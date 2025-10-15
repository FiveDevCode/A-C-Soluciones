import express from 'express';
import { AuthController } from '../controllers/usuario.controller.js';

const router = express.Router();

const authController = new AuthController();

// Ruta para iniciar sesión
router.post('/api/login', authController.login);

// Ruta para restablecer la contraseña
router.post('/api/forgot-password', authController.sendRecoveryCode);

// Ruta para verificar el código de recuperación
router.post('/api/verify-code', authController.verifyRecoveryCode);

// Ruta para restablecer la contraseña  
router.post('/api/reset-password', authController.resetPassword);


export default router;