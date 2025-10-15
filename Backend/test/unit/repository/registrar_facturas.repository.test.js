
import { RegistroFacturaRepository } from '../../../src/repository/registrar_facturas.repository.js';
import { RegistroFacturaModel } from '../../../src/models/registrar_facturas.model.js';
import { Op } from 'sequelize';

// Mock al modelo RegistroFacturaModel
jest.mock('../../../src/models/registrar_facturas.model.js', () => ({
  RegistroFacturaModel: {
    RegistroFactura: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('RegistroFacturaRepository', () => {
  let registroFacturaRepository;

  beforeEach(() => {
    registroFacturaRepository = new RegistroFacturaRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para el método crearRegistroFactura
  describe('crearRegistroFactura', () => {
    it('debe llamar a RegistroFactura.create con los datos correctos', async () => {
      const data = { numero_factura: 'F-001', monto: 100 };
      const expectedResponse = { id: 1, ...data };
      RegistroFacturaModel.RegistroFactura.create.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.crearRegistroFactura(data);

      expect(RegistroFacturaModel.RegistroFactura.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistroPorCliente
  describe('obtenerRegistroPorCliente', () => {
    it('debe llamar a RegistroFactura.findAll con el id del cliente', async () => {
      const id_cliente = 1;
      const expectedResponse = [{ id: 1, id_cliente: 1 }];
      RegistroFacturaModel.RegistroFactura.findAll.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerRegistroPorCliente(id_cliente);

      expect(RegistroFacturaModel.RegistroFactura.findAll).toHaveBeenCalledWith({ where: { id_cliente } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistroPorId
  describe('obtenerRegistroPorId', () => {
    it('debe llamar a RegistroFactura.findByPk con el id correcto', async () => {
      const id = 1;
      const expectedResponse = { id: 1 };
      RegistroFacturaModel.RegistroFactura.findByPk.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerRegistroPorId(id);

      expect(RegistroFacturaModel.RegistroFactura.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistros
  describe('obtenerRegistros', () => {
    it('debe llamar a RegistroFactura.findAll sin argumentos', async () => {
      const expectedResponse = [{ id: 1 }, { id: 2 }];
      RegistroFacturaModel.RegistroFactura.findAll.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerRegistros();

      expect(RegistroFacturaModel.RegistroFactura.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerRegistroPorNumero
  describe('obtenerRegistroPorNumero', () => {
    it('debe llamar a RegistroFactura.findOne con el número de factura', async () => {
      const numero_factura = 'F-001';
      const expectedResponse = { id: 1, numero_factura };
      RegistroFacturaModel.RegistroFactura.findOne.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerRegistroPorNumero(numero_factura);

      expect(RegistroFacturaModel.RegistroFactura.findOne).toHaveBeenCalledWith({ where: { numero_factura } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerPorSaldoPendiente
  describe('obtenerPorSaldoPendiente', () => {
    it('debe llamar a RegistroFactura.findAll con la condición de saldo pendiente > 0', async () => {
      const expectedResponse = [{ id: 1, saldo_pendiente: 100 }];
      RegistroFacturaModel.RegistroFactura.findAll.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerPorSaldoPendiente();

      expect(RegistroFacturaModel.RegistroFactura.findAll).toHaveBeenCalledWith({
        where: {
          saldo_pendiente: {
            [Op.gt]: 0,
          },
        },
      });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método obtenerPorEstado
  describe('obtenerPorEstado', () => {
    it('debe llamar a RegistroFactura.findAll con el estado de la factura', async () => {
      const estado_factura = 'pendiente';
      const expectedResponse = [{ id: 1, estado_factura }];
      RegistroFacturaModel.RegistroFactura.findAll.mockResolvedValue(expectedResponse);

      const result = await registroFacturaRepository.obtenerPorEstado(estado_factura);

      expect(RegistroFacturaModel.RegistroFactura.findAll).toHaveBeenCalledWith({ where: { estado_factura } });
      expect(result).toEqual(expectedResponse);
    });
  });

  // Pruebas para el método actualizarRegistroFactura
  describe('actualizarRegistroFactura', () => {
    it('debe actualizar y devolver el registro si se encuentra', async () => {
      const id = 1;
      const data = { monto: 200 };
      const mockRegistro = {
        update: jest.fn().mockResolvedValue({ id, ...data }),
      };
      RegistroFacturaModel.RegistroFactura.findByPk.mockResolvedValue(mockRegistro);

      const result = await registroFacturaRepository.actualizarRegistroFactura(id, data);

      expect(RegistroFacturaModel.RegistroFactura.findByPk).toHaveBeenCalledWith(id);
      expect(mockRegistro.update).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id, ...data });
    });

    it('debe devolver null si el registro no se encuentra', async () => {
      const id = 999;
      const data = { monto: 200 };
      RegistroFacturaModel.RegistroFactura.findByPk.mockResolvedValue(null);

      const result = await registroFacturaRepository.actualizarRegistroFactura(id, data);

      expect(RegistroFacturaModel.RegistroFactura.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  // Pruebas para el método eliminarRegistroFactura
  describe('eliminarRegistroFactura', () => {
    it('debe eliminar y devolver el registro si se encuentra', async () => {
      const id = 1;
      const mockRegistro = {
        destroy: jest.fn().mockResolvedValue(),
      };
      RegistroFacturaModel.RegistroFactura.findByPk.mockResolvedValue(mockRegistro);

      const result = await registroFacturaRepository.eliminarRegistroFactura(id);

      expect(RegistroFacturaModel.RegistroFactura.findByPk).toHaveBeenCalledWith(id);
      expect(mockRegistro.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockRegistro);
    });

    it('debe devolver null si el registro no se encuentra', async () => {
      const id = 999;
      RegistroFacturaModel.RegistroFactura.findByPk.mockResolvedValue(null);

      const result = await registroFacturaRepository.eliminarRegistroFactura(id);

      expect(RegistroFacturaModel.RegistroFactura.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });
});
