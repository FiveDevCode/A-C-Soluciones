import { jest } from '@jest/globals';
import { HistorialServicesRepository } from '../../../src/repository/Historial_services.repository.js';
import { sequelize } from '../../../src/database/conexion.js';

jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: 'SELECT'
    }
  }
}));

describe('HistorialServicesRepository', () => {
  let historialServicesRepository;

  const mockHistorial = [
    {
      fecha: '2024-01-15T10:00:00.000Z',
      servicio: 'Mantenimiento de Bomba',
      tecnico: 'Juan Pérez',
      estado: 'completada'
    },
    {
      fecha: '2024-01-10T14:30:00.000Z',
      servicio: 'Reparación Eléctrica',
      tecnico: 'María García',
      estado: 'programada'
    }
  ];

  beforeEach(() => {
    historialServicesRepository = new HistorialServicesRepository();
    jest.clearAllMocks();
  });

  describe('getHistorialServiciosByCliente', () => {
    it('debe retornar el historial de servicios formateado para un cliente', async () => {
      sequelize.query.mockResolvedValue(mockHistorial);

      const result = await historialServicesRepository.getHistorialServiciosByCliente(1);

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        expect.objectContaining({
          replacements: { clienteId: 1 },
          type: sequelize.QueryTypes.SELECT
        })
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('fecha');
      expect(result[0]).toHaveProperty('servicio');
      expect(result[0]).toHaveProperty('tecnico');
      expect(result[0]).toHaveProperty('estado');
    });

    it('debe formatear las fechas correctamente', async () => {
      const historialConFecha = [
        {
          fecha: new Date('2024-01-15T10:00:00.000Z'),
          servicio: 'Mantenimiento',
          tecnico: 'Juan Pérez',
          estado: 'completada'
        }
      ];

      sequelize.query.mockResolvedValue(historialConFecha);

      const result = await historialServicesRepository.getHistorialServiciosByCliente(1);

      expect(result[0].fecha).toBeDefined();
      expect(typeof result[0].fecha).toBe('string');
    });

    it('debe manejar fechas nulas correctamente', async () => {
      const historialSinFecha = [
        {
          fecha: null,
          servicio: 'Mantenimiento',
          tecnico: 'Juan Pérez',
          estado: 'programada'
        }
      ];

      sequelize.query.mockResolvedValue(historialSinFecha);

      const result = await historialServicesRepository.getHistorialServiciosByCliente(1);

      expect(result[0].fecha).toBeNull();
    });

    it('debe retornar un array vacío si no hay servicios', async () => {
      sequelize.query.mockResolvedValue([]);

      const result = await historialServicesRepository.getHistorialServiciosByCliente(999);

      expect(result).toEqual([]);
    });

    it('debe lanzar error si la consulta falla', async () => {
      const error = new Error('Error de base de datos');
      sequelize.query.mockRejectedValue(error);

      await expect(
        historialServicesRepository.getHistorialServiciosByCliente(1)
      ).rejects.toThrow('Error de base de datos');
    });

    it('debe ordenar los resultados por fecha descendente', async () => {
      sequelize.query.mockResolvedValue(mockHistorial);

      await historialServicesRepository.getHistorialServiciosByCliente(1);

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY v.fecha_programada DESC'),
        expect.any(Object)
      );
    });
  });
});

