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
    const tecnico = await this.tecnicoRepository.obtenerTecnicoPorId(data.tecnico_id_fk);
    if (!tecnico) {
      throw new Error('Técnico no encontrado');
    }
    const solicitud = await this.solicitudRepository.obtenerPorId(data.solicitud_id_fk);
    if (!solicitud) {
      throw new Error('Solicitud no encontrada');
    }
    const tecnicoDisponible = await this.visitaRepository.verificarDisponibilidadTecnico(
      data.tecnico_id_fk,
      data.fecha_programada,
      data.duracion_estimada
    );
    if (!tecnicoDisponible) {
      throw new Error('El técnico no está disponible en ese horario');
    }
    const visita = await this.visitaRepository.crearVisita({
      ...data,
      estado: 'programada'
    });
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
  obtenerVisitasPorTecnico = async (tecnicoId) => {
    return await Visita.findAll({ where: { tecnico_id_fk: tecnicoId } });
  };
  async obtenerVisitasPorSolicitud(solicitudId) {
    return await this.visitaRepository.obtenerVisitasPorSolicitud(solicitudId);
  }
  async actualizarVisita(id, data) {
    const visita = await this.visitaRepository.obtenerVisitaPorId(id);
    if (!visita) {
      throw new Error('Visita no encontrada');
    }
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
    return visitaActualizada;
  }
  async obtenerTecnicosDisponibles(fecha, duracion) {
    return await this.visitaRepository.obtenerTecnicosDisponibles(fecha, duracion);
  }
}