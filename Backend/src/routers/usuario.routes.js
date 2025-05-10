import express from 'express';
import { AuthController } from '../controllers/usuario.controller.js';

const router = express.Router();

const authController = new AuthController();

// Ruta para iniciar sesión
router.post('/api/login', authController.login);


export default router;