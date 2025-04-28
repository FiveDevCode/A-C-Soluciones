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
            is: { //validación solo letras, acentos y espacios
                args: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/i,
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
            },
            //Validacion de repeticones excessivas (+3 caracteres igua)
            noRepeticionesExcesivas(value){
                if (/(.)\1{3,}/.test(value)){
                    throw new Error('No se permiten repeticiones excesivas de caracteres.');
                    
                }
            },
            noEspaciosMultiples (value){
                if(/\s{2,}/.test(value)){
                    throw new Error('No se permiten espacios multiples consecutivos.');
                    
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
    correo_electronico: {
        type: DataTypes.STRING(320),
        allowNull: false,
        validate: {
          isEmail: { msg: 'El correo electrónico no es válido.' },
          len: {
            args: [5, 320],
            msg: 'El correo debe tener máximo 320 caracteres.',
          },
          is: {
            args: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
            msg: 'El correo electrónico tiene un formato incorrecto.',
          },
        },
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