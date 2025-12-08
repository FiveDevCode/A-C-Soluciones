import { EncuestaRepository } from '../repository/encuesta.repository.js';
import { SolicitudRepository } from '../repository/solicitud.repository.js'; 

export const ENCUESTA_ERRORS = {
  NO_SESION: "Debe iniciar sesión para acceder a la encuesta.",
  NO_CLIENTE: "Solo usuarios con rol CLIENTE pueden responder encuestas.",
  SOLICITUD_NO_COMPLETADA: "La encuesta solo está disponible para solicitudes en estado Completada.",
  YA_RESPONDIDA: "Ya has respondido la encuesta para esta solicitud.",
  ERROR_DB: "Error al enviar la encuesta. Intente nuevamente más tarde."
};

export class EncuestaService {
  constructor() {
    this.encuestaRepository = new EncuestaRepository();
    this.solicitudRepository = new SolicitudRepository(); 
  }

  async responderEncuesta(clienteId, solicitudId, datosEncuesta) { 
    const encuestaExistente = await this.encuestaRepository.findBySolicitudId(solicitudId); 
    if (encuestaExistente) {
      const error = new Error(ENCUESTA_ERRORS.YA_RESPONDIDA);
      error.name = 'EncuestaDuplicadaError';
      throw error;
    }

    const solicitud = await this.solicitudRepository.obtenerSolicitudPorId(solicitudId);

    if (!solicitud || solicitud.estado !== 'completada') {
      const error = new Error(ENCUESTA_ERRORS.SOLICITUD_NO_COMPLETADA);
      error.name = 'SolicitudNoCompletadaError';
      throw error;
    }

    const datosCompletos = {
      cliente_id: clienteId,
      solicitud_id: solicitudId,
      ...datosEncuesta
    };

    return await this.encuestaRepository.crearEncuesta(datosCompletos);
  }

  async obtenerEncuestaPorId(id) {
    return await this.encuestaRepository.obtenerEncuestaPorId(id);
  }

  async obtenerTodas() {
    return await this.encuestaRepository.obtenerTodas();
  }

  
}
