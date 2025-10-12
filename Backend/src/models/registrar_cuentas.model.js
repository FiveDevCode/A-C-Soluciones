import { AdminModel } from "./administrador.model.js";
import { ClienteModel } from "./cliente.model.js";
import { ContabilidadModel } from "./contabilidad.model.js";
import { DataTypes } from "sequelize";
import { sequelize } from "../database/conexion.js";

const RegistroCuenta = sequelize.define("registarcuentas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  numero_cuenta: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [3, 50],
        msg: "El número de cuenta debe tener entre 3 y 50 caracteres.",
      },
      notEmpty: { msg: "El número de cuenta no puede estar vacío." },
    },
  },
  fecha_registro: {
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
      model: "cliente",
      key: "id",
    },
  },
  id_administrador: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "administrador",
      key: "id",
    },
  },
  id_contabilidad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "contabilidad",
      key: "id",
    },
  },
  nit: {
    type: DataTypes.STRING(9),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [5, 30],
        msg: "El número NIT debe tener entre 5 y 30 caracteres.",
      },
      notEmpty: { msg: "El número NIT no puede estar vacío." },
    },
  },
}, {
 tableName: 'registrarcuentas',
  timestamps: false,
});

// rleaciones con otras tablas
RegistroCuenta.belongsTo(ClienteModel.Cliente, {
  foreignKey: "id_cliente",
  as: "cliente",
});

RegistroCuenta.belongsTo(AdminModel.Admin, {
  foreignKey: "id_administrador",
  as: "administrador",
});

RegistroCuenta.belongsTo(ContabilidadModel.Contabilidad, {
  foreignKey: "id_contabilidad",
  as: "contabilidad",
});

export const RegistroCuentaModel = { RegistroCuenta };
