import { jest } from '@jest/globals';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { sequelize } from '../../../src/database/conexion.js';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';

// Create mock DataTypes
const MockDataTypes = {
  INTEGER: { constructor: { name: 'INTEGER' } },
  STRING: (size) => ({ constructor: { name: 'STRING' }, size }),
  ENUM: (...values) => ({ constructor: { name: 'ENUM' }, values }),
  NOW: 'CURRENT_TIMESTAMP'
};

// Mock dependencies
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({
      beforeCreate: jest.fn()
    })
  }
}));

jest.mock('../../../src/hooks/encryptPassword.js', () => ({
  encryptPasswordHook: jest.fn()
}));

describe('Admin Model Tests', () => {
  let modelDefinition;
  let hooks;

  beforeEach(() => {
    jest.clearAllMocks();

    sequelize.define.mockImplementation((modelName, attributes, options) => {
      modelDefinition = { modelName, attributes, options };
      const model = { beforeCreate: jest.fn() };
      hooks = model.beforeCreate;
      return model;
    });

    jest.isolateModules(() => {
      require('../../../src/models/administrador.model.js');
    });
  });

  test('Debe definir el modelo de administración con el nombre de tabla.', () => {
    expect(modelDefinition.options.tableName).toBe('administrador');
    expect(modelDefinition.options.timestamps).toBe(false);
  });

  test('Debe definir el modelo de administración con todos los campos obligatorios.', () => {
    const attributes = modelDefinition.attributes;
    
    expect(attributes).toHaveProperty('id');
    expect(attributes).toHaveProperty('numero_cedula');
    expect(attributes).toHaveProperty('nombre');
    expect(attributes).toHaveProperty('apellido');
    expect(attributes).toHaveProperty('correo_electronico');
    expect(attributes).toHaveProperty('contrasenia');
    expect(attributes).toHaveProperty('rol');
  });

  test('Debería hacer el campo de identificación correctamente', () => {
    const idField = modelDefinition.attributes.id;
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
    expect(idField.allowNull).toBe(false);
  });

  test('Debería hacer el campo numero_cedula con validaciones correctas', () => {
    const cedulaField = modelDefinition.attributes.numero_cedula;
    expect(cedulaField.allowNull).toBe(false);
    expect(cedulaField.unique).toBe(true);
    
    //validacion de nuermo
    expect(() => cedulaField.validate.isNumeric.msg).not.toThrow();
    
    // test del legth
    expect(cedulaField.validate.len.args).toEqual([6, 10]);
    expect(() => cedulaField.validate.len.msg).not.toThrow();
    
    // Test validaciones
    expect(() => cedulaField.validate.notStartsWithZero('123456')).not.toThrow();
    expect(() => cedulaField.validate.notStartsWithZero('023456')).toThrow();
    
    expect(() => cedulaField.validate.notSequential('987654')).not.toThrow();
    expect(() => cedulaField.validate.notSequential('1234567')).toThrow();
  });

  test('Debe hacer el campo nombre con validaciones correctas', () => {
    const nombreField = modelDefinition.attributes.nombre;
    expect(nombreField.allowNull).toBe(false);
    
    // Test  validacion
    expect(nombreField.validate.is.args).toBeDefined();
    expect(() => nombreField.validate.is.msg).not.toThrow();
    
    // Test length validacion
    expect(nombreField.validate.len.args).toEqual([1, 50]);
    expect(() => nombreField.validate.len.msg).not.toThrow();
    
    // Test  validaciones
    expect(() => nombreField.validate.noSpacesEdges('Juan')).not.toThrow();
    expect(() => nombreField.validate.noSpacesEdges(' Juan')).toThrow();
    expect(() => nombreField.validate.noSpacesEdges('Juan ')).toThrow();
  });

  test('Debe hacer el campo apellido con validaciones correctas', () => {
    const apellidoField = modelDefinition.attributes.apellido;
    expect(apellidoField.allowNull).toBe(false);
    
    // Test  validacion
    expect(apellidoField.validate.is.args).toBeDefined();
    expect(() => apellidoField.validate.is.msg).not.toThrow();
    
    // Test length validacion
    expect(apellidoField.validate.len.args).toEqual([1, 50]);
    expect(() => apellidoField.validate.len.msg).not.toThrow();
    
    // Test  validaciones
    expect(() => apellidoField.validate.noSpacesEdges('Perez')).not.toThrow();
    expect(() => apellidoField.validate.noSpacesEdges(' Perez')).toThrow();
    expect(() => apellidoField.validate.noSpacesEdges('Perez ')).toThrow();
  });

  test('Debería hacer el campo correo_electronico con las validaciones correctas', () => {
    const emailField = modelDefinition.attributes.correo_electronico;
    expect(emailField.allowNull).toBe(false);
    expect(emailField.unique).toBe(true);
    
    // Test correo validacion
    expect(() => emailField.validate.isEmail.msg).not.toThrow();
    
    // Test length validacion
    expect(emailField.validate.len.args).toEqual([5, 320]);
    expect(() => emailField.validate.len.msg).not.toThrow();
    
    // Test regex validacion
    expect(emailField.validate.is.args).toBeDefined();
    expect(() => emailField.validate.is.msg).not.toThrow();
  });

   test('Debe hacer el campo contrasenia con todas sus validaciones personalizadas', () => {
    const passwordField = modelDefinition.attributes.contrasenia;
    expect(passwordField.allowNull).toBe(false);
    expect(passwordField.validate.len.args).toEqual([8, 64]);

    // Validación de mayúscula
    expect(() => passwordField.validate.tieneMayuscula('Password133!')).not.toThrow();
    expect(() => passwordField.validate.tieneMayuscula('password133!')).toThrow();

    // Validación de minúscula
    expect(() => passwordField.validate.tieneMinuscula('Password133!')).not.toThrow();
    expect(() => passwordField.validate.tieneMinuscula('PASSWORD133!')).toThrow();

    // Validación de número
    expect(() => passwordField.validate.tieneNumero('Password133!')).not.toThrow();
    expect(() => passwordField.validate.tieneNumero('Password!')).toThrow();

    // Validación de especial
    expect(() => passwordField.validate.tieneEspecial('Password133!')).not.toThrow();
    expect(() => passwordField.validate.tieneEspecial('Password133')).toThrow();

    // Validación de sin espacios
    expect(() => passwordField.validate.sinEspacios('Password133!')).not.toThrow();
    expect(() => passwordField.validate.sinEspacios('Pass word133!')).toThrow();

    // Validación de repetidos
    expect(() => passwordField.validate.sinRepetidos('Passsword133!')).toThrow();
    expect(() => passwordField.validate.sinRepetidos('Password133!')).not.toThrow();

    // Validación de contraseñas comunes
    expect(() => passwordField.validate.notCommonPassword('123456')).toThrow();
    expect(() => passwordField.validate.notCommonPassword('Password123!')).not.toThrow();
  });


  test('Deberia hacer el campo rol correctamente', () => {
    const rolField = modelDefinition.attributes.rol;
    expect(rolField.defaultValue).toBe('administrador');
    expect(rolField.allowNull).toBe(false);
  });

  test('Deberia aplicar el cifrado de contraseña', () => {
    // Test that the hook is registered
    expect(hooks).toHaveBeenCalledWith(encryptPasswordHook);
  });

  test('Debería exportar AdministradorModel con la propiedad Admin.', () => {
    expect(AdminModel).toBeDefined();
    expect(AdminModel).toHaveProperty('Admin');
  });
});