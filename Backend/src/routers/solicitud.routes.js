import { Router } from 'express';
import { SolicitudController } from '../controllers/solicitud.controller.js';
import { authenticate, isAdminOrCliente, isCliente } from '../middlewares/autenticacion.js';

// Crear instancia del router
const router = Router();

// Crear una instancia del controlador
const solicitudController = new SolicitudController();


router.use(authenticate);

// Crear una nueva solicitud
router.post('/api/solicitudes', isCliente, solicitudController.crear);

// Obtener todas las solicitudes
router.get('/api/solicitudes', isAdminOrCliente,  solicitudController.obtenerTodos);

// Obtener solicitudes por cliente
router.get('/api/solicitudes/:id', isAdminOrCliente , solicitudController.obtenerPorId);

// Obtener una solicitud específica por ID
router.get('/api/solicitudes/cliente/:cliente_id_fk', isAdminOrCliente, solicitudController.obtenerPorCliente);

// Actualizar el estado de una solicitud
router.patch('/api/solicitudes/:id/estado', isAdminOrCliente,solicitudController.actualizarEstado);

// Eliminar una solicitud
router.delete('/api/solicitud/:id', isAdminOrCliente,solicitudController.eliminar);

export default router;