import { jest } from '@jest/globals';
import { SolicitudService } from '../../../src/services/solicitud.services.js';
import { SolicitudRepository } from '../../../src/repository/solicitud.repository.js';

jest.mock('../../../src/repository/solicitud.repository.js');

describe('SolicitudService', () => {
  let solicitudService;
  let mockRepository;

  const mockSolicitud = {
    id: 1,
    cliente_id: 1,
    servicio_id: 2,
    estado: 'pendiente'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      crear: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerPorId: jest.fn(),
      obtenerPorCliente: jest.fn(),
      clienteExiste: jest.fn(),
      servicioExiste: jest.fn(),
      actualizarEstado: jest.fn(),
      eliminar: jest.fn()
    };

    SolicitudRepository.mockImplementation(() => mockRepository);
    solicitudService = new SolicitudService();
  });

  describe('crear', () => {
    it('debe llamar a crear del repositorio y devolver el resultado', async () => {
      const data = { cliente_id: 1, servicio_id: 2 };
      mockRepository.crear.mockResolvedValue(mockSolicitud);

      const result = await solicitudService.crear(data);

      expect(mockRepository.crear).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockSolicitud);
    });
  });

  describe('obtenerTodos', () => {
    it('debe devolver todas las solicitudes', async () => {
      const mockSolicitudes = [mockSolicitud];
      mockRepository.obtenerTodos.mockResolvedValue(mockSolicitudes);

      const result = await solicitudService.obtenerTodos();

      expect(mockRepository.obtenerTodos).toHaveBeenCalled();
      expect(result).toEqual(mockSolicitudes);
    });
  });

  describe('obtenerPorId', () => {
    it('debe devolver la solicitud por ID', async () => {
      mockRepository.obtenerPorId.mockResolvedValue(mockSolicitud);

      const result = await solicitudService.obtenerPorId(1);

      expect(mockRepository.obtenerPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSolicitud);
    });

    it('debe devolver null si la solicitud no existe', async () => {
      mockRepository.obtenerPorId.mockResolvedValue(null);

      const result = await solicitudService.obtenerPorId(999);

      expect(mockRepository.obtenerPorId).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('obtenerPorCliente', () => {
    it('debe devolver las solicitudes del cliente', async () => {
      const mockSolicitudes = [mockSolicitud];
      mockRepository.obtenerPorCliente.mockResolvedValue(mockSolicitudes);

      const result = await solicitudService.obtenerPorCliente(1);

      expect(mockRepository.obtenerPorCliente).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSolicitudes);
    });
  });

  describe('clienteExiste', () => {
    it('debe devolver true si el cliente existe', async () => {
      mockRepository.clienteExiste.mockResolvedValue(true);

      const result = await solicitudService.clienteExiste(1);

      expect(mockRepository.clienteExiste).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe devolver false si el cliente no existe', async () => {
      mockRepository.clienteExiste.mockResolvedValue(false);

      const result = await solicitudService.clienteExiste(999);

      expect(mockRepository.clienteExiste).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });
  });

  describe('servicioExiste', () => {
    it('debe devolver true si el servicio existe', async () => {
      mockRepository.servicioExiste.mockResolvedValue(true);

      const result = await solicitudService.servicioExiste(2);

      expect(mockRepository.servicioExiste).toHaveBeenCalledWith(2);
      expect(result).toBe(true);
    });

    it('debe devolver false si el servicio no existe', async () => {
      mockRepository.servicioExiste.mockResolvedValue(false);

      const result = await solicitudService.servicioExiste(999);

      expect(mockRepository.servicioExiste).toHaveBeenCalledWith(999);
      expect(result).toBe(false);
    });
  });

  describe('actualizarEstado', () => {
    it('debe actualizar el estado de la solicitud', async () => {
      const updatedSolicitud = { ...mockSolicitud, estado: 'aceptada' };
      mockRepository.actualizarEstado.mockResolvedValue(updatedSolicitud);

      const result = await solicitudService.actualizarEstado(1, 'aceptada');

      expect(mockRepository.actualizarEstado).toHaveBeenCalledWith(1, 'aceptada');
      expect(result).toEqual(updatedSolicitud);
    });

    it('debe lanzar un error si no encuentra la solicitud', async () => {
      mockRepository.actualizarEstado.mockResolvedValue(null);

      await expect(solicitudService.actualizarEstado(999, 'aceptada')).rejects.toThrow('Solicitud no encontrada');
      expect(mockRepository.actualizarEstado).toHaveBeenCalledWith(999, 'aceptada');
    });
  });

  describe('eliminar', () => {
    it('debe eliminar la solicitud por ID', async () => {
      const deleted = { ...mockSolicitud, estado: 'eliminado' };
      mockRepository.eliminar.mockResolvedValue(deleted);

      const result = await solicitudService.eliminar(1);

      expect(mockRepository.eliminar).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleted);
    });
  });
});
