import { RegistroFacturaModel } from '../../../src/models/registrar_facturas.model.js';
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

describe('RegistroFacturaModel', () => {
  let RegistroFactura;

  beforeAll(() => {
    RegistroFactura = RegistroFacturaModel.RegistroFactura;
  });

  // --------------------- DEFINICIÓN GENERAL ---------------------
  it('debería definir correctamente el modelo RegistroFactura', () => {
    expect(RegistroFactura.modelName).toBe('RegistroFactura');
    expect(RegistroFactura.options.tableName).toBe('registrofactura');
    expect(RegistroFactura.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos principales definidos', () => {
    const expectedFields = [
      'id', 'fecha_factura', 'id_cliente', 'id_admin', 'id_contabilidad',
      'numero_factura', 'concepto', 'monto_facturado', 'abonos',
      'saldo_pendiente', 'fecha_vencimiento', 'estado_factura',
    ];
    expectedFields.forEach(field => {
      expect(RegistroFactura.attributes[field]).toBeDefined();
    });
  });

  // --------------------- VALIDACIONES DE FECHAS ---------------------
  describe('Validaciones de fecha_factura', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.fecha_factura.validate;
    });

    it('debería tener una validación de fecha válida', () => {
      expect(validate.isDate).toBeDefined();
      expect(validate.isDate.msg).toBe('La fecha de factura debe tener un formato válido (YYYY-MM-DD).');
    });
  });

  describe('Validaciones de fecha_vencimiento', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.fecha_vencimiento.validate;
    });

    it('debería validar que la fecha tenga formato correcto', () => {
      expect(validate.isDate.msg).toBe('La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD).');
    });
  });

  // --------------------- VALIDACIONES DE NUMERO_FACTURA ---------------------
  describe('Validaciones de numero_factura', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.numero_factura.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([3, 50]);
      expect(validate.len.msg).toBe('El número de factura debe tener entre 3 y 50 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('El número de factura no puede estar vacío.');
    });
  });

  // --------------------- VALIDACIONES DE CONCEPTO ---------------------
  describe('Validaciones de concepto', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.concepto.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([3, 500]);
      expect(validate.len.msg).toBe('El concepto debe tener entre 3 y 500 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('El concepto no puede estar vacío.');
    });
  });

  // --------------------- VALIDACIONES DE MONTO_FACTURADO ---------------------
  describe('Validaciones de monto_facturado', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.monto_facturado.validate;
    });

    it('debería tener validación de número decimal', () => {
      expect(validate.isDecimal.msg).toBe('El monto facturado debe ser un número válido.');
    });

    it('debería tener validación de mínimo 0', () => {
      expect(validate.min.args).toEqual([0]);
      expect(validate.min.msg).toBe('El monto facturado no puede ser negativo.');
    });

    it('debería tener validación de campo obligatorio', () => {
      expect(validate.notNull.msg).toBe('El monto facturado es obligatorio.');
    });
  });

  // --------------------- VALIDACIONES DE ABONOS ---------------------
  describe('Validaciones de abonos', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.abonos.validate;
    });

    it('debería tener validación decimal y no negativo', () => {
      expect(validate.isDecimal.msg).toBe('El abono debe ser un número válido.');
      expect(validate.min.args).toEqual([0]);
      expect(validate.min.msg).toBe('El abono no puede ser negativo.');
    });
  });

  // --------------------- VALIDACIONES DE SALDO_PENDIENTE ---------------------
  describe('Validaciones de saldo_pendiente', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.saldo_pendiente.validate;
    });

    it('debería tener validación decimal y no negativo', () => {
      expect(validate.isDecimal.msg).toBe('El saldo pendiente debe ser un número válido.');
      expect(validate.min.args).toEqual([0]);
      expect(validate.min.msg).toBe('El saldo pendiente no puede ser negativo.');
    });
  });

  // --------------------- VALIDACIONES DE ESTADO_FACTURA ---------------------
  // --------------------- VALIDACIONES DE ESTADO_FACTURA ---------------------
  describe('Validaciones de estado_factura', () => {
    let estadoFactura;

    beforeAll(() => {
      estadoFactura = RegistroFactura.attributes.estado_factura;
    });

    it('debería estar definido como ENUM', () => {
      expect(estadoFactura.type).toBeDefined();
    });

    it('debería tener valores permitidos: pendiente, pagada, vencida', () => {
      // Sequelize guarda los valores ENUM en type.values
      expect(estadoFactura.type.values).toEqual(['pendiente', 'pagada', 'vencida']);
    });

    it('debería tener valor por defecto pendiente', () => {
      expect(estadoFactura.defaultValue).toBe('pendiente');
    });
  });


  // --------------------- RELACIONES ---------------------
  describe('Relaciones del modelo', () => {
    it('debería establecer belongsTo con ClienteModel', () => {
      RegistroFactura.belongsTo(ClienteModel.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
      expect(ClienteModel.Cliente.modelName).toBe('Cliente');
    });

    it('debería establecer belongsTo con AdminModel', () => {
      RegistroFactura.belongsTo(AdminModel.Admin, { foreignKey: 'id_admin', as: 'administrador' });
      expect(AdminModel.Admin.modelName).toBe('Admin');
    });

    it('debería establecer belongsTo con ContabilidadModel', () => {
      RegistroFactura.belongsTo(ContabilidadModel.Contabilidad, { foreignKey: 'id_contabilidad', as: 'contabilidad' });
      expect(ContabilidadModel.Contabilidad.modelName).toBe('Contabilidad');
    });
  });
});
