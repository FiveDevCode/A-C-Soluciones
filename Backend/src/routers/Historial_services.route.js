import express from 'express';
import { HistorialServicesController } from '../controllers/Historial_services.controller.js';
import { authenticate } from '../middlewares/autenticacion.js';

const router = express.Router();
const historialServicesController = new HistorialServicesController();

router.get('/api/cliente/:clienteId/servicios', historialServicesController.getServiciosByCliente);

export default router;