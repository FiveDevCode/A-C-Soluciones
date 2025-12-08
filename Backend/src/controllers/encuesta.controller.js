import { EncuestaService, ENCUESTA_ERRORS } from '../services/encuesta.services.js';
import { ValidationError } from 'sequelize';

export class EncuestaController {
  constructor() {
    this.encuestaService = new EncuestaService();
  }

  responderEncuesta = async (req, res) => {
    const clienteId = req.user.id;
    const solicitudId = req.params.solicitudId; 
    const datosEncuesta = req.body;

    try {
      const nuevaEncuesta = await this.encuestaService.responderEncuesta(
        clienteId,
        solicitudId,
        datosEncuesta
      );

      return res.status(201).json({
        message: '¡Gracias por tu opinión! Tu respuesta ha sido registrada exitosamente.',
        encuesta: nuevaEncuesta
      });

    } catch (error) {
      console.error('Error al responder encuesta:', error);

      if (error.name === 'EncuestaDuplicadaError') {
        return res.status(400).json({ 
          message: ENCUESTA_ERRORS.YA_RESPONDIDA
        });
      }
      
      if (error.name === 'SolicitudNoCompletadaError') {
        return res.status(403).json({ 
          message: ENCUESTA_ERRORS.SOLICITUD_NO_COMPLETADA
        });
      }

      if (error.name === 'SolicitudInvalidaError') {
        return res.status(404).json({ 
          message: "No se encontró la solicitud o no tienes permisos para calificarla."
        });
      }

      if (error instanceof ValidationError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path && err.message) {
            fieldErrors[err.path] = err.message;
          }
        });
        return res.status(400).json({ 
          message: 'Error de validación: Revise los campos obligatorios y sus valores.',
          errors: fieldErrors 
        });
      }

      return res.status(500).json({ 
        message: ENCUESTA_ERRORS.ERROR_DB
      });
    }
  };

  obtenerEncuestaPorId = async (req, res) => {
    try {
      const clienteId = req.user.id;
      const encuestaId = req.params.id;

      const encuesta = await this.encuestaService.obtenerEncuestaPorId(encuestaId);
      
      if (!encuesta) {
        return res.status(404).json({ message: 'Encuesta no encontrada.' });
      }

      if (encuesta.cliente_id !== clienteId) {
        return res.status(403).json({ message: 'Acceso denegado. No puedes ver esta encuesta.' });
      }

      return res.status(200).json(encuesta);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener la encuesta.' });
    }
  };

  obtenerTodas = async (req, res) => {
    try {
      const encuestas = await this.encuestaService.obtenerTodas();
      return res.status(200).json(encuestas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener las encuestas.' });
    }
  };
}
