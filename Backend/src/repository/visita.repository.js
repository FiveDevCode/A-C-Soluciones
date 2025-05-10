import { VisitaModel } from '../models/visita.model.js';
import { SolicitudModel } from '../models/solicitud.model.js';
import { TecnicoModel } from '../models/tecnico.model.js';
import { ServicioModel } from '../models/servicios.model.js';
import { Op } from 'sequelize'; // Asegúrate de importar esto al inicio del archivo

export class VisitaRepository {
  constructor() {
    this.model = VisitaModel.Visita;
    this.solicitudModel = SolicitudModel.Solicitud;
    this.tecnicoModel = TecnicoModel.Tecnico;
    this.servicioModel = ServicioModel.Servicio;
    this.setupAssociations();
  }

  setupAssociations() {
    if (!this.model.associations?.solicitud) {
      this.model.belongsTo(this.solicitudModel, {
        foreignKey: 'solicitud_id_fk',
        as: 'solicitud'
      });
    }

    if (!this.model.associations?.tecnico) {
      this.model.belongsTo(this.tecnicoModel, {
        foreignKey: 'tecnico_id_fk',
        as: 'tecnico'
      });
    }

    if (!this.model.associations?.servicio) {
      this.model.belongsTo(this.servicioModel, {
        foreignKey: 'servicio_id_fk',
        as: 'servicio'
      });
    }
    
  }

  async crearVisita(data) {
    return await this.model.create(data);
  }

  async obtenerVisitaPorId(id) {
    return await this.model.findByPk(id, {
      include: [
         {
          model: this.solicitudModel,
          as: 'solicitud',
          attributes: ['id', 'fecha_solicitud', 'descripcion', 'direccion_servicio', 'comentarios','estado']
         },
        {
          model: this.tecnicoModel,
          as: 'tecnico',
          attributes: ['id', 'nombre', 'apellido', 'especialidad']
        }
      ]
    });
  }

  async obtenerVisitas() {
    return await this.model.findAll({
      include: [
        {
          model: this.solicitudModel,
          as: 'solicitud',
          attributes: ['id', 'descripcion', 'direccion_servicio', 'comentarios', 'estado']
        },
        {
          model: this.tecnicoModel,
          as: 'tecnico',
          attributes: ['id', 'nombre', 'apellido', 'especialidad']
        }
      ],
      order: [['fecha_programada', 'DESC']]
    });
  }

  async obtenerVisitasPorSolicitud(solicitud_id_fk) {
    return await this.model.findAll({
      where: { solicitud_ID: solicitud_id_fk },
      order: [['fecha_programada', 'DESC']]
    });
  }

  async obtenerVisitasPorTecnico(tecnico_id_fk) {
    return await this.model.findAll({
      where: { tecnico_ID: tecnico_id_fk },
      order: [['fecha_programada', 'ASC']]
    });
  }

  async actualizarVisita(id, data) {
    const visita = await this.model.findByPk(id);
    if (!visita) return null;
    return await visita.update(data);
  }

  async eliminarVisita(id) {
    const visita = await this.model.findByPk(id);
    if (!visita) return null;
    await visita.destroy();
    return visita;
  }

  // 🚨 MÉTODO NUEVO: verificarDisponibilidadTecnico
  async verificarDisponibilidadTecnico(tecnicoId, fechaProgramada, duracionEstimada) {
    // Validación de fecha y duración
    if (!fechaProgramada || isNaN(new Date(fechaProgramada).getTime())) {
      throw new Error("Fecha programada inválida");
    }
  
    const duracionMin = Number(duracionEstimada);
    if (isNaN(duracionMin)) {
      throw new Error("Duración estimada inválida");
    }
  
    const inicio = new Date(fechaProgramada);
    const fin = new Date(inicio.getTime() + duracionMin * 60000); // duración en minutos
  
    const visitas = await this.model.findAll({
      where: {
        tecnico_id_fk: tecnicoId,
        [Op.or]: [
          {
            fecha_programada: {
              [Op.between]: [inicio, fin]
            }
          },
          {
            [Op.and]: [
              {
                fecha_programada: {
                  [Op.lte]: inicio
                }
              },
              {
                duracion_estimada: {
                  [Op.gte]: duracionMin
                }
              }
            ]
          }
        ]
      }
    });
  
    return visitas.length === 0;
  }

  async obtenerServiciosPorTecnico(tecnico_id) {
    return await VisitaModel.Visita.findAll({
      where: {
        tecnico_id_fk: tecnico_id
      },
      attributes: ['id', 'fecha_programada', 'duracion_estimada', 'estado', 'notas_previas', 'notas_posteriores', 'fecha_creacion'],
      include: [{
        model: ServicioModel.Servicio,
        as: 'servicio',
        attributes: ['id', 'nombre', 'descripcion', 'estado', 'fecha_creacion', 'fecha_modificacion']
      }],
      order: [['fecha_creacion', 'DESC']]
    });
  }

  async obtenerServicioAsignadoPorId(tecnico_id, visita_id) {
    return await VisitaModel.Visita.findOne({
      where: {
        id: visita_id,
        tecnico_id_fk: tecnico_id
      },
      attributes: ['id', 'fecha_programada', 'duracion_estimada', 'estado', 'notas_previas', 'notas_posteriores', 'fecha_creacion'],
      include: [{
        model: ServicioModel.Servicio,
        as: 'servicio',
        attributes: ['id', 'nombre', 'descripcion', 'estado', 'fecha_creacion', 'fecha_modificacion']
      }]
    });
  }
}

//['id', 'nombre', 'descripcion', 'estado', ' fecha_creacion', ' fecha_modificacion']
 