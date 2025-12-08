import { ReporteMantenimientoModel } from '../models/reporte_mantenimiento.model.js';

const { ReporteMantenimientoPlantasElectricas, ParametrosOperacion, VerificacionMantenimiento } = ReporteMantenimientoModel;

export const crearReporte = async (data) => {
  return await ReporteMantenimientoPlantasElectricas.create(data);
};

export const crearParametrosOperacion = async (data) => {
  return await ParametrosOperacion.create(data);
};

export const crearVerificaciones = async (verificaciones) => {
  return await VerificacionMantenimiento.bulkCreate(verificaciones);
};

export const obtenerReportePorId = async (id) => {
  return await ReporteMantenimientoPlantasElectricas.findByPk(id, {
    include: [
      {
        model: ParametrosOperacion,
        as: 'parametros'
      },
      {
        model: VerificacionMantenimiento,
        as: 'verificaciones'
      }
    ]
  });
};

export const obtenerReportesPorCliente = async (id_cliente) => {
  return await ReporteMantenimientoPlantasElectricas.findAll({
    where: { id_cliente },
    include: [
      {
        model: ParametrosOperacion,
        as: 'parametros'
      },
      {
        model: VerificacionMantenimiento,
        as: 'verificaciones'
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

export const obtenerReportesPorTecnico = async (id_tecnico) => {
  return await ReporteMantenimientoPlantasElectricas.findAll({
    where: { id_tecnico },
    include: [
      {
        model: ParametrosOperacion,
        as: 'parametros'
      },
      {
        model: VerificacionMantenimiento,
        as: 'verificaciones'
      }
    ],
    order: [['fecha', 'DESC']]
  });
};

export const obtenerTodosReportes = async () => {
  return await ReporteMantenimientoPlantasElectricas.findAll({
    include: [
      {
        model: ParametrosOperacion,
        as: 'parametros'
      },
      {
        model: VerificacionMantenimiento,
        as: 'verificaciones'
      }
    ],
    order: [['fecha', 'DESC']]
  });
};
