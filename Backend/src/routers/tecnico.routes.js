import express from 'express';
import { TecnicoController } from '../controllers/tecnico.controller.js';

const router = express.Router();

const tecnicoController = new TecnicoController();

router.post('/api/tecnico',  tecnicoController.crearTecnico);
router.get('/api/tecnico', tecnicoController.obtenerTecnicos);
router.get('/api/tecnico/:id', tecnicoController.obtenerTecnicoPorId);
router.get('/api/tecnico/cedula/:numero_de_cedula', tecnicoController.obtenerTecnicoPorCedula);
router.put('/api/tecnico/:id', tecnicoController.actualizarTecnico);
router.delete('/api/tecnico/:id', tecnicoController.eliminarTecnico);

export default router;
