import express from 'express';
import { ContabilidadController } from '../controllers/contabilidad.controller.js';
import { authenticate, isAdmin, isAdminOrContador } from '../middlewares/autenticacion.js';
const router = express.Router();
const contabilidadController = new ContabilidadController();

// Rutas para la entidad Contabilidad
router.post('/api/contabilidad',authenticate, isAdmin, contabilidadController.crearContabilidad);

router.get('/api/contabilidad',authenticate, isAdmin, contabilidadController.obtenerContabilidad);

router.get('/api/contabilidad/:id', authenticate, isAdminOrContador ,contabilidadController.obtenerContabilidadPorId);

router.get('/api/contabilidad/cedula/:numero_cedula', authenticate, isAdmin,contabilidadController.obtenerContabilidadPorCedula);

router.get('/api/contabilidad/correo/:correo_electronico',authenticate, isAdmin, contabilidadController.obtenerContabilidadPorCorreo);

router.delete('/api/contabilidad/:id',authenticate, isAdmin, contabilidadController.eliminarContabilidad);

router.post('/api/admin/login', contabilidadController.autenticarContabilidad);

router.put('/api/contabilidad/:id', authenticate, contabilidadController.actualizarContabilidad);

export default router;






