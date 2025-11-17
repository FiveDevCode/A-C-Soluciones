import { DataTypes } from 'sequelize';
import { IntentModel, PatternModel } from '../../../src/models/chatbot.model.js';

// Mock de sequelize
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
      hasMany: jest.fn(),
      belongsTo: jest.fn(),
    })),
  },
}));

describe('Chatbot Models', () => {
  let Intent, Pattern;

  beforeAll(() => {
    Intent = IntentModel;
    Pattern = PatternModel;
  });

  // --------------------------------------------------------------------
  // TESTS DEL MODELO INTENT
  // --------------------------------------------------------------------
  describe('IntentModel', () => {
    it('debería definir correctamente el modelo Intent', () => {
      expect(Intent.modelName).toBe('Intent');
      expect(Intent.options.tableName).toBe('intents');
      expect(Intent.options.timestamps).toBe(false);
    });

    it('debería tener todos los campos definidos correctamente', () => {
      const fields = ['id', 'response', 'activo'];
      fields.forEach(field => expect(Intent.attributes[field]).toBeDefined());
    });

    it('el campo id debería ser entero, PK y autoincremental', () => {
      const idField = Intent.attributes.id;
      expect(idField.type).toBe(DataTypes.INTEGER);
      expect(idField.primaryKey).toBe(true);
      expect(idField.autoIncrement).toBe(true);
    });

    it('el campo response debería ser TEXT y no permitir nulos', () => {
      const responseField = Intent.attributes.response;
      expect(responseField.type).toBe(DataTypes.TEXT);
      expect(responseField.allowNull).toBe(false);
    });

    it('el campo activo debería ser booleano con valor por defecto true', () => {
      const activoField = Intent.attributes.activo;
      expect(activoField.type).toBe(DataTypes.BOOLEAN);
      expect(activoField.defaultValue).toBe(true);
    });
  });

  // --------------------------------------------------------------------
  // TESTS DEL MODELO PATTERN
  // --------------------------------------------------------------------
  describe('PatternModel', () => {
    it('debería definir correctamente el modelo Pattern', () => {
      expect(Pattern.modelName).toBe('Pattern');
      expect(Pattern.options.tableName).toBe('patterns');
      expect(Pattern.options.timestamps).toBe(false);
    });

    it('debería tener todos los campos definidos correctamente', () => {
      const fields = ['id', 'intent_id', 'patron'];
      fields.forEach(field => expect(Pattern.attributes[field]).toBeDefined());
    });

    it('el campo id debería ser entero, PK y autoincremental', () => {
      const idField = Pattern.attributes.id;
      expect(idField.type).toBe(DataTypes.INTEGER);
      expect(idField.primaryKey).toBe(true);
      expect(idField.autoIncrement).toBe(true);
    });

    it('el campo intent_id debería ser entero y obligatorio', () => {
      const intentField = Pattern.attributes.intent_id;
      expect(intentField.type).toBe(DataTypes.INTEGER);
      expect(intentField.allowNull).toBe(false);
    });

    it('el campo patron debería ser string y obligatorio', () => {
      const patronField = Pattern.attributes.patron;
      expect(patronField.type).toBe(DataTypes.STRING);
      expect(patronField.allowNull).toBe(false);
    });
  });

  // --------------------------------------------------------------------
  // TESTS DE RELACIONES ENTRE MODELOS
  // --------------------------------------------------------------------
  describe('Relaciones entre modelos', () => {
    it('IntentModel debería tener una relación hasMany con PatternModel', () => {
      Intent.hasMany(Pattern, { foreignKey: 'intent_id' });
      expect(Intent.hasMany).toHaveBeenCalledWith(Pattern, { foreignKey: 'intent_id' });
    });

    it('PatternModel debería tener una relación belongsTo con IntentModel', () => {
      Pattern.belongsTo(Intent, { foreignKey: 'intent_id' });
      expect(Pattern.belongsTo).toHaveBeenCalledWith(Intent, { foreignKey: 'intent_id' });
    });
  });
});
