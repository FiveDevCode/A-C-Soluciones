import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

export const IntentModel = sequelize.define('Intent', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },

  response: { 
    type: DataTypes.TEXT, 
    allowNull: false },

  activo: {
     type: DataTypes.BOOLEAN, 
     defaultValue: true }
}, {
  tableName: 'intents',
  timestamps: false
});

export const PatternModel = sequelize.define('Pattern', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },

  intent_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false },

  patron: { 
    type: DataTypes.STRING,     
    allowNull: false }
    
}, {
  tableName: 'patterns',
  timestamps: false
});

// Relaciones
IntentModel.hasMany(PatternModel, { foreignKey: 'intent_id' });
PatternModel.belongsTo(IntentModel, { foreignKey: 'intent_id' });
