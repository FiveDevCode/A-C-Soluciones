import { jest } from '@jest/globals';
import { HistorialServicesController } from '../../../src/controllers/Historial_services.controller.js';
import { HistorialServicesService } from '../../../src/services/Historial_services.services.js';

jest.mock('../../../src/services/Historial_services.services.js');

describe('HistorialServicesController', () => {
  let historialServicesController;
  let req, res;

  const mockHistorial = [
    {
      fecha: '2024-01-15T10:00:00.000Z',
      servicio: 'Mantenimiento de Bomba',
      tecnico: 'Juan Pérez',
      estado: 'completada'
    }
  ];

  beforeEach(() => {
    req = {
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    historialServicesController = new HistorialServicesController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getServiciosByCliente', () => {
    it('debe retornar el historial de servicios exitosamente', async () => {
      req.params.clienteId = '1';
      HistorialServicesService.prototype.getServiciosByCliente.mockResolvedValue(mockHistorial);

      await historialServicesController.getServiciosByCliente(req, res);

      expect(HistorialServicesService.prototype.getServiciosByCliente).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHistorial
      });
    });

    it('debe retornar un array vacío si no hay servicios', async () => {
      req.params.clienteId = '999';
      HistorialServicesService.prototype.getServiciosByCliente.mockResolvedValue([]);

      await historialServicesController.getServiciosByCliente(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });

    it('debe manejar errores y retornar status 500', async () => {
      req.params.clienteId = '1';
      const error = new Error('Error al obtener historial');
      HistorialServicesService.prototype.getServiciosByCliente.mockRejectedValue(error);

      await historialServicesController.getServiciosByCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener historial'
      });
    });

    it('debe convertir clienteId a string si viene como número', async () => {
      req.params.clienteId = 1;
      HistorialServicesService.prototype.getServiciosByCliente.mockResolvedValue(mockHistorial);

      await historialServicesController.getServiciosByCliente(req, res);

      expect(HistorialServicesService.prototype.getServiciosByCliente).toHaveBeenCalledWith(1);
    });
  });
});

