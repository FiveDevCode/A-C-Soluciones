import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const Faq = sequelize.define('Faq', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  pregunta: {
    type: DataTypes.STRING(350),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La pregunta no puede estar vacía.' },
      len: {
        args: [5, 350],
        msg: 'La pregunta debe tener entre 5 y 350 caracteres.'
      },
      noEspacios(value) {
        if (value.trim() !== value) {
          throw new Error('La pregunta no debe comenzar ni terminar con espacios.');
        }
      }
    }
  },
  respuesta: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La respuesta no puede estar vacía.' },
      len: {
        args: [5, 500],
        msg: 'La respuesta debe tener entre 5 y 500 caracteres.'
      },
      noEspacios(value) {
        if (value.trim() !== value) {
          throw new Error('La respuesta no debe comenzar ni terminar con espacios.');
        }
      }
    }
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La categoría no puede estar vacía.' },
      len: {
        args: [3, 50],
        msg: 'La categoría debe tener entre 3 y 50 caracteres.'
      },
    }
  },
  id_administrador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'administrador',
      key: 'id'
    }
  }
}, {
  tableName: 'preguntas_frecuentes',
  timestamps: false
});

export const FaqModel = {
  Faq
};
