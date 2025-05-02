// src/models/tecnico.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';
import { encryptPasswordHook } from '../hooks/encryptPassword.js'; // Importar el hook


const Tecnico = sequelize.define('Tecnico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/i,
        msg: 'El nombre solo puede contener letras y espacios.',
      },
      len: {
        args: [1, 100],
        msg: 'El nombre no debe exceder los 50 caracteres.',
      },
      noSpacesEdges(value) {
        if (value.trim() !== value) {
          throw new Error('El nombre no debe tener espacios al inicio o final.');
        }
      },
    },
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/i,
        msg: 'El primer apellido solo puede contener letras.',
      },
      len: {
        args: [1, 100],
        msg: 'El primer apellido no debe exceder los 50 caracteres.',
      },
      noSpacesEdges(value) {
        if (value.trim() !== value) {
          throw new Error('El primer apellido no debe tener espacios al inicio o final.');
        }
      },
    },
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
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isNumeric: { msg: 'El teléfono solo puede contener números.' },
      len: {
        args: [10, 10],
        msg: 'El teléfono debe tener exactamente 10 dígitos.',
      },
      startsWithValidDigit(value) {
        if (!value.startsWith('3')) {
          throw new Error('El teléfono debe iniciar con 3 en Colombia.');
        }
      },
    },
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
        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!])(?!.*\s)(?!.*(.)\1{2,}).{8,64}$/,
        msg: 'La contraseña debe incluir mayúscula, minúscula, número, carácter especial y no repetir caracteres.',
      },
      notCommonPassword(value) {
        const commonPasswords = ['123456', 'abcdef', 'qwerty', '12345678', '111111'];
        if (commonPasswords.includes(value)) {
          throw new Error('La contraseña no puede ser común o predecible.');
        }
      },
    },
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  rol: {
    type: DataTypes.ENUM('tecnico'),
    defaultValue: 'tecnico',
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
  },
}, {
  tableName: 'tecnico',
  timestamps: false,
});

// encriptar la contraseña antes de guardar el registro
Tecnico.beforeCreate(encryptPasswordHook); 

// exportamos el model para usarlo en el repository
export const TecnicoModel = {
  Tecnico
}