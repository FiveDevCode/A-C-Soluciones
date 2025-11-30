import { jest } from '@jest/globals';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { sequelize } from '../../../src/database/conexion.js';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';

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

describe('Cliente Model Tests', () => {
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
      require('../../../src/models/cliente.model.js');
    });
  });

  test('Debe definir el modelo Cliente con el nombre de tabla correcto', () => {
    expect(modelDefinition.options.tableName).toBe('cliente');
    expect(modelDefinition.options.timestamps).toBe(false);
  });

  test('Debe tener el hook beforeCreate configurado', () => {
    expect(hooks).toHaveBeenCalledWith(encryptPasswordHook);
  });

  test('Debe tener el campo id como primaryKey y autoIncrement', () => {
    const idField = modelDefinition.attributes.id;
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
    expect(idField.allowNull).toBe(false);
  });

  test('Debe tener validaciones en numero_de_cedula', () => {
    const cedulaField = modelDefinition.attributes.numero_de_cedula;
    expect(cedulaField.allowNull).toBe(false);
    expect(cedulaField.unique).toBe(true);
    expect(cedulaField.validate).toBeDefined();
    expect(cedulaField.validate.isNumeric).toBeDefined();
    expect(cedulaField.validate.len).toBeDefined();
    expect(cedulaField.validate.notStartsWithZero).toBeDefined();
    expect(cedulaField.validate.notSequential).toBeDefined();
  });

  test('Debe tener validaciones en nombre', () => {
    const nombreField = modelDefinition.attributes.nombre;
    expect(nombreField.allowNull).toBe(false);
    expect(nombreField.validate).toBeDefined();
    expect(nombreField.validate.is).toBeDefined();
    expect(nombreField.validate.len).toBeDefined();
    expect(nombreField.validate.noSpaceEdges).toBeDefined();
    expect(nombreField.validate.noRepeticionesExcesivas).toBeDefined();
    expect(nombreField.validate.noEspaciosMultiples).toBeDefined();
  });

  test('Debe tener validaciones en apellido', () => {
    const apellidoField = modelDefinition.attributes.apellido;
    expect(apellidoField.allowNull).toBe(false);
    expect(apellidoField.validate).toBeDefined();
    expect(apellidoField.validate.is).toBeDefined();
    expect(apellidoField.validate.len).toBeDefined();
    expect(apellidoField.validate.noSpaceEdges).toBeDefined();
  });

  test('Debe tener validaciones en correo_electronico', () => {
    const emailField = modelDefinition.attributes.correo_electronico;
    expect(emailField.allowNull).toBe(false);
    expect(emailField.validate).toBeDefined();
    expect(emailField.validate.isEmail).toBeDefined();
    expect(emailField.validate.len).toBeDefined();
    expect(emailField.validate.is).toBeDefined();
  });

  test('Debe tener validaciones en telefono', () => {
    const telefonoField = modelDefinition.attributes.telefono;
    expect(telefonoField.allowNull).toBe(false);
    expect(telefonoField.validate).toBeDefined();
    expect(telefonoField.validate.isNumeric).toBeDefined();
    expect(telefonoField.validate.len).toBeDefined();
    expect(telefonoField.validate.iniciaConDigitoValido).toBeDefined();
  });

  test('Debe tener validaciones en contrasenia', () => {
    const passwordField = modelDefinition.attributes.contrasenia;
    expect(passwordField.allowNull).toBe(false);
    expect(passwordField.validate).toBeDefined();
    expect(passwordField.validate.len).toBeDefined();
    expect(passwordField.validate.is).toBeDefined();
    expect(passwordField.validate.notCommonPassword).toBeDefined();
  });

  test('Debe tener validaciones en direccion', () => {
    const direccionField = modelDefinition.attributes.direccion;
    expect(direccionField.allowNull).toBe(false);
    expect(direccionField.validate).toBeDefined();
    expect(direccionField.validate.len).toBeDefined();
    expect(direccionField.validate.notEmpty).toBeDefined();
  });

  test('Debe tener fecha_registro con defaultValue NOW', () => {
    const fechaField = modelDefinition.attributes.fecha_registro;
    expect(fechaField.defaultValue).toBeDefined();
    expect(fechaField.validate).toBeDefined();
    expect(fechaField.validate.isDate).toBeDefined();
  });

  test('Debe tener rol con valor por defecto cliente', () => {
    const rolField = modelDefinition.attributes.rol;
    expect(rolField.allowNull).toBe(false);
    expect(rolField.defaultValue).toBe('cliente');
  });

  test('Debe tener estado con valor por defecto activo', () => {
    const estadoField = modelDefinition.attributes.estado;
    expect(estadoField.allowNull).toBe(false);
    expect(estadoField.defaultValue).toBe('activo');
  });

  test('Debe tener campos recovery_code y recovery_expires como opcionales', () => {
    const recoveryCodeField = modelDefinition.attributes.recovery_code;
    const recoveryExpiresField = modelDefinition.attributes.recovery_expires;
    expect(recoveryCodeField.allowNull).toBe(true);
    expect(recoveryExpiresField.allowNull).toBe(true);
  });
});

