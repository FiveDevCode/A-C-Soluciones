import { SolicitudModel } from './solicitud.model.js';
import { ClienteModel } from './cliente.model.js';
import { ServicioModel } from './servicios.model.js';
import { VisitaModel } from './visita.model.js';
import { TecnicoModel } from './tecnico.model.js';
import { AdminModel } from './administrador.model.js';

export const setupAssociations = () => {
  // Asociación Cliente -> Solicitud (1:N)
  ClienteModel.hasMany(SolicitudModel, {
    foreignKey: 'cliente_id_fk',
    as: 'solicitudes'
  });

  // Asociación Solicitud -> Cliente (N:1)
  SolicitudModel.belongsTo(ClienteModel, {
    foreignKey: 'cliente_id_fk',
    as: 'cliente'
  });

  // Asociación Solicitud -> Administrador (N:1)
  SolicitudModel.belongsTo(AdminModel, {
    foreignKey: 'admin_id_fk',
    as: 'administrador'
  });

  // Asociación Administrador -> Solicitudes (1:N)
  AdminModel.hasMany(SolicitudModel, {
    foreignKey: 'admin_id_fk',
    as: 'solicitudes'
  });

  // Relación entre Visita y Solicitud (N:1)
  VisitaModel.belongsTo(SolicitudModel, {
    foreignKey: 'solicitud_id_fk',
    as: 'solicitud'
  });

  // Relación entre Visita y Técnico (N:1)
  VisitaModel.belongsTo(TecnicoModel, {
    foreignKey: 'tecnico_id_fk',
    as: 'tecnico'
  });

  console.log('🔗 Asociaciones establecidas correctamente');
};
