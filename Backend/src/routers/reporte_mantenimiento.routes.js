import path from 'path';
import express from 'express';
import { crearReporteMantenimiento, listarReportes, obtenerReportePorId, descargarPDF } from '../controllers/reporte_mantenimiento.controller.js';
import { isAdminOrTecnico, isCliente, authenticate} from '../middlewares/autenticacion.js';

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

// Ruta para descargar PDF directamente por nombre de archivo (similar a fichas)
router.get('/descargar/:nombreArchivo', authenticate, isCliente, (req, res) => {
  const { nombreArchivo } = req.params;
  const filePath = path.resolve(`uploads/reportes/${nombreArchivo}`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error enviando archivo:', err);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
});

export default router;
