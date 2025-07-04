import express from 'express';
import { FaqController } from '../controllers/preguntas_freceuntes.controller.js';
import { authenticate, isAdmin } from '../middlewares/autenticacion.js';

const router = express.Router();
const faqController = new FaqController();

// Rutas públicas
router.get('/api/faqs', faqController.obtenerTodas);
router.get('/api/faqs/categoria/:categoria', faqController.obtenerPorCategoria);

// Rutas protegidas
router.use(authenticate);

router.post('/api/faqs', isAdmin, faqController.crear);
router.put('/api/faqs/:id', isAdmin, faqController.actualizar);
router.delete('/api/faqs/:id', isAdmin, faqController.eliminar);

export default router;
