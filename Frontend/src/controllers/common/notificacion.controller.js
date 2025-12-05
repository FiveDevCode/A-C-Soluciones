import notificacionService from '../../services/notificacion-service';

/**
 * Obtener todas las notificaciones
 */
export const handleObtenerNotificaciones = async (limite) => {
  try {
    const response = await notificacionService.obtenerNotificaciones(limite);
    return {
      success: true,
      data: response.data.data,
      total: response.data.total
    };
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener las notificaciones'
    };
  }
};

/**
 * Obtener notificaciones no leídas
 */
export const handleObtenerNoLeidas = async () => {
  try {
    const response = await notificacionService.obtenerNotificacionesNoLeidas();
    return {
      success: true,
      data: response.data.data,
      total: response.data.total
    };
  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener las notificaciones'
    };
  }
};

/**
 * Obtener contador de no leídas
 */
export const handleContarNoLeidas = async () => {
  try {
    const response = await notificacionService.contarNoLeidas();
    return {
      success: true,
      cantidad: response.data.cantidad
    };
  } catch (error) {
    console.error('Error al contar notificaciones:', error);
    return {
      success: false,
      cantidad: 0
    };
  }
};

/**
 * Marcar notificación como leída
 */
export const handleMarcarComoLeida = async (idNotificacion) => {
  try {
    const response = await notificacionService.marcarComoLeida(idNotificacion);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al marcar la notificación'
    };
  }
};

/**
 * Marcar todas como leídas
 */
export const handleMarcarTodasComoLeidas = async () => {
  try {
    const response = await notificacionService.marcarTodasComoLeidas();
    return {
      success: true,
      message: response.data.message,
      cantidad: response.data.cantidad || 0
    };
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al marcar todas las notificaciones'
    };
  }
};

/**
 * Eliminar notificación
 */
export const handleEliminarNotificacion = async (idNotificacion) => {
  try {
    const response = await notificacionService.eliminarNotificacion(idNotificacion);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al eliminar la notificación'
    };
  }
};
