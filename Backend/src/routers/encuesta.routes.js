import express from 'express';
import { EncuestaController } from '../controllers/encuesta.controller.js';
import { authenticate, isCliente} from '../middlewares/autenticacion.js';

const router = express.Router();
const encuestaController = new EncuestaController();



router.post('/api/servicios/:solicitudId/encuesta', authenticate, isCliente, encuestaController.responderEncuesta);
router.get('/api/encuestas', encuestaController.obtenerTodas);
router.get('/api/encuestas/:id', encuestaController.obtenerEncuestaPorId);

export default router;
