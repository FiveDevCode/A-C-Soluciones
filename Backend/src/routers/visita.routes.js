import express from 'express';
import { VisitaController } from '../controllers/visita.controller.js';
import { authenticate, isAdmin, isAdminOrTecnico} from '../middlewares/autenticacion.js';

const router = express.Router();
const visitaController = new VisitaController();

// Rutas protegidas para administradores
router.post('/api/visitas', authenticate, isAdmin, visitaController.crearVisita);
// Obtener servicios asignados a un técnico autenticado
router.get('/api/visitas/asignados', visitaController.obtenerServiciosAsignados);
router.get('/api/visitas/asignados/:id', visitaController.obtenerServicioAsignadoPorId);
router.get('/api/visitas', authenticate, isAdminOrTecnico, visitaController.obtenerVisitas); 

router.get('/api/visitas/:id', authenticate, isAdminOrTecnico, visitaController.obtenerVisitaPorId);

router.put('/api/visitas/:id', authenticate, isAdminOrTecnico, visitaController.actualizarVisita);

router.post('/api/visitas/:id/cancelar', authenticate, isAdmin, visitaController.cancelarVisita);



export default router;