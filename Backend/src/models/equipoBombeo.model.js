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
    presion: { 
        type: DataTypes.STRING(50),
        allowNull: false, 
        validate: {
            notNull: { msg: 'La presión es requerida' }
        }
    },
    sumergibles_medida: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sumergibles_placa: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    amperaje_medida: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    amperaje_placa: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    temperatura: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    amperaje_estado: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    ruidos: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    humedad: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    conexiones: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'equipobombeo',
    timestamps: false
});
export const EquipoBombeoModel = { 
  EquipoBombeo 
}; 