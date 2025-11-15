import { ChatbotRepository } from '../repository/chatbot.repository.js';

export const processMessage = async (mensaje, ultimoIntent) => {
  mensaje = mensaje.toLowerCase().trim();

  // Buscar en BD
  const intentEncontrado = await ChatbotRepository.buscarIntentPorMensaje(mensaje);

  if (intentEncontrado && intentEncontrado.Intent) {
    return {
      texto: intentEncontrado.Intent.response,
      intentDetectado: intentEncontrado.Intent.id
    };
  }

  // Guardar como pendiente de aprendizaje
  await ChatbotRepository.guardarPatronPendiente(mensaje);

  // Respuesta por defecto
  return {
    texto: "No estoy seguro de cómo responder a eso. Lo aprenderé para la próxima.",
    intentDetectado: null
  };
};
