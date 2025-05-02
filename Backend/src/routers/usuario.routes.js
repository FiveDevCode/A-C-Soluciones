import express from 'express';
import { loginController } from '../controllers/usuario.controller.js';
import verificarToken from '../middlewares/autenticacion.js';

const router = express.Router();

router.post('/api/login', loginController);

// Ejemplo de rutas protegidas:
router.get('/admin', verificarToken(['administrador']), (req, res) => res.send('Vista admin'));
router.get('/tecnico', verificarToken(['tecnico']), (req, res) => res.send('Vista técnico'));
router.get('/cliente', verificarToken(['cliente']), (req, res) => res.send('Vista cliente'));

export default router;