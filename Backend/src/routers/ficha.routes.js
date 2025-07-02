import path from 'path';

import express from 'express';
import { crearFichaMantenimiento, listarFichas} from '../controllers/ficha_mantenimiento.controller.js';
import { isAdminOrTecnico, isCliente} from '../middlewares/autenticacion.js';
import upload from '../middlewares/uploadImages.js';

const router = express.Router();

router.post(
  '/fichas',
  isAdminOrTecnico,
  upload.fields([
    { name: 'foto_estado_antes', maxCount: 1 },
    { name: 'foto_estado_final', maxCount: 1 },
    { name: 'foto_descripcion_trabajo', maxCount: 1 },
  ]),
  crearFichaMantenimiento
);

router.get('/fichas', isAdminOrTecnico, listarFichas);

router.get('/descargar/:nombreArchivo', isCliente, (req, res) => {
  const { nombreArchivo } = req.params;
  const filePath = path.resolve(`uploads/fichas/${nombreArchivo}`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error enviando archivo:', err);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
});



export default router;
