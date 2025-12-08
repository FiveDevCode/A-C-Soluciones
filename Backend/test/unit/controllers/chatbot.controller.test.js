import crypto from 'crypto';
import { chatbotReply, addIntent, verPendientes, asociarPendiente } from '../../../src/controllers/chatbot.controller.js';
import { getContext, setContext } from '../../../src/services/chatContext.services.js';
import { processMessage } from '../../../src/services/chatbot.services.js';
import { ChatbotRepository } from '../../../src/repository/chatbot.repository.js';

// ---------------- MOCKS ----------------
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('abcd1234ef567890', 'hex')),
}));

jest.mock('../../../src/services/chatContext.services.js', () => ({
  getContext: jest.fn(),
  setContext: jest.fn(),
}));

jest.mock('../../../src/services/chatbot.services.js', () => ({
  processMessage: jest.fn(),
}));

jest.mock('../../../src/repository/chatbot.repository.js', () => ({
  ChatbotRepository: {
    crearIntent: jest.fn(),
    obtenerPendientes: jest.fn(),
    asociarPendienteAIntent: jest.fn(),
  },
}));

// Helper para mock de res
const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('Chat Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  
  describe('chatbotReply', () => {
    it('debería crear un nuevo sessionId si no se envía y responder correctamente', async () => {
      req = { body: { mensaje: 'hola' } };
      getContext.mockReturnValue(null);
      processMessage.mockResolvedValue({
        texto: 'Hola, ¿cómo estás?',
        intentDetectado: 10,
      });

      await chatbotReply(req, res);

      expect(crypto.randomBytes).toHaveBeenCalledWith(8);
      expect(getContext).toHaveBeenCalledWith(expect.any(String));
      expect(processMessage).toHaveBeenCalledWith('hola', null);
      expect(setContext).toHaveBeenCalledWith(expect.any(String), 10);
      expect(res.json).toHaveBeenCalledWith({
        sessionId: expect.any(String),
        respuesta: 'Hola, ¿cómo estás?',
      });
    });

    it('no debería actualizar el contexto si no hay intentDetectado', async () => {
      req = { body: { sessionId: 'sess123', mensaje: 'no entiendo' } };
      getContext.mockReturnValue('prevIntent');
      processMessage.mockResolvedValue({
        texto: 'No lo sé',
        intentDetectado: null,
      });

      await chatbotReply(req, res);

      expect(setContext).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        sessionId: 'sess123',
        respuesta: 'No lo sé',
      });
    });

    it('debería manejar errores internos correctamente', async () => {
      req = { body: { mensaje: 'error test' } };
      processMessage.mockRejectedValue(new Error('Falla simulada'));

      await chatbotReply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno' });
    });
  });

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  describe('addIntent', () => {
    it('debería devolver 400 si los datos son inválidos', async () => {
      req = { body: { response: '', patrones: [] } };

      await addIntent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Datos inválidos' });
    });

    it('debería crear un intent exitosamente', async () => {
      const mockIntent = { id: 1, response: 'Hola' };
      req = { body: { response: 'Hola', patrones: ['saludo', 'buenas'] } };
      ChatbotRepository.crearIntent.mockResolvedValue(mockIntent);

      await addIntent(req, res);

      expect(ChatbotRepository.crearIntent).toHaveBeenCalledWith('Hola', ['saludo', 'buenas']);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Intent creado exitosamente',
        intent: mockIntent,
      });
    });

    it('debería manejar errores internos correctamente', async () => {
      req = { body: { response: 'hola', patrones: ['saludo'] } };
      ChatbotRepository.crearIntent.mockRejectedValue(new Error('DB error'));

      await addIntent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno' });
    });
  });

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  describe('verPendientes', () => {
    it('debería devolver la lista de pendientes', async () => {
      const mockPendientes = [{ id: 1, mensaje: 'hola' }];
      ChatbotRepository.obtenerPendientes.mockResolvedValue(mockPendientes);

      req = {};
      await verPendientes(req, res);

      expect(ChatbotRepository.obtenerPendientes).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPendientes);
    });
  });

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  describe('asociarPendiente', () => {
    it('debería asociar correctamente un pendiente a un intent', async () => {
      req = { body: { idPendiente: 1, intentId: 5 } };
      ChatbotRepository.asociarPendienteAIntent.mockResolvedValue();

      await asociarPendiente(req, res);

      expect(ChatbotRepository.asociarPendienteAIntent).toHaveBeenCalledWith(1, 5);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Patrón asociado exitosamente.' });
    });

    it('debería manejar errores al asociar pendiente', async () => {
      req = { body: { idPendiente: 1, intentId: 5 } };
      ChatbotRepository.asociarPendienteAIntent.mockRejectedValue(new Error('fallo'));

      await asociarPendiente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al asociar pendiente.' });
    });
  });
});
