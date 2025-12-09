// routers/reporte_bombeo.router.js (Ajustado)

import express from 'express';
import path from 'path';
import { crearReporteBombeo, listarReportes, obtenerReportePorId } from '../controllers/reporte_bombeo.controller.js';
import { authenticate, isAdminOrTecnico, isAdminOrTecnicoOrCliente } from '../middlewares/autenticacion.js';
import * as reporteRepo from '../repository/reporte_bombeo.repository.js';

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
    authenticate, isAdminOrTecnicoOrCliente, 
    listarReportes
);

// 3. Obtener Reporte por ID
router.get(
    '/api/reportes-bombeo/:idReporte',
    authenticate,
    isAdminOrTecnicoOrCliente,
    obtenerReportePorId
);

// 4. Descargar PDF del Reporte
router.get('/api/reportes-bombeo/descargar/:nombreArchivo', authenticate, isAdminOrTecnicoOrCliente, async (req, res) => {
    const { nombreArchivo } = req.params;
    
    // Buscar el reporte por el nombre del archivo
    const reporteId = nombreArchivo.match(/reporte_bombeo_(\d+)/)?.[1];
    
    if (reporteId) {
        try {
            const reporte = await reporteRepo.obtenerReportePorId(reporteId);
            
            if (reporte && reporte.pdf_path) {
                // Si la URL es de Cloudinary, redirigir
                if (reporte.pdf_path.includes('cloudinary.com')) {
                    return res.redirect(reporte.pdf_path);
                }
            }
        } catch (error) {
            console.error('Error buscando reporte:', error);
        }
    }
    
    // Fallback: intentar archivo local
    const filePath = path.resolve(`uploads/reportes_bombeo/${nombreArchivo}`);
    res.sendFile(filePath, (err) => { 
        if (err) {
            console.error('Error enviando archivo:', err);
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
    });
});

export default router;