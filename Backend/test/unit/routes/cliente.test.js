import { jest } from '@jest/globals';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { sequelize } from '../../../src/database/conexion.js';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';

// Create mock DataTypes
const MockDataTypes = {
  INTEGER: { constructor: { name: 'INTEGER' } },
  STRING: (size) => ({ constructor: { name: 'STRING' }, size }),
  TEXT: { constructor: { name: 'TEXT' } },
  DATE: { constructor: { name: 'DATE' } },
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

describe('Cliente Model Tests', () => {
  let modelDefinition;
  let hooks;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Capture model definition when sequelize.define is called
    sequelize.define.mockImplementation((modelName, attributes, options) => {
      modelDefinition = { modelName, attributes, options };
      const model = { beforeCreate: jest.fn() };
      hooks = model.beforeCreate;
      return model;
    });

    // Re-import to trigger the mock captures 
    jest.isolateModules(() => {
      require('../../../src/models/cliente.model.js');
    });
  });

  test('should define Cliente model with correct table name and timestamps', () => {
    expect(modelDefinition.options.tableName).toBe('cliente');
    expect(modelDefinition.options.timestamps).toBe(false);
  });

  test('should define Cliente model with all required fields', () => {
    const attributes = modelDefinition.attributes;
    
    expect(attributes).toHaveProperty('id');
    expect(attributes).toHaveProperty('numero_de_cedula');
    expect(attributes).toHaveProperty('nombre');
    expect(attributes).toHaveProperty('apellido');
    expect(attributes).toHaveProperty('correo_electronico');
    expect(attributes).toHaveProperty('telefono');
    expect(attributes).toHaveProperty('contrasenia');
    expect(attributes).toHaveProperty('direccion');
    expect(attributes).toHaveProperty('fecha_registro');
    expect(attributes).toHaveProperty('rol');
    expect(attributes).toHaveProperty('estado');
  });

  test('should set up id field correctly', () => {
    const idField = modelDefinition.attributes.id;
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
    expect(idField.allowNull).toBe(false);
  });

  test('should set up numero_de_cedula field with correct validations', () => {
    const cedulaField = modelDefinition.attributes.numero_de_cedula;
    expect(cedulaField.allowNull).toBe(false);
    expect(cedulaField.unique).toBe(true);
    
    // Test isNumeric validation
    expect(() => cedulaField.validate.isNumeric.msg).not.toThrow();
    
    // Test length validation
    expect(cedulaField.validate.len.args).toEqual([6, 10]);
    expect(() => cedulaField.validate.len.msg).not.toThrow();
    
    // Test custom validations
    expect(() => cedulaField.validate.notStartsWithZero('123456')).not.toThrow();
    expect(() => cedulaField.validate.notStartsWithZero('023456')).toThrow();
    
    expect(() => cedulaField.validate.notSequential('987654')).not.toThrow();
    expect(() => cedulaField.validate.notSequential('1234567')).toThrow();
  });

  test('should set up nombre field with correct validations', () => {
    const nombreField = modelDefinition.attributes.nombre;
    expect(nombreField.allowNull).toBe(false);
    
    // Test regex validation
    expect(nombreField.validate.is.args).toBeDefined();
    expect(() => nombreField.validate.is.msg).not.toThrow();
    
    // Test length validation
    expect(nombreField.validate.len.args).toEqual([1, 50]);
    expect(() => nombreField.validate.len.msg).not.toThrow();
    
    // Test custom validations
    expect(() => nombreField.validate.noSpaceEdges('Juan')).not.toThrow();
    expect(() => nombreField.validate.noSpaceEdges(' Juan')).toThrow();
    expect(() => nombreField.validate.noSpaceEdges('Juan ')).toThrow();
    
    // Test repetition validation
    expect(() => nombreField.validate.noRepeticionesExcesivas('Juan')).not.toThrow();
    expect(() => nombreField.validate.noRepeticionesExcesivas('Juaaaan')).toThrow();
    
    // Test spaces validation
    expect(() => nombreField.validate.noEspaciosMultiples('Juan Carlos')).not.toThrow();
    expect(() => nombreField.validate.noEspaciosMultiples('Juan  Carlos')).toThrow();
  });

  test('should set up apellido field with correct validations', () => {
    const apellidoField = modelDefinition.attributes.apellido;
    expect(apellidoField.allowNull).toBe(false);
    
    // Test regex validation
    expect(apellidoField.validate.is.args).toBeDefined();
    expect(() => apellidoField.validate.is.msg).not.toThrow();
    
    // Test length validation
    expect(apellidoField.validate.len.args).toEqual([1, 50]);
    expect(() => apellidoField.validate.len.msg).not.toThrow();
    
    // Test custom validations
    expect(() => apellidoField.validate.noSpaceEdges('Perez')).not.toThrow();
    expect(() => apellidoField.validate.noSpaceEdges(' Perez')).toThrow();
    expect(() => apellidoField.validate.noSpaceEdges('Perez ')).toThrow();
  });

  test('should set up correo_electronico field with correct validations', () => {
    const emailField = modelDefinition.attributes.correo_electronico;
    expect(emailField.allowNull).toBe(false);
    
    // Test email validation
    expect(() => emailField.validate.isEmail.msg).not.toThrow();
    
    // Test length validation
    expect(emailField.validate.len.args).toEqual([5, 320]);
    expect(() => emailField.validate.len.msg).not.toThrow();
    
    // Test regex validation
    expect(emailField.validate.is.args).toBeDefined();
    expect(() => emailField.validate.is.msg).not.toThrow();
  });

  test('should set up telefono field with correct validations', () => {
    const telefonoField = modelDefinition.attributes.telefono;
    expect(telefonoField.allowNull).toBe(false);
    
    // Test numeric validation
    expect(() => telefonoField.validate.isNumeric.msg).not.toThrow();
    
    // Test length validation
    expect(telefonoField.validate.len.args).toEqual([10, 10]);
    expect(() => telefonoField.validate.len.msg).not.toThrow();
    
    // Test custom validations
    expect(() => telefonoField.validate.iniciaConDigitoValido('3123456789')).not.toThrow();
    expect(() => telefonoField.validate.iniciaConDigitoValido('2123456789')).toThrow();
  });

  test('should set up contrasenia field with correct validations', () => {
    const passwordField = modelDefinition.attributes.contrasenia;
    expect(passwordField.allowNull).toBe(false);
    
    // Test length validation
    expect(passwordField.validate.len.args).toEqual([8, 64]);
    expect(() => passwordField.validate.len.msg).not.toThrow();
    
    // Test regex validation
    expect(passwordField.validate.is.args).toBeDefined();
    expect(() => passwordField.validate.is.msg).not.toThrow();
    
    // Test custom validations
    expect(() => passwordField.validate.notCommonPassword('Strong@Password123')).not.toThrow();
    expect(() => passwordField.validate.notCommonPassword('123456')).toThrow();
  });

  test('should set up direccion field with correct validations', () => {
    const direccionField = modelDefinition.attributes.direccion;
    expect(direccionField.allowNull).toBe(false);
    
    // Test length validation
    expect(direccionField.validate.len.args).toEqual([10, 255]);
    expect(() => direccionField.validate.len.msg).not.toThrow();
    
    // Test not empty validation
    expect(() => direccionField.validate.notEmpty.msg).not.toThrow();
    
    // Test custom validations
    expect(() => direccionField.validate.sinEspaciosSolamente('Calle 123 #45-67')).not.toThrow();
    expect(() => direccionField.validate.sinEspaciosSolamente('   ')).toThrow();
  });

  test('should set up fecha_registro field with correct validations', () => {
    const fechaField = modelDefinition.attributes.fecha_registro;
    expect(fechaField.defaultValue).toBeDefined();
    
    // Test date validation
    expect(() => fechaField.validate.isDate.msg).not.toThrow();
    
    // Test custom validations
    const pastDate = new Date(2023, 0, 1);
    const futureDate = new Date(2030, 0, 1);
    
    expect(() => fechaField.validate.noFechasPasadas(pastDate)).toThrow();
    expect(() => fechaField.validate.noFechasPasadas(futureDate)).not.toThrow();
  });

  test('should set up rol field correctly', () => {
    const rolField = modelDefinition.attributes.rol;
    expect(rolField.defaultValue).toBe('cliente');
    expect(rolField.allowNull).toBe(false);
  });

  test('should set up estado field correctly', () => {
    const estadoField = modelDefinition.attributes.estado;
    expect(estadoField.defaultValue).toBe('activo');
  });

  test('should apply password encryption hook', () => {
    // Test that the hook is registered
    expect(hooks).toHaveBeenCalledWith(encryptPasswordHook);
  });

  test('should export ClienteModel with Cliente property', () => {
    expect(ClienteModel).toBeDefined();
    expect(ClienteModel).toHaveProperty('Cliente');
  });
});