// src/models/admin.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';
import { encryptPasswordHook } from '../hooks/encryptPassword.js';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,  
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  numero_cedula: {
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
        args: /^[A-ZÁÉÍÓÚÑ0-9 !,.&()\-]+$/i,
        msg: 'El nombre solo puede contener letras y espacios.',
      },
      len: {
        args: [1, 50],
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
        args: /^[A-ZÁÉÍÓÚÑ0-9 !,.&()\-]+$/i,
        msg: 'El apellido solo puede contener letras.',
      },
      len: {
        args: [1, 50],
        msg: 'El apellido no debe exceder los 50 caracteres.',
      },
      noSpacesEdges(value) {
        if (value.trim() !== value) {
          throw new Error('El apellido no debe tener espacios al inicio o final.');
        }
      },
    },
  },
  correo_electronico: {
    type: DataTypes.STRING(320),
    allowNull: false,
    unique: true,
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
  rol: {
    type: DataTypes.ENUM('administrador'),
    defaultValue: 'administrador',
    allowNull: false
  },
  recovery_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recovery_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
  }, {
    tableName: 'administrador',
    timestamps: false,
  });

Admin.beforeCreate(encryptPasswordHook);

export const AdminModel = {
  Admin
};