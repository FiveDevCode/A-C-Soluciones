import express from 'express';
import { FaqController } from '../controllers/preguntas_freceuntes.controller.js';
import { authenticate, isAdmin } from '../middlewares/autenticacion.js';

const router = express.Router();
const faqController = new FaqController();

// Rutas públicas
router.get('/api/faqs', faqController.obtenerTodas);
router.get('/api/faqs/categoria/:categoria', faqController.obtenerPorCategoria);

// Rutas protegidas (requieren autenticación y ser admin)
router.post('/api/faqs', authenticate, isAdmin, faqController.crear);
router.put('/api/faqs/:id', authenticate, isAdmin, faqController.actualizar);
router.delete('/api/faqs/:id', authenticate, isAdmin, faqController.eliminar);

export default router;
