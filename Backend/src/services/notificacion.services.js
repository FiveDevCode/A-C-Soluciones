import * as notificacionRepository from '../repository/notificacion.repository.js';

// Variable global para almacenar la instancia de Socket.io
// Se inicializará desde app.js o index.js
let io = null;

/**
 * Inicializar Socket.io para notificaciones en tiempo real
 */
export const inicializarSocket = (socketInstance) => {
  io = socketInstance;
  console.log('Socket.io inicializado para notificaciones');
};

/**
 * Emitir notificación en tiempo real al usuario específico
 */
const emitirNotificacionTiempoReal = (notificacion) => {
  if (!io) {
    console.warn('Socket.io no está inicializado');
    return;
  }

  // Crear un room único por usuario: "usuario_cliente_5" o "usuario_admin_2"
  const room = `usuario_${notificacion.tipo_destinatario}_${notificacion.id_destinatario}`;
  
  io.to(room).emit('nueva_notificacion', {
    id_notificacion: notificacion.id_notificacion,
    tipo_notificacion: notificacion.tipo_notificacion,
    mensaje: notificacion.mensaje,
    leida: notificacion.leida,
    fecha_creacion: notificacion.fecha_creacion,
    id_referencia: notificacion.id_referencia,
    tipo_referencia: notificacion.tipo_referencia
  });

  console.log(`Notificación emitida al room: ${room}`);
};

/**
 * Crear una nueva notificación y emitirla en tiempo real
 */
export const crearNotificacion = async (data) => {
  const notificacion = await notificacionRepository.crearNotificacion(data);
  
  // Emitir en tiempo real
  emitirNotificacionTiempoReal(notificacion);
  
  return notificacion;
};

/**
 * Obtener todas las notificaciones de un usuario
 */
export const obtenerNotificacionesUsuario = async (id_destinatario, tipo_destinatario, limite) => {
  return await notificacionRepository.obtenerNotificacionesPorUsuario(id_destinatario, tipo_destinatario, limite);
};

/**
 * Obtener solo notificaciones no leídas
 */
export const obtenerNotificacionesNoLeidas = async (id_destinatario, tipo_destinatario) => {
  return await notificacionRepository.obtenerNotificacionesNoLeidas(id_destinatario, tipo_destinatario);
};

/**
 * Contar notificaciones no leídas
 */
export const contarNoLeidas = async (id_destinatario, tipo_destinatario) => {
  return await notificacionRepository.contarNoLeidas(id_destinatario, tipo_destinatario);
};

/**
 * Marcar notificación como leída
 */
export const marcarComoLeida = async (id_notificacion, id_destinatario, tipo_destinatario) => {
  const resultado = await notificacionRepository.marcarComoLeida(id_notificacion, id_destinatario, tipo_destinatario);
  
  // Emitir evento de actualización
  if (io && resultado[0] > 0) {
    const room = `usuario_${tipo_destinatario}_${id_destinatario}`;
    io.to(room).emit('notificacion_leida', { id_notificacion });
  }
  
  return resultado;
};

/**
 * Marcar todas como leídas
 */
export const marcarTodasComoLeidas = async (id_destinatario, tipo_destinatario) => {
  const resultado = await notificacionRepository.marcarTodasComoLeidas(id_destinatario, tipo_destinatario);
  
  // Emitir evento de actualización
  if (io && resultado[0] > 0) {
    const room = `usuario_${tipo_destinatario}_${id_destinatario}`;
    io.to(room).emit('todas_notificaciones_leidas');
  }
  
  return resultado;
};

/**
 * Eliminar notificación
 */
export const eliminarNotificacion = async (id_notificacion, id_destinatario, tipo_destinatario) => {
  return await notificacionRepository.eliminarNotificacion(id_notificacion, id_destinatario, tipo_destinatario);
};

// ============= MÉTODOS HELPER PARA OTROS SERVICIOS =============

/**
 * Notificar cuando un cliente solicita un servicio
 */
export const notificarServicioSolicitado = async (id_cliente, id_servicio, nombreServicio) => {
  return await crearNotificacion({
    id_destinatario: id_cliente,
    tipo_destinatario: 'cliente',
    tipo_notificacion: 'SERVICIO_SOLICITADO',
    mensaje: `Tu solicitud del servicio "${nombreServicio}" ha sido registrada exitosamente.`,
    id_referencia: id_servicio,
    tipo_referencia: 'servicio'
  });
};

/**
 * Notificar cuando se crea una ficha de mantenimiento
 */
export const notificarFichaCreada = async (id_cliente, id_ficha, nombreTecnico) => {
  return await crearNotificacion({
    id_destinatario: id_cliente,
    tipo_destinatario: 'cliente',
    tipo_notificacion: 'FICHA_CREADA',
    mensaje: `Se ha creado una ficha de mantenimiento para tu equipo. Técnico asignado: ${nombreTecnico}.`,
    id_referencia: id_ficha,
    tipo_referencia: 'ficha_mantenimiento'
  });
};

/**
 * Notificar al técnico cuando se le asigna una ficha
 */
export const notificarTecnicoFichaAsignada = async (id_tecnico, id_ficha, nombreCliente) => {
  return await crearNotificacion({
    id_destinatario: id_tecnico,
    tipo_destinatario: 'tecnico',
    tipo_notificacion: 'FICHA_ASIGNADA',
    mensaje: `Se te ha asignado una nueva ficha de mantenimiento para el cliente: ${nombreCliente}.`,
    id_referencia: id_ficha,
    tipo_referencia: 'ficha_mantenimiento'
  });
};

/**
 * Notificar al administrador sobre nueva solicitud
 */
export const notificarAdminNuevaSolicitud = async (id_administrador, id_solicitud, nombreCliente, tipoSolicitud) => {
  return await crearNotificacion({
    id_destinatario: id_administrador,
    tipo_destinatario: 'administrador',
    tipo_notificacion: 'NUEVA_SOLICITUD',
    mensaje: `Nueva solicitud de ${tipoSolicitud} del cliente ${nombreCliente}.`,
    id_referencia: id_solicitud,
    tipo_referencia: 'solicitud'
  });
};

/**
 * Notificar cambio de estado de solicitud
 */
export const notificarCambioEstadoSolicitud = async (id_cliente, id_solicitud, nuevoEstado) => {
  return await crearNotificacion({
    id_destinatario: id_cliente,
    tipo_destinatario: 'cliente',
    tipo_notificacion: 'CAMBIO_ESTADO_SOLICITUD',
    mensaje: `El estado de tu solicitud ha cambiado a: ${nuevoEstado}.`,
    id_referencia: id_solicitud,
    tipo_referencia: 'solicitud'
  });
};
