import { ContabilidadController } from '../../../src/controllers/contabilidad.controller.js';
import { ContabilidadService } from '../../../src/services/contabilidad.services.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/contabilidad.services.js');

describe('ContabilidadController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockService = {
      obtenerContabilidadPorCedula: jest.fn(),
      obtenerContabilidadPorCorreo: jest.fn(),
      crearContabilidad: jest.fn(),
      obtenerContabilidadPorId: jest.fn(),
      actualizarContabilidad: jest.fn(),
      eliminarContabilidad: jest.fn(),
      autenticarContabilidad: jest.fn(),
    };

    ContabilidadService.mockImplementation(() => mockService);
    controller = new ContabilidadController();

    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // crearContabilidad
  describe('crearContabilidad', () => {
    it('debe crear un contador exitosamente', async () => {
      mockReq.body = { numero_de_cedula: '123', correo_electronico: 'test@mail.com' };
      mockService.obtenerContabilidadPorCedula.mockResolvedValue(null);
      mockService.obtenerContabilidadPorCorreo.mockResolvedValue(null);
      mockService.crearContabilidad.mockResolvedValue({ id: 1, nombre: 'Juan' });

      await controller.crearContabilidad(mockReq, mockRes);

      expect(mockService.crearContabilidad).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Contador creado exitosamente',
        data: { id: 1, nombre: 'Juan' },
      });
    });

    it('debe retornar 400 si la cédula o correo ya existen', async () => {
      mockReq.body = { numero_de_cedula: '123', correo_electronico: 'test@mail.com' };
      mockService.obtenerContabilidadPorCedula.mockResolvedValue({ id: 1 });

      await controller.crearContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'El Contador ya está registrada (cédula o correo en uso)',
      });
    });

    it('debe manejar errores de validación', async () => {
      const error = new ValidationError('Error', [
        { path: 'correo_electronico', message: 'Correo inválido' },
      ]);
      mockService.obtenerContabilidadPorCedula.mockResolvedValue(null);
      mockService.obtenerContabilidadPorCorreo.mockResolvedValue(null);
      mockService.crearContabilidad.mockRejectedValue(error);

      await controller.crearContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { correo_electronico: 'Correo inválido' },
      });
    });

    it('debe manejar errores generales', async () => {
      mockService.obtenerContabilidadPorCedula.mockResolvedValue(null);
      mockService.obtenerContabilidadPorCorreo.mockResolvedValue(null);
      mockService.crearContabilidad.mockRejectedValue(new Error('Fallo inesperado'));

      await controller.crearContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al crear el Contador',
        error: 'Fallo inesperado',
      });
    });
  });

  // obtenerContabilidadPorId
  describe('obtenerContabilidadPorId', () => {
    it('debe retornar el contador sin contraseña', async () => {
      const mockData = { get: jest.fn().mockReturnValue({ id: 1, contrasenia: '1234' }) };
      mockService.obtenerContabilidadPorId.mockResolvedValue(mockData);
      mockReq.params = { id: 1 };

      await controller.obtenerContabilidadPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, contrasenia: undefined });
    });

    it('debe retornar 404 si no existe', async () => {
      mockService.obtenerContabilidadPorId.mockResolvedValue(null);
      mockReq.params = { id: 1 };

      await controller.obtenerContabilidadPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Contador no encontrado' });
    });

    it('debe manejar errores', async () => {
      mockService.obtenerContabilidadPorId.mockRejectedValue(new Error('DB error'));

      await controller.obtenerContabilidadPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al obtener el Contador',
        error: 'DB error',
      });
    });
  });

  //  obtenerContabilidadPorCedula
  describe('obtenerContabilidadPorCedula', () => {
    it('debe retornar el contador', async () => {
      mockService.obtenerContabilidadPorCedula.mockResolvedValue({ id: 1 });
      mockReq.params = { numero_cedula: '123' };

      await controller.obtenerContabilidadPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ contabilidad: { id: 1 } });
    });

    it('debe retornar 404 si no existe', async () => {
      mockService.obtenerContabilidadPorCedula.mockResolvedValue(null);

      await controller.obtenerContabilidadPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('debe manejar errores', async () => {
      mockService.obtenerContabilidadPorCedula.mockRejectedValue(new Error('Error'));

      await controller.obtenerContabilidadPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // obtenerContabilidadPorCorreo
  describe('obtenerContabilidadPorCorreo', () => {
    it('debe retornar el contador', async () => {
      mockService.obtenerContabilidadPorCorreo.mockResolvedValue({ id: 2 });
      mockReq.params = { correo_electronico: 'mail@mail.com' };

      await controller.obtenerContabilidadPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ contabilidad: { id: 2 } });
    });

    it('debe retornar 404 si no existe', async () => {
      mockService.obtenerContabilidadPorCorreo.mockResolvedValue(null);

      await controller.obtenerContabilidadPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('debe manejar errores', async () => {
      mockService.obtenerContabilidadPorCorreo.mockRejectedValue(new Error('Error'));

      await controller.obtenerContabilidadPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // actualizarContabilidad
  describe('actualizarContabilidad', () => {
    it('debe actualizar correctamente', async () => {
      mockService.actualizarContabilidad.mockResolvedValue({ id: 1 });
      mockReq.params = { id: 1 };
      mockReq.body = { nombre: 'Nuevo' };

      await controller.actualizarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Contador actualizado exitosamente',
        data: { id: 1 },
      });
    });

    it('debe retornar 404 si no existe', async () => {
      mockService.actualizarContabilidad.mockResolvedValue(null);

      await controller.actualizarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('debe manejar errores', async () => {
      mockService.actualizarContabilidad.mockRejectedValue(new Error('Error'));

      await controller.actualizarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // eliminarContabilidad
  describe('eliminarContabilidad', () => {
    it('debe eliminar correctamente', async () => {
      await controller.eliminarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Contador eliminada exitosamente' });
    });

    it('debe manejar errores', async () => {
      mockService.eliminarContabilidad.mockRejectedValue(new Error('Error'));

      await controller.eliminarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  //  autenticarContabilidad
  describe('autenticarContabilidad', () => {
    it('debe autenticar correctamente', async () => {
      mockReq.body = { correo_electronico: 'test@mail.com', contrasenia: '1234' };
      mockService.autenticarContabilidad.mockResolvedValue({
        id: 1,
        nombre: 'Contador',
        correo_electronico: 'test@mail.com',
        rol: 'contabilidad',
      });

      await controller.autenticarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Autenticación exitosa',
        token: 'generar-token-jwt-aqui',
        contabilidad: {
          id: 1,
          nombre: 'Contador',
          correo_electronico: 'test@mail.com',
          rol: 'contabilidad',
        },
      });
    });

    it('debe manejar error de autenticación', async () => {
      mockService.autenticarContabilidad.mockRejectedValue(new Error('Credenciales inválidas'));

      await controller.autenticarContabilidad(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de autenticación',
        error: 'Credenciales inválidas',
      });
    });
  });
});
