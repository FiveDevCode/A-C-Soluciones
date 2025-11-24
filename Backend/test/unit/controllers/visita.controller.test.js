import { VisitaController } from '../../../src/controllers/visita.controller.js';
import { VisitaService } from '../../../src/services/visita.services.js';
import { ValidationError } from 'sequelize';

// Mock del servicio
jest.mock('../../../src/services/visita.services.js', () => ({
  VisitaService: jest.fn().mockImplementation(() => ({
    crearVisita: jest.fn(),
    obtenerVisitas: jest.fn(),
    obtenerVisitasPorTecnico: jest.fn(),
    obtenerVisitaPorId: jest.fn(),
    obtenerVisitasPorSolicitud: jest.fn(),
    actualizarVisita: jest.fn(),
    cancelarVisita: jest.fn(),
    obtenerTecnicosDisponibles: jest.fn(),
    obtenerServiciosPorTecnico: jest.fn(),
    obtenerServicioAsignadoPorId: jest.fn(),
  })),
}));

describe(' VisitaController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new VisitaController();
    mockService = controller.visitaService;
    mockReq = { body: {}, params: {}, query: {}, user: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // crearVisita
  // -------------------------------------------------------------------------
  describe('crearVisita', () => {
    it('debería devolver 403 si el usuario no es administrador', async () => {
      mockReq.user.rol = 'tecnico';
      await controller.crearVisita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería crear visita correctamente', async () => {
      mockReq.user.rol = 'administrador';
      mockService.crearVisita.mockResolvedValue({ id: 1, fecha: '2025-11-10' });

      await controller.crearVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1, fecha: '2025-11-10' },
      });
    });

    it(' debería manejar ValidationError', async () => {
      mockReq.user.rol = 'administrador';
      const error = new ValidationError('Error');
      error.errors = [{ path: 'fecha', message: 'Fecha inválida' }];
      mockService.crearVisita.mockRejectedValue(error);

      await controller.crearVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors: { fecha: 'Fecha inválida' } });
    });

    it(' debería manejar error genérico 500 con mensaje', async () => {
      mockReq.user.rol = 'administrador';
      mockService.crearVisita.mockRejectedValue(new Error('DB error'));

      await controller.crearVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB error',
      });
    });
  });

  // -------------------------------------------------------------------------
  // obtenerVisitas
  // -------------------------------------------------------------------------
  describe('obtenerVisitas', () => {
    it(' debería devolver todas las visitas si es administrador', async () => {
      mockReq.user.rol = 'administrador';
      mockService.obtenerVisitas.mockResolvedValue([{ id: 1 }]);

      await controller.obtenerVisitas(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería devolver visitas del técnico', async () => {
      mockReq.user = { rol: 'tecnico', id: 2 };
      mockService.obtenerVisitasPorTecnico.mockResolvedValue([{ id: 3 }]);

      await controller.obtenerVisitas(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería devolver 403 si rol no permitido', async () => {
      mockReq.user.rol = 'cliente';
      await controller.obtenerVisitas(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería manejar error 500', async () => {
      mockReq.user.rol = 'administrador';
      mockService.obtenerVisitas.mockRejectedValue(new Error('DB error'));
      await controller.obtenerVisitas(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------------------------------
  // obtenerVisitaPorId
  // -------------------------------------------------------------------------
  describe('obtenerVisitaPorId', () => {
    it(' debería devolver visita si existe', async () => {
      mockService.obtenerVisitaPorId.mockResolvedValue({ id: 1 });
      mockReq.params.id = '1';

      await controller.obtenerVisitaPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería devolver 404 si no existe', async () => {
      mockService.obtenerVisitaPorId.mockResolvedValue(null);
      mockReq.params.id = '1';

      await controller.obtenerVisitaPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it(' debería manejar error 500', async () => {
      mockService.obtenerVisitaPorId.mockRejectedValue(new Error('DB error'));
      await controller.obtenerVisitaPorId(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------------------------------
  // obtenerVisitasPorSolicitud
  // -------------------------------------------------------------------------
  describe('obtenerVisitasPorSolicitud', () => {
    it('debería devolver visitas por solicitud', async () => {
      mockService.obtenerVisitasPorSolicitud.mockResolvedValue([{ id: 1 }]);
      mockReq.params.solicitud_id_fk = '5';

      await controller.obtenerVisitasPorSolicitud(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería manejar error 500', async () => {
      mockService.obtenerVisitasPorSolicitud.mockRejectedValue(new Error('Error DB'));
      await controller.obtenerVisitasPorSolicitud(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------------------------------
  // actualizarVisita
  // -------------------------------------------------------------------------
  describe('actualizarVisita', () => {
    it(' debería devolver 403 si el rol no tiene permisos', async () => {
      mockReq.user.rol = 'cliente';
      await controller.actualizarVisita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería actualizar correctamente si es admin', async () => {
      mockReq.user.rol = 'administrador';
      mockService.actualizarVisita.mockResolvedValue({ id: 1 });

      await controller.actualizarVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería manejar error 400', async () => {
      mockReq.user.rol = 'tecnico';
      mockService.actualizarVisita.mockRejectedValue(new Error('Error'));
      await controller.actualizarVisita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // -------------------------------------------------------------------------
  // cancelarVisita
  // -------------------------------------------------------------------------
  describe('cancelarVisita', () => {
    it(' debería devolver 403 si no es administrador', async () => {
      mockReq.user.rol = 'tecnico';
      await controller.cancelarVisita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('debería requerir motivo', async () => {
      mockReq.user.rol = 'administrador';
      mockReq.body = {};
      await controller.cancelarVisita(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería cancelar correctamente', async () => {
      mockReq.user.rol = 'administrador';
      mockReq.params.id = '1';
      mockReq.body.motivo = 'Cliente canceló';
      mockService.cancelarVisita.mockResolvedValue({ id: 1, estado: 'cancelada' });

      await controller.cancelarVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('debería manejar error 400 con mensaje', async () => {
      mockReq.user.rol = 'administrador';
      mockReq.params.id = '1';
      mockReq.body.motivo = 'Error X';
      mockService.cancelarVisita.mockRejectedValue(new Error('DB error'));

      await controller.cancelarVisita(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB error',
      });
    });
  });

  // -------------------------------------------------------------------------
  // obtenerTecnicosDisponibles
  // -------------------------------------------------------------------------
  describe('obtenerTecnicosDisponibles', () => {
    it('debería devolver 400 si faltan parámetros', async () => {
      mockReq.query = {};
      await controller.obtenerTecnicosDisponibles(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('debería devolver técnicos disponibles', async () => {
      mockReq.query = { fecha: '2025-11-01', duracion: '2h' };
      mockService.obtenerTecnicosDisponibles.mockResolvedValue([{ id: 5 }]);

      await controller.obtenerTecnicosDisponibles(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it(' debería manejar error 500', async () => {
      mockReq.query = { fecha: '2025-11-01', duracion: '2h' };
      mockService.obtenerTecnicosDisponibles.mockRejectedValue(new Error('DB error'));

      await controller.obtenerTecnicosDisponibles(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'DB error',
      });
    });
  });

  // -------------------------------------------------------------------------
  // obtenerServiciosAsignados
  // -------------------------------------------------------------------------
  describe('obtenerServiciosAsignados', () => {
    it(' debería devolver 403 si no es técnico', async () => {
      mockReq.user.rol = 'administrador';
      await controller.obtenerServiciosAsignados(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería devolver servicios del técnico', async () => {
      mockReq.user = { rol: 'tecnico', id: 1 };
      mockService.obtenerServiciosPorTecnico.mockResolvedValue([{ id: 10 }, { id: 11 }]);

      await controller.obtenerServiciosAsignados(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const response = mockRes.json.mock.calls[0][0];
      expect(response.count).toBe(2);
    });

    it('debería manejar error 500', async () => {
      mockReq.user = { rol: 'tecnico', id: 1 };
      mockService.obtenerServiciosPorTecnico.mockRejectedValue(new Error('Error DB'));
      await controller.obtenerServiciosAsignados(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  // -------------------------------------------------------------------------
  // obtenerServicioAsignadoPorId
  // -------------------------------------------------------------------------
  describe('obtenerServicioAsignadoPorId', () => {
    it('debería devolver 403 si no es técnico', async () => {
      mockReq.user.rol = 'administrador';
      await controller.obtenerServicioAsignadoPorId(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it(' debería devolver 404 si no se encuentra', async () => {
      mockReq.user = { rol: 'tecnico', id: 1 };
      mockReq.params.id = '2';
      mockService.obtenerServicioAsignadoPorId.mockResolvedValue(null);

      await controller.obtenerServicioAsignadoPorId(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it(' debería devolver servicio correctamente', async () => {
      mockReq.user = { rol: 'tecnico', id: 1 };
      mockReq.params.id = '2';
      mockService.obtenerServicioAsignadoPorId.mockResolvedValue({ id: 2 });

      await controller.obtenerServicioAsignadoPorId(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('debería manejar error 500', async () => {
      mockReq.user = { rol: 'tecnico', id: 1 };
      mockService.obtenerServicioAsignadoPorId.mockRejectedValue(new Error('DB error'));
      await controller.obtenerServicioAsignadoPorId(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
