import express from 'express';
import { ContabilidadController } from '../controllers/contabilidad.controller.js';

const router = express.Router();
const contabilidadController = new ContabilidadController();

// Rutas para la entidad Contabilidad
router.post('/api/contabilidad', contabilidadController.crearContabilidad);

router.get('/api/contabilidad', contabilidadController.obtenerContabilidad);

router.get('/api/contabilidad/:id', contabilidadController.obtenerContabilidadPorId);

router.get('/api/contabilidad/cedula/:numero_cedula', contabilidadController.obtenerContabilidadPorCedula);

router.get('/api/contabilidad/correo/:correo_electronico', contabilidadController.obtenerContabilidadPorCorreo);

router.delete('/api/contabilidad/:id', contabilidadController.eliminarContabilidad);

router.post('/api/admin/login', contabilidadController.autenticarContabilidad);


export default router;






