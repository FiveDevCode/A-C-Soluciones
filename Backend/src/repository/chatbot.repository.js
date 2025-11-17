import { Op } from "sequelize";
import { PatternModel, IntentModel } from "../models/chatbot.model.js";
import { PendingPatternModel } from "../models/pendingPattern.model.js";

export const ChatbotRepository = {
  buscarIntentPorMensaje: async (mensaje) => {
    return PatternModel.findOne({
      where: { patron: { [Op.like]: `%${mensaje}%` } },
      include: [{ model: IntentModel, where: { activo: true } }]
    });
  },

  crearIntent: async (response, patrones) => {
    const intent = await IntentModel.create({ response });
    const patternsData = patrones.map(p => ({ patron: p, intent_id: intent.id }));
    await PatternModel.bulkCreate(patternsData);
    return intent;
  },

  guardarPatronPendiente: async (mensaje) => {
    const existente = await PendingPatternModel.findOne({ where: { mensaje } });
    if (!existente) {
      await PendingPatternModel.create({ mensaje });
    }
  },

  obtenerPendientes: async () => {
    return PendingPatternModel.findAll({ order: [["fecha", "DESC"]] });
  },

  asociarPendienteAIntent: async (idPendiente, intentId) => {
    const pendiente = await PendingPatternModel.findByPk(idPendiente);
    if (!pendiente) throw new Error("Pendiente no encontrado");

    await PatternModel.create({
      patron: pendiente.mensaje,
      intent_id: intentId
    });

    await pendiente.destroy(); // eliminar de pendientes
  }
};
