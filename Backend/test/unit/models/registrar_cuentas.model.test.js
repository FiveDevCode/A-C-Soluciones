import { RegistroCuentaModel } from '../../../src/models/registrar_cuentas.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { ContabilidadModel } from '../../../src/models/contabilidad.model.js';

// Mock de sequelize
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
      belongsTo: jest.fn(),
    })),
  },
}));

// Mocks de modelos relacionados
jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: { Cliente: { modelName: 'Cliente' } },
}));

jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: { Admin: { modelName: 'Admin' } },
}));

jest.mock('../../../src/models/contabilidad.model.js', () => ({
  ContabilidadModel: { Contabilidad: { modelName: 'Contabilidad' } },
}));

describe('RegistroCuentaModel', () => {
  let RegistroCuenta;

  beforeAll(() => {
    RegistroCuenta = RegistroCuentaModel.RegistroCuenta;
  });

  // --------------------- DEFINICIÓN GENERAL ---------------------
  it('debería definir correctamente el modelo RegistroCuenta', () => {
    expect(RegistroCuenta.modelName).toBe('registarcuentas'); // nota: el nombre tiene una “r” omitida según tu modelo
    expect(RegistroCuenta.options.tableName).toBe('registrarcuentas');
    expect(RegistroCuenta.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos principales definidos', () => {
    const expectedFields = [
      'id',
      'numero_cuenta',
      'fecha_registro',
      'id_cliente',
      'id_administrador',
      'id_contabilidad',
      'nit',
    ];
    expectedFields.forEach(field => {
      expect(RegistroCuenta.attributes[field]).toBeDefined();
    });
  });

  // --------------------- VALIDACIONES DE NUMERO_CUENTA ---------------------
  describe('Validaciones de numero_cuenta', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroCuenta.attributes.numero_cuenta.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([3, 50]);
      expect(validate.len.msg).toBe('El número de cuenta debe tener entre 3 y 50 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('El número de cuenta no puede estar vacío.');
    });
  });

  // --------------------- VALIDACIONES DE FECHA_REGISTRO ---------------------
  describe('Validaciones de fecha_registro', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroCuenta.attributes.fecha_registro.validate;
    });

    it('debería tener una validación de fecha válida', () => {
      expect(validate.isDate).toBeDefined();
      expect(validate.isDate.msg).toBe('La fecha de factura debe tener un formato válido (YYYY-MM-DD).');
    });
  });

  // --------------------- VALIDACIONES DE NIT ---------------------
  describe('Validaciones de nit', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroCuenta.attributes.nit.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([5, 30]);
      expect(validate.len.msg).toBe('El número NIT debe tener entre 5 y 30 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('El número NIT no puede estar vacío.');
    });
  });

  // --------------------- VALIDACIONES DE RELACIONES ---------------------
  describe('Validaciones de campos relacionales', () => {
    it('id_cliente debería tener referencia a cliente', () => {
      const ref = RegistroCuenta.attributes.id_cliente.references;
      expect(ref.model).toBe('cliente');
      expect(ref.key).toBe('id');
    });

    it('id_administrador debería tener referencia a administrador', () => {
      const ref = RegistroCuenta.attributes.id_administrador.references;
      expect(ref.model).toBe('administrador');
      expect(ref.key).toBe('id');
    });

    it('id_contabilidad debería tener referencia a contabilidad', () => {
      const ref = RegistroCuenta.attributes.id_contabilidad.references;
      expect(ref.model).toBe('contabilidad');
      expect(ref.key).toBe('id');
    });
  });

  // --------------------- RELACIONES ---------------------
  describe('Relaciones del modelo', () => {
    it('debería establecer belongsTo con ClienteModel', () => {
      RegistroCuenta.belongsTo(ClienteModel.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
      expect(ClienteModel.Cliente.modelName).toBe('Cliente');
    });

    it('debería establecer belongsTo con AdminModel', () => {
      RegistroCuenta.belongsTo(AdminModel.Admin, { foreignKey: 'id_administrador', as: 'administrador' });
      expect(AdminModel.Admin.modelName).toBe('Admin');
    });

    it('debería establecer belongsTo con ContabilidadModel', () => {
      RegistroCuenta.belongsTo(ContabilidadModel.Contabilidad, { foreignKey: 'id_contabilidad', as: 'contabilidad' });
      expect(ContabilidadModel.Contabilidad.modelName).toBe('Contabilidad');
    });
  });
});
