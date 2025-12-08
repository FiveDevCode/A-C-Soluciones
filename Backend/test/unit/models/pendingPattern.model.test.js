import { DataTypes } from 'sequelize';
import { PendingPatternModel } from '../../../src/models/pendingPattern.model.js';

// Mock de sequelize
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
    })),
  },
}));

describe('PendingPatternModel', () => {
  let PendingPattern;

  beforeAll(() => {
    PendingPattern = PendingPatternModel;
  });

  it('debería definir correctamente el modelo PendingPattern', () => {
    expect(PendingPattern.modelName).toBe('PendingPattern');
    expect(PendingPattern.options.tableName).toBe('pending_patterns');
    expect(PendingPattern.options.timestamps).toBe(false);
  });

  
  it('debería tener todos los campos definidos correctamente', () => {
    const fields = ['id', 'mensaje', 'fecha'];
    fields.forEach(field => expect(PendingPattern.attributes[field]).toBeDefined());
  });

  it('el campo id debería ser entero, PK y autoincremental', () => {
    const idField = PendingPattern.attributes.id;
    expect(idField.type).toBe(DataTypes.INTEGER);
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
  });

  it('el campo mensaje debería ser STRING y obligatorio', () => {
    const mensajeField = PendingPattern.attributes.mensaje;
    expect(mensajeField.type).toBe(DataTypes.STRING);
    expect(mensajeField.allowNull).toBe(false);
  });

  it('el campo fecha debería ser DATE con valor por defecto NOW', () => {
    const fechaField = PendingPattern.attributes.fecha;
    expect(fechaField.type).toBe(DataTypes.DATE);
    expect(fechaField.defaultValue).toBe(DataTypes.NOW);
  });
});
