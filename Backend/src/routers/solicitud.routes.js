import { Router } from 'express';
import { SolicitudController } from '../controllers/solicitud.controller.js';
import { authenticate, isAdmin, isCliente, isTecnico } from '../middlewares/autenticacion.js';

// Crear instancia del router
const router = Router();

// Crear una instancia del controlador
const solicitudController = new SolicitudController();

/**
 * Rutas para el manejo de solicitudes
 * Todas las rutas están protegidas por el middleware de autenticación
 */

router.use(authenticate);

// Crear una nueva solicitud
router.post('/api/solicitudes', 
    isCliente, 
    solicitudController.crearSolicitud
);

// Obtener todas las solicitudes
router.get('/api/solicitudes', 
    solicitudController.obtenerSolicitudes
);

// Obtener solicitudes por cliente
router.get('api/solicitudes/:cliente_id_fk', 
    isCliente, isAdmin, 
    solicitudController.obtenerSolicitudesPorCliente
);

// Obtener una solicitud específica por ID
router.get('api/solicitudes/:id', 
    isAdmin, isTecnico,
    solicitudController.obtenerSolicitudPorId
);

// Actualizar el estado de una solicitud
router.patch('api/solicitudes/:id/estado', 
    isAdmin, isCliente,
    solicitudController.actualizarEstadoSolicitud
);

// Eliminar una solicitud
router.delete('api/solicitudes/:id', 
    isAdmin, isCliente,
    solicitudController.eliminarSolicitud
);

export default router;