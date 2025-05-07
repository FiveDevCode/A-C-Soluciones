import { DataTypes } from "sequelize";
import { sequelize } from "../database/conexion.js";
import { encryptPasswordHook } from '../hooks/encryptPassword.js';
import { noFechasPasadas, sinEspaciosSolamente } from "../hooks/validators.js";

const Cliente=sequelize.define('Cliente',{

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull:false,

        
    },
    numero_de_cedula: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: { msg: 'La cédula debe contener solo números.' },
          len: {
            args: [6, 10],
            msg: 'La cédula debe tener entre 6 y 10 dígitos.',
          },
          notStartsWithZero(value) {
            if (value.startsWith('0')) {
              throw new Error('La cédula no debe comenzar con cero.');
            }
          },
          notSequential(value) {
            const sequences = ['123456', '1234567', '12345678', '123456789', '111111', '1111111', '11111111', '111111111'];
            if (sequences.includes(value.substring(0, value.length - 1))) {
              throw new Error('La cédula no debe ser una secuencia numérica predecible.');
            }
          },
        },
      },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: { //validación solo letras, acentos y espacios
                args: [/^[a-záéíóúñ\s]*$/i],
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
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            is: { //validación solo letras y espacios
                args:[/^[a-záéíóúñ\s]*$/i],
                msg: 'El apellido solo puede contener letras y espacios.',

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
            args: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            msg: 'El correo electrónico tiene un formato incorrecto.',
          },
        },
      },
    telefono: {

        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isNumeric: {msg: 'El número de teléfono solo puede contener números.'},
            len:{
                args:[10,10],
                msg: 'El teléfono debe tener exactamente 10 dígitos',

            },
            iniciaConDigitoValido (value){
                if(!value.startsWith('3')){
                    throw new Error('El teléfono debe iniciar con 3 en Colombia');
                    
                }
            }
        }
    },
    contrasenia: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: {
            args: [8, 64],
            msg: 'La contraseña debe tener entre 8 y 64 caracteres.',
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[^\s]{8,64}$/,
            msg: 'La contraseña debe incluir mayúscula, minúscula, número, carácter especial y no repetir caracteres.',
          },
          //Valida que las contraseña ingresada no sea alguna predecible 
          notCommonPassword(value) {
            const commonPasswords = ['123456', 'abcdef', 'qwerty', '12345678', '111111'];
            if (commonPasswords.includes(value)) {
              throw new Error('La contraseña no puede ser común o predecible.');
            }
          },
        },
      },
    direccion: {

        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
              args: [10, 255],
              msg: 'La dirección debe tener entre 10 y 255 caracteres.',
            },
            notEmpty: {
              msg: 'La dirección no puede estar vacía.',
            },
            sinEspaciosSolamente
          }
        

    },
    fecha_registro: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: { msg: 'La fecha de registro debe ser una fecha válida.' },
            noFechasPasadas,
                
            
          }
          

    },
    rol: {
      type: DataTypes.ENUM('cliente'),
      defaultValue: 'cliente',
      allowNull: false
    },
    estado: {

        type: DataTypes.ENUM('activo', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo'
    },

}, {
    tableName: 'cliente',
    timestamps: false,
});


//Forna de encriptar la contraseña antes de guardar el registro
Cliente.beforeCreate(encryptPasswordHook);


export const ClienteModel ={
  Cliente
}
