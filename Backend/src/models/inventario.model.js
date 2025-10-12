import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';

const Inventario = sequelize.define('Inventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    field: 'nombre_herramienta', // <--- Mapea a la columna real en la DB
    type: DataTypes.STRING(100), 
    allowNull: false,
    validate: {
      len: {
        args: [3, 100], 
        msg: 'El nombre debe tener entre 3 y 100 caracteres.',
      },
     
      is: {
        args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9-]+$/,
        msg: 'El nombre solo puede contener letras, números, espacios y guiones (-).',
      },
    },
  },
  codigo: {
    type: DataTypes.STRING(20), 
    allowNull: false,
    unique: {
      msg: 'El código de herramienta ya está registrado. Ingrese uno diferente.', 
    },
    validate: {
      len: {
        args: [3, 20],
        msg: 'El código debe tener entre 3 y 20 caracteres.',
      },
     
      isAlphanumeric: {
        msg: 'El código solo puede contener caracteres alfanuméricos.',
      },
    },
  },
   categoria: {
    type: DataTypes.STRING(20), // Ajuste el tamaño para que coincida con la DB (20)
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La categoría no puede estar vacía o en la opción por defecto.',
      },
      // La DB ya tiene la restricción CHECK para estos valores.
      isIn: {
        args: [['electricas', 'manuales', 'medicion', 'neumaticas', 'jardineria', 'seguridad', 'otras']], 
        msg: 'La categoría seleccionada no es válida.',
      },
    },
  },


 cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1, 
        msg: 'La cantidad disponible debe ser mínimo 1.',
      },
      max: {
        args: 9999, 
        msg: 'La cantidad disponible debe ser máximo 9999.',
      },
      isInt: {
        msg: 'La cantidad debe ser un número entero.',
      },
    },
  },


  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Nueva',
    allowNull: false,
    validate: {
      isIn: {
        args: [['Nueva', 'Dañada', 'Mantenimiento']],
        msg: 'El estado debe ser seleccionado de la lista predefinida.',
      },
    },
  },
 
  id_administrador: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  id_contabilidad: {
    type: DataTypes.INTEGER,
    allowNull: true, 

    
  },
}, {
  tableName: 'inventario',
  timestamps: false, 
});

export const InventarioModel = {
  Inventario
};