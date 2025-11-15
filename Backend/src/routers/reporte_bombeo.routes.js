// routers/reporte_bombeo.router.js (Ajustado)

import express from 'express';
import { crearReporteBombeo, listarReportes, obtenerReportePorId } from '../controllers/reporte_bombeo.controller.js';
import { authenticate, isAdminOrTecnico, isCliente } from '../middlewares/autenticacion.js';

const router = express.Router();

// 1. Crear Reporte
router.post(
    '/api/reportes-bombeo',
    authenticate, isAdminOrTecnico,
    crearReporteBombeo
);

// 2. Listar Reportes (con filtro opcional de visita_id en query params)
router.get(
    '/api/reportes-bombeo',
    authenticate, isAdminOrTecnico, 
    listarReportes
);

// 3. Obtener Reporte por ID
router.get(
    '/reportes-bombeo/:idReporte',
    // authenticate, 
    obtenerReportePorId
);

export default router;