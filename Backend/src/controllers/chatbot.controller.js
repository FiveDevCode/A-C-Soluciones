import crypto from "crypto";
import { getContext, setContext } from "../services/chatContext.services.js";
import { processMessage } from "../services/chatbot.services.js";
import { ChatbotRepository } from "../repository/chatbot.repository.js";

export const chatbotReply = async (req, res) => {
  try {
    let { sessionId, mensaje } = req.body;

    if (!sessionId) {
      sessionId = crypto.randomBytes(8).toString("hex");
    }

    const lastIntent = getContext(sessionId);

    const respuesta = await processMessage(mensaje, lastIntent);

    // Si detecta una intención, actualiza contexto
    if (respuesta.intentDetectado) {
      setContext(sessionId, respuesta.intentDetectado);
    }

    return res.json({
      sessionId,
      respuesta: respuesta.texto
    });

  } catch (error) {
    console.error("Error chatbot:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const addIntent = async (req, res) => {
  try {
    const { response, patrones } = req.body;

    if (!response || !Array.isArray(patrones) || patrones.length === 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const nuevaIntent = await ChatbotRepository.crearIntent(response, patrones);
    res.json({ mensaje: "Intent creado exitosamente", intent: nuevaIntent });
  } catch (error) {
    console.error("Error creando intent:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const verPendientes = async (req, res) => {
  const pendientes = await ChatbotRepository.obtenerPendientes();
  res.json(pendientes);
};

//Asociar frase pendiente a una intención ya existente
export const asociarPendiente = async (req, res) => {
  try {
    const { idPendiente, intentId } = req.body;
    await ChatbotRepository.asociarPendienteAIntent(idPendiente, intentId);
    res.json({ mensaje: "Patrón asociado exitosamente." });
  } catch (error) {
    console.error("Error al asociar pendiente:", error);
    res.status(500).json({ error: "Error al asociar pendiente." });
  }
};