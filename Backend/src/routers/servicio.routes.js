import express from 'express';
import { ServicioController } from '../controllers/servicio.controller.js';
import { authenticate, isAdmin} from '../middlewares/autenticacion.js';

const router = express.Router();
const servicioController = new ServicioController();

// Rutas públicas
router.get('/api/servicios/activos', servicioController.obtenerServiciosActivos);
router.get('/api/servicios/buscar', servicioController.buscarServicios);

// Rutas protegidas - requieren autenticación
router.use(authenticate);

// Obtener servicios asignados a un técnico autenticado
router.get('/api/servicios/asignados', servicioController.obtenerServiciosAsignados);


// Crear servicio (solo lo peude hacer administradores)
router.post('/api/servicios', isAdmin, servicioController.crearServicio);

// Obtener todos los servicios
router.get('/api/servicios', servicioController.obtenerServicios);

// Obtener servicio por ID
router.get('/api/servicios/:id', servicioController.obtenerServicioPorId);

// Obtener servicio por nombre
router.get('/api/servicios/nombre/:nombre', servicioController.obtenerServicioPorNombre);

// Actualizar servicio (Solo administradores tiene este permiso)
router.put('/api/servicios/:id', isAdmin, servicioController.actualizarServicio);

// Eliminar servicio (Solo administradores tienen este permiso)
router.delete('/api/servicios/:id', isAdmin, servicioController.eliminarServicio);

// Deshabilitar servicio (Solo administradores tienen este permiso)
router.patch('/api/servicios/:id/deshabilitar', isAdmin, servicioController.deshabilitarServicio);

// Habilitar servicio (Solo administradores tienen este permiso)
router.patch('/api/servicios/:id/habilitar', isAdmin, servicioController.habilitarServicio);

export default router;