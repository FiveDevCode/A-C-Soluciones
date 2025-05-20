import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const Servicio = sequelize.define('Servicio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre del servicio no puede estar vacío.' },
      len: {
        args: [2, 100],
        msg: 'El nombre del servicio debe tener entre 2 y 100 caracteres.',
      },
      is: {
        args: /^[A-ZÁÉÍÓÚÑ0-9 !,.&()\-]+$/i,
        msg: 'El nombre del servicio contiene caracteres no válidos.',
      },
      noSpacesEdges(value) {
        if (value.trim() !== value) {
          throw new Error('El nombre no debe tener espacios al inicio o final.');
        }
      },
    },
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción del servicio no puede estar vacía.' },
      len: {
        args: [20, 500],
        msg: 'La descripción debe tener entre 20 y 500 caracteres.',
      },
      noSpacesEdges(value) {
        if (value.trim() !== value) {
          throw new Error('La descripción no debe tener espacios al inicio o final.');
        }
      },
    },
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  fecha_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  creada_por_fk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'El ID del creador debe ser un número entero.' },
      min: {
        args: [1],
        msg: 'El ID del creador debe ser un número positivo.',
      },
    },
  },
  id_administrador: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: { msg: 'El ID del administrador debe ser un número entero.' },
      min: {
        args: [1],
        msg: 'El ID del administrador debe ser un número positivo.',
      },
    },
  },
  tecnico_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tecnico', 
      key: 'id'
    },
    validate: {
      isInt: { msg: 'El ID del técnico debe ser un número entero.' },
      min: {
        args: [1],
        msg: 'El ID del técnico debe ser un número positivo.'
      }
    }
  }
}, {
  tableName: 'servicios',
  timestamps: false,
  hooks: {
    beforeUpdate: (servicio) => {
      servicio.fecha_modificacion = new Date();
    }
  }
});


export const ServicioModel = {
  Servicio
};
