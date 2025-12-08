import * as notificacionController from '../../../src/controllers/notificacion.controller.js';
import * as notificacionService from '../../../src/services/notificacion.services.js';

jest.mock('../../../src/services/notificacion.services.js');

describe('NotificacionController', () => {
  let req;
  let res;
  let statusMock;
  let jsonMock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };

    req = {
      user: { id: 1, rol: 'CLIENTE' },
      query: {},
      params: {}
    };

    jest.clearAllMocks();
  });

  describe('obtenerNotificaciones', () => {
    it('debería retornar todas las notificaciones del usuario con límite por defecto', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, mensaje: 'Notificación 1', leida: false },
        { id_notificacion: 2, mensaje: 'Notificación 2', leida: true }
      ];

      notificacionService.obtenerNotificacionesUsuario.mockResolvedValue(mockNotificaciones);

      await notificacionController.obtenerNotificaciones(req, res);

      expect(notificacionService.obtenerNotificacionesUsuario).toHaveBeenCalledWith(1, 'cliente', 50);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockNotificaciones,
        total: 2
      });
    });

    it('debería retornar notificaciones con límite personalizado', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, mensaje: 'Notificación 1', leida: false }
      ];

      req.query.limite = '10';
      notificacionService.obtenerNotificacionesUsuario.mockResolvedValue(mockNotificaciones);

      await notificacionController.obtenerNotificaciones(req, res);

      expect(notificacionService.obtenerNotificacionesUsuario).toHaveBeenCalledWith(1, 'cliente', 10);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockNotificaciones,
        total: 1
      });
    });

    it('debería normalizar el rol a minúsculas', async () => {
      req.user.rol = 'ADMINISTRADOR';
      notificacionService.obtenerNotificacionesUsuario.mockResolvedValue([]);

      await notificacionController.obtenerNotificaciones(req, res);

      expect(notificacionService.obtenerNotificacionesUsuario).toHaveBeenCalledWith(
        1,
        'administrador',
        50
      );
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.obtenerNotificacionesUsuario.mockRejectedValue(error);

      await notificacionController.obtenerNotificaciones(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener las notificaciones.'
      });
    });
  });

  describe('obtenerNotificacionesNoLeidas', () => {
    it('debería retornar solo notificaciones no leídas', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, mensaje: 'Notificación 1', leida: false },
        { id_notificacion: 3, mensaje: 'Notificación 3', leida: false }
      ];

      notificacionService.obtenerNotificacionesNoLeidas.mockResolvedValue(mockNotificaciones);

      await notificacionController.obtenerNotificacionesNoLeidas(req, res);

      expect(notificacionService.obtenerNotificacionesNoLeidas).toHaveBeenCalledWith(1, 'cliente');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockNotificaciones,
        total: 2
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.obtenerNotificacionesNoLeidas.mockRejectedValue(error);

      await notificacionController.obtenerNotificacionesNoLeidas(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener las notificaciones no leídas.'
      });
    });
  });

  describe('contarNoLeidas', () => {
    it('debería retornar el conteo de notificaciones no leídas', async () => {
      notificacionService.contarNoLeidas.mockResolvedValue(5);

      await notificacionController.contarNoLeidas(req, res);

      expect(notificacionService.contarNoLeidas).toHaveBeenCalledWith(1, 'cliente');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        cantidad: 5
      });
    });

    it('debería retornar 0 si no hay notificaciones no leídas', async () => {
      notificacionService.contarNoLeidas.mockResolvedValue(0);

      await notificacionController.contarNoLeidas(req, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        cantidad: 0
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.contarNoLeidas.mockRejectedValue(error);

      await notificacionController.contarNoLeidas(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al contar las notificaciones no leídas.'
      });
    });
  });

  describe('marcarComoLeida', () => {
    beforeEach(() => {
      req.params.id_notificacion = '123';
    });

    it('debería marcar una notificación como leída exitosamente', async () => {
      notificacionService.marcarComoLeida.mockResolvedValue([1]); // 1 fila afectada

      await notificacionController.marcarComoLeida(req, res);

      expect(notificacionService.marcarComoLeida).toHaveBeenCalledWith(123, 1, 'cliente');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Notificación marcada como leída.'
      });
    });

    it('debería retornar 404 si la notificación no existe o no pertenece al usuario', async () => {
      notificacionService.marcarComoLeida.mockResolvedValue([0]); // 0 filas afectadas

      await notificacionController.marcarComoLeida(req, res);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Notificación no encontrada o no tienes permiso para modificarla.'
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.marcarComoLeida.mockRejectedValue(error);

      await notificacionController.marcarComoLeida(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al marcar la notificación como leída.'
      });
    });
  });

  describe('marcarTodasComoLeidas', () => {
    it('debería marcar todas las notificaciones como leídas', async () => {
      notificacionService.marcarTodasComoLeidas.mockResolvedValue([3]); // 3 filas afectadas

      await notificacionController.marcarTodasComoLeidas(req, res);

      expect(notificacionService.marcarTodasComoLeidas).toHaveBeenCalledWith(1, 'cliente');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: '3 notificaciones marcadas como leídas.',
        data: { cantidad: 3 }
      });
    });

    it('debería funcionar cuando no hay notificaciones para marcar', async () => {
      notificacionService.marcarTodasComoLeidas.mockResolvedValue([0]);

      await notificacionController.marcarTodasComoLeidas(req, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: '0 notificaciones marcadas como leídas.',
        data: { cantidad: 0 }
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.marcarTodasComoLeidas.mockRejectedValue(error);

      await notificacionController.marcarTodasComoLeidas(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al marcar todas las notificaciones como leídas.'
      });
    });
  });

  describe('eliminarNotificacion', () => {
    beforeEach(() => {
      req.params.id_notificacion = '456';
    });

    it('debería eliminar una notificación exitosamente', async () => {
      notificacionService.eliminarNotificacion.mockResolvedValue(1); // 1 fila eliminada

      await notificacionController.eliminarNotificacion(req, res);

      expect(notificacionService.eliminarNotificacion).toHaveBeenCalledWith(456, 1, 'cliente');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Notificación eliminada correctamente.'
      });
    });

    it('debería retornar 404 si la notificación no existe o no pertenece al usuario', async () => {
      notificacionService.eliminarNotificacion.mockResolvedValue(0); // 0 filas eliminadas

      await notificacionController.eliminarNotificacion(req, res);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Notificación no encontrada o no tienes permiso para eliminarla.'
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      notificacionService.eliminarNotificacion.mockRejectedValue(error);

      await notificacionController.eliminarNotificacion(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al eliminar la notificación.'
      });
    });
  });
});
