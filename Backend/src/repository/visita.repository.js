import { Visita } from '../models/visita.model.js';

export class VisitaRepository {
    async crearVisita(data) {
      return await Visita.create(data);
    }
  
    async obtenerVisitaPorId(id) {
      return await Visita.findByPk(id, {
        include: [
          { model: Solicitud, attributes: ['id', 'tipo', 'descripcion', 'estado'] },
          { model: Tecnico, attributes: ['id', 'nombre', 'apellido', 'especialidad'] }
        ]
      });
    }
  
    async obtenerVisitasPorSolicitud(solicitudId) {
      return await Visita.findAll({
        where: { solicitud_ID: solicitudId },
        order: [['fecha_programada', 'DESC']]
      });
    }
  
    async obtenerVisitasPorTecnico(tecnicoId) {
      return await Visita.findAll({
        where: { tecnico_ID: tecnicoId },
        order: [['fecha_programada', 'ASC']]
      });
    }
  
    async actualizarVisita(id, data) {
      const visita = await Visita.findByPk(id);
      if (!visita) return null;
      return await visita.update(data);
    }
  
    async eliminarVisita(id) {
      const visita = await Visita.findByPk(id);
      if (!visita) return null;
      await visita.destroy();
      return visita;
    }
  
    async obtenerTecnicosDisponibles(fecha, duracion) {
      // Lógica para encontrar técnicos disponibles en una fecha/hora específica
      return await Tecnico.findAll({
        where: {
          estado: 'activo'
        },
        include: [{
          model: Visita,
          where: {
            [Op.or]: [
              {
                fecha_programada: {
                  [Op.between]: [
                    new Date(fecha),
                    new Date(new Date(fecha).getTime() + duracion * 60000)
                  ]
                }
              },
              {
                [Op.and]: [
                  { fecha_programada: { [Op.lte]: new Date(fecha) } },
                  sequelize.literal(`"fecha_programada" + INTERVAL '1 minute' * "duracion_estimada" >= '${fecha}'`)
                ]
              }
            ]
          },
          required: false
        }],
        having: sequelize.where(sequelize.fn('COUNT', sequelize.col('Visitas.id')), 0)
      });
    }
  }