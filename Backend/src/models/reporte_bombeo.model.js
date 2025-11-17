import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js'; // Asumiendo que esta es tu conexión

export const ReporteBombeo = sequelize.define('ReporteBombeo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
            notNull: { msg: 'La fecha es requerida' },
            isDate: { msg: 'Debe ser una fecha válida' }
        }
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: 'cliente', 
            key: 'id'
        },
        validate: { isInt: { msg: 'ID de cliente no válido' }, notNull: true }
    },
    tecnico_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: 'tecnico', 
            key: 'id'
        },
        validate: { isInt: { msg: 'ID de técnico no válido' }, notNull: true }
    },
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'administrador', 
            key: 'id'
        }
    },

    visita_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'visitas', 
            key: 'id'
        }
    },
    direccion: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { 
            notNull: { msg: 'La dirección es requerida' },
            len: { args: [0, 150], msg: 'La dirección debe tener entre 0 y 150 caracteres' },
            notEmpty: { msg: 'La dirección no puede estar vacía' }
        }
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { 
            notNull: { msg: 'La ciudad es requerida' },
            len: { args: [0, 100], msg: 'La ciudad debe tener entre 0 y 100 caracteres' },
            notEmpty: { msg: 'La ciudad no puede estar vacía' }
         }
    },
    telefono: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { 
            notNull: { msg: 'El teléfono es requerido' },
            len: { args: [0, 50], msg: 'El teléfono debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'El teléfono no puede estar vacío' }
         }
    },
    encargado: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { 
            notNull: { msg: 'El encargado es requerido' },
            len: { args: [0, 100], msg: 'El encargado debe tener entre 0 y 100 caracteres' },
            notEmpty: { msg: 'El encargado no puede estar vacío' }

         }
    },
    observaciones_finales: {
        type: DataTypes.TEXT,
        allowNull: false, 
        validate:{
            notNull: { msg: 'Las observaciones finales son requeridas' },

        }
    },
    pdf_path: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'reportebombeo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export const ReporteBombeoModel = { 
  ReporteBombeo 
};