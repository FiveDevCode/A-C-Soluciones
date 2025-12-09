import path from 'path';

import express from 'express';
import { crearFichaMantenimiento, listarFichas} from '../controllers/ficha_mantenimiento.controller.js';
import { isAdminOrTecnico, isCliente, authenticate, isAdminOrCliente, isAdminOrTecnicoOrCliente} from '../middlewares/autenticacion.js';
import upload from '../middlewares/uploadImages.js';
import { obtenerFichasPorCliente, obtenerFichasPorTecnico} from '../controllers/ficha_mantenimiento.controller.js';


const router = express.Router();

// Middleware para capturar errores async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('╔════════════════════════════════════════════════════════╗');
    console.error('║        ERROR CAPTURADO EN ROUTER DE FICHAS            ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error('🔴 Ruta:', req.method, req.url);
    console.error('🔴 Error:', error);
    console.error('════════════════════════════════════════════════════════\n');
    next(error);
  });
};

router.post(
  '/fichas', authenticate,
  isAdminOrTecnico,
  upload.fields([
    { name: 'foto_estado_antes', maxCount: 1 },
    { name: 'foto_estado_final', maxCount: 1 },
    { name: 'foto_descripcion_trabajo', maxCount: 1 },
  ]),
  asyncHandler(crearFichaMantenimiento)
);

router.get('/fichas', authenticate, isAdminOrTecnico, listarFichas);

router.get('/descargar/:nombreArchivo', authenticate, isAdminOrTecnicoOrCliente, async (req, res) => {
  const { nombreArchivo } = req.params;
  
  // Buscar la ficha por el nombre del archivo
  const fichaId = nombreArchivo.match(/ficha_(\d+)/)?.[1];
  
  if (fichaId) {
    try {
      const { obtenerFichaPorId } = await import('../repository/ficha_mantenimiento.repository.js');
      const ficha = await obtenerFichaPorId(fichaId);
      
      if (ficha && ficha.pdf_path) {
        // Si la URL es de Cloudinary, redirigir
        if (ficha.pdf_path.includes('cloudinary.com')) {
          return res.redirect(ficha.pdf_path);
        }
      }
    } catch (error) {
      console.error('Error buscando ficha:', error);
    }
  }
  
  // Fallback: intentar archivo local
  const filePath = path.resolve(`uploads/fichas/${nombreArchivo}`);
  res.sendFile(filePath, (err) => { 
    if (err) {
      console.error('Error enviando archivo:', err);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
});
router.get('/obtener-por-cliente/:idCliente', authenticate, isAdminOrTecnico, obtenerFichasPorCliente);

router.get('/obtener-por-tecnico/:id_tecnico', authenticate, isAdminOrTecnico, obtenerFichasPorTecnico);

export default router;
