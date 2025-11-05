import { InventarioController } from '../../../src/controllers/inventario.controller.js';
import { InventarioService, INVENTARIO_ERRORS } from '../../../src/services/inventario.services.js';
import { ValidationError } from 'sequelize';

// Mock del servicio completo
jest.mock('../../../src/services/inventario.services.js');

describe('InventarioController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService = {
      crearInventario: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerInventarioPorId: jest.fn(),
      actualizarInventario: jest.fn(),
      eliminarInventario: jest.fn(),
    };

    InventarioService.mockImplementation(() => mockService);
    controller = new InventarioController();

    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // -------------------------------------------------------------------
  //  CREAR INVENTARIO
  // -------------------------------------------------------------------
  describe('crearInventario', () => {
    it('debe registrar un item exitosamente', async () => {
      const itemMock = { id: 1, nombre: 'Martillo' };
      mockService.crearInventario.mockResolvedValue(itemMock);
      mockReq.body = { nombre: 'Martillo', codigo: 'H001' };

      await controller.crearInventario(mockReq, mockRes);

      expect(mockService.crearInventario).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item de inventario registrado exitosamente.',
        item: itemMock,
      });
    });

    it('debe devolver 400 si el código ya existe', async () => {
      const error = new Error('Código duplicado');
      error.name = 'CodigoDuplicadoError';
      mockService.crearInventario.mockRejectedValue(error);

      await controller.crearInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: INVENTARIO_ERRORS.CODIGO_DUPLICADO,
      });
    });

    it('debe manejar errores de validación del formulario', async () => {
      const validationError = new ValidationError('Validation failed', [
        { path: 'nombre', message: 'El nombre es obligatorio' },
      ]);
      mockService.crearInventario.mockRejectedValue(validationError);

      await controller.crearInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de validación en el formulario.',
        errors: { nombre: 'El nombre es obligatorio' },
      });
    });

    it('debe manejar error interno del servidor', async () => {
      const error = new Error('Error inesperado');
      mockService.crearInventario.mockRejectedValue(error);

      await controller.crearInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al registrar el item de inventario. Intente nuevamente.',
      });
    });
  });

  // -------------------------------------------------------------------
  // 🧩 OBTENER TODOS
  // -------------------------------------------------------------------
  describe('obtenerTodos', () => {
    it('debe devolver todos los items', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      mockService.obtenerTodos.mockResolvedValue(items);

      await controller.obtenerTodos(mockReq, mockRes);

      expect(mockService.obtenerTodos).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(items);
    });

    it('debe manejar errores al obtener los items', async () => {
      mockService.obtenerTodos.mockRejectedValue(new Error('Falla DB'));

      await controller.obtenerTodos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al obtener los items de inventario.',
      });
    });
  });

  // -------------------------------------------------------------------
  // 🧩 OBTENER POR ID
  // -------------------------------------------------------------------
  describe('obtenerInventarioPorId', () => {
    it('debe devolver el item si existe', async () => {
      const item = { id: 1, nombre: 'Martillo' };
      mockService.obtenerInventarioPorId.mockResolvedValue(item);
      mockReq.params.id = 1;

      await controller.obtenerInventarioPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(item);
    });

    it('debe devolver 404 si no se encuentra el item', async () => {
      mockService.obtenerInventarioPorId.mockResolvedValue(null);

      await controller.obtenerInventarioPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item de inventario no encontrado.',
      });
    });

    it('debe manejar error interno', async () => {
      mockService.obtenerInventarioPorId.mockRejectedValue(new Error('Error DB'));

      await controller.obtenerInventarioPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al obtener el item de inventario.',
      });
    });
  });

  // -------------------------------------------------------------------
  // 🧩 ACTUALIZAR
  // -------------------------------------------------------------------
  describe('actualizarInventario', () => {
    it('debe actualizar correctamente un item', async () => {
      const itemActualizado = { id: 1, nombre: 'Martillo actualizado' };
      mockService.actualizarInventario.mockResolvedValue(itemActualizado);
      mockReq.params.id = 1;
      mockReq.body = { nombre: 'Nuevo' };

      await controller.actualizarInventario(mockReq, mockRes);

      expect(mockService.actualizarInventario).toHaveBeenCalledWith(1, { nombre: 'Nuevo' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item de inventario actualizado exitosamente.',
        item: itemActualizado,
      });
    });

    it('debe devolver 404 si no se encuentra el item para actualizar', async () => {
      mockService.actualizarInventario.mockResolvedValue(null);

      await controller.actualizarInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item de inventario no encontrado para actualizar.',
      });
    });

    it('debe manejar errores de validación', async () => {
      const validationError = new ValidationError('Validation error', [
        { path: 'codigo', message: 'Código inválido' },
      ]);
      mockService.actualizarInventario.mockRejectedValue(validationError);

      await controller.actualizarInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de validación al actualizar el item.',
        errors: { codigo: 'Código inválido' },
      });
    });

    it('debe manejar error interno', async () => {
      mockService.actualizarInventario.mockRejectedValue(new Error('Error DB'));

      await controller.actualizarInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al actualizar el item de inventario. Intente nuevamente.',
      });
    });
  });

  // -------------------------------------------------------------------
  // 🧩 ELIMINAR
  // -------------------------------------------------------------------
  describe('eliminarInventario', () => {
    it('debe eliminar la herramienta exitosamente', async () => {
      mockService.eliminarInventario.mockResolvedValue(true);
      mockReq.params.id = 1;

      await controller.eliminarInventario(mockReq, mockRes);

      expect(mockService.eliminarInventario).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Herramienta eliminada correctamente del inventario.',
      });
    });

    it('debe devolver 404 si no se encuentra la herramienta', async () => {
      mockService.eliminarInventario.mockResolvedValue(null);

      await controller.eliminarInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'La herramienta no fue encontrada.',
      });
    });

    it('debe manejar error interno', async () => {
      mockService.eliminarInventario.mockRejectedValue(new Error('Error DB'));

      await controller.eliminarInventario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al eliminar la herramienta. Intente nuevamente.',
      });
    });
  });
});
