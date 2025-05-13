// test/unit/controllers/visita.controller.test.js
import { VisitaController } from '../../../src/controllers/visita.controller.js';
import { VisitaService } from '../../../src/services/visita.services.js';
import { ValidationError } from 'sequelize';

// Mock completo del servicio
const mockVisitaService = {
  crearVisita: jest.fn(),
  obtenerVisitas: jest.fn(),
  obtenerVisitasPorTecnico: jest.fn(),
  obtenerVisitaPorId: jest.fn(),
  obtenerVisitasPorSolicitud: jest.fn(),
  actualizarVisita: jest.fn(),
  cancelarVisita: jest.fn(),
  obtenerTecnicosDisponibles: jest.fn(),
  obtenerServiciosPorTecnico: jest.fn(),
  obtenerServicioAsignadoPorId: jest.fn()
};

// Mock del módulo del servicio
jest.mock('../../../src/services/visita.services.js', () => ({
  VisitaService: jest.fn(() => mockVisitaService)
}));

describe('VisitaController', () => {
  let visitaController, req, res;

  beforeEach(() => {
    // Crear instancia del controlador
    visitaController = new VisitaController();
    
    // Configurar request mock
    req = {
      params: {},
      body: {},
      user: { rol: 'administrador', id: 1 },
      query: {}
    };
    
    // Configurar response mock
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('crearVisita', () => {
    it('debe crear una visita exitosamente cuando es administrador', async () => {
      req.body = { fecha: '2023-01-01', tecnico_id: 1 };
      const mockVisita = { id: 1, fecha: '2023-01-01', tecnico_id: 1 };
      mockVisitaService.crearVisita.mockResolvedValue(mockVisita);

      await visitaController.crearVisita(req, res);

      expect(mockVisitaService.crearVisita).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisita
      });
    });

    it('debe rechazar la creación si no es administrador', async () => {
      req.user.rol = 'tecnico';
      
      await visitaController.crearVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Solo los administradores pueden programar visitas'
      });
    });

    it('debe manejar errores de validación', async () => {
      const validationError = new ValidationError('Error de validación', [
        { path: 'fecha', message: 'Fecha requerida' }
      ]);
      mockVisitaService.crearVisita.mockRejectedValue(validationError);

      await visitaController.crearVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { fecha: 'Fecha requerida' }
      });
    });

    it('debe manejar errores inesperados', async () => {
      const error = new Error('Error inesperado');
      mockVisitaService.crearVisita.mockRejectedValue(error);

      await visitaController.crearVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: error.message
      });
    });
  });

  describe('obtenerVisitas', () => {
    it('debe devolver todas las visitas para administrador', async () => {
      const mockVisitas = [{ id: 1 }, { id: 2 }];
      mockVisitaService.obtenerVisitas.mockResolvedValue(mockVisitas);

      await visitaController.obtenerVisitas(req, res);

      expect(mockVisitaService.obtenerVisitas).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisitas
      });
    });

    it('debe devolver visitas del técnico cuando es técnico', async () => {
      req.user.rol = 'tecnico';
      const mockVisitas = [{ id: 1, tecnico_id: 1 }];
      mockVisitaService.obtenerVisitasPorTecnico.mockResolvedValue(mockVisitas);

      await visitaController.obtenerVisitas(req, res);

      expect(mockVisitaService.obtenerVisitasPorTecnico).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisitas
      });
    });

    it('debe rechazar la consulta si no tiene permisos', async () => {
      req.user.rol = 'cliente';

      await visitaController.obtenerVisitas(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No tienes permisos para ver las visitas'
      });
    });

    it('debe manejar errores al obtener visitas', async () => {
      const error = new Error('Error de base de datos');
      mockVisitaService.obtenerVisitas.mockRejectedValue(error);

      await visitaController.obtenerVisitas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener las visitas programadas'
      });
    });
  });

  describe('obtenerVisitaPorId', () => {
    it('debe devolver una visita específica si existe', async () => {
      req.params.id = '1';
      const mockVisita = { id: 1 };
      mockVisitaService.obtenerVisitaPorId.mockResolvedValue(mockVisita);

      await visitaController.obtenerVisitaPorId(req, res);

      expect(mockVisitaService.obtenerVisitaPorId).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisita
      });
    });

    it('debe devolver error 404 si la visita no existe', async () => {
      req.params.id = '999';
      mockVisitaService.obtenerVisitaPorId.mockResolvedValue(null);

      await visitaController.obtenerVisitaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Visita no encontrada'
      });
    });

    it('debe manejar errores al obtener visita', async () => {
      req.params.id = '1';
      const error = new Error('Error de base de datos');
      mockVisitaService.obtenerVisitaPorId.mockRejectedValue(error);

      await visitaController.obtenerVisitaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Visita no encontrada'
      });
    });
  });

  describe('obtenerVisitasPorSolicitud', () => {
    it('debe devolver visitas por solicitud', async () => {
      req.params.solicitud_id_fk = '1';
      const mockVisitas = [{ id: 1, solicitud_id: 1 }];
      mockVisitaService.obtenerVisitasPorSolicitud.mockResolvedValue(mockVisitas);

      await visitaController.obtenerVisitasPorSolicitud(req, res);

      expect(mockVisitaService.obtenerVisitasPorSolicitud).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisitas
      });
    });

    it('debe manejar errores al obtener visitas por solicitud', async () => {
      req.params.solicitud_id_fk = '1';
      const error = new Error('Error de base de datos');
      mockVisitaService.obtenerVisitasPorSolicitud.mockRejectedValue(error);

      await visitaController.obtenerVisitasPorSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener las visitas para esta solicitud'
      });
    });
  });

  describe('actualizarVisita', () => {
    it('debe actualizar una visita si es administrador', async () => {
      req.params.id = '1';
      req.body = { fecha: '2023-01-02' };
      const mockVisitaActualizada = { id: 1, fecha: '2023-01-02' };
      mockVisitaService.actualizarVisita.mockResolvedValue(mockVisitaActualizada);

      await visitaController.actualizarVisita(req, res);

      expect(mockVisitaService.actualizarVisita).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisitaActualizada
      });
    });

    it('debe rechazar actualización si no es administrador', async () => {
      req.user.rol = 'tecnico';

      await visitaController.actualizarVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Solo los administradores pueden actualizar visitas'
      });
    });

    it('debe manejar errores al actualizar visita', async () => {
      req.params.id = '1';
      const error = new Error('Error de base de datos');
      mockVisitaService.actualizarVisita.mockRejectedValue(error);

      await visitaController.actualizarVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al actualizar la visita'
      });
    });
  });

  describe('cancelarVisita', () => {
    it('debe cancelar una visita con motivo válido', async () => {
      req.params.id = '1';
      req.body = { motivo: 'Técnico enfermo' };
      const mockVisitaCancelada = { id: 1, estado: 'cancelada' };
      mockVisitaService.cancelarVisita.mockResolvedValue(mockVisitaCancelada);

      await visitaController.cancelarVisita(req, res);

      expect(mockVisitaService.cancelarVisita).toHaveBeenCalledWith('1', 'Técnico enfermo');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVisitaCancelada
      });
    });

    it('debe rechazar cancelación sin motivo', async () => {
      req.params.id = '1';
      req.body = {};

      await visitaController.cancelarVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Se requiere un motivo para cancelar la visita'
      });
    });

    it('debe rechazar cancelación si no es admin', async () => {
      req.user.rol = 'tecnico';
      req.params.id = '1';
      req.body = { motivo: 'Motivo' };

      await visitaController.cancelarVisita(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Solo los administradores pueden cancelar visitas'
      });
    });
  });

  describe('obtenerTecnicosDisponibles', () => {
    it('debe devolver técnicos disponibles con fecha y duración', async () => {
      req.query = { fecha: '2023-01-01', duracion: '2' };
      const mockTecnicos = [{ id: 1, nombre: 'Técnico 1' }];
      mockVisitaService.obtenerTecnicosDisponibles.mockResolvedValue(mockTecnicos);

      await visitaController.obtenerTecnicosDisponibles(req, res);

      expect(mockVisitaService.obtenerTecnicosDisponibles).toHaveBeenCalledWith('2023-01-01', '2');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTecnicos
      });
    });

    it('debe rechazar consulta sin fecha o duración', async () => {
      req.query = { fecha: '2023-01-01' };

      await visitaController.obtenerTecnicosDisponibles(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Se requieren fecha y duración para buscar técnicos disponibles'
      });
    });
  });

  describe('obtenerServiciosAsignados', () => {
    it('debe devolver servicios asignados a técnico', async () => {
      req.user.rol = 'tecnico';
      const mockServicios = [{ id: 1, tecnico_id: 1 }];
      mockVisitaService.obtenerServiciosPorTecnico.mockResolvedValue(mockServicios);

      await visitaController.obtenerServiciosAsignados(req, res);

      expect(mockVisitaService.obtenerServiciosPorTecnico).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Servicios asignados obtenidos correctamente.',
        count: 1,
        data: mockServicios
      });
    });

    it('debe rechazar consulta si no es técnico', async () => {
      req.user.rol = 'cliente';

      await visitaController.obtenerServiciosAsignados(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Acceso denegado. Solo los técnicos pueden consultar sus servicios asignados.'
      });
    });

    it('debería denegar acceso a usuarios que no son técnicos', async () => {
      // Mock de la solicitud para un usuario no técnico
      const req = {
        user: {
          rol: 'administrador', // Rol diferente de 'tecnico'
          id: '123'
        }
      };

      // Mock de la respuesta
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Ejecutar la función del controlador usando la instancia
      await visitaController.obtenerServiciosAsignados(req, res);

      // Verificar que se denegó el acceso
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Acceso denegado. Solo los técnicos pueden consultar sus servicios asignados.'
      });
    });
  });

  describe('obtenerServicioAsignadoPorId', () => {
    it('debe devolver un servicio específico del técnico', async () => {
      req.user.rol = 'tecnico';
      req.params.id = '1';
      const mockServicio = { id: 1, tecnico_id: 1 };
      mockVisitaService.obtenerServicioAsignadoPorId.mockResolvedValue(mockServicio);

      await visitaController.obtenerServicioAsignadoPorId(req, res);

      expect(mockVisitaService.obtenerServicioAsignadoPorId).toHaveBeenCalledWith(1, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Servicio asignado obtenido correctamente.',
        data: mockServicio
      });
    });

    it('debe devolver error si el servicio no pertenece al técnico', async () => {
      req.user.rol = 'tecnico';
      req.params.id = '1';
      mockVisitaService.obtenerServicioAsignadoPorId.mockResolvedValue(null);

      await visitaController.obtenerServicioAsignadoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Servicio asignado no encontrado o no pertenece a este técnico.'
      });
    });
  });
});