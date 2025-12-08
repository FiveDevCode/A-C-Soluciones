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
    Solicitud: {
      belongsTo: jest.fn()
    }
  }
}));
jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: {
    Cliente: {
      hasMany: jest.fn()
    }
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
  TecnicoModel: {
    Tecnico: {
      hasMany: jest.fn()
    }
  }
}));
jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: {
    Admin: {
      hasMany: jest.fn()
    }
  }
}));
jest.mock('../../../src/models/servicios.model.js', () => ({
  ServicioModel: {
    Servicio: {
      hasMany: jest.fn()
    }
  }
}));

// Mock de modelos de Reporte Bombeo
jest.mock('../../../src/models/reporte_bombeo.model.js', () => ({
  ReporteBombeoModel: {
    ReporteBombeo: {
      hasMany: jest.fn(),
      hasOne: jest.fn(),
      belongsTo: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/equipoBombeo.model.js', () => ({
  EquipoBombeoModel: {
    EquipoBombeo: {
      belongsTo: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/parametroBombeo.model.js', () => ({
  ParametroBombeoModel: {
    ParametroBombeo: {
      belongsTo: jest.fn()
    }
  }
}));

// Mock de Notificacion
jest.mock('../../../src/models/notificacion.model.js', () => ({
  Notificacion: {
    belongsTo: jest.fn()
  }
}));

// Mock de ReporteMantenimiento
jest.mock('../../../src/models/reporte_mantenimiento.model.js', () => ({
  ReporteMantenimientoModel: {
    ReporteMantenimientoPlantasElectricas: {
      belongsTo: jest.fn()
    },
    ParametrosOperacion: {
      belongsTo: jest.fn()
    },
    VerificacionMantenimiento: {
      belongsTo: jest.fn()
    }
  }
}));

describe('setupAssociations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe configurar todas las asociaciones entre los modelos', () => {
    setupAssociations();

    expect(ClienteModel.Cliente.hasMany).toHaveBeenCalledWith(SolicitudModel.Solicitud, {
      foreignKey: 'cliente_id_fk',
      as: 'solicitudes'
    });

    expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledWith(ClienteModel.Cliente, {
      foreignKey: 'cliente_id_fk',
      as: 'cliente_solicitud'
    });

    expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledWith(AdminModel.Admin, {
      foreignKey: 'admin_id_fk',
      as: 'administrador'
    });

    expect(AdminModel.Admin.hasMany).toHaveBeenCalledWith(SolicitudModel.Solicitud, {
      foreignKey: 'admin_id_fk',
      as: 'solicitudes'
    });

    expect(VisitaModel.belongsTo).toHaveBeenCalledWith(SolicitudModel.Solicitud, {
      foreignKey: 'solicitud_id_fk',
      as: 'solicitud_asociada'
    });

    expect(VisitaModel.belongsTo).toHaveBeenCalledWith(TecnicoModel.Tecnico, {
      foreignKey: 'tecnico_id_fk',
      as: 'tecnico_asociado'
    });

    expect(VisitaModel.belongsTo).toHaveBeenCalledWith(ServicioModel.Servicio, {
      foreignKey: 'servicio_id_fk',
      as: 'servicio'
    });

    expect(ServicioModel.Servicio.hasMany).toHaveBeenCalledWith(VisitaModel.Visita, {
      foreignKey: 'servicio_id_fk',
      as: 'visitas'
    });
  });
});
