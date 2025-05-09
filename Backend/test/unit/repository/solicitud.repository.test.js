import { jest } from '@jest/globals';
import { SolicitudRepository } from '../../../src/repository/solicitud.repository.js';
import { SolicitudModel } from '../../../src/models/solicitud.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';

jest.mock('../../../src/models/solicitud.model.js', () => ({
  SolicitudModel: {
    Solicitud: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      belongsTo: jest.fn(), // mock para relaciones
      associations: {
        cliente: {},
        servicio: {},
      },
    },
  },
}));

jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: {
    Cliente: {
      findByPk: jest.fn(),
    },
  },
}));

jest.mock('../../../src/models/servicios.model.js', () => ({
  ServicioModel: {
    Servicio: {
      findByPk: jest.fn(),
    },
  },
}));

describe('SolicitudRepository', () => {
  let solicitudRepository;
  const mockSolicitud = {
    id: 1,
    cliente_id: 1,
    servicio_id: 1,
    estado: 'pendiente',
    update: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true), // Agregar el mock de destroy
  };

  beforeEach(() => {
    solicitudRepository = new SolicitudRepository();
    jest.clearAllMocks();
    // Reset estado property to default before each test
    mockSolicitud.estado = 'pendiente';
  });

  describe('crear', () => {
    it('debe crear una nueva solicitud', async () => {
      jest.spyOn(solicitudRepository, 'clienteExiste').mockResolvedValue(true);
      jest.spyOn(solicitudRepository, 'servicioExiste').mockResolvedValue(true);

      SolicitudModel.Solicitud.create.mockResolvedValue(mockSolicitud);

      const result = await solicitudRepository.crear(mockSolicitud);

      expect(SolicitudModel.Solicitud.create).toHaveBeenCalledWith(mockSolicitud);
      expect(result).toEqual(mockSolicitud);
    });

    it('debe lanzar un error si el cliente o el servicio no existen', async () => {
      jest.spyOn(solicitudRepository, 'clienteExiste').mockResolvedValue(false);
      jest.spyOn(solicitudRepository, 'servicioExiste').mockResolvedValue(true);

      await expect(solicitudRepository.crear(mockSolicitud)).rejects.toThrow('Cliente o servicio no encontrado');
    });
  });

  describe('obtenerTodos', () => {
    it('debe retornar todas las solicitudes', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([mockSolicitud]);

      const result = await solicitudRepository.obtenerTodos();

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockSolicitud]);
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar una solicitud por ID', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(mockSolicitud);

      const result = await solicitudRepository.obtenerPorId(1);

      // Corregir la expectativa para incluir el objeto con relaciones
      expect(SolicitudModel.Solicitud.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({
        include: expect.any(Array),
      }));
      expect(result).toEqual(mockSolicitud);
    });

    it('debe retornar null si no encuentra la solicitud', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(null);

      const result = await solicitudRepository.obtenerPorId(99);

      expect(result).toBeNull();
    });
  });

  describe('obtenerPorCliente', () => {
    it('debe retornar solicitudes por cliente_id', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([mockSolicitud]);
      const result = await solicitudRepository.obtenerPorCliente(1);

      // Actualizar expectativa para incluir todos los parámetros
      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { cliente_id_fk: 1 },
          // No verificamos los valores exactos de include y order, solo que estén presentes
          include: expect.any(Array),
          order: expect.any(Array)
        })
      );
      expect(result).toEqual([mockSolicitud]);
    });
  });

  describe('clienteExiste', () => {
    it('debe retornar true si el cliente existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue({ id: 1 });

      const result = await solicitudRepository.clienteExiste(1);

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe retornar false si el cliente no existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(null);

      const result = await solicitudRepository.clienteExiste(999);

      expect(result).toBe(false);
    });
  });

  describe('servicioExiste', () => {
    it('debe retornar true si el servicio existe', async () => {
      ServicioModel.Servicio.findByPk.mockResolvedValue({ id: 1 });

      const result = await solicitudRepository.servicioExiste(1);

      expect(ServicioModel.Servicio.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe retornar false si el servicio no existe', async () => {
      ServicioModel.Servicio.findByPk.mockResolvedValue(null);

      const result = await solicitudRepository.servicioExiste(999);

      expect(result).toBe(false);
    });
  });

  
});