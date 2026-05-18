import { ReporteMantenimientoModel } from '../models/reporte_mantenimiento.model.js';
import {
  ITEMS_VERIFICACION_MANTENIMIENTO,
  normalizarItemVerificacion
} from '../utils/reporte_mantenimiento.constants.js';

const { ReporteMantenimientoPlantasElectricas, ParametrosOperacion, VerificacionMantenimiento } = ReporteMantenimientoModel;

const ORDEN_ITEMS_VERIFICACION = new Map(
  ITEMS_VERIFICACION_MANTENIMIENTO.map((item, index) => [normalizarItemVerificacion(item), index])
);

const ordenarVerificaciones = (verificaciones = []) => {
  return [...verificaciones].sort((a, b) => {
    const ordenA = ORDEN_ITEMS_VERIFICACION.get(normalizarItemVerificacion(a?.item));
    const ordenB = ORDEN_ITEMS_VERIFICACION.get(normalizarItemVerificacion(b?.item));

    const posA = Number.isInteger(ordenA) ? ordenA : 999;
    const posB = Number.isInteger(ordenB) ? ordenB : 999;

    return posA - posB;
  });
};

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
  const reporte = await ReporteMantenimientoPlantasElectricas.findByPk(id, {
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

  if (reporte?.verificaciones) {
    reporte.verificaciones = ordenarVerificaciones(reporte.verificaciones);
  }

  return reporte;
};

export const obtenerReportesPorCliente = async (id_cliente) => {
  console.log('🔎 [REPO] Buscando reportes de mantenimiento para id_cliente:', id_cliente);
  const reportes = await ReporteMantenimientoPlantasElectricas.findAll({
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
    order: [['created_at', 'DESC']] // Más recientes primero
  });
  console.log('✅ [REPO] Reportes de mantenimiento encontrados:', reportes.length);
  if (reportes.length > 0) {
    console.log('📄 [REPO] Primer reporte:', {
      id: reportes[0].id,
      id_cliente: reportes[0].id_cliente,
      fecha: reportes[0].fecha
    });
  }
  return reportes.map((reporte) => {
    if (reporte?.verificaciones) {
      reporte.verificaciones = ordenarVerificaciones(reporte.verificaciones);
    }
    return reporte;
  });
};

export const obtenerReportesPorTecnico = async (id_tecnico) => {
  const reportes = await ReporteMantenimientoPlantasElectricas.findAll({
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
    order: [['created_at', 'DESC']] // Más recientes primero
  });

  return reportes.map((reporte) => {
    if (reporte?.verificaciones) {
      reporte.verificaciones = ordenarVerificaciones(reporte.verificaciones);
    }
    return reporte;
  });
};

export const obtenerTodosReportes = async () => {
  const reportes = await ReporteMantenimientoPlantasElectricas.findAll({
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
    order: [['created_at', 'DESC']] // Más recientes primero
  });

  return reportes.map((reporte) => {
    if (reporte?.verificaciones) {
      reporte.verificaciones = ordenarVerificaciones(reporte.verificaciones);
    }
    return reporte;
  });
};
