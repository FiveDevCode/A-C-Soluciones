import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

export const ParametroBombeo = sequelize.define('ParametroBombeo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reporte_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reportebombeo',
            key: 'id'
        },
        validate: { isInt: true, notNull: true }
    },
    voltaje_linea: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'El voltaje de la línea es requerido' },
            len: { args: [0, 50], msg: 'El voltaje de la línea debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'El voltaje de la línea no puede estar vacío' }
        }
    },
    corriente_linea: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La corriente de la línea es requerida' },
            len: { args: [0, 50], msg: 'La corriente de la línea debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'La corriente de la línea no puede estar'
        }
    } 
    },
    presion_succion: {
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La presión de succión es requerida' },
            len: { args: [0, 50], msg: 'La presión de succión debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'La presión de succión no puede estar vacía' },
        }
    },
    presion_descarga: {
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La presión de descarga es  requerida' },
            len: { args: [0, 50], msg: 'La presión de descarga debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'La presión de descarga no puede estar vacía' },
        }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'parametrobombeo',
    timestamps: false
});

export const ParametroBombeoModel = { 
  ParametroBombeo 
};