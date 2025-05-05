import { VisitaRepository } from '../repository/visita.repository.js';
import { TecnicoRepository } from '../repository/tecnico.repository.js';
import { SolicitudRepository } from '../repository/solicitud.repository.js';

export class VisitaService {
  constructor() {
    this.visitaRepository = new VisitaRepository();
    this.tecnicoRepository = new TecnicoRepository();
    this.solicitudRepository = new SolicitudRepository();
  }

  async crearVisita(data) {
    // Validar técnico
    const tecnico = await this.tecnicoRepository.obtenerTecnicoPorId(data.tecnico_ID);
    if (!tecnico) {
      throw new Error('Técnico no encontrado');
    }

    // Validar solicitud
    const solicitud = await this.solicitudRepository.obtenerSolicitudPorId(data.solicitud_ID);
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }

    // Verificar disponibilidad del técnico
    const tecnicoDisponible = await this.visitaRepository.verificarDisponibilidadTecnico(
      data.tecnico_ID,
      data.fecha_programada,
      data.duracion_estimada
    );

    if (!tecnicoDisponible) {
      throw new Error('El técnico no está disponible en ese horario');
    }

    // Crear la visita
    const visita = await this.visitaRepository.crearVisita({
      ...data,
      estado: 'programada'
    });

    // // Enviar notificaciones
    // await this.notificationService.enviarNotificacionVisitaProgramada({
    //   visitaId: visita.id,
    //   tecnicoId: data.tecnico_ID,
    //   clienteId: solicitud.cliente_ID,
    //   fecha: data.fecha_programada
    // });

    return visita;
  }

  async obtenerVisitas() {
    return await this.visitaRepository.obtenerVisitas();
  }

  async obtenerVisitaPorId(id) {
    const visita = await this.visitaRepository.obtenerVisitaPorId(id);
    if (!visita) {
      throw new Error('Visita no encontrada');
    }
    return visita;
  }

  async obtenerVisitasPorSolicitud(solicitudId) {
    return await this.visitaRepository.obtenerVisitasPorSolicitud(solicitudId);
  }

  async actualizarVisita(id, data) {
    const visita = await this.visitaRepository.obtenerVisitaPorId(id);
    if (!visita) {
      throw new Error('Visita no encontrada');
    }

    // Validaciones adicionales según estado actual
    if (visita.estado === 'completada' || visita.estado === 'cancelada') {
      throw new Error('No se puede modificar una visita completada o cancelada');
    }

    return await this.visitaRepository.actualizarVisita(id, data);
  }

  async cancelarVisita(id, motivo) {
    const visita = await this.visitaRepository.obtenerVisitaPorId(id);
    if (!visita) {
      throw new Error('Visita no encontrada');
    }

    const visitaActualizada = await this.visitaRepository.actualizarVisita(id, {
      estado: 'cancelada',
      notas_posteriores: motivo
    });

    // // Enviar notificación de cancelación
    // await this.notificationService.enviarNotificacionVisitaCancelada({
    //   visitaId: visita.id,
    //   tecnicoId: visita.tecnico_ID,
    //   clienteId: visita.solicitud.cliente_ID,
    //   motivo: motivo
    // });

    return visitaActualizada;
  }

  async obtenerTecnicosDisponibles(fecha, duracion) {
    return await this.visitaRepository.obtenerTecnicosDisponibles(fecha, duracion);
  }
}