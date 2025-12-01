import { VisitaService } from '../services/visita.services.js';
import { ValidationError } from 'sequelize';
import * as notificacionService from '../services/notificacion.services.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ClienteModel } from '../models/cliente.model.js';
import { SolicitudModel } from '../models/solicitud.model.js';

export class VisitaController {
  constructor() {
    this.visitaService = new VisitaService();
  }

  crearVisita = async (req, res) => {
    try {
      if (req.user.rol !== 'administrador') {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden programar visitas'
        });
      }
      const visita = await this.visitaService.crearVisita(req.body);
      
      // Notificar al técnico sobre la nueva visita asignada
      try {
        // Obtener información completa de la visita con cliente
        const visitaCompleta = await this.visitaService.obtenerVisitaPorId(visita.id);
        
        let nombreCliente = 'un cliente';
        if (visitaCompleta.solicitud_asociada?.cliente_solicitud) {
          const cliente = visitaCompleta.solicitud_asociada.cliente_solicitud;
          nombreCliente = `${cliente.nombre} ${cliente.apellido || ''}`.trim();
        }
        
        // Formatear fecha
        const fechaProgramada = new Date(visita.fecha_programada).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        await notificacionService.notificarTecnicoNuevaVisita(
          req.body.tecnico_id_fk,
          visita.id,
          nombreCliente,
          fechaProgramada
        ).catch(err => console.error('Error al enviar notificación al técnico:', err));
        
      } catch (notifError) {
        console.error('Error al procesar notificación de nueva visita:', notifError);
        // No fallar la creación si falla la notificación
      }
      
      return res.status(201).json({
        success: true,
        data: visita
      });
    } catch (error) {
      console.error('Error al crear visita:', error);
      if (error instanceof ValidationError) {
        const fieldErrors = {};
        for (const err of error.errors) {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        }

        return res.status(400).json({ errors: fieldErrors });
      }
      //extraer el mensaje error o usar el predeterminado de forma explicita
      let mensajeDeError = 'Error al agendar la visita. Intente nuevamente.'
      if (error.message && error.message.trim() !== '') {
        mensajeDeError = error.message;
      }

      return res.status(500).json({
        success: false,
        message: mensajeDeError
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

      // Verificar si la visita existe
      if (!visita) {
        return res.status(404).json({
          success: false,
          message: 'Visita no encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        data: visita
      });
    } catch (error) {
      console.error('Error al obtener visita:', error);
      return res.status(500).json({
        success: false,
        message: 'Visita no encontrada'
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
      // Corregir la verificación de permisos
      if (req.user.rol !== 'administrador' && req.user.rol !== 'tecnico') {
        return res.status(403).json({
          success: false,
          message: 'Solo administradores o técnicos pueden actualizar visitas'
        });
      }

      const visitaActualizada = await this.visitaService.actualizarVisita(req.params.id, req.body);
      
      // Si un técnico marca la visita como completada, notificar a los administradores
      if (req.body.estado === 'completada' && req.user.rol === 'tecnico') {
        try {
          // Obtener información del técnico
          const tecnico = await TecnicoModel.Tecnico.findByPk(req.user.id);
          
          // Obtener información de la visita con la solicitud y cliente
          const visitaCompleta = await this.visitaService.obtenerVisitaPorId(req.params.id);
          
          let nombreCliente = 'Cliente';
          if (visitaCompleta.solicitud_asociada?.cliente_solicitud) {
            const cliente = visitaCompleta.solicitud_asociada.cliente_solicitud;
            nombreCliente = `${cliente.nombre} ${cliente.apellido || ''}`.trim();
          }
          
          const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellido || ''}`.trim() : 'Técnico';
          
          // Obtener todos los administradores y notificarlos
          const { AdminModel: AdminModelImport } = await import('../models/administrador.model.js');
          const administradores = await AdminModelImport.Admin.findAll({
            attributes: ['id']
          });
          
          // Notificar a cada administrador
          for (const admin of administradores) {
            await notificacionService.notificarAdminVisitaCompletada(
              admin.id,
              visitaActualizada.id,
              nombreTecnico,
              nombreCliente
            ).catch(err => console.error(`Error al enviar notificación al admin ${admin.id}:`, err));
          }
          
        } catch (notifError) {
          console.error('Error al procesar notificación de visita completada:', notifError);
          // No fallar la actualización si falla la notificación
        }
      }
      
      return res.status(200).json({
        success: true,
        data: visitaActualizada
      });
    } catch (error) {
      console.error('Error al actualizar visita:', error);
      return res.status(400).json({
        success: false,
        message: 'Error al actualizar la visita'
      });
    }
  };

  cancelarVisita = async (req, res) => {
    try {
      // Verificar que sea administrador
      if (req.user.rol !== 'administrador') {
        return res.status(403).json({
          success: false,
          message: 'Solo los administradores pueden cancelar visitas'
        });
      }
      // Verificar que exista motivo (cambiar código de estado a 403)
      if (!req.body.motivo) {
        return res.status(403).json({
          success: false,
          message: 'Se requiere un motivo para cancelar la visita'
        });
      }

      const visitaCancelada = await this.visitaService.cancelarVisita(req.params.id, req.body.motivo);
      return res.status(200).json({
        success: true,
        data: visitaCancelada
      });
    } catch (error) {
      console.error('Error al cancelar visita:', error);
      // Extraer mensaje de error de forma explícita
      let errorMessage = 'Error al cancelar la visita';
      if (error.message && error.message.trim() !== '') {
        errorMessage = error.message;
      }
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }
  };

  obtenerTecnicosDisponibles = async (req, res) => {
    try {
      const { fecha, duracion } = req.query;
      if (!fecha || !duracion) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren fecha y duración para buscar técnicos disponibles'
        });
      }

      const tecnicos = await this.visitaService.obtenerTecnicosDisponibles(fecha, duracion);
      return res.status(200).json({
        success: true,
        data: tecnicos
      });
    } catch (error) {
      console.error('Error al obtener técnicos disponibles:', error);

      let errorMessageTecnicosDisponibles = 'Error al obtener ténicos disponibles'
      if (error.message && error.message.trim() !== '') {
        errorMessageTecnicosDisponibles = error.message
      }
      return res.status(500).json({
        success: false,
        message: errorMessageTecnicosDisponibles
      });
    }
  };

  // Obtener servicios asignados a un técnico
  obtenerServiciosAsignados = async (req, res) => {
    try {
      // Validar que el usuario sea un técnico
      if (req.user.rol !== 'tecnico') {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Solo los técnicos pueden consultar sus servicios asignados.'
        });
      }

      const tecnico_id = req.user.id;
      const visitas = await this.visitaService.obtenerServiciosPorTecnico(tecnico_id);

      return res.status(200).json({
        success: true,
        message: 'Servicios asignados obtenidos correctamente.',
        count: visitas.length,
        data: visitas
      });
    } catch (error) {
      console.error('Error al obtener servicios asignados:', error);

      let errorMessage = 'Error al obtener servicios asignados';
      if (error.message && error.message.trim() !== '') {
        errorMessage = error.message
      }
      return res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  // Obtener un servicio asignado específico por ID
  obtenerServicioAsignadoPorId = async (req, res) => {
    try {
      // Validar que el usuario sea un técnico
      if (req.user.rol !== 'tecnico') {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Solo los técnicos pueden consultar sus servicios asignados.'
        });
      }

      const tecnico_id = req.user.id;
      const visita_id = req.params.id;

      const visita = await this.visitaService.obtenerServicioAsignadoPorId(tecnico_id, visita_id);

      if (!visita) {
        return res.status(404).json({
          success: false,
          message: 'Servicio asignado no encontrado o no pertenece a este técnico.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Servicio asignado obtenido correctamente.',
        data: visita
      });
    } catch (error) {
      console.error('Error al obtener servicio asignado por ID:', error);
      let errorMessageServicioAsignadoID = 'Error al obtener servicio asignado por ID:';
      if (error.message && error.message.trim() !== '') {
        errorMessageServicioAsignadoID = error.message
      }
      return res.status(500).json({
        success: false,
        message: errorMessageServicioAsignadoID
      });
    }
  }
}