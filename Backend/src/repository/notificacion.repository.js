import { Notificacion } from '../models/notificacion.model.js';
import { Op } from 'sequelize';

/**
 * Crear una nueva notificación
 */
export const crearNotificacion = async (data) => {
  return await Notificacion.create(data);
};

/**
 * Obtener todas las notificaciones de un usuario específico
 */
export const obtenerNotificacionesPorUsuario = async (id_destinatario, tipo_destinatario, limite = 50) => {
  return await Notificacion.findAll({
    where: {
      id_destinatario,
      tipo_destinatario
    },
    order: [['fecha_creacion', 'DESC']],
    limit: limite
  });
};

/**
 * Obtener notificaciones no leídas de un usuario
 */
export const obtenerNotificacionesNoLeidas = async (id_destinatario, tipo_destinatario) => {
  return await Notificacion.findAll({
    where: {
      id_destinatario,
      tipo_destinatario,
      leida: false
    },
    order: [['fecha_creacion', 'DESC']]
  });
};

/**
 * Contar notificaciones no leídas de un usuario
 */
export const contarNoLeidas = async (id_destinatario, tipo_destinatario) => {
  return await Notificacion.count({
    where: {
      id_destinatario,
      tipo_destinatario,
      leida: false
    }
  });
};

/**
 * Marcar una notificación como leída
 */
export const marcarComoLeida = async (id_notificacion, id_destinatario, tipo_destinatario) => {
  return await Notificacion.update(
    { leida: true },
    {
      where: {
        id_notificacion,
        id_destinatario,
        tipo_destinatario
      }
    }
  );
};

/**
 * Marcar todas las notificaciones de un usuario como leídas
 */
export const marcarTodasComoLeidas = async (id_destinatario, tipo_destinatario) => {
  return await Notificacion.update(
    { leida: true },
    {
      where: {
        id_destinatario,
        tipo_destinatario,
        leida: false
      }
    }
  );
};

/**
 * Obtener una notificación por ID
 */
export const obtenerNotificacionPorId = async (id_notificacion) => {
  return await Notificacion.findByPk(id_notificacion);
};

/**
 * Eliminar una notificación
 */
export const eliminarNotificacion = async (id_notificacion, id_destinatario, tipo_destinatario) => {
  return await Notificacion.destroy({
    where: {
      id_notificacion,
      id_destinatario,
      tipo_destinatario
    }
  });
};

/**
 * Eliminar notificaciones antiguas (opcional - para limpieza)
 */
export const eliminarNotificacionesAntiguas = async (diasAntiguedad = 30) => {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

  return await Notificacion.destroy({
    where: {
      fecha_creacion: {
        [Op.lt]: fechaLimite
      },
      leida: true
    }
  });
};

/**
 * Obtener notificaciones por tipo
 */
export const obtenerNotificacionesPorTipo = async (id_destinatario, tipo_destinatario, tipo_notificacion) => {
  return await Notificacion.findAll({
    where: {
      id_destinatario,
      tipo_destinatario,
      tipo_notificacion
    },
    order: [['fecha_creacion', 'DESC']]
  });
};
