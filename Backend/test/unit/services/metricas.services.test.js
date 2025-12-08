import { MetricasService } from '../../../src/services/metricas.services.js';
import { MetricasRepository } from '../../../src/repository/metricas.repository.js';

jest.mock('../../../src/repository/metricas.repository.js');

describe('MetricasService', () => {
  let service;

  beforeEach(() => {
    service = new MetricasService();
    jest.clearAllMocks();
  });

  describe('obtenerServiciosMasSolicitados', () => {
    it('debería transformar datos del repository correctamente', async () => {
      const mockRepositoryData = [
        {
          servicio_id_fk: 1,
          servicio_solicitud: { nombre: 'Mantenimiento', descripcion: 'Servicio de mantenimiento' },
          dataValues: { total_solicitudes: 15 }
        },
        {
          servicio_id_fk: 2,
          servicio_solicitud: { nombre: 'Reparación', descripcion: 'Servicio de reparación' },
          dataValues: { total_solicitudes: 10 }
        }
      ];

      service.metricasRepository.obtenerServiciosMasSolicitados.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerServiciosMasSolicitados();

      expect(service.metricasRepository.obtenerServiciosMasSolicitados).toHaveBeenCalled();
      expect(result).toEqual([
        {
          servicio_id: 1,
          nombre: 'Mantenimiento',
          descripcion: 'Servicio de mantenimiento',
          total_solicitudes: 15
        },
        {
          servicio_id: 2,
          nombre: 'Reparación',
          descripcion: 'Servicio de reparación',
          total_solicitudes: 10
        }
      ]);
    });

    it('debería manejar servicios sin nombre o descripción', async () => {
      const mockRepositoryData = [
        {
          servicio_id_fk: 1,
          servicio_solicitud: null,
          dataValues: { total_solicitudes: 5 }
        }
      ];

      service.metricasRepository.obtenerServiciosMasSolicitados.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerServiciosMasSolicitados();

      expect(result).toEqual([
        {
          servicio_id: 1,
          nombre: 'Sin nombre',
          descripcion: '',
          total_solicitudes: 5
        }
      ]);
    });

    it('debería manejar total_solicitudes faltante', async () => {
      const mockRepositoryData = [
        {
          servicio_id_fk: 1,
          servicio_solicitud: { nombre: 'Test', descripcion: 'Test desc' },
          dataValues: {}
        }
      ];

      service.metricasRepository.obtenerServiciosMasSolicitados.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerServiciosMasSolicitados();

      expect(result[0].total_solicitudes).toBe(0);
    });
  });

  describe('obtenerSolicitudesPorEstado', () => {
    it('debería transformar estados correctamente', async () => {
      const mockRepositoryData = [
        { estado: 'Pendiente', total: '20' },
        { estado: 'Aprobada', total: '35' },
        { estado: 'Rechazada', total: '5' }
      ];

      service.metricasRepository.obtenerSolicitudesPorEstado.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerSolicitudesPorEstado();

      expect(service.metricasRepository.obtenerSolicitudesPorEstado).toHaveBeenCalled();
      expect(result).toEqual([
        { estado: 'Pendiente', total: 20 },
        { estado: 'Aprobada', total: 35 },
        { estado: 'Rechazada', total: 5 }
      ]);
    });

    it('debería retornar array vacío si no hay datos', async () => {
      service.metricasRepository.obtenerSolicitudesPorEstado.mockResolvedValue([]);

      const result = await service.obtenerSolicitudesPorEstado();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerClientesMasActivos', () => {
    it('debería transformar datos de clientes correctamente con limit por defecto', async () => {
      const mockRepositoryData = [
        {
          cliente_id_fk: 1,
          cliente_solicitud: {
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
            nombre: 'Ana',
            apellido: 'García',
            correo_electronico: 'ana@test.com',
            telefono: '0987654321'
          },
          dataValues: { total_solicitudes: 20 }
        }
      ];

      service.metricasRepository.obtenerClientesMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerClientesMasActivos();

      expect(service.metricasRepository.obtenerClientesMasActivos).toHaveBeenCalledWith(10);
      expect(result).toEqual([
        {
          cliente_id: 1,
          nombre: 'Juan Pérez',
          email: 'juan@test.com',
          telefono: '1234567890',
          total_solicitudes: 25
        },
        {
          cliente_id: 2,
          nombre: 'Ana García',
          email: 'ana@test.com',
          telefono: '0987654321',
          total_solicitudes: 20
        }
      ]);
    });

    it('debería usar limit personalizado cuando se proporciona', async () => {
      service.metricasRepository.obtenerClientesMasActivos.mockResolvedValue([]);

      await service.obtenerClientesMasActivos(5);

      expect(service.metricasRepository.obtenerClientesMasActivos).toHaveBeenCalledWith(5);
    });

    it('debería manejar clientes sin apellido', async () => {
      const mockRepositoryData = [
        {
          cliente_id_fk: 1,
          cliente_solicitud: {
            nombre: 'Juan',
            apellido: null,
            correo_electronico: 'juan@test.com',
            telefono: '1234567890'
          },
          dataValues: { total_solicitudes: 10 }
        }
      ];

      service.metricasRepository.obtenerClientesMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerClientesMasActivos();

      expect(result[0].nombre).toBe('Juan');
    });

    it('debería manejar cliente_solicitud nulo', async () => {
      const mockRepositoryData = [
        {
          cliente_id_fk: 1,
          cliente_solicitud: null,
          dataValues: { total_solicitudes: 5 }
        }
      ];

      service.metricasRepository.obtenerClientesMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerClientesMasActivos();

      expect(result[0].nombre).toBe('Sin nombre');
      expect(result[0].email).toBe('');
      expect(result[0].telefono).toBe('');
    });
  });

  describe('obtenerTecnicosMasActivos', () => {
    it('debería transformar datos de técnicos correctamente con limit por defecto', async () => {
      const mockRepositoryData = [
        {
          tecnico_id_fk: 1,
          tecnico_asociado: {
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
            nombre: 'María',
            apellido: 'López',
            especialidad: 'Plomería',
            correo_electronico: 'maria@test.com'
          },
          dataValues: { total_visitas: 45 }
        }
      ];

      service.metricasRepository.obtenerTecnicosMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerTecnicosMasActivos();

      expect(service.metricasRepository.obtenerTecnicosMasActivos).toHaveBeenCalledWith(10);
      expect(result).toEqual([
        {
          tecnico_id: 1,
          nombre: 'Carlos Ruiz',
          especialidad: 'Electricidad',
          email: 'carlos@test.com',
          total_visitas: 50
        },
        {
          tecnico_id: 2,
          nombre: 'María López',
          especialidad: 'Plomería',
          email: 'maria@test.com',
          total_visitas: 45
        }
      ]);
    });

    it('debería usar limit personalizado cuando se proporciona', async () => {
      service.metricasRepository.obtenerTecnicosMasActivos.mockResolvedValue([]);

      await service.obtenerTecnicosMasActivos(3);

      expect(service.metricasRepository.obtenerTecnicosMasActivos).toHaveBeenCalledWith(3);
    });

    it('debería manejar técnicos sin apellido', async () => {
      const mockRepositoryData = [
        {
          tecnico_id_fk: 1,
          tecnico_asociado: {
            nombre: 'Carlos',
            apellido: null,
            especialidad: 'Electricidad',
            correo_electronico: 'carlos@test.com'
          },
          dataValues: { total_visitas: 30 }
        }
      ];

      service.metricasRepository.obtenerTecnicosMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerTecnicosMasActivos();

      expect(result[0].nombre).toBe('Carlos');
    });

    it('debería manejar tecnico_asociado nulo', async () => {
      const mockRepositoryData = [
        {
          tecnico_id_fk: 1,
          tecnico_asociado: null,
          dataValues: { total_visitas: 10 }
        }
      ];

      service.metricasRepository.obtenerTecnicosMasActivos.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerTecnicosMasActivos();

      expect(result[0].nombre).toBe('Sin nombre');
      expect(result[0].especialidad).toBe('');
      expect(result[0].email).toBe('');
    });
  });

  describe('obtenerEstadisticasGenerales', () => {
    it('debería retornar estadísticas sin transformación', async () => {
      const mockEstadisticas = {
        total_solicitudes: 100,
        total_clientes: 50,
        total_tecnicos: 10,
        total_servicios: 15
      };

      service.metricasRepository.obtenerEstadisticasGenerales.mockResolvedValue(mockEstadisticas);

      const result = await service.obtenerEstadisticasGenerales();

      expect(service.metricasRepository.obtenerEstadisticasGenerales).toHaveBeenCalled();
      expect(result).toEqual(mockEstadisticas);
    });
  });

  describe('obtenerVisitasPorEstado', () => {
    it('debería transformar estados de visitas correctamente', async () => {
      const mockRepositoryData = [
        { estado: 'Programada', total: '30' },
        { estado: 'Completada', total: '50' },
        { estado: 'Cancelada', total: '10' }
      ];

      service.metricasRepository.obtenerVisitasPorEstado.mockResolvedValue(mockRepositoryData);

      const result = await service.obtenerVisitasPorEstado();

      expect(service.metricasRepository.obtenerVisitasPorEstado).toHaveBeenCalled();
      expect(result).toEqual([
        { estado: 'Programada', total: 30 },
        { estado: 'Completada', total: 50 },
        { estado: 'Cancelada', total: 10 }
      ]);
    });

    it('debería retornar array vacío si no hay datos', async () => {
      service.metricasRepository.obtenerVisitasPorEstado.mockResolvedValue([]);

      const result = await service.obtenerVisitasPorEstado();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerDashboardCompleto', () => {
    it('debería obtener todas las métricas en paralelo', async () => {
      const mockEstadisticas = { total_solicitudes: 100, total_clientes: 50 };

      service.metricasRepository.obtenerServiciosMasSolicitados.mockResolvedValue([
        {
          servicio_id_fk: 1,
          servicio_solicitud: { nombre: 'Test', descripcion: '' },
          dataValues: { total_solicitudes: 5 }
        }
      ]);
      service.metricasRepository.obtenerSolicitudesPorEstado.mockResolvedValue([
        { estado: 'Pendiente', total: '10' }
      ]);
      service.metricasRepository.obtenerClientesMasActivos.mockResolvedValue([
        {
          cliente_id_fk: 1,
          cliente_solicitud: { nombre: 'Juan', apellido: '', correo_electronico: '', telefono: '' },
          dataValues: { total_solicitudes: 15 }
        }
      ]);
      service.metricasRepository.obtenerTecnicosMasActivos.mockResolvedValue([
        {
          tecnico_id_fk: 1,
          tecnico_asociado: { nombre: 'Carlos', apellido: '', especialidad: '', correo_electronico: '' },
          dataValues: { total_visitas: 20 }
        }
      ]);
      service.metricasRepository.obtenerEstadisticasGenerales.mockResolvedValue(mockEstadisticas);
      service.metricasRepository.obtenerVisitasPorEstado.mockResolvedValue([
        { estado: 'Completada', total: '25' }
      ]);

      const result = await service.obtenerDashboardCompleto();

      expect(result).toEqual({
        servicios_mas_solicitados: [
          {
            servicio_id: 1,
            nombre: 'Test',
            descripcion: '',
            total_solicitudes: 5
          }
        ],
        solicitudes_por_estado: [
          { estado: 'Pendiente', total: 10 }
        ],
        clientes_mas_activos: [
          {
            cliente_id: 1,
            nombre: 'Juan',
            email: '',
            telefono: '',
            total_solicitudes: 15
          }
        ],
        tecnicos_mas_activos: [
          {
            tecnico_id: 1,
            nombre: 'Carlos',
            especialidad: '',
            email: '',
            total_visitas: 20
          }
        ],
        estadisticas_generales: mockEstadisticas,
        visitas_por_estado: [
          { estado: 'Completada', total: 25 }
        ]
      });

      // Verificar que se llamaron los métodos del repositorio con los parámetros correctos
      expect(service.metricasRepository.obtenerClientesMasActivos).toHaveBeenCalledWith(5);
      expect(service.metricasRepository.obtenerTecnicosMasActivos).toHaveBeenCalledWith(5);
    });

    it('debería manejar errores en Promise.all correctamente', async () => {
      service.metricasRepository.obtenerServiciosMasSolicitados.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.obtenerDashboardCompleto()).rejects.toThrow('Database error');
    });
  });
});
