import { jest } from '@jest/globals';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { sequelize } from '../../../src/database/conexion.js';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';

const MockDataTypes = {
  INTEGER: { constructor: { name: 'INTEGER' } },
  STRING: (size) => ({ constructor: { name: 'STRING' }, size }),
  DATE: { constructor: { name: 'DATE' } },
  ENUM: (...values) => ({ constructor: { name: 'ENUM' }, values }),
  NOW: 'CURRENT_TIMESTAMP'
};

// Mock dependencias
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

describe('Tecnico Model Tests', () => {
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
      require('../../../src/models/tecnico.model.js');
    });
  });

  test('should define Tecnico model with correct table name and timestamps', () => {
    expect(modelDefinition.options.tableName).toBe('tecnico');
    expect(modelDefinition.options.timestamps).toBe(false);
  });

  test('should define Tecnico model with all required fields', () => {
    const attributes = modelDefinition.attributes;
    
    expect(attributes).toHaveProperty('id');
    expect(attributes).toHaveProperty('numero_de_cedula');
    expect(attributes).toHaveProperty('nombre');
    expect(attributes).toHaveProperty('apellido');
    expect(attributes).toHaveProperty('correo_electronico');
    expect(attributes).toHaveProperty('telefono');
    expect(attributes).toHaveProperty('contrasenia');
    expect(attributes).toHaveProperty('especialidad');
    expect(attributes).toHaveProperty('rol');
    expect(attributes).toHaveProperty('fecha_registro');
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
    
    // Test es numerico validacion
    expect(() => cedulaField.validate.isNumeric.msg).not.toThrow();
    
    // Test length validacion
    expect(cedulaField.validate.len.args).toEqual([6, 10]);
    expect(() => cedulaField.validate.len.msg).not.toThrow();
    
    // Test custom validaciones
    expect(() => cedulaField.validate.notStartsWithZero('123456')).not.toThrow();
    expect(() => cedulaField.validate.notStartsWithZero('023456')).toThrow();
    
    expect(() => cedulaField.validate.notSequential('987654')).not.toThrow();
    expect(() => cedulaField.validate.notSequential('1234567')).toThrow();
  });

  test('should set up nombre field with correct validations', () => {
    const nombreField = modelDefinition.attributes.nombre;
    expect(nombreField.allowNull).toBe(false);
    
    // Test regex validcacion
    expect(nombreField.validate.is.args).toBeDefined();
    expect(() => nombreField.validate.is.msg).not.toThrow();
    
    // Test length validacion
    expect(nombreField.validate.len.args).toEqual([1, 100]);
    expect(() => nombreField.validate.len.msg).not.toThrow();
    
    // Test custom validaciones
    expect(() => nombreField.validate.noSpacesEdges('Juan')).not.toThrow();
    expect(() => nombreField.validate.noSpacesEdges(' Juan')).toThrow();
    expect(() => nombreField.validate.noSpacesEdges('Juan ')).toThrow();
  });

  test('Debe hacer el campo apellido con validaciones correctas', () => {
    const apellidoField = modelDefinition.attributes.apellido;
    expect(apellidoField.allowNull).toBe(false);
    
    // Test regex validacion
    expect(apellidoField.validate.is.args).toBeDefined();
    expect(() => apellidoField.validate.is.msg).not.toThrow();
    
    // Test length validacion
    expect(apellidoField.validate.len.args).toEqual([1, 100]);
    expect(() => apellidoField.validate.len.msg).not.toThrow();
    
    // Test  validaciones
    expect(() => apellidoField.validate.noSpacesEdges('Perez')).not.toThrow();
    expect(() => apellidoField.validate.noSpacesEdges(' Perez')).toThrow();
    expect(() => apellidoField.validate.noSpacesEdges('Perez ')).toThrow();
  });

  test('Deberia hacer el campo correo_electronico con las validaciones correctas', () => {
    const emailField = modelDefinition.attributes.correo_electronico;
    expect(emailField.allowNull).toBe(false);
    
    // Test correo validacion
    expect(() => emailField.validate.isEmail.msg).not.toThrow();
    
    // Test length validacion
    expect(emailField.validate.len.args).toEqual([5, 320]);
    expect(() => emailField.validate.len.msg).not.toThrow();
    
    // Test regex validacion
    expect(emailField.validate.is.args).toBeDefined();
    expect(() => emailField.validate.is.msg).not.toThrow();
  });

  test('Deberia hacer el campo teléfono con las validaciones correctas', () => {
    const telefonoField = modelDefinition.attributes.telefono;
    expect(telefonoField.allowNull).toBe(false);
    
    // Test validadcion numerica 
    expect(() => telefonoField.validate.isNumeric.msg).not.toThrow();
    
    // Test length validacion
    expect(telefonoField.validate.len.args).toEqual([10, 10]);
    expect(() => telefonoField.validate.len.msg).not.toThrow();
    
    // Test custom validaciones
    expect(() => telefonoField.validate.startsWithValidDigit('3123456789')).not.toThrow();
    expect(() => telefonoField.validate.startsWithValidDigit('2123456789')).toThrow();
  });

  test('Deberia hacer el campo de contraseña con validaciones correctas', () => {
    const passwordField = modelDefinition.attributes.contrasenia;
    expect(passwordField.allowNull).toBe(false);
    
    // Test length validacion
    expect(passwordField.validate.len.args).toEqual([8, 64]);
    expect(() => passwordField.validate.len.msg).not.toThrow();
    
    // Test regex validacion
    expect(passwordField.validate.is.args).toBeDefined();
    expect(() => passwordField.validate.is.msg).not.toThrow();
    
    // Test  validacions
    expect(() => passwordField.validate.notCommonPassword('Strong@Password123')).not.toThrow();
    expect(() => passwordField.validate.notCommonPassword('123456')).toThrow();
  });

  test('Deberia hacer el campo de especialidad correctamente', () => {
    const especialidadField = modelDefinition.attributes.especialidad;
    expect(especialidadField.allowNull).toBe(true);
  });

  test('Deberia hacer el campo rol correctamente', () => {
    const rolField = modelDefinition.attributes.rol;
    expect(rolField.defaultValue).toBe('tecnico');
    expect(rolField.allowNull).toBe(false);
  });

  test('Deberia hacer correctamente el campo fecha_registro', () => {
    const fechaField = modelDefinition.attributes.fecha_registro;
    expect(fechaField.defaultValue).toBeDefined();
  });

  test('Deberia hacer el campo estado correctamente', () => {
    const estadoField = modelDefinition.attributes.estado;
    expect(estadoField.defaultValue).toBe('activo');
  });

  test('debera aplicar el de cifrado de contraseña', () => {
    // Test that the hook is registered
    expect(hooks).toHaveBeenCalledWith(encryptPasswordHook);
  });

  test('Deberia exportar TecnicoModel con la propiedad Tecnico.', () => {
    expect(TecnicoModel).toBeDefined();
    expect(TecnicoModel).toHaveProperty('Tecnico');
  });
});