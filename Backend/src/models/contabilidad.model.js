import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';
import { encryptPasswordHook } from '../hooks/encryptPassword.js';
import { AdminModel } from './administrador.model.js';

const Contabilidad = sequelize.define('Contabilidad', {
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
        args: [/^[-A-ZÁÉÍÓÚÑ0-9 !,.&()]+$/i],
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
        args: [/^[-A-ZÁÉÍÓÚÑ0-9 !,.&()]+$/i],
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
        args: [/^[a-z0-9_%+.-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i],
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
      notStartsWithZero(value) {
        if (value.startsWith('0')) {
          throw new Error('El teléfono no debe comenzar con cero.');
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
      tieneMayuscula(value) {
        if (!/[A-Z]/.test(value)) {
          throw new Error('La contraseña debe contener al menos una letra mayúscula.');
        }
      },
      tieneMinuscula(value) {
        if (!/[a-z]/.test(value)) {
          throw new Error('La contraseña debe contener al menos una letra minúscula.');
        }
      },
      tieneNumero(value) {
        if (!/\d/.test(value)) {
          throw new Error('La contraseña debe contener al menos un número.');
        }
      },
      tieneEspecial(value) {
        if (!/[@#$%&*!]/.test(value)) {
          throw new Error('La contraseña debe contener al menos un carácter especial (@#$%&*!).');
        }
      },
      sinEspacios(value) {
        if (/\s/.test(value)) {
          throw new Error('La contraseña no debe contener espacios.');
        }
      },
      sinRepetidos(value) {
        if (/(.)\1{2,}/.test(value)) {
          throw new Error('La contraseña no debe tener más de 2 caracteres repetidos seguidos.');
        }
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
    type: DataTypes.ENUM('Contador'),
    defaultValue: 'Contador',
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo',
  },
  id_administrador: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'administrador',
      key: 'id',
    },
  },
  recovery_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recovery_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'contabilidad',
  timestamps: false,
});

// hook para contraseña
Contabilidad.beforeCreate(encryptPasswordHook);

Contabilidad.belongsTo(AdminModel.Admin, {
  foreignKey: 'id_administrador',
  as: 'administrador',
});

export const ContabilidadModel = { Contabilidad };
