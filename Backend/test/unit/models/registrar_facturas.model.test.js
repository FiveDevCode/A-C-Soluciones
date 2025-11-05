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

  // Pruebas como tal: definicion, validaciones, relaciones
  it('deberia definir correctamente el modelo RegistroFactura', () => {
    expect(RegistroFactura.modelName).toBe('RegistroFactura');
    expect(RegistroFactura.options.tableName).toBe('registrofactura');
    expect(RegistroFactura.options.timestamps).toBe(false);
  });

  it('deberia tener todos los campos principales definidos', () => {
    const expectedFields = [
      'id', 'fecha_factura', 'id_cliente', 'id_admin', 'id_contabilidad',
      'numero_factura', 'concepto', 'monto_facturado', 'abonos',
      'saldo_pendiente', 'fecha_vencimiento', 'estado_factura',
    ];
    expectedFields.forEach(field => {
      expect(RegistroFactura.attributes[field]).toBeDefined();
    });
  });
//validacion de fehcas facturas
  describe('Validaciones de fecha_factura', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.fecha_factura.validate;
    });

    it('deberia tener una validacion de fecha valida', () => {
      expect(validate.isDate).toBeDefined();
      expect(validate.isDate.msg).toBe('La fecha de factura debe tener un formato válido (YYYY-MM-DD).');
    });
  });

  describe('Validaciones de fecha_vencimiento', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.fecha_vencimiento.validate;
    });

    it('deberia validar que la fecha tenga formato correcto', () => {
      expect(validate.isDate.msg).toBe('La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD).');
    });
  });

  // validacion numero de factura
  describe('Validaciones de numero_factura', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.numero_factura.validate;
    });

    it('deberia tener validacion de longitud', () => {
      expect(validate.len.args).toEqual([3, 50]);
      expect(validate.len.msg).toBe('El número de factura debe tener entre 3 y 50 caracteres.');
    });

    it('deberia tener validacion de campo no vacio', () => {
      expect(validate.notEmpty.msg).toBe('El número de factura no puede estar vacío.');
    });
  });

  //Validacion de concepto
  describe('Validaciones de concepto', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.concepto.validate;
    });

    it('deberia tener validacion de longitud', () => {
      expect(validate.len.args).toEqual([3, 500]);
      expect(validate.len.msg).toBe('El concepto debe tener entre 3 y 500 caracteres.');
    });

    it('deberia tener validacion de campo no vacio', () => {
      expect(validate.notEmpty.msg).toBe('El concepto no puede estar vacío.');
    });
  });

  // validaciones de motno facturado
  describe('Validaciones de monto_facturado', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.monto_facturado.validate;
    });

    it('deberia tener validacion de numero decimal', () => {
      expect(validate.isDecimal.msg).toBe('El monto facturado debe ser un número válido.');
    });

    it('deberia tener validacion de minimo 0', () => {
      expect(validate.min.args).toEqual([0]);
      expect(validate.min.msg).toBe('El monto facturado no puede ser negativo.');
    });

    it('deberia tener validacion de campo obligatorio', () => {
      expect(validate.notNull.msg).toBe('El monto facturado es obligatorio.');
    });
  });

  //Validaciones de abonos
  describe('Validaciones de abonos', () => {
    let validate;
    beforeAll(() => {
      validate = RegistroFactura.attributes.abonos.validate;
    });

    it('deberia tener validacion decimal y no negativo', () => {
      expect(validate.isDecimal.msg).toBe('El abono debe ser un número válido.');
      expect(validate.min.args).toEqual([0]);
      expect(validate.min.msg).toBe('El abono no puede ser negativo.');
    });
  });

  //Validaciones de saldo pendiente
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

  // validacion de estado de la factura
  describe('Validaciones de estado_factura', () => {
    let estadoFactura;

    beforeAll(() => {
      estadoFactura = RegistroFactura.attributes.estado_factura;
    });

    it('deberia estar definido como ENUM', () => {
      expect(estadoFactura.type).toBeDefined();
    });

    it('deberia tener valores permitidos: pendiente, pagada, vencida', () => {
      // Sequelize guarda los valores ENUM en type.values
      expect(estadoFactura.type.values).toEqual(['pendiente', 'pagada', 'vencida']);
    });

    it('deberia tener valor por defecto pendiente', () => {
      expect(estadoFactura.defaultValue).toBe('pendiente');
    });
  });

// relaciones
  describe('Relaciones del modelo', () => {
    it('deberia establecer belongsTo con ClienteModel', () => {
      RegistroFactura.belongsTo(ClienteModel.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
      expect(ClienteModel.Cliente.modelName).toBe('Cliente');
    });

    it('deberia establecer belongsTo con AdminModel', () => {
      RegistroFactura.belongsTo(AdminModel.Admin, { foreignKey: 'id_admin', as: 'administrador' });
      expect(AdminModel.Admin.modelName).toBe('Admin');
    });

    it('deberia establecer belongsTo con ContabilidadModel', () => {
      RegistroFactura.belongsTo(ContabilidadModel.Contabilidad, { foreignKey: 'id_contabilidad', as: 'contabilidad' });
      expect(ContabilidadModel.Contabilidad.modelName).toBe('Contabilidad');
    });
  });
});
