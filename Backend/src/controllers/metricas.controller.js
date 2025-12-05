import { MetricasService } from '../services/metricas.services.js';

export class MetricasController {
  constructor() {
    this.metricasService = new MetricasService();
  }

  /**
   * GET /api/metricas/servicios-mas-solicitados
   * Obtiene los servicios más solicitados
   */
  obtenerServiciosMasSolicitados = async (req, res) => {
    try {
      const servicios = await this.metricasService.obtenerServiciosMasSolicitados();
      
      return res.status(200).json({
        success: true,
        data: servicios
      });
    } catch (error) {
      console.error('Error al obtener servicios más solicitados:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de servicios',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/solicitudes-por-estado
   * Obtiene solicitudes agrupadas por estado
   */
  obtenerSolicitudesPorEstado = async (req, res) => {
    try {
      const estados = await this.metricasService.obtenerSolicitudesPorEstado();
      
      return res.status(200).json({
        success: true,
        data: estados
      });
    } catch (error) {
      console.error('Error al obtener solicitudes por estado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de solicitudes',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/clientes-mas-activos
   * Obtiene los clientes con más solicitudes
   */
  obtenerClientesMasActivos = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const clientes = await this.metricasService.obtenerClientesMasActivos(limit);
      
      return res.status(200).json({
        success: true,
        data: clientes
      });
    } catch (error) {
      console.error('Error al obtener clientes más activos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de clientes',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/tecnicos-mas-activos
   * Obtiene los técnicos con más visitas
   */
  obtenerTecnicosMasActivos = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const tecnicos = await this.metricasService.obtenerTecnicosMasActivos(limit);
      
      return res.status(200).json({
        success: true,
        data: tecnicos
      });
    } catch (error) {
      console.error('Error al obtener técnicos más activos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de técnicos',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/estadisticas-generales
   * Obtiene estadísticas generales del sistema
   */
  obtenerEstadisticasGenerales = async (req, res) => {
    try {
      const estadisticas = await this.metricasService.obtenerEstadisticasGenerales();
      
      return res.status(200).json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas generales',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/visitas-por-estado
   * Obtiene visitas agrupadas por estado
   */
  obtenerVisitasPorEstado = async (req, res) => {
    try {
      const estados = await this.metricasService.obtenerVisitasPorEstado();
      
      return res.status(200).json({
        success: true,
        data: estados
      });
    } catch (error) {
      console.error('Error al obtener visitas por estado:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener métricas de visitas',
        error: error.message
      });
    }
  };

  /**
   * GET /api/metricas/dashboard
   * Obtiene todas las métricas principales en una sola petición
   */
  obtenerDashboardCompleto = async (req, res) => {
    try {
      const dashboard = await this.metricasService.obtenerDashboardCompleto();
      
      return res.status(200).json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Error al obtener dashboard completo:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener dashboard de métricas',
        error: error.message
      });
    }
  };
}
