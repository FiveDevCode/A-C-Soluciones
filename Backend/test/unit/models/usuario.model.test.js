import bcrypt from 'bcrypt';
import { Usuario, setupDatabase } from '../../helpers/sequelize-test-setup.js'; 

//test de model de usuario 
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn((pwd, salt) => Promise.resolve(`hashed-${pwd}`)),
  compare: jest.fn((pwd, hashed) => Promise.resolve(hashed === `hashed-${pwd}`))
}));
jest.setTimeout(20000); // 20 segundos

describe('Modelo Usuario (con Sequelize real)', () => {
    
  beforeAll(async () => {
    await setupDatabase(); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  

  it('debería hashear la contraseña antes de crear', async () => {
    const usuario = Usuario.build({ correo_electronico: 'a@b.com', contrasenia: 'abc123' });

    await Usuario.runHooks('beforeCreate', usuario);

    expect(usuario.contrasenia).toBe('hashed-abc123');
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it('debería hashear la contraseña antes de actualizar y actualizar fecha', async () => {
    const usuario = Usuario.build({ contrasenia: 'abc123' });
    usuario.changed = jest.fn((field) => field === 'contrasenia');

    await Usuario.runHooks('beforeUpdate', usuario);

    expect(usuario.contrasenia).toBe('hashed-abc123');
    expect(usuario.ultima_actualizacion_contrasena).toBeInstanceOf(Date);
  });

  it('debería validar correctamente una contraseña', async () => {
    const usuario = Usuario.build({ contrasenia: 'hashed-abc123' });

    const esValida = await usuario.validarContrasena('abc123');
    expect(esValida).toBe(true);
  });

  it('debería invalidar un token y guardarlo', async () => {
    const usuario = await Usuario.create({
      correo_electronico: 'tokentest@example.com',
      contrasenia: 'abc123',
      tokens_invalidados: []
    });

    const saveSpy = jest.spyOn(usuario, 'save');

    await usuario.invalidarToken('token123');

    expect(usuario.tokens_invalidados).toContain('token123');
    expect(saveSpy).toHaveBeenCalled();
  });

  it('debería identificar si un token está invalidado', async () => {
    const usuario = Usuario.build({ tokens_invalidados: ['tok1', 'tok2'] });

    expect(usuario.esTokenInvalidado('tok1')).toBe(true);
    expect(usuario.esTokenInvalidado('otro')).toBe(false);
  });
});


