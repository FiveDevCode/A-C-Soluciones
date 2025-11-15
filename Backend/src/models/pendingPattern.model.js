import { DataTypes } from "sequelize";
import { sequelize } from "../database/conexion.js";

export const PendingPatternModel = sequelize.define("PendingPattern", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true },
  mensaje: { 
    type: DataTypes.STRING, 
    allowNull: false },
    
  fecha: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW },
}, {
  tableName: "pending_patterns",
  timestamps: false
});
