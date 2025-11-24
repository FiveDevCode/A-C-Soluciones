import { jest } from '@jest/globals';
import { HistorialServicesService } from '../../../src/services/Historial_services.services.js';
import { HistorialServicesRepository } from '../../../src/repository/Historial_services.repository.js';

jest.mock('../../../src/repository/Historial_services.repository.js');

describe('HistorialServicesService', () => {
  let historialServicesService;
  let mockHistorialServicesRepository;

  const mockHistorial = [
    {
      fecha: '2024-01-15T10:00:00.000Z',
      servicio: 'Mantenimiento de Bomba',
      tecnico: 'Juan Pérez',
      estado: 'completada'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockHistorialServicesRepository = {
      getHistorialServiciosByCliente: jest.fn()
    };

    HistorialServicesRepository.mockImplementation(() => mockHistorialServicesRepository);
    historialServicesService = new HistorialServicesService();
  });

  describe('getServiciosByCliente', () => {
    it('debe obtener el historial de servicios para un cliente', async () => {
      const clienteId = 1;
      mockHistorialServicesRepository.getHistorialServiciosByCliente.mockResolvedValue(mockHistorial);

      const result = await historialServicesService.getServiciosByCliente(clienteId);

      expect(mockHistorialServicesRepository.getHistorialServiciosByCliente).toHaveBeenCalledWith(clienteId);
      expect(result).toEqual(mockHistorial);
    });

    it('debe retornar un array vacío si no hay servicios', async () => {
      const clienteId = 999;
      mockHistorialServicesRepository.getHistorialServiciosByCliente.mockResolvedValue([]);

      const result = await historialServicesService.getServiciosByCliente(clienteId);

      expect(result).toEqual([]);
    });

    it('debe propagar errores del repositorio', async () => {
      const clienteId = 1;
      const error = new Error('Error al obtener historial');
      mockHistorialServicesRepository.getHistorialServiciosByCliente.mockRejectedValue(error);

      await expect(
        historialServicesService.getServiciosByCliente(clienteId)
      ).rejects.toThrow('Error al obtener historial');
    });
  });
});

