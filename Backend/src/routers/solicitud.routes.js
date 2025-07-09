import { Router } from 'express';
import { SolicitudController } from '../controllers/solicitud.controller.js';
import { authenticate, isAdminOrCliente, isAdminOrTecnico, isCliente } from '../middlewares/autenticacion.js';

// Crear instancia del router
const router = Router();

// Crear una instancia del controlador
const solicitudController = new SolicitudController();


//router.use(authenticate);

// Crear una nueva solicitud
router.post('/api/solicitudes', authenticate, isCliente, solicitudController.crear);

// Obtener todas las solicitudes
router.get('/api/solicitudes', authenticate, isAdminOrCliente,  solicitudController.obtenerTodos);

// Obtener solicitudes por cliente
router.get('/api/solicitudes/:id', authenticate, isAdminOrTecnico , solicitudController.obtenerPorId);

// Obtener una solicitud específica por ID
router.get('/api/solicitudes/cliente/:cliente_id_fk', authenticate, isAdminOrCliente, solicitudController.obtenerPorCliente);

// Actualizar el estado de una solicitud
router.patch('/api/solicitudes/:id/estado', authenticate, isAdminOrCliente,solicitudController.actualizarEstado);

// Eliminar una solicitud
router.delete('/api/solicitud/:id', authenticate, isAdminOrCliente,solicitudController.eliminar);

export default router;