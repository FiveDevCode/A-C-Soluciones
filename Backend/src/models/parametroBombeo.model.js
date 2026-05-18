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
    tanque_marca: { 
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tanque_carga_determinada: { 
        type: DataTypes.STRING(50),
        allowNull: true
    },
    tanque_carga_media: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    controlador_marca: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'parametrobombeo',
    timestamps: false
});

export const ParametroBombeoModel = { 
  ParametroBombeo 
};