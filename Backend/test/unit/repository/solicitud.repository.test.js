import { jest } from '@jest/globals';
import { SolicitudRepository } from '../../../src/repository/solicitud.repository.js';
import { SolicitudModel } from '../../../src/models/solicitud.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';
import { AdminModel } from '../../../src/models/administrador.model.js';

// Configuración de mocks
jest.mock('../../../src/models/solicitud.model.js', () => {
  const mockSolicitud = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    belongsTo: jest.fn(),
    associations: {},
  };
  return {
    SolicitudModel: {
      Solicitud: mockSolicitud
    }
  };
});

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

jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: {
    Admin: {
      findByPk: jest.fn(),
    },
  },
}));

describe('SolicitudRepository', () => {
  let solicitudRepository;
  let mockSolicitud;
  const mockCliente = { id: 1, nombre: 'Cliente Test' };
  const mockServicio = { id: 1, nombre: 'Servicio Test' };
  const mockAdmin = { id: 1, nombre: 'Admin Test' };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSolicitud = {
      id: 1,
      cliente_id_fk: 1,
      servicio_id_fk: 1,
      admin_id_fk: 1,
      estado: 'pendiente',
      update: jest.fn().mockImplementation((data) => {
        return Promise.resolve({ ...mockSolicitud, ...data });
      }),
      destroy: jest.fn().mockResolvedValue(true),
    };

    solicitudRepository = new SolicitudRepository();
  });

  describe('setupAssociations', () => {
    it('debe configurar las asociaciones correctamente', () => {
      const repo = new SolicitudRepository();
      
      expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledTimes(3);
      
      expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledWith(
        ClienteModel.Cliente,
        expect.objectContaining({
          foreignKey: 'cliente_id_fk',
          as: 'cliente'
        })
      );
      
      expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledWith(
        ServicioModel.Servicio,
        expect.objectContaining({
          foreignKey: 'servicio_id_fk',
          as: 'servicio'
        })
      );
      
      expect(SolicitudModel.Solicitud.belongsTo).toHaveBeenCalledWith(
        AdminModel.Admin,
        expect.objectContaining({
          foreignKey: 'admin_id_fk',
          as: 'admin'
        })
      );
    });
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

    it('debe lanzar un error si el cliente no existe', async () => {
      jest.spyOn(solicitudRepository, 'clienteExiste').mockResolvedValue(false);
      jest.spyOn(solicitudRepository, 'servicioExiste').mockResolvedValue(true);

      await expect(solicitudRepository.crear(mockSolicitud)).rejects.toThrow('Cliente o servicio no encontrado');
    });

    it('debe lanzar un error si el servicio no existe', async () => {
      jest.spyOn(solicitudRepository, 'clienteExiste').mockResolvedValue(true);
      jest.spyOn(solicitudRepository, 'servicioExiste').mockResolvedValue(false);

      await expect(solicitudRepository.crear(mockSolicitud)).rejects.toThrow('Cliente o servicio no encontrado');
    });
  });

  describe('obtenerTodos', () => {
    it('debe retornar todas las solicitudes con relaciones', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([mockSolicitud]);

      const result = await solicitudRepository.obtenerTodos();

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: ClienteModel.Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'apellido', 'telefono']
          },
          {
            model: AdminModel.Admin,
            as: 'admin',
            attributes: ['id', 'nombre', 'apellido']
          },
          {
            model: ServicioModel.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ],
        order: [['fecha_solicitud', 'DESC']]
      });
      expect(result).toEqual([mockSolicitud]);
    });

    it('debe retornar array vacío si no hay solicitudes', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      const result = await solicitudRepository.obtenerTodos();

      expect(result).toEqual([]);
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar una solicitud por ID con relaciones', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(mockSolicitud);

      const result = await solicitudRepository.obtenerPorId(1);

      expect(SolicitudModel.Solicitud.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: ClienteModel.Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre', 'apellido', 'telefono', 'direccion']
          },
          {
            model: ServicioModel.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre', 'descripcion']
          }
        ]
      });
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

      expect(SolicitudModel.Solicitud.findAll).toHaveBeenCalledWith({
        where: { cliente_id_fk: 1 },
        include: [{
          model: ServicioModel.Servicio,
          as: 'servicio',
          attributes: ['id', 'nombre', 'descripcion']
        }],
        order: [['fecha_solicitud', 'DESC']]
      });
      expect(result).toEqual([mockSolicitud]);
    });

    it('debe retornar array vacío si no hay solicitudes para el cliente', async () => {
      SolicitudModel.Solicitud.findAll.mockResolvedValue([]);

      const result = await solicitudRepository.obtenerPorCliente(1);

      expect(result).toEqual([]);
    });
  });

  describe('clienteExiste', () => {
    it('debe retornar true si el cliente existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);

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
      ServicioModel.Servicio.findByPk.mockResolvedValue(mockServicio);

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

  describe('actualizarEstado', () => {
    it('debe actualizar el estado de una solicitud existente', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(mockSolicitud);

      const result = await solicitudRepository.actualizarEstado(1, 'completado');

      expect(SolicitudModel.Solicitud.findByPk).toHaveBeenCalledWith(1);
      expect(mockSolicitud.update).toHaveBeenCalledWith({ estado: 'completado' });
      expect(result.estado).toBe('completado');
    });

    it('debe retornar null si la solicitud no existe', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(null);

      const result = await solicitudRepository.actualizarEstado(999, 'completado');

      expect(result).toBeNull();
    });
  });

  describe('eliminar', () => {
    it('debe eliminar una solicitud existente', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(mockSolicitud);

      const result = await solicitudRepository.eliminar(1);

      expect(SolicitudModel.Solicitud.findByPk).toHaveBeenCalledWith(1);
      expect(mockSolicitud.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockSolicitud);
    });

    it('debe retornar null si la solicitud no existe', async () => {
      SolicitudModel.Solicitud.findByPk.mockResolvedValue(null);

      const result = await solicitudRepository.eliminar(999);

      expect(result).toBeNull();
    });
  });
});