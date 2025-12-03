import express from 'express';
import { MetricasController } from '../controllers/metricas.controller.js';
import { authenticate } from '../middlewares/autenticacion.js';
import { isAdmin } from '../middlewares/autenticacion.js';

const router = express.Router();
const metricasController = new MetricasController();

/**
 * @route GET /api/metricas/servicios-mas-solicitados
 * @desc Obtiene los servicios más solicitados
 * @access Private - Solo Administrador
 */
router.get(
  '/api/metricas/servicios-mas-solicitados',
  authenticate,
  isAdmin,
  metricasController.obtenerServiciosMasSolicitados
);

/**
 * @route GET /api/metricas/solicitudes-por-estado
 * @desc Obtiene solicitudes agrupadas por estado
 * @access Private - Solo Administrador
 */
router.get(
  '/api/metricas/solicitudes-por-estado',
  authenticate,
  isAdmin,
  metricasController.obtenerSolicitudesPorEstado
);

/**
 * @route GET /api/metricas/clientes-mas-activos
 * @desc Obtiene los clientes con más solicitudes
 * @access Private - Solo Administrador
 * @query limit - Número de clientes a retornar (default: 10)
 */
router.get(
  '/api/metricas/clientes-mas-activos',
  authenticate,
  isAdmin,
  metricasController.obtenerClientesMasActivos
);

/**
 * @route GET /api/metricas/tecnicos-mas-activos
 * @desc Obtiene los técnicos con más visitas
 * @access Private - Solo Administrador
 * @query limit - Número de técnicos a retornar (default: 10)
 */
router.get(
  '/api/metricas/tecnicos-mas-activos',
  authenticate,
  isAdmin,
  metricasController.obtenerTecnicosMasActivos
);

/**
 * @route GET /api/metricas/estadisticas-generales
 * @desc Obtiene estadísticas generales del sistema
 * @access Private - Solo Administrador
 */
router.get(
  '/api/metricas/estadisticas-generales',
  authenticate,
  isAdmin,
  metricasController.obtenerEstadisticasGenerales
);

/**
 * @route GET /api/metricas/visitas-por-estado
 * @desc Obtiene visitas agrupadas por estado
 * @access Private - Solo Administrador
 */
router.get(
  '/api/metricas/visitas-por-estado',
  authenticate,
  isAdmin,
  metricasController.obtenerVisitasPorEstado
);

/**
 * @route GET /api/metricas/dashboard
 * @desc Obtiene todas las métricas principales en una sola petición
 * @access Private - Solo Administrador
 */
router.get(
  '/api/metricas/dashboard',
  authenticate,
  isAdmin,
  metricasController.obtenerDashboardCompleto
);

export default router;
