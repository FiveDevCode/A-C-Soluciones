import path from 'path';

import express from 'express';
import { crearFichaMantenimiento, listarFichas} from '../controllers/ficha_mantenimiento.controller.js';
import { isAdminOrTecnico, isCliente, authenticate} from '../middlewares/autenticacion.js';

const router = express.Router();

router.post('/fichas', isAdminOrTecnico, crearFichaMantenimiento);
router.get('/fichas', authenticate, listarFichas);

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
