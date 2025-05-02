import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const Usuario = sequelize.define('usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  correo_electronico: { type: DataTypes.STRING, unique: true, allowNull: false },
  contrasenia: { type: DataTypes.STRING, allowNull: false },
}, { 
  timestamps: true, 
  freezeTableName: true 
});

export default Usuario;