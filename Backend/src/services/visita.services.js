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

  async obtenerServiciosPorTecnico(tecnico_id) {
    return await this.visitaRepository.obtenerServiciosPorTecnico(tecnico_id);
  }
  async obtenerServicioAsignadoPorId(tecnico_id, visita_id) {
    return await this.visitaRepository.obtenerServicioAsignadoPorId(tecnico_id, visita_id);
  }

  async obtenerDisponibilidadTecnico(tecnicoId, fecha) {
    // Obtener información del técnico
    const tecnico = await this.tecnicoRepository.obtenerTecnicoPorId(tecnicoId);
    if (!tecnico) {
      throw new Error('Técnico no encontrado');
    }

    // Obtener todas las visitas del técnico para ese día
    const visitas = await this.visitaRepository.obtenerHorariosDisponibles(tecnicoId, fecha);

    // Calcular intervalos ocupados
    const intervalosOcupados = visitas.map(visita => {
      const inicio = new Date(visita.fecha_programada);
      const fin = new Date(inicio.getTime() + visita.duracion_estimada * 60000);
      return {
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        duracion: visita.duracion_estimada
      };
    });

    // Definir horario laboral (8 AM a 6 PM)
    const fechaObj = new Date(fecha);
    const horaInicio = new Date(fechaObj.getFullYear(), fechaObj.getMonth(), fechaObj.getDate(), 8, 0, 0);
    const horaFin = new Date(fechaObj.getFullYear(), fechaObj.getMonth(), fechaObj.getDate(), 18, 0, 0);

    // Calcular bloques disponibles
    const horariosDisponibles = [];
    let tiempoActual = horaInicio;

    intervalosOcupados.forEach(intervalo => {
      const inicioOcupado = new Date(intervalo.inicio);
      if (tiempoActual < inicioOcupado) {
        horariosDisponibles.push({
          inicio: tiempoActual.toISOString(),
          fin: inicioOcupado.toISOString(),
          duracionDisponible: Math.floor((inicioOcupado - tiempoActual) / 60000)
        });
      }
      tiempoActual = new Date(intervalo.fin);
    });

    // Agregar último bloque disponible si existe
    if (tiempoActual < horaFin) {
      horariosDisponibles.push({
        inicio: tiempoActual.toISOString(),
        fin: horaFin.toISOString(),
        duracionDisponible: Math.floor((horaFin - tiempoActual) / 60000)
      });
    }

    return {
      tecnico: {
        id: tecnico.id,
        nombre: `${tecnico.nombre} ${tecnico.apellido}`,
        especialidad: tecnico.especialidad
      },
      fecha: fechaObj.toISOString(),
      intervalosOcupados,
      horariosDisponibles
    };
  }
}