import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conexion.js';
import { AdminModel } from './administrador.model.js';
import { ContabilidadModel } from './contabilidad.model.js';
import { ClienteModel } from './cliente.model.js';

const RegistroFactura = sequelize.define('RegistroFactura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fecha_factura: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'La fecha de factura debe tener un formato válido (YYYY-MM-DD).' },
    },
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cliente',
      key: 'id',
    },
  },
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'administrador',
      key: 'id',
    },
  },
  id_contabilidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contabilidad',
      key: 'id',
    },
  },
  numero_factura: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [3, 50],
        msg: 'El número de factura debe tener entre 3 y 50 caracteres.',
      },
      notEmpty: { msg: 'El número de factura no puede estar vacío.' },
    },
  },
  concepto: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [3, 500],
        msg: 'El concepto debe tener entre 3 y 500 caracteres.',
      },
      notEmpty: { msg: 'El concepto no puede estar vacío.' },
    },
  },
  monto_facturado: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'El monto facturado debe ser un número válido.' },
      min: {
        args: [0],
        msg: 'El monto facturado no puede ser negativo.',
      },
      notNull: { msg: 'El monto facturado es obligatorio.'},
    },
  },
  abonos: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: 'El abono debe ser un número válido.' },
      min: {
        args: [0],
        msg: 'El abono no puede ser negativo.',
      },
    },
  },
  saldo_pendiente: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'El saldo pendiente debe ser un número válido.' },
      min: {
        args: [0],
        msg: 'El saldo pendiente no puede ser negativo.',
      },
    },
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD).' },
    },
  },
  estado_factura: {
    type: DataTypes.ENUM('pendiente', 'pagada', 'vencida'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  tableName: 'registrofactura',
  timestamps: false,
});


// rleaciones con otras tablas
RegistroFactura.belongsTo(ClienteModel.Cliente, {
  foreignKey: 'id_cliente',
  as: 'cliente',
});

RegistroFactura.belongsTo(AdminModel.Admin, {
  foreignKey: 'id_admin',
  as: 'administrador',
});

RegistroFactura.belongsTo(ContabilidadModel.Contabilidad, {
  foreignKey: 'id_contabilidad',
  as: 'contabilidad',
});

export const RegistroFacturaModel = { RegistroFactura };
