import { camposPermitidosCliente } from '../../../src/services/allowedFields.js';

describe('camposPermitidosCliente', () => {
  it('debe ser un array con los campos permitidos esperados', () => {
    const esperado = [
      'nombre',
      'apellido',
      'correo_electronico',
      'telefono',
      'contrasenia',
      'direccion'
    ];

    expect(camposPermitidosCliente).toEqual(esperado);
  });

  it('debe contener exactamente 6 campos', () => {
    expect(camposPermitidosCliente).toHaveLength(6);
  });

  it('debe incluir el campo "contrasenia"', () => {
    expect(camposPermitidosCliente).toContain('contrasenia');
  });

  it('no debe incluir campos no permitidos como "rol" o "estado"', () => {
    expect(camposPermitidosCliente).not.toContain('rol');
    expect(camposPermitidosCliente).not.toContain('estado');
  });
});
