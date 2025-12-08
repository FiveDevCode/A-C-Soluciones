import { MetricasRepository } from '../repository/metricas.repository.js';

export class MetricasService {
  constructor() {
    this.metricasRepository = new MetricasRepository();
  }

  /**
   * Obtiene los servicios más solicitados
   */
  async obtenerServiciosMasSolicitados() {
    const servicios = await this.metricasRepository.obtenerServiciosMasSolicitados();
    
    // Transformar datos para gráficas
    return servicios.map(item => ({
      servicio_id: item.servicio_id_fk,
      nombre: item.servicio_solicitud?.nombre || 'Sin nombre',
      descripcion: item.servicio_solicitud?.descripcion || '',
      total_solicitudes: parseInt(item.dataValues?.total_solicitudes || 0)
    }));
  }

  /**
   * Obtiene solicitudes agrupadas por estado
   */
  async obtenerSolicitudesPorEstado() {
    const estados = await this.metricasRepository.obtenerSolicitudesPorEstado();
    
    return estados.map(item => ({
      estado: item.estado,
      total: parseInt(item.total)
    }));
  }

  /**
   * Obtiene los clientes más activos
   */
  async obtenerClientesMasActivos(limit = 10) {
    const clientes = await this.metricasRepository.obtenerClientesMasActivos(limit);
    
    return clientes.map(item => ({
      cliente_id: item.cliente_id_fk,
      nombre: item.cliente_solicitud ? 
        `${item.cliente_solicitud.nombre} ${item.cliente_solicitud.apellido || ''}`.trim() : 
        'Sin nombre',
      email: item.cliente_solicitud?.correo_electronico || '',
      telefono: item.cliente_solicitud?.telefono || '',
      total_solicitudes: parseInt(item.dataValues?.total_solicitudes || 0)
    }));
  }

  /**
   * Obtiene los técnicos más activos
   */
  async obtenerTecnicosMasActivos(limit = 10) {
    const tecnicos = await this.metricasRepository.obtenerTecnicosMasActivos(limit);
    
    return tecnicos.map(item => ({
      tecnico_id: item.tecnico_id_fk,
      nombre: item.tecnico_asociado ? 
        `${item.tecnico_asociado.nombre} ${item.tecnico_asociado.apellido || ''}`.trim() : 
        'Sin nombre',
      especialidad: item.tecnico_asociado?.especialidad || '',
      email: item.tecnico_asociado?.correo_electronico || '',
      total_visitas: parseInt(item.dataValues?.total_visitas || 0)
    }));
  }

  /**
   * Obtiene estadísticas generales del sistema
   */
  async obtenerEstadisticasGenerales() {
    return await this.metricasRepository.obtenerEstadisticasGenerales();
  }

  /**
   * Obtiene visitas agrupadas por estado
   */
  async obtenerVisitasPorEstado() {
    const estados = await this.metricasRepository.obtenerVisitasPorEstado();
    
    return estados.map(item => ({
      estado: item.estado,
      total: parseInt(item.total)
    }));
  }

  /**
   * Obtiene un dashboard completo con todas las métricas principales
   */
  async obtenerDashboardCompleto() {
    const [
      servicios,
      solicitudesEstado,
      clientesActivos,
      tecnicosActivos,
      estadisticas,
      visitasEstado
    ] = await Promise.all([
      this.obtenerServiciosMasSolicitados(),
      this.obtenerSolicitudesPorEstado(),
      this.obtenerClientesMasActivos(5),
      this.obtenerTecnicosMasActivos(5),
      this.obtenerEstadisticasGenerales(),
      this.obtenerVisitasPorEstado()
    ]);

    return {
      servicios_mas_solicitados: servicios,
      solicitudes_por_estado: solicitudesEstado,
      clientes_mas_activos: clientesActivos,
      tecnicos_mas_activos: tecnicosActivos,
      estadisticas_generales: estadisticas,
      visitas_por_estado: visitasEstado
    };
  }
}
