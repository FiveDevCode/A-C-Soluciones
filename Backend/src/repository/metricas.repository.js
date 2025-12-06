import { Sequelize } from 'sequelize';
import { SolicitudModel } from '../models/solicitud.model.js';
import { ServicioModel } from '../models/servicios.model.js';
import { ClienteModel } from '../models/cliente.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { VisitaModel } from '../models/visita.model.js';

export class MetricasRepository {
  constructor() {
    this.solicitudModel = SolicitudModel.Solicitud;
    this.servicioModel = ServicioModel.Servicio;
    this.clienteModel = ClienteModel.Cliente;
    this.tecnicoModel = TecnicoModel.Tecnico;
    this.visitaModel = VisitaModel.Visita;
  }

  /**
   * Obtiene la cantidad de solicitudes por servicio
   * @returns Array con servicios y su cantidad de solicitudes
   */
  async obtenerServiciosMasSolicitados() {
    return await this.solicitudModel.findAll({
      attributes: [
        'servicio_id_fk',
        [Sequelize.fn('COUNT', Sequelize.col('servicio_id_fk')), 'total_solicitudes']
      ],
      include: [
        {
          model: this.servicioModel,
          as: 'servicio_solicitud',
          attributes: ['id', 'nombre', 'descripcion']
        }
      ],
      group: ['servicio_id_fk', 'servicio_solicitud.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('servicio_id_fk')), 'DESC']],
      raw: false
    });
  }

  /**
   * Obtiene la cantidad de solicitudes por estado
   * @returns Array con estados y su cantidad
   */
  async obtenerSolicitudesPorEstado() {
    return await this.solicitudModel.findAll({
      attributes: [
        'estado',
        [Sequelize.fn('COUNT', Sequelize.col('estado')), 'total']
      ],
      group: ['estado'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('estado')), 'DESC']],
      raw: true
    });
  }

  /**
   * Obtiene los clientes con más solicitudes
   * @param {number} limit - Cantidad de clientes a retornar
   * @returns Array con clientes y su cantidad de solicitudes
   */
  async obtenerClientesMasActivos(limit = 10) {
    return await this.solicitudModel.findAll({
      attributes: [
        'cliente_id_fk',
        [Sequelize.fn('COUNT', Sequelize.col('cliente_id_fk')), 'total_solicitudes']
      ],
      include: [
        {
          model: this.clienteModel,
          as: 'cliente_solicitud',
          attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'telefono']
        }
      ],
      group: ['cliente_id_fk', 'cliente_solicitud.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('cliente_id_fk')), 'DESC']],
      limit: limit,
      raw: false
    });
  }

  /**
   * Obtiene los técnicos con más visitas asignadas
   * @param {number} limit - Cantidad de técnicos a retornar
   * @returns Array con técnicos y su cantidad de visitas
   */
  async obtenerTecnicosMasActivos(limit = 10) {
    return await this.visitaModel.findAll({
      attributes: [
        'tecnico_id_fk',
        [Sequelize.fn('COUNT', Sequelize.col('tecnico_id_fk')), 'total_visitas']
      ],
      include: [
        {
          model: this.tecnicoModel,
          as: 'tecnico_asociado',
          attributes: ['id', 'nombre', 'apellido', 'especialidad', 'correo_electronico']
        }
      ],
      group: ['tecnico_id_fk', 'tecnico_asociado.id'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('tecnico_id_fk')), 'DESC']],
      limit: limit,
      raw: false
    });
  }

  /**
   * Obtiene estadísticas generales del sistema
   * @returns Objeto con conteos totales
   */
  async obtenerEstadisticasGenerales() {
    const [totalSolicitudes, totalClientes, totalTecnicos, totalServicios] = await Promise.all([
      this.solicitudModel.count(),
      this.clienteModel.count(),
      this.tecnicoModel.count(),
      this.servicioModel.count()
    ]);

    return {
      total_solicitudes: totalSolicitudes,
      total_clientes: totalClientes,
      total_tecnicos: totalTecnicos,
      total_servicios: totalServicios
    };
  }

  /**
   * Obtiene visitas por estado
   * @returns Array con estados de visitas y su cantidad
   */
  async obtenerVisitasPorEstado() {
    return await this.visitaModel.findAll({
      attributes: [
        'estado',
        [Sequelize.fn('COUNT', Sequelize.col('estado')), 'total']
      ],
      group: ['estado'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('estado')), 'DESC']],
      raw: true
    });
  }
}
