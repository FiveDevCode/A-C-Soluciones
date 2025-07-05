import { FaqModel } from "../models/preguntas_frecuentes.model.js";

export class FaqRepository {
  async crear(faqData) {
    return await FaqModel.Faq.create(faqData);
  }

  async obtenerTodos() {
    return await FaqModel.Faq.findAll();
  }

  async obtenerPorCategoria(categoria) {
    return await FaqModel.Faq.findAll({
      where: { categoria }
    });
  }

  async obtenerPorId(id) {
    return await FaqModel.Faq.findByPk(id);
  }

  async actualizar(id, data) {
    return await FaqModel.Faq.update(data, { where: { id } });
  }

  async eliminar(id) {
    return await FaqModel.Faq.destroy({ where: { id } });
  }
}
