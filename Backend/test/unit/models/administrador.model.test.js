// test/unit/models/administrador.model.test.js

import { AdminModel } from '../../../src/models/administrador.model.js';

const { Admin } = AdminModel;

describe('Admin Model Tests', () => {

  test('Debe crear un administrador válido', async () => {
    const admin = await Admin.create({
      numero_cedula: '8765432',
      nombre: 'Juan',
      apellido: 'Pérez',
      correo_electronico: 'juan.perez@mail.com',
      contrasenia: 'Secure1@Pass'
    });

    expect(admin.id).toBeDefined();
    expect(admin.numero_cedula.toString()).toBe('8765432');
    expect(admin.nombre).toBe('Juan');
    expect(admin.apellido).toBe('Pérez');
    expect(admin.correo_electronico).toBe('juan.perez@mail.com');
  },20000);

  test('El campo numero_cedula no debe tener espacios al inicio o final', async () => {
    expect.assertions(1);
    try {
      const admin = Admin.build({
        numero_cedula: ' 1234567 ',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: 'juan@mail.com',
        contrasenia: 'Secure1@Pass',
      });
      await admin.validate();
    } catch (error) {
      expect(error.message).toMatch(/La cédula debe contener solo números.|La cédula debe tener entre 6 y 10 dígitos./);
    }
  });

  test('El campo correo_electronico no debe tener espacios al inicio o final', async () => {
    expect.assertions(1);
    try {
      const admin = Admin.build({
        numero_cedula: '8765432',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo_electronico: ' juan@mail.com ',
        contrasenia: 'Secure1@Pass',
      });
      await admin.validate();
    } catch (error) {
      expect(error.message).toMatch(/El correo electrónico no es válido.|El correo electrónico tiene un formato incorrecto./);
    }
  });

  test('El hook beforeCreate debe encriptar la contraseña antes de guardar el administrador', async () => {
    const admin = await Admin.create({
      numero_cedula: '9876543',
      nombre: 'Ana',
      apellido: 'García',
      correo_electronico: 'ana.garcia@mail.com',
      contrasenia: 'Secure1@Pass'
    });

    expect(admin.contrasenia).not.toBe('Secure1@Pass');
    expect(admin.contrasenia.length).toBeGreaterThanOrEqual(60); // bcrypt hash length
  });

});
