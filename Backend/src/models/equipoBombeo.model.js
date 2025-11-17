import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

export const EquipoBombeo = sequelize.define('EquipoBombeo', {
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
    equipo: { 
        type: DataTypes.STRING(100),
        allowNull: false, 
        validate: {
            notNull: { msg: 'El equipo es requerido' },
            len: { args: [0, 100], msg: 'El equipo debe tener entre 0 y 100 caracteres' },
            notEmpty: { msg: 'El equipo no puede estar vacío' }
        }
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La marca es requerida' },
            len: { args: [0, 100], msg: 'La marca debe tener entre 0 y 100 caracteres' },
            notEmpty: { msg: 'La marca no puede estar vacía' }
        } 
    },
    amperaje: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'El amperaje es requerido' },
            len: { args: [1, 50], msg: 'El amperaje debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'El amperaje no puede estar vacío' }
        }
    },
    presion: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La presión es requerida' },
            len: { args: [0, 50], msg: 'La presión debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'La presión no puede estar vacía' }
        }
    },
    temperatura: {
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La temperatura es requerida' },
            len: { args: [0, 50], msg: 'La temperatura debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'La temperatura no puede estar vacía' }
        }
    },
    estado: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'El estado es requerido' },
            len: { args: [0, 50], msg: 'El estado debe tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'El estado no puede estar vacío' }
        }
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: false, 
        validate: {
            notNull: { msg: 'Las observaciones son requeridas' },
            len: { args: [0, 50], msg: 'Las observaciones deben tener entre 0 y 50 caracteres' },
            notEmpty: { msg: 'Las observaciones no pueden estar vacías' }
        }
    }
}, {
    tableName: 'equipobombeo',
    timestamps: false
});
export const EquipoBombeoModel = { 
  EquipoBombeo 
}; 