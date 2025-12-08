import { EncuestaModel } from '../models/encuesta.model.js';

export class EncuestaRepository {
  async findBySolicitudId(solicitudId) { 
    return await EncuestaModel.Encuesta.findOne({
      where: { solicitud_id: solicitudId }
    });
  }

  async crearEncuesta(data) {
    try {
      return await EncuestaModel.Encuesta.create(data);
    } catch (error) {
      throw error;
    }
  }

  async obtenerEncuestaPorId(id) {
    return await EncuestaModel.Encuesta.findByPk(id);
  }

  async obtenerTodas() {
    return await EncuestaModel.Encuesta.findAll();
  }
}
