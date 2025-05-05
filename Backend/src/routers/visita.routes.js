import express from 'express';
import { VisitaController } from '../controllers/visita.controller.js';
import { authenticate, isAdmin } from '../middlewares/autenticacion.js';

const router = express.Router();
const visitaController = new VisitaController();

// Rutas protegidas para administradores
router.post('/api/visitas', authenticate, isAdmin, visitaController.crearVisita);
router.get('/api/visitas', authenticate, isAdmin, visitaController.obtenerVisitas);
router.get('/api/visitas/:id', authenticate, visitaController.obtenerVisitaPorId);
router.put('/api/visitas/:id', authenticate, isAdmin, visitaController.actualizarVisita);
router.post('/api/visitas/:id/cancelar', authenticate, isAdmin, visitaController.cancelarVisita);

// Rutas para obtener datos relacionados
router.get('/api/visitas/solicitud/:solicitudId', authenticate, visitaController.obtenerVisitasPorSolicitud);
router.get('/api/visitas/tecnicos-disponibles', authenticate, isAdmin, visitaController.obtenerTecnicosDisponibles);

export default router;