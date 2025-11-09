
import { RegistrarFacturasController } from '../../../src/controllers/registrar_facturas.controller.js';
import { RegistroFacturaService } from '../../../src/services/registrar_facturas.services.js';
import { ValidationError } from 'sequelize';

// Mock al servicio
jest.mock('../../../src/services/registrar_facturas.services.js');

describe('RegistrarFacturasController', () => {
  let controller;
  let mockService;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockService = new RegistroFacturaService();
    controller = new RegistrarFacturasController();
    controller.registroFacturaService = mockService; // mock del controlador

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para crear el registro de la factura
  describe('crearRegistroFactura', () => {
    it('debe crear una factura y devolver 201 si no existe', async () => {
      mockRequest.body = { numero_factura: 'F-001', monto: 100 };
      mockService.obtenerRegistroPorNumero.mockResolvedValue(null);
      mockService.crearRegistroFactura.mockResolvedValue({ id: 1, ...mockRequest.body });

      await controller.crearRegistroFactura(mockRequest, mockResponse);

      expect(mockService.obtenerRegistroPorNumero).toHaveBeenCalledWith('F-001');
      expect(mockService.crearRegistroFactura).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Factura registrada exitosamente',
        data: { id: 1, ...mockRequest.body },
      });
    });

    it('debe devolver 400 si la factura ya existe', async () => {
      mockRequest.body = { numero_factura: 'F-001' };
      mockService.obtenerRegistroPorNumero.mockResolvedValue({ id: 1, numero_factura: 'F-001' });

      await controller.crearRegistroFactura(mockRequest, mockResponse);

      expect(mockService.obtenerRegistroPorNumero).toHaveBeenCalledWith('F-001');
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'La factura ya está registrada (número de factura en uso)' });
    });

    it('debe manejar errores de validación y devolver 400', async () => {
        mockRequest.body = { numero_factura: 'F-001' };
        const validationError = new ValidationError('Error de validación');
        validationError.errors = [{ path: 'monto', message: 'El monto es requerido' }];
        mockService.obtenerRegistroPorNumero.mockResolvedValue(null);
        mockService.crearRegistroFactura.mockRejectedValue(validationError);
      
        await controller.crearRegistroFactura(mockRequest, mockResponse);
      
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ errors: { monto: 'El monto es requerido' } });
      });

    it('debe manejar errores generales y devolver 500', async () => {
      mockRequest.body = { numero_factura: 'F-001' };
      const error = new Error('Error inesperado');
      mockService.obtenerRegistroPorNumero.mockResolvedValue(null);
      mockService.crearRegistroFactura.mockRejectedValue(error);

      await controller.crearRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al registrar la factura',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para obtener registro por cliente
  describe('obtenerRegistroPorCliente', () => {
    it('debe devolver las facturas de un cliente y un estado 200', async () => {
      mockRequest.params = { id_cliente: '1' };
      const facturas = [{ id: 1, id_cliente: 1 }];
      mockService.obtenerRegistroPorCliente.mockResolvedValue(facturas);

      await controller.obtenerRegistroPorCliente(mockRequest, mockResponse);

      expect(mockService.obtenerRegistroPorCliente).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(facturas);
    });

    it('debe devolver 404 si no se encuentran facturas', async () => {
      mockRequest.params = { id_cliente: '1' };
      mockService.obtenerRegistroPorCliente.mockResolvedValue([]);

      await controller.obtenerRegistroPorCliente(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No se encontraron facturas para este cliente' });
    });

    it('debe manejar errores y devolver 500', async () => {
      mockRequest.params = { id_cliente: '1' };
      const error = new Error('Error inesperado');
      mockService.obtenerRegistroPorCliente.mockRejectedValue(error);

      await controller.obtenerRegistroPorCliente(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener las facturas del cliente',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para obtener registro por ID
  describe('obtenerRegistroPorId', () => {
    it('debe devolver una factura por id y un estado 200', async () => {
      mockRequest.params = { id: '1' };
      const factura = { id: 1 };
      mockService.obtenerRegistroPorId.mockResolvedValue(factura);

      await controller.obtenerRegistroPorId(mockRequest, mockResponse);

      expect(mockService.obtenerRegistroPorId).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(factura);
    });

    it('debe devolver 404 si la factura no se encuentra', async () => {
      mockRequest.params = { id: '999' };
      mockService.obtenerRegistroPorId.mockResolvedValue(null);

      await controller.obtenerRegistroPorId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
    });

    it('debe manejar errores y devolver 500', async () => {
      mockRequest.params = { id: '1' };
      const error = new Error('Error inesperado');
      mockService.obtenerRegistroPorId.mockRejectedValue(error);

      await controller.obtenerRegistroPorId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener la factura',
        error: 'Error inesperado',
      });
    });
  });


  // Pruebas para por numero de factura
  describe('obtenerRegistroPorNumero', () => {
    it('debe devolver una factura por número y un estado 200', async () => {
      mockRequest.params = { numero_factura: 'F-001' };
      const factura = { id: 1, numero_factura: 'F-001' };
      mockService.obtenerRegistroPorNumero.mockResolvedValue(factura);

      await controller.obtenerRegistroPorNumero(mockRequest, mockResponse);

      expect(mockService.obtenerRegistroPorNumero).toHaveBeenCalledWith('F-001');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ factura });
    });

    it('debe devolver 404 si la factura no se encuentra', async () => {
      mockRequest.params = { numero_factura: 'F-999' };
      mockService.obtenerRegistroPorNumero.mockResolvedValue(null);

      await controller.obtenerRegistroPorNumero(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
    });

    it('debe manejar errores y devolver 500', async () => {
      mockRequest.params = { numero_factura: 'F-999' };
      const error = new Error('Error inesperado');
      mockService.obtenerRegistroPorNumero.mockRejectedValue(error);

      await controller.obtenerRegistroPorNumero(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error al obtener la factura' });
    });
  });

  // Pruebas para obtener todos los regstro de facturas
  describe('obtenerRegistros', () => {
    it('debe devolver todas las facturas y un estado 200', async () => {
      const facturas = [{ id: 1 }, { id: 2 }];
      mockService.obtenerRegistros.mockResolvedValue(facturas);

      await controller.obtenerRegistros(mockRequest, mockResponse);

      expect(mockService.obtenerRegistros).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(facturas);
    });

    it('debe manejar errores y devolver 500', async () => {
      const error = new Error('Error inesperado');
      mockService.obtenerRegistros.mockRejectedValue(error);

      await controller.obtenerRegistros(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener las facturas',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para saldo pendiente
  describe('obtenerPorSaldoPendiente', () => {
    it('debe devolver facturas con saldo pendiente y un estado 200', async () => {
      const facturas = [{ id: 1, saldo_pendiente: 100 }];
      mockService.obtenerPorSaldoPendiente.mockResolvedValue(facturas);

      await controller.obtenerPorSaldoPendiente(mockRequest, mockResponse);

      expect(mockService.obtenerPorSaldoPendiente).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(facturas);
    });

    it('debe manejar errores y devolver 500', async () => {
      const error = new Error('Error inesperado');
      mockService.obtenerPorSaldoPendiente.mockRejectedValue(error);

      await controller.obtenerPorSaldoPendiente(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener las facturas con saldo pendiente',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para estado
  describe('obtenerPorEstado', () => {
    it('debe devolver facturas por estado y un estado 200', async () => {
      mockRequest.params = { estado_factura: 'pendiente' };
      const facturas = [{ id: 1, estado_factura: 'pendiente' }];
      mockService.obtenerPorEstado.mockResolvedValue(facturas);

      await controller.obtenerPorEstado(mockRequest, mockResponse);

      expect(mockService.obtenerPorEstado).toHaveBeenCalledWith('pendiente');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(facturas);
    });

    it('debe manejar errores y devolver 500', async () => {
      mockRequest.params = { estado_factura: 'pendiente' };
      const error = new Error('Error inesperado');
      mockService.obtenerPorEstado.mockRejectedValue(error);

      await controller.obtenerPorEstado(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al obtener las facturas por estado',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para actualizar
  describe('actualizarRegistroFactura', () => {
    it('debe actualizar una factura y devolver 200', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { monto: 200 };
      const facturaActualizada = { id: 1, monto: 200 };
      mockService.actualizarRegistroFactura.mockResolvedValue(facturaActualizada);

      await controller.actualizarRegistroFactura(mockRequest, mockResponse);

      expect(mockService.actualizarRegistroFactura).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Factura actualizada exitosamente',
        data: facturaActualizada,
      });
    });

    it('debe devolver 404 si la factura a actualizar no se encuentra', async () => {
      mockRequest.params = { id: '999' };
      mockService.actualizarRegistroFactura.mockResolvedValue(null);

      await controller.actualizarRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
    });

    it('debe manejar errores de validación y devolver 400', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { monto: -100 }; // Dato inválido
      const validationError = new ValidationError('Error de validación');
      validationError.errors = [{ path: 'monto', message: 'El monto no puede ser negativo' }];
      mockService.actualizarRegistroFactura.mockRejectedValue(validationError);

      await controller.actualizarRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: { monto: 'El monto no puede ser negativo' } });
    });

    it('debe manejar errores generales y devolver 500', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { monto: 200 };
      const error = new Error('Error inesperado');
      mockService.actualizarRegistroFactura.mockRejectedValue(error);

      await controller.actualizarRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al actualizar la factura',
        error: 'Error inesperado',
      });
    });
  });

  // Pruebas para eliminar
  describe('eliminarRegistroFactura', () => {
    it('debe eliminar una factura y devolver 200', async () => {
      mockRequest.params = { id: '1' };
      mockService.eliminarRegistroFactura.mockResolvedValue({ id: 1 });

      await controller.eliminarRegistroFactura(mockRequest, mockResponse);

      expect(mockService.eliminarRegistroFactura).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Factura eliminada exitosamente' });
    });

    it('debe devolver 404 si la factura a eliminar no se encuentra', async () => {
      mockRequest.params = { id: '999' };
      mockService.eliminarRegistroFactura.mockResolvedValue(null);

      await controller.eliminarRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Factura no encontrada' });
    });

    it('debe manejar errores y devolver 500', async () => {
      mockRequest.params = { id: '1' };
      const error = new Error('Error inesperado');
      mockService.eliminarRegistroFactura.mockRejectedValue(error);

      await controller.eliminarRegistroFactura(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error al eliminar la factura',
        error: 'Error inesperado',
      });
    });
  });


});
