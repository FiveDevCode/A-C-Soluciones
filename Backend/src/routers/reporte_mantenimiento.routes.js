import path from 'path';
import express from 'express';
import { crearReporteMantenimiento, listarReportes, obtenerReportePorId, descargarPDF } from '../controllers/reporte_mantenimiento.controller.js';
import { isAdminOrTecnico, isCliente, authenticate} from '../middlewares/autenticacion.js';
import * as reporteRepo from '../repository/reporte_mantenimiento.repository.js';

const router = express.Router();

router.post(
  '/reportes-mantenimiento',
  authenticate,
  isAdminOrTecnico,
  crearReporteMantenimiento
);

router.get(
  '/reportes-mantenimiento',
  authenticate,
  isAdminOrTecnico,
  listarReportes
);

router.get(
  '/reportes-mantenimiento/:id',
  authenticate,
  isAdminOrTecnico,
  obtenerReportePorId
);

router.get(
  '/reportes-mantenimiento/:id/pdf',
  authenticate,
  isAdminOrTecnico,
  descargarPDF
);

// Ruta para descargar PDF directamente por nombre de archivo
router.get('/descargar/:nombreArchivo', authenticate, async (req, res) => {
  try {
    const { nombreArchivo } = req.params;
    
    // Extraer el ID del reporte del nombre del archivo
    const match = nombreArchivo.match(/reporte_mantenimiento_(\\d+)/);
    if (!match) {
      return res.status(400).json({ error: 'Formato de nombre de archivo inválido' });
    }

    const reporteId = parseInt(match[1]);
    const reporte = await reporteRepo.obtenerReportePorId(reporteId);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    // Si el reporte tiene URL de Cloudinary, redirigir
    if (reporte.pdf_path && reporte.pdf_path.includes('cloudinary.com')) {
      return res.redirect(reporte.pdf_path);
    }

    // Si es un archivo local, enviarlo
    const filePath = path.resolve(`uploads/reportes/${nombreArchivo}`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error enviando archivo:', err);
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
    });
  } catch (error) {
    console.error('Error en descargar:', error);
    res.status(500).json({ error: 'Error al descargar el archivo' });
  }
});

export default router;
