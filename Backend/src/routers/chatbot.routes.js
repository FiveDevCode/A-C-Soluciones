import { Router } from 'express';
import { chatbotReply, addIntent, verPendientes, asociarPendiente } from '../controllers/chatbot.controller.js';

const router = Router();
router.post('/api/intent', addIntent); //

router.post('/api/chat', chatbotReply);
router.get('/api/pendientes', verPendientes); // listar frases no entendidas
router.post('/api/pendientes/asociar', asociarPendiente); // asociar frase a intención
export default router;
