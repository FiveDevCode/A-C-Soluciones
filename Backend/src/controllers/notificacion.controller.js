import * as notificacionService from '../services/notificacion.services.js';
import { ValidationError } from 'sequelize';

/**
 * Obtener todas las notificaciones del usuario autenticado
 */
export const obtenerNotificaciones = async (req, res) => {
  try {
    const { id, rol } = req.user; // Del middleware de autenticación
    const { limite } = req.query;

    const notificaciones = await notificacionService.obtenerNotificacionesUsuario(
      id,
      rol.toLowerCase(), // Normalizar a minúsculas (cliente, administrador, tecnico)
      limite ? parseInt(limite) : 50
    );

    return res.status(200).json({
      success: true,
      data: notificaciones,
      total: notificaciones.length
    });

  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones.'
    });
  }
};

/**
 * Obtener solo notificaciones no leídas
 */
export const obtenerNotificacionesNoLeidas = async (req, res) => {
  try {
    const { id, rol } = req.user;

    const notificaciones = await notificacionService.obtenerNotificacionesNoLeidas(id, rol.toLowerCase());

    return res.status(200).json({
      success: true,
      data: notificaciones,
      total: notificaciones.length
    });

  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones no leídas.'
    });
  }
};

/**
 * Contar notificaciones no leídas
 */
export const contarNoLeidas = async (req, res) => {
  try {
    const { id, rol } = req.user;

    const cantidad = await notificacionService.contarNoLeidas(id, rol.toLowerCase());

    return res.status(200).json({
      success: true,
      data: { cantidad }
    });

  } catch (error) {
    console.error('Error al contar notificaciones no leídas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al contar las notificaciones no leídas.'
    });
  }
};

/**
 * Marcar una notificación como leída
 */
export const marcarComoLeida = async (req, res) => {
  try {
    const { id, rol } = req.user;
    const { id_notificacion } = req.params;

    const resultado = await notificacionService.marcarComoLeida(
      parseInt(id_notificacion),
      id,
      rol.toLowerCase()
    );

    if (resultado[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada o no tienes permiso para modificarla.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notificación marcada como leída.'
    });

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al marcar la notificación como leída.'
    });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = async (req, res) => {
  try {
    const { id, rol } = req.user;

    const resultado = await notificacionService.marcarTodasComoLeidas(id, rol.toLowerCase());

    return res.status(200).json({
      success: true,
      message: `${resultado[0]} notificaciones marcadas como leídas.`,
      data: { cantidad: resultado[0] }
    });

  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al marcar todas las notificaciones como leídas.'
    });
  }
};

/**
 * Eliminar una notificación
 */
export const eliminarNotificacion = async (req, res) => {
  try {
    const { id, rol } = req.user;
    const { id_notificacion } = req.params;

    const resultado = await notificacionService.eliminarNotificacion(
      parseInt(id_notificacion),
      id,
      rol.toLowerCase()
    );

    if (resultado === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada o no tienes permiso para eliminarla.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notificación eliminada correctamente.'
    });

  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la notificación.'
    });
  }
};
