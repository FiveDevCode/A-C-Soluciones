import { SolicitudModel } from './solicitud.model.js';
import { ClienteModel } from './cliente.model.js';
import { ServicioModel } from './servicios.model.js';
import { VisitaModel } from './visita.model.js';
import { TecnicoModel } from './tecnico.model.js';

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

  // Asociación Solicitud -> Servicio (N:1)
  SolicitudModel.belongsTo(ServicioModel, {
    foreignKey: 'servicio_id_fk',
    as: 'servicio'
  });


  // // Visita N:1 Solicitud
  // VisitaModel.Visita.belongsTo(SolicitudModel.Solicitud, {
  //   foreignKey: 'solicitud_ID',
  //   as: 'solicitud'
  // });

  // Visita N:1 Técnico
  VisitaModel.Visita.belongsTo(TecnicoModel.Tecnico, {
    foreignKey: 'tecnico_id_fk',
    as: 'tecnico'
  });
  console.log('🔗 Asociaciones establecidas correctamente');
};