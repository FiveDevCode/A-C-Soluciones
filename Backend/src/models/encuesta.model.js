import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const Encuesta = sequelize.define('Encuesta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  solicitud_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      msg: 'Ya has respondido la encuesta para esta servicio.'
    }
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calificacion_general: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      isInt: true,
      notEmpty: { msg: 'La calificación general es obligatoria.' }
    }
  },
  calif_puntualidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      notEmpty: { msg: 'La calificación de puntualidad es obligatoria.' }
    }
  },
  calif_calidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      notEmpty: { msg: 'La calificación de calidad es obligatoria.' }
    }
  },
  calif_atencion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      notEmpty: { msg: 'La calificación de atención es obligatoria.' }
    }
  },
  comentarios: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'encuestas',
  timestamps: false
});

export const EncuestaModel = {
  Encuesta
};
