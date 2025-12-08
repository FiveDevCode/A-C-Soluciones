import { jest } from '@jest/globals';
import { MetricasRepository } from '../../../src/repository/metricas.repository.js';
import { SolicitudModel } from '../../../src/models/solicitud.model.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { VisitaModel } from '../../../src/models/visita.model.js';

// Mock de los modelos
jest.mock('../../../src/models/solicitud.model.js', () => ({
  SolicitudModel: {
    Solicitud: {
      findAll: jest.fn(),
      count: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/servicios.model.js', () => ({
  ServicioModel: {
    Servicio: {
      count: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: {
    Cliente: {
      count: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/tecnico.model.js', () => ({
  TecnicoModel: {
    Tecnico: {
      count: jest.fn()
    }
  }
}));

jest.mock('../../../src/models/visita.model.js', () => ({
  VisitaModel: {
    Visita: {
      findAll: jest.fn()
    }
  }
}));

describe('MetricasRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new MetricasRepository();
    jest.clearAllMocks();
  });

  describe('obtenerServiciosMasSolicitados', () => {
    it('debería obtener servicios más solicitados con relaciones', async () => {
      const mockResult = [
        {
          servicio_id_fk: 1,
          servicio_solicitud: { id: 1, nombre: 'Mantenimiento', descripcion: 'Desc 1' },
          dataValues: { total_solicitudes: 15 }
        },
        {
          servicio_id_fk: 2,
          servicio_solicitud: { id: 2, nombre: 'Reparación', descripcion: 'Desc 2' },
          dataValues: { total_solicitudes: 10 }
        }
      ];

      SolicitudModel.Solicitud.findAll.mockResolvedValue(mockResult);

      const result = await repository.obtenerServiciosMasSolicitados();

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith({
        attributes: expect.arrayContaining(['servicio_id_fk']),
        include: expect.arrayContaining([
          expect.objectContaining({
            model: repository.servicioModel,
            as: 'servicio_solicitud',
            attributes: ['id', 'nombre', 'descripcion']
          })
        ]),
        group: ['servicio_id_fk', 'servicio_solicitud.id'],
        order: expect.any(Array),
        raw: false
      });

      expect(result).toEqual(mockResult);
    });

    it('debería retornar array vacío si no hay servicios', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      const result = await repository.obtenerServiciosMasSolicitados();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerSolicitudesPorEstado', () => {
    it('debería agrupar solicitudes por estado', async () => {
      const mockResult = [
        { estado: 'Pendiente', total: 20 },
        { estado: 'Aprobada', total: 35 },
        { estado: 'Rechazada', total: 5 }
      ];

      SolicitudModel.Solicitud.findAll.mockResolvedValue(mockResult);

      const result = await repository.obtenerSolicitudesPorEstado();

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        group: ['estado'],
        order: expect.any(Array),
        raw: true
      });

      expect(result).toEqual(mockResult);
    });

    it('debería retornar array vacío si no hay solicitudes', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      const result = await repository.obtenerSolicitudesPorEstado();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerClientesMasActivos', () => {
    it('debería obtener clientes más activos con limit por defecto', async () => {
      const mockResult = [
        {
          cliente_id_fk: 1,
          cliente_solicitud: {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            correo_electronico: 'juan@test.com',
            telefono: '1234567890'
          },
          dataValues: { total_solicitudes: 25 }
        },
        {
          cliente_id_fk: 2,
          cliente_solicitud: {
            id: 2,
            nombre: 'Ana',
            apellido: 'García',
            correo_electronico: 'ana@test.com',
            telefono: '0987654321'
          },
          dataValues: { total_solicitudes: 20 }
        }
      ];

      SolicitudModel.Solicitud.findAll.mockResolvedValue(mockResult);

      const result = await repository.obtenerClientesMasActivos();

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith({
        attributes: expect.arrayContaining(['cliente_id_fk']),
        include: expect.arrayContaining([
          expect.objectContaining({
            model: repository.clienteModel,
            as: 'cliente_solicitud',
            attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'telefono']
          })
        ]),
        group: ['cliente_id_fk', 'cliente_solicitud.id'],
        order: expect.any(Array),
        limit: 10,
        raw: false
      });

      expect(result).toEqual(mockResult);
    });

    it('debería respetar el limit personalizado', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      await repository.obtenerClientesMasActivos(5);

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5 })
      );
    });

    it('debería retornar array vacío si no hay clientes', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      const result = await repository.obtenerClientesMasActivos();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerTecnicosMasActivos', () => {
    it('debería obtener técnicos más activos con limit por defecto', async () => {
      const mockResult = [
        {
          tecnico_id_fk: 1,
          tecnico_asociado: {
            id: 1,
            nombre: 'Carlos',
            apellido: 'Ruiz',
            especialidad: 'Electricidad',
            correo_electronico: 'carlos@test.com'
          },
          dataValues: { total_visitas: 50 }
        },
        {
          tecnico_id_fk: 2,
          tecnico_asociado: {
            id: 2,
            nombre: 'María',
            apellido: 'López',
            especialidad: 'Plomería',
            correo_electronico: 'maria@test.com'
          },
          dataValues: { total_visitas: 45 }
        }
      ];

      VisitaModel.Visita.findAll.mockResolvedValue(mockResult);

      const result = await repository.obtenerTecnicosMasActivos();

      expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith({
        attributes: expect.arrayContaining(['tecnico_id_fk']),
        include: expect.arrayContaining([
          expect.objectContaining({
            model: repository.tecnicoModel,
            as: 'tecnico_asociado',
            attributes: ['id', 'nombre', 'apellido', 'especialidad', 'correo_electronico']
          })
        ]),
        group: ['tecnico_id_fk', 'tecnico_asociado.id'],
        order: expect.any(Array),
        limit: 10,
        raw: false
      });

      expect(result).toEqual(mockResult);
    });

    it('debería respetar el limit personalizado', async () => {
      VisitaModel.Visita.findAll.mockResolvedValue([]);

      await repository.obtenerTecnicosMasActivos(3);

      expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 3 })
      );
    });

    it('debería retornar array vacío si no hay técnicos', async () => {
      VisitaModel.Visita.findAll.mockResolvedValue([]);

      const result = await repository.obtenerTecnicosMasActivos();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerEstadisticasGenerales', () => {
    it('debería obtener todas las estadísticas en paralelo', async () => {
      SolicitudModel.Solicitud.count.mockResolvedValue(100);
      ClienteModel.Cliente.count.mockResolvedValue(50);
      TecnicoModel.Tecnico.count.mockResolvedValue(10);
      ServicioModel.Servicio.count.mockResolvedValue(15);

      const result = await repository.obtenerEstadisticasGenerales();

      expect(SolicitudModel.Solicitud.count).toHaveBeenCalled();
      expect(ClienteModel.Cliente.count).toHaveBeenCalled();
      expect(TecnicoModel.Tecnico.count).toHaveBeenCalled();
      expect(ServicioModel.Servicio.count).toHaveBeenCalled();

      expect(result).toEqual({
        total_solicitudes: 100,
        total_clientes: 50,
        total_tecnicos: 10,
        total_servicios: 15
      });
    });

    it('debería retornar conteos en 0 si no hay registros', async () => {
      SolicitudModel.Solicitud.count.mockResolvedValue(0);
      ClienteModel.Cliente.count.mockResolvedValue(0);
      TecnicoModel.Tecnico.count.mockResolvedValue(0);
      ServicioModel.Servicio.count.mockResolvedValue(0);

      const result = await repository.obtenerEstadisticasGenerales();

      expect(result).toEqual({
        total_solicitudes: 0,
        total_clientes: 0,
        total_tecnicos: 0,
        total_servicios: 0
      });
    });

    it('debería manejar errores en Promise.all', async () => {
      SolicitudModel.Solicitud.count.mockRejectedValue(new Error('Database error'));

      await expect(repository.obtenerEstadisticasGenerales()).rejects.toThrow('Database error');
    });
  });

  describe('obtenerVisitasPorEstado', () => {
    it('debería agrupar visitas por estado', async () => {
      const mockResult = [
        { estado: 'Programada', total: 30 },
        { estado: 'Completada', total: 50 },
        { estado: 'Cancelada', total: 10 }
      ];

      VisitaModel.Visita.findAll.mockResolvedValue(mockResult);

      const result = await repository.obtenerVisitasPorEstado();

      expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        group: ['estado'],
        order: expect.any(Array),
        raw: true
      });

      expect(result).toEqual(mockResult);
    });

    it('debería retornar array vacío si no hay visitas', async () => {
      VisitaModel.Visita.findAll.mockResolvedValue([]);

      const result = await repository.obtenerVisitasPorEstado();

      expect(result).toEqual([]);
    });
  });
});
