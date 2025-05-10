import { VisitaService } from '../services/visita.services.js';
import { ValidationError } from 'sequelize';

export class VisitaController {
  constructor() {
    this.visitaService = new VisitaService();
  }
  crearVisita = async (req, res) => {
    try {
      if (req.user.rol !== 'administrador' ) {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden programar visitas'
        });
      }
      const visita = await this.visitaService.crearVisita(req.body);
      return res.status(201).json({
        success: true,
        data: visita
      });
    } catch (error) {
      console.error('Error al crear visita:', error);
      if (error instanceof ValidationError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
            if (err.path) {
                fieldErrors[err.path] = err.message;
            }
        });
        return res.status(400).json({ errors: fieldErrors });
      }
      return res.status(500).json({success: false, message: error.message || 'Error al agendar la visita. Intente nuevamente.'
      });
    }
  };
  obtenerVisitas = async (req, res) => {
    try {
      if (req.user.rol === 'administrador') {
        const visitas = await this.visitaService.obtenerVisitas(); // Todas
        return res.status(200).json({ success: true, data: visitas });
      }
      if (req.user.rol === 'tecnico') {
        const visitas = await this.visitaService.obtenerVisitasPorTecnico(req.user.id);
        return res.status(200).json({ success: true, data: visitas });
      }
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver las visitas'
      });
    } catch (error) {
      console.error('Error al obtener visitas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las visitas programadas'
      });
    }
  };
  obtenerVisitaPorId = async (req, res) => {
    try {
      const visita = await this.visitaService.obtenerVisitaPorId(req.params.id);
      if (req.user.rol === 'admin' || req.user.rol === 'admininistrador' || req.user.rol === 'tecnico') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta visita'
        });
      }
      return res.status(200).json({
        success: true,
        data: visita
      });
    } catch (error) {
      console.error('Error al obtener visita:', error);
      return res.status(404).json({
        success: false,
        message: error.message || 'Visita no encontrada'
      });
    }
  };
  obtenerVisitasPorSolicitud = async (req, res) => {
    try {
      const visitas = await this.visitaService.obtenerVisitasPorSolicitud(req.params.solicitud_id_fk);
      return res.status(200).json({
        success: true,
        data: visitas
      });
    } catch (error) {
      console.error('Error al obtener visitas por solicitud:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener las visitas para esta solicitud'
      });
    }
  };
  actualizarVisita = async (req, res) => {
    try {
      if (req.user.rol === 'admin' || req.user.rol === 'admininistrador' ) {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden actualizar visitas'
        });
      }
      const visitaActualizada = await this.visitaService.actualizarVisita(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: visitaActualizada
      });
    } catch (error) {
      console.error('Error al actualizar visita:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la visita'
      });
    }
  };
  cancelarVisita = async (req, res) => {
    try {
      if (req.user.rol !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden cancelar visitas'
        });
      }
      const { motivo } = req.body;
      if (!motivo) {
        return res.status(400).json({success: false,message: 'Se requiere un motivo para cancelar la visita'});
      }
      const visitaCancelada = await this.visitaService.cancelarVisita(req.params.id, motivo);

      return res.status(200).json({success: true,data: visitaCancelada});

    } catch (error) {
      
      console.error('Error al cancelar visita:', error);

      return res.status(400).json({success: false,message: error.message || 'Error al cancelar la visita'});
    }
  };
  obtenerTecnicosDisponibles = async (req, res) => {
    try {
      const { fecha, duracion } = req.query;
      if (!fecha || !duracion) {
        return res.status(400).json({success: false, message: 'Se requieren fecha y duración para buscar técnicos disponibles'});
      }
      const tecnicos = await this.visitaService.obtenerTecnicosDisponibles(fecha, duracion);

      return res.status(200).json({success: true, data: tecnicos });

    } catch (error) {

      console.error('Error al obtener técnicos disponibles:', error);

      return res.status(500).json({success: false,message: 'Error al buscar técnicos disponibles' });
    }
  };
}