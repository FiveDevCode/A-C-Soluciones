import express from 'express';
import * as notificacionController from '../controllers/notificacion.controller.js';
import { authenticate } from '../middlewares/autenticacion.js';

const router = express.Router();

// Todas las rutas de notificaciones requieren autenticación
// El usuario solo puede ver/modificar sus propias notificaciones

// Obtener contador de notificaciones no leídas
router.get('/api/notificaciones/count', authenticate, notificacionController.contarNoLeidas);

// Obtener solo notificaciones no leídas
router.get('/api/notificaciones/no-leidas', authenticate, notificacionController.obtenerNotificacionesNoLeidas);

// Marcar todas las notificaciones como leídas
router.put('/api/notificaciones/leer-todas', authenticate, notificacionController.marcarTodasComoLeidas);

// Obtener todas las notificaciones del usuario (con opción de límite en query)
router.get('/api/notificaciones', authenticate, notificacionController.obtenerNotificaciones);

// Marcar una notificación específica como leída
router.put('/api/notificaciones/:id_notificacion/leer', authenticate, notificacionController.marcarComoLeida);

// Eliminar una notificación
router.delete('/api/notificaciones/:id_notificacion', authenticate, notificacionController.eliminarNotificacion);

export default router;
