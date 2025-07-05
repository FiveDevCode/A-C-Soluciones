import { FaqRepository } from "../repository/preguntas_frecuentes.repository.js";

export class FaqService {
  constructor() {
    this.faqRepository = new FaqRepository();
  }

  async crear(faqData) {
    return await this.faqRepository.crear(faqData);
  }

  async obtenerTodas() {
    return await this.faqRepository.obtenerTodos();
  }

  async obtenerPorCategoria(categoria) {
    return await this.faqRepository.obtenerPorCategoria(categoria);
  }

  async actualizar(id, data) {
    const existente = await this.faqRepository.obtenerPorId(id);
    if (!existente) {
      throw new Error('Pregunta frecuente no encontrada.');
    }
    return await this.faqRepository.actualizar(id, data);
  }

  async eliminar(id) {
    const existente = await this.faqRepository.obtenerPorId(id);
    if (!existente) {
      throw new Error('Pregunta frecuente no encontrada.');
    }
    return await this.faqRepository.eliminar(id);
  }
}
