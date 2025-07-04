import { FaqService } from "../services/preguntas_frecuentes.services.js";

export class FaqController {
  constructor() {
    this.faqService = new FaqService();
  }

  crear = async (req, res) => {
    try {
      const { pregunta, respuesta, categoria } = req.body;
      const id_administrador = req.user.id;

      const nuevaFaq = await this.faqService.crear({
        pregunta,
        respuesta,
        categoria,
        id_administrador
      });

      res.status(201).json({
        success: true,
        data: nuevaFaq,
        message: "Pregunta frecuente creada correctamente."
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  obtenerTodas = async (req, res) => {
    try {
      const faqs = await this.faqService.obtenerTodas();
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  obtenerPorCategoria = async (req, res) => {
    try {
      const { categoria } = req.params;
      const faqs = await this.faqService.obtenerPorCategoria(categoria);
      res.json({ success: true, data: faqs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const { pregunta, respuesta, categoria } = req.body;

      await this.faqService.actualizar(id, { pregunta, respuesta, categoria });

      res.json({ success: true, message: "Pregunta frecuente actualizada correctamente." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.faqService.eliminar(id);
      res.json({ success: true, message: "Pregunta frecuente eliminada correctamente." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
