import api from "../controllers/common/api.controller";

/**
 * Obtener todas las notificaciones del usuario autenticado
 * @param {number} limite - Número máximo de notificaciones a obtener (opcional)
 */
export const obtenerNotificaciones = (limite = 50) => {
  return api.get(`/notificaciones?limite=${limite}`);
};

/**
 * Obtener solo las notificaciones no leídas
 */
export const obtenerNotificacionesNoLeidas = () => {
  return api.get('/notificaciones/no-leidas');
};

/**
 * Obtener el contador de notificaciones no leídas
 */
export const contarNoLeidas = () => {
  return api.get('/notificaciones/count');
};

/**
 * Marcar una notificación como leída
 * @param {number} idNotificacion - ID de la notificación
 */
export const marcarComoLeida = (idNotificacion) => {
  return api.put(`/notificaciones/${idNotificacion}/leer`);
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = () => {
  return api.put('/notificaciones/leer-todas');
};

/**
 * Eliminar una notificación
 * @param {number} idNotificacion - ID de la notificación
 */
export const eliminarNotificacion = (idNotificacion) => {
  return api.delete(`/notificaciones/${idNotificacion}`);
};

export default {
  obtenerNotificaciones,
  obtenerNotificacionesNoLeidas,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion
};
