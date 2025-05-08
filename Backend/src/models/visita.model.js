import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

export const Visita = sequelize.define('Visita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  fecha_programada: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha programada debe ser una fecha válida'
      },
      notInPast(value) {
        if (new Date(value) < new Date()) {
          throw new Error('La fecha no puede ser anterior a la fecha actual');
        }
      }
    }
  },
  duracion_estimada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60, 
    validate: {
      min: {
        args: [15],
        msg: 'La duración mínima es de 15 minutos'
      },
      max: {
        args: [480],
        msg: 'La duración máxima es de 8 horas (480 minutos)'
      }
    }
  },
  estado: {
    type: DataTypes.ENUM('programada', 'en_camino', 'iniciada', 'completada', 'cancelada'),
    defaultValue: 'programada',
    allowNull: false
  },
  notas_previas: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 250],
        msg: 'Las notas no pueden exceder los 250 caracteres'
      }
    }
  },
  notas_posteriores: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  solicitud_id_fk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'solicitudes',
      key: 'id'
    }
  },
  tecnico_id_fk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tecnico',
      key: 'id'
    }
  },
  servicio_id_fk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id'
    }
  }
}, {
  tableName: 'visitas',
  timestamps: false,
  indexes: [
    {
      fields: ['fecha_programada']
    },
    {
      fields: ['tecnico_id_fk']
    },
    {
      fields: ['solicitud_id_fk']
    },
    {
      fields: ['servicio_id_fk']
    }
  ]
});

export const VisitaModel = {
  Visita
}