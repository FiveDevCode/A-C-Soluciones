import { SolicitudModel } from './solicitud.model.js';
import { ClienteModel } from './cliente.model.js';
import { VisitaModel } from './visita.model.js';
import { TecnicoModel } from './tecnico.model.js';
import { AdminModel } from './administrador.model.js';
import { ServicioModel } from './servicios.model.js';
import { ReporteMantenimientoModel } from './reporte_mantenimiento.model.js';

export const setupAssociations = () => {
 
  ClienteModel.hasMany(SolicitudModel, {
    foreignKey: 'cliente_id_fk',
    as: 'solicitudes'
  });
  SolicitudModel.belongsTo(ClienteModel, {
    foreignKey: 'cliente_id_fk',
    as: 'cliente'
  });
  SolicitudModel.belongsTo(AdminModel, {
    foreignKey: 'admin_id_fk',
    as: 'administrador'
  });
  AdminModel.hasMany(SolicitudModel, {
    foreignKey: 'admin_id_fk',
    as: 'solicitudes'
  });
  VisitaModel.belongsTo(SolicitudModel, {
    foreignKey: 'solicitud_id_fk',
    as: 'solicitud'
  });
  VisitaModel.belongsTo(TecnicoModel, {
    foreignKey: 'tecnico_id_fk',
    as: 'tecnico'
  });

  VisitaModel.Visita.belongsTo(ServicioModel.Servicio, {
    foreignKey: 'servicio_id_fk',
    as: 'servicio'
  });
  
  ServicioModel.Servicio.hasMany(VisitaModel.Visita, {
    foreignKey: 'servicio_id_fk',
    as: 'visitas'
  });

  // Asociaciones de Reporte de Mantenimiento
  ClienteModel.Cliente.hasMany(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'id_cliente',
    as: 'reportes_mantenimiento'
  });

  ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.belongsTo(ClienteModel.Cliente, {
    foreignKey: 'id_cliente',
    as: 'cliente'
  });

  TecnicoModel.Tecnico.hasMany(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'id_tecnico',
    as: 'reportes_mantenimiento'
  });

  ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.belongsTo(TecnicoModel.Tecnico, {
    foreignKey: 'id_tecnico',
    as: 'tecnico'
  });

  AdminModel.Administrador.hasMany(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'id_administrador',
    as: 'reportes_mantenimiento'
  });

  ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.belongsTo(AdminModel.Administrador, {
    foreignKey: 'id_administrador',
    as: 'administrador'
  });

  console.log('🔗 Asociaciones establecidas correctamente');
};
