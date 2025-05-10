// src/routes/admin.routes.js
import express from 'express';
import { AdminController } from '../controllers/administrador.controller.js';

const router = express.Router();
const adminController = new AdminController();

// Registrar administrador
router.post('/api/admin', adminController.crearAdmin);

// Obtener todos los administradores registrados
router.get('/api/admin', adminController.obtenerAdmins);

// Obtener administrador por ID
router.get('/api/admin/:id', adminController.obtenerAdminPorId);

// Obtener administrador por número de cédula
router.get('/api/admin/cedula/:numero_cedula', adminController.obtenerAdminPorCedula);

// Obtener administrador por correo electrónico (útil para login)
router.get('/api/admin/correo/:correo_electronico', adminController.obtenerAdminPorCorreo);

// Actualizar administrador por ID
router.put('/api/admin/:id', adminController.actualizarAdmin);

// Eliminar administrador por ID
router.delete('/api/admin/:id', adminController.eliminarAdmin);

// Ruta adicional para autenticación
router.post('/api/admin/login', adminController.autenticarAdmin);

export default router;


