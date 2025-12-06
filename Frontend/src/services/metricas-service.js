import api from "../controllers/common/api.controller";

/**
 * Servicio para consumir endpoints de métricas del backend
 */

/**
 * Obtiene los servicios más solicitados
 */
const getServiciosMasSolicitados = () => {
  return api.get('/metricas/servicios-mas-solicitados', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene solicitudes agrupadas por estado
 */
const getSolicitudesPorEstado = () => {
  return api.get('/metricas/solicitudes-por-estado', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene los clientes más activos
 * @param {number} limit - Cantidad de clientes a retornar (default: 10)
 */
const getClientesMasActivos = (limit = 10) => {
  return api.get(`/metricas/clientes-mas-activos?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene los técnicos más activos
 * @param {number} limit - Cantidad de técnicos a retornar (default: 10)
 */
const getTecnicosMasActivos = (limit = 10) => {
  return api.get(`/metricas/tecnicos-mas-activos?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene estadísticas generales del sistema
 */
const getEstadisticasGenerales = () => {
  return api.get('/metricas/estadisticas-generales', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene visitas agrupadas por estado
 */
const getVisitasPorEstado = () => {
  return api.get('/metricas/visitas-por-estado', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

/**
 * Obtiene todas las métricas principales en una sola petición
 */
const getDashboardCompleto = () => {
  return api.get('/metricas/dashboard', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
};

export const metricasService = {
  getServiciosMasSolicitados,
  getSolicitudesPorEstado,
  getClientesMasActivos,
  getTecnicosMasActivos,
  getEstadisticasGenerales,
  getVisitasPorEstado,
  getDashboardCompleto
};
