import { processMessage } from '../../../src/services/chatbot.services.js';
import { ChatbotRepository } from '../../../src/repository/chatbot.repository.js';

// Mock del repositorio
jest.mock('../../../src/repository/chatbot.repository.js', () => ({
  ChatbotRepository: {
    buscarIntentPorMensaje: jest.fn(),
    guardarPatronPendiente: jest.fn(),
  },
}));

describe('processMessage (Chatbot Service)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------------------------------
  // Caso 1: Intención encontrada
  // ------------------------------------------------------------
  it('debería devolver la respuesta del intent cuando se encuentra', async () => {
    const mockIntent = {
      Intent: { id: 5, response: 'Hola humano 👋' },
    };

    ChatbotRepository.buscarIntentPorMensaje.mockResolvedValue(mockIntent);

    const result = await processMessage('  HOLA  ', null);

    // Normalización del mensaje
    expect(ChatbotRepository.buscarIntentPorMensaje).toHaveBeenCalledWith('hola');

    // Retorno esperado
    expect(result).toEqual({
      texto: 'Hola humano 👋',
      intentDetectado: 5,
    });

    // No debería guardar pendiente si hay intent
    expect(ChatbotRepository.guardarPatronPendiente).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------------
  // Caso 2: No se encuentra el intent → guarda pendiente
  // ------------------------------------------------------------
  it('debería guardar el mensaje como pendiente si no se encuentra ningún intent', async () => {
    ChatbotRepository.buscarIntentPorMensaje.mockResolvedValue(null);
    ChatbotRepository.guardarPatronPendiente.mockResolvedValue(undefined);

    const result = await processMessage('No sé qué decir', null);

    expect(ChatbotRepository.buscarIntentPorMensaje).toHaveBeenCalledWith('no sé qué decir');
    expect(ChatbotRepository.guardarPatronPendiente).toHaveBeenCalledWith('no sé qué decir');

    expect(result).toEqual({
      texto: 'No estoy seguro de cómo responder a eso. Lo aprenderé para la próxima.',
      intentDetectado: null,
    });
  });

  // ------------------------------------------------------------
  // Caso 3: Intent encontrado sin propiedad Intent (respuesta inválida)
  // ------------------------------------------------------------
  it('debería manejar cuando el objeto no contiene Intent y tratarlo como no encontrado', async () => {
    ChatbotRepository.buscarIntentPorMensaje.mockResolvedValue({});

    const result = await processMessage('mensaje desconocido', null);

    expect(ChatbotRepository.guardarPatronPendiente).toHaveBeenCalledWith('mensaje desconocido');
    expect(result.texto).toContain('No estoy seguro de cómo responder a eso');
    expect(result.intentDetectado).toBeNull();
  });

  // ------------------------------------------------------------
  // Caso 4: Verifica que el mensaje se normaliza correctamente
  // ------------------------------------------------------------
  it('debería convertir el mensaje a minúsculas y quitar espacios antes de buscar', async () => {
    ChatbotRepository.buscarIntentPorMensaje.mockResolvedValue(null);

    await processMessage('   SALUDAR   ', null);

    expect(ChatbotRepository.buscarIntentPorMensaje).toHaveBeenCalledWith('saludar');
  });
});
