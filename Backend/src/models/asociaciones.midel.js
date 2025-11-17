import { SolicitudModel } from './solicitud.model.js';
import { ClienteModel } from './cliente.model.js';
import { VisitaModel } from './visita.model.js';
import { TecnicoModel } from './tecnico.model.js';
import { AdminModel } from './administrador.model.js';
import { ServicioModel } from './servicios.model.js';
import { ReporteBombeoModel } from './reporte_bombeo.model.js';
import { EquipoBombeoModel } from './equipoBombeo.model.js';
import { ParametroBombeoModel } from './parametroBombeo.model.js';
import { ReporteMantenimientoModel } from './reporte_mantenimiento.model.js';

export const setupAssociations = () => {
  // Extraer los modelos de sus contenedores
  const { Solicitud } = SolicitudModel;
  const { Cliente } = ClienteModel;
  const { Visita } = VisitaModel;
  const { Tecnico } = TecnicoModel;
  const { Admin } = AdminModel;
  const { Servicio } = ServicioModel;
  const { ReporteBombeo } = ReporteBombeoModel;
  const { EquipoBombeo } = EquipoBombeoModel;
  const { ParametroBombeo } = ParametroBombeoModel;

  // Asociaciones Cliente - Solicitud
  Cliente.hasMany(Solicitud, {
    foreignKey: 'cliente_id_fk',
    as: 'solicitudes'
  });

  Solicitud.belongsTo(Cliente, {
    foreignKey: 'cliente_id_fk',
    as: 'cliente_solicitud'
  });

  // Asociaciones Solicitud - Admin
  Solicitud.belongsTo(Admin, {
    foreignKey: 'admin_id_fk',
    as: 'administrador'
  });
  Solicitud.belongsTo(Servicio, {
    foreignKey: 'servicio_id_fk',
    as: 'servicio_solicitud'

  });

  Admin.hasMany(Solicitud, {
    foreignKey: 'admin_id_fk',
    as: 'solicitudes'
  });

  // Asociaciones Visita - Solicitud
  Visita.belongsTo(Solicitud, {
    foreignKey: 'solicitud_id_fk',
    as: 'solicitud_asociada'
  });

  // Asociaciones Visita - Tecnico
  Visita.belongsTo(Tecnico, {
    foreignKey: 'tecnico_id_fk',
    as: 'tecnico_asociado'
  });

  // Asociaciones Visita - Servicio
  Visita.belongsTo(Servicio, {
    foreignKey: 'servicio_id_fk',
    as: 'servicio'
  });

  Servicio.hasMany(Visita, {
    foreignKey: 'servicio_id_fk',
    as: 'visitas'
  });


  ReporteBombeo.hasMany(EquipoBombeo, { foreignKey: 'reporte_id', as: 'equipos' });
  EquipoBombeo.belongsTo(ReporteBombeo, { foreignKey: 'reporte_id' });

  ReporteBombeo.hasOne(ParametroBombeo, { foreignKey: 'reporte_id', as: 'parametrosLinea' });
  ParametroBombeo.belongsTo(ReporteBombeo, { foreignKey: 'reporte_id' });

  ReporteBombeo.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente_reporte' });
  ReporteBombeo.belongsTo(Tecnico, { foreignKey: 'tecnico_id', as: 'tecnico_reporte' });
  ReporteBombeo.belongsTo(Admin, { foreignKey: 'administrador_id', as: 'administrador_reporte' });
  ReporteBombeo.belongsTo(Visita, { foreignKey: 'visita_id', as: 'visita_reporte' });


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

  AdminModel.Admin.hasMany(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas, {
    foreignKey: 'id_administrador',
    as: 'reportes_mantenimiento'
  });

  ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.belongsTo(AdminModel.Admin, {
    foreignKey: 'id_administrador',
    as: 'administrador'
  });

  console.log('🔗 Asociaciones establecidas correctamente');
};