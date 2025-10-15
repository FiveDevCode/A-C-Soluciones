import { setupAssociations } from '../../../src/models/asociaciones.midel.js';

import { SolicitudModel } from '../../../src/models/solicitud.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { VisitaModel } from '../../../src/models/visita.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';

// Mockeamos los métodos de asociación de Sequelize
jest.mock('../../../src/models/solicitud.model.js', () => ({
  SolicitudModel: {
    belongsTo: jest.fn()
  }
}));
jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: {
    hasMany: jest.fn()
  }
}));
jest.mock('../../../src/models/visita.model.js', () => ({
  VisitaModel: {
    belongsTo: jest.fn(),
    Visita: {
      belongsTo: jest.fn()
    }
  }
}));
jest.mock('../../../src/models/tecnico.model.js', () => ({
  TecnicoModel: {}
}));
jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: {
    hasMany: jest.fn()
  }
}));
jest.mock('../../../src/models/servicios.model.js', () => ({
  ServicioModel: {
    Servicio: {
      hasMany: jest.fn()
    }
  }
}));

describe('setupAssociations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe configurar todas las asociaciones entre los modelos', () => {
    setupAssociations();

    expect(ClienteModel.hasMany).toHaveBeenCalledWith(SolicitudModel, {
      foreignKey: 'cliente_id_fk',
      as: 'solicitudes'
    });

    expect(SolicitudModel.belongsTo).toHaveBeenCalledWith(ClienteModel, {
      foreignKey: 'cliente_id_fk',
      as: 'cliente'
    });

    expect(SolicitudModel.belongsTo).toHaveBeenCalledWith(AdminModel, {
      foreignKey: 'admin_id_fk',
      as: 'administrador'
    });

    expect(AdminModel.hasMany).toHaveBeenCalledWith(SolicitudModel, {
      foreignKey: 'admin_id_fk',
      as: 'solicitudes'
    });

    expect(VisitaModel.belongsTo).toHaveBeenCalledWith(SolicitudModel, {
      foreignKey: 'solicitud_id_fk',
      as: 'solicitud'
    });

    expect(VisitaModel.belongsTo).toHaveBeenCalledWith(TecnicoModel, {
      foreignKey: 'tecnico_id_fk',
      as: 'tecnico'
    });

    expect(VisitaModel.Visita.belongsTo).toHaveBeenCalledWith(ServicioModel.Servicio, {
      foreignKey: 'servicio_id_fk',
      as: 'servicio'
    });

    expect(ServicioModel.Servicio.hasMany).toHaveBeenCalledWith(VisitaModel.Visita, {
      foreignKey: 'servicio_id_fk',
      as: 'visitas'
    });
  });
});
