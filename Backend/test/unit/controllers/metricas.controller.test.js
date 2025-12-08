import { MetricasController } from '../../../src/controllers/metricas.controller.js';
import { MetricasService } from '../../../src/services/metricas.services.js';

jest.mock('../../../src/services/metricas.services.js');

describe('MetricasController', () => {
  let controller;
  let req;
  let res;
  let statusMock;
  let jsonMock;

  beforeEach(() => {
    controller = new MetricasController();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };

    req = { query: {} };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerServiciosMasSolicitados', () => {
    it('debería retornar los servicios más solicitados correctamente', async () => {
      const mockServicios = [
        { servicio_id: 1, nombre: 'Mantenimiento', total_solicitudes: 10 },
        { servicio_id: 2, nombre: 'Reparación', total_solicitudes: 5 }
      ];

      controller.metricasService.obtenerServiciosMasSolicitados.mockResolvedValue(mockServicios);

      await controller.obtenerServiciosMasSolicitados(req, res);

      expect(controller.metricasService.obtenerServiciosMasSolicitados).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockServicios
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerServiciosMasSolicitados.mockRejectedValue(error);

      await controller.obtenerServiciosMasSolicitados(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener métricas de servicios',
        error: error.message
      });
    });
  });

  describe('obtenerSolicitudesPorEstado', () => {
    it('debería retornar solicitudes agrupadas por estado correctamente', async () => {
      const mockEstados = [
        { estado: 'Pendiente', total: 15 },
        { estado: 'Aprobada', total: 30 },
        { estado: 'Rechazada', total: 5 }
      ];

      controller.metricasService.obtenerSolicitudesPorEstado.mockResolvedValue(mockEstados);

      await controller.obtenerSolicitudesPorEstado(req, res);

      expect(controller.metricasService.obtenerSolicitudesPorEstado).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockEstados
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerSolicitudesPorEstado.mockRejectedValue(error);

      await controller.obtenerSolicitudesPorEstado(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener métricas de solicitudes',
        error: error.message
      });
    });
  });

  describe('obtenerClientesMasActivos', () => {
    it('debería retornar clientes más activos con limit por defecto (10)', async () => {
      const mockClientes = [
        { cliente_id: 1, nombre: 'Juan Pérez', total_solicitudes: 20 },
        { cliente_id: 2, nombre: 'Ana García', total_solicitudes: 15 }
      ];

      controller.metricasService.obtenerClientesMasActivos.mockResolvedValue(mockClientes);

      await controller.obtenerClientesMasActivos(req, res);

      expect(controller.metricasService.obtenerClientesMasActivos).toHaveBeenCalledWith(10);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockClientes
      });
    });

    it('debería retornar clientes más activos con limit personalizado', async () => {
      const mockClientes = [
        { cliente_id: 1, nombre: 'Juan Pérez', total_solicitudes: 20 }
      ];

      req.query.limit = '5';
      controller.metricasService.obtenerClientesMasActivos.mockResolvedValue(mockClientes);

      await controller.obtenerClientesMasActivos(req, res);

      expect(controller.metricasService.obtenerClientesMasActivos).toHaveBeenCalledWith(5);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockClientes
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerClientesMasActivos.mockRejectedValue(error);

      await controller.obtenerClientesMasActivos(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener métricas de clientes',
        error: error.message
      });
    });
  });

  describe('obtenerTecnicosMasActivos', () => {
    it('debería retornar técnicos más activos con limit por defecto (10)', async () => {
      const mockTecnicos = [
        { tecnico_id: 1, nombre: 'Carlos Ruiz', total_visitas: 50 },
        { tecnico_id: 2, nombre: 'María López', total_visitas: 45 }
      ];

      controller.metricasService.obtenerTecnicosMasActivos.mockResolvedValue(mockTecnicos);

      await controller.obtenerTecnicosMasActivos(req, res);

      expect(controller.metricasService.obtenerTecnicosMasActivos).toHaveBeenCalledWith(10);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockTecnicos
      });
    });

    it('debería retornar técnicos más activos con limit personalizado', async () => {
      const mockTecnicos = [
        { tecnico_id: 1, nombre: 'Carlos Ruiz', total_visitas: 50 }
      ];

      req.query.limit = '3';
      controller.metricasService.obtenerTecnicosMasActivos.mockResolvedValue(mockTecnicos);

      await controller.obtenerTecnicosMasActivos(req, res);

      expect(controller.metricasService.obtenerTecnicosMasActivos).toHaveBeenCalledWith(3);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockTecnicos
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerTecnicosMasActivos.mockRejectedValue(error);

      await controller.obtenerTecnicosMasActivos(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener métricas de técnicos',
        error: error.message
      });
    });
  });

  describe('obtenerEstadisticasGenerales', () => {
    it('debería retornar estadísticas generales correctamente', async () => {
      const mockEstadisticas = {
        total_solicitudes: 100,
        total_clientes: 50,
        total_tecnicos: 10,
        total_servicios: 15
      };

      controller.metricasService.obtenerEstadisticasGenerales.mockResolvedValue(mockEstadisticas);

      await controller.obtenerEstadisticasGenerales(req, res);

      expect(controller.metricasService.obtenerEstadisticasGenerales).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockEstadisticas
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerEstadisticasGenerales.mockRejectedValue(error);

      await controller.obtenerEstadisticasGenerales(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener estadísticas generales',
        error: error.message
      });
    });
  });

  describe('obtenerVisitasPorEstado', () => {
    it('debería retornar visitas agrupadas por estado correctamente', async () => {
      const mockEstados = [
        { estado: 'Programada', total: 25 },
        { estado: 'Completada', total: 40 },
        { estado: 'Cancelada', total: 5 }
      ];

      controller.metricasService.obtenerVisitasPorEstado.mockResolvedValue(mockEstados);

      await controller.obtenerVisitasPorEstado(req, res);

      expect(controller.metricasService.obtenerVisitasPorEstado).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockEstados
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerVisitasPorEstado.mockRejectedValue(error);

      await controller.obtenerVisitasPorEstado(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener métricas de visitas',
        error: error.message
      });
    });
  });

  describe('obtenerDashboardCompleto', () => {
    it('debería retornar dashboard completo correctamente', async () => {
      const mockDashboard = {
        servicios_mas_solicitados: [],
        solicitudes_por_estado: [],
        clientes_mas_activos: [],
        tecnicos_mas_activos: [],
        estadisticas_generales: {},
        visitas_por_estado: []
      };

      controller.metricasService.obtenerDashboardCompleto.mockResolvedValue(mockDashboard);

      await controller.obtenerDashboardCompleto(req, res);

      expect(controller.metricasService.obtenerDashboardCompleto).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockDashboard
      });
    });

    it('debería retornar error 500 si falla el servicio', async () => {
      const error = new Error('Database error');
      controller.metricasService.obtenerDashboardCompleto.mockRejectedValue(error);

      await controller.obtenerDashboardCompleto(req, res);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener dashboard de métricas',
        error: error.message
      });
    });
  });
});
