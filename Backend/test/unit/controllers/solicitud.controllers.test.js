import { SolicitudController } from '../../../src/controllers/solicitud.controller.js';
import { SolicitudService } from '../../../src/services/solicitud.services.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/solicitud.services.js');

describe('SolicitudController', () => {
  let controller;
  let serviceMock;
  let req, res;

  beforeEach(() => {
    serviceMock = new SolicitudService();
    controller = new SolicitudController(serviceMock);

    req = {
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };    
  });

  it('debería instanciar con el constructor por defecto correctamente', () => {
    const controller = new SolicitudController(); // Sin argumentos
    expect(controller).toBeInstanceOf(SolicitudController);
    expect(controller.solicitudService).toBeInstanceOf(SolicitudService);
  });

  describe('crear', () => {
    it('debería retornar 400 si cliente o servicio no existe', async () => {
      req.body = { cliente_id_fk: 1, servicio_id_fk: 2 };
      serviceMock.clienteExiste.mockResolvedValue(false);
      serviceMock.servicioExiste.mockResolvedValue(true);

      await controller.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cliente o servicio no encontrado',
      });
    });

    it('debería retornar 400 si ocurre error de validación', async () => {
      req.body = { cliente_id_fk: 1, servicio_id_fk: 2 };
      serviceMock.clienteExiste.mockResolvedValue(true);
      serviceMock.servicioExiste.mockResolvedValue(true);
      serviceMock.crear.mockRejectedValue(new ValidationError('Error', [
        { message: 'Campo requerido' }
      ]));

      await controller.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: ['Campo requerido'] });
    });

    it('debería retornar 500 si ocurre un error no manejado', async () => {
      req.body = { cliente_id_fk: 1, servicio_id_fk: 2 };
      serviceMock.clienteExiste.mockResolvedValue(true);
      serviceMock.servicioExiste.mockResolvedValue(true);
      serviceMock.crear.mockRejectedValue(new Error('Error general'));

      await controller.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al crear la solicitud',
      });
    });

    it('debería crear una solicitud exitosamente', async () => {
      req.body = { cliente_id_fk: 1, servicio_id_fk: 2 };
      const nuevaSolicitud = { id: 1, cliente_id_fk: 1, servicio_id_fk: 2 };

      serviceMock.clienteExiste.mockResolvedValue(true);
      serviceMock.servicioExiste.mockResolvedValue(true);
      serviceMock.crear.mockResolvedValue(nuevaSolicitud);

      await controller.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(nuevaSolicitud);
    });
  });

  describe('obtenerTodos', () => {
    it('debería retornar todas las solicitudes', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      serviceMock.obtenerTodos.mockResolvedValue(data);

      await controller.obtenerTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    it('debería manejar errores con status 500', async () => {
      serviceMock.obtenerTodos.mockRejectedValue(new Error('Fallo'));

      await controller.obtenerTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener las solicitudes',
      });
    });
  });

  describe('obtenerPorId', () => {
    it('debería retornar solicitud si existe', async () => {
      req.params.id = 1;
      const solicitud = { id: 1 };
      serviceMock.obtenerPorId.mockResolvedValue(solicitud);

      await controller.obtenerPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(solicitud);
    });

    it('debería retornar 404 si no existe', async () => {
      req.params.id = 1;
      serviceMock.obtenerPorId.mockResolvedValue(null);

      await controller.obtenerPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Solicitud no encontrada',
      });
    });

    it('debería retornar 500 en caso de error', async () => {
      req.params.id = 1;
      serviceMock.obtenerPorId.mockRejectedValue(new Error());

      await controller.obtenerPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener la solicitud',
      });
    });
  });

  describe('obtenerPorCliente', () => {
    it('debería retornar solicitudes por cliente', async () => {
      req.params.cliente_id = 1;
      const solicitudes = [{ id: 1 }];
      serviceMock.obtenerPorCliente.mockResolvedValue(solicitudes);

      await controller.obtenerPorCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(solicitudes);
    });

    it('debería retornar 404 si no hay solicitudes', async () => {
      req.params.cliente_id = 1;
      serviceMock.obtenerPorCliente.mockResolvedValue([]);

      await controller.obtenerPorCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No se encontraron solicitudes para este cliente',
      });
    });

    it('debería retornar 500 en caso de error', async () => {
      req.params.cliente_id = 1;
      serviceMock.obtenerPorCliente.mockRejectedValue(new Error());

      await controller.obtenerPorCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener las solicitudes',
      });
    });
  });

  describe('actualizarEstado', () => {
    it('debería actualizar estado correctamente', async () => {
      req.params.id = 1;
      req.body.estado = 'en_proceso';
      const actualizada = { id: 1, estado: 'en_proceso' };
      serviceMock.actualizarEstado.mockResolvedValue(actualizada);

      await controller.actualizarEstado(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(actualizada);
    });

    it('debería retornar 404 si no se actualiza', async () => {
      req.params.id = 1;
      req.body.estado = 'cancelada';
      serviceMock.actualizarEstado.mockResolvedValue(null);

      await controller.actualizarEstado(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Solicitud no encontrada',
      });
    });

    it('debería retornar 400 si hay error de validación', async () => {
      req.params.id = 1;
      req.body.estado = 'inválido';
      serviceMock.actualizarEstado.mockRejectedValue(
        new ValidationError('Error', [{ message: 'Estado no permitido' }])
      );

      await controller.actualizarEstado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Estado no permitido'],
      });
    });

    it('debería retornar 500 en caso de error', async () => {
      req.params.id = 1;
      req.body.estado = 'activo';
      serviceMock.actualizarEstado.mockRejectedValue(new Error());

      await controller.actualizarEstado(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al actualizar la solicitud',
      });
    });
  });

  describe('eliminar', () => {
    it('debería eliminar solicitud si existe', async () => {
      req.params.id = 1;
      serviceMock.eliminar.mockResolvedValue(true);

      await controller.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Solicitud eliminada correctamente',
      });
    });

    it('debería retornar 404 si no se encuentra', async () => {
      req.params.id = 2;
      serviceMock.eliminar.mockResolvedValue(false);

      await controller.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Solicitud no encontrada',
      });
    });

    it('debería retornar 500 si ocurre un error', async () => {
      req.params.id = 1;
      serviceMock.eliminar.mockRejectedValue(new Error());

      await controller.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al eliminar la solicitud',
      });
    });
  });
});
