import {DataTypes} from 'sequelize'
import { sequelize } from "../database/conexion";


sequelize.define('cliente',{

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull:false,

        
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: { //validación solo letras y espacios
                args: /^[/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/i,
                msg: 'El nombre solo puede contener letras y espacios.',

            },
            len: {
                args:[1,50],
                msg: 'El nombre no debe exceder los 50 caracteres.',

            }, //validación de espacios 
            noSpaceEdges (value){
                if(value.trim()!= value){
                    throw new Error('El nombre no debe tener espacios al inicio o final.');

                    
                }
            }

        }
    },
    Apellido: {

        type: DataTypes.STRING(100),
        allowNull: false,
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: { //validación solo letras y espacios
                args: /^[/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/i,
                msg: 'El nombre solo puede contener letras y espacios.',

            },
            len: {
                args:[1,50],
                msg: 'El apellido no debe exceder los 50 caracteres.',

            }, //validación de espacios 
            noSpaceEdges (value){
                if(value.trim()!= value){
                    throw new Error('El apellido no debe tener espacios al inicio o final.');

                    
                }
            }

        }
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