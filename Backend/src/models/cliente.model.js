import {DataTypes} from 'sequelize'
import { sequelize } from "../database/conexion";


sequelize.define('cliente',{

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement

        
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Apellido: {

        type: DataTypes.STRING(100),
        allowNull: false,
    },
    Telefono: {

        type: DataTypes.STRING(20)
    },
    Direccion: {

        type: DataTypes.TEXT


    },
    fecha_registro: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Estado: {

        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }

    


})