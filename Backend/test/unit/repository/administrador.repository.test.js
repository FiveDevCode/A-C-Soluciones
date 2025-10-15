import { jest } from '@jest/globals';
import { AdminRepository } from '../../../src/repository/administrador.repository.js';
import { AdminModel } from '../../../src/models/administrador.model.js';

jest.mock('../../../src/models/administrador.model.js', () => {
  return {
    AdminModel: {
      Admin: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn().mockResolvedValue(true),
      },
    },
  };
});

describe('AdminRepository', () => {
  let adminRepository;
  let mockAdmin;

  beforeEach(() => {
    adminRepository = new AdminRepository();
    
    mockAdmin = {
      id: 1,
      nombre: 'Admin',
      apellido: 'Principal',
      numero_cedula: '987654321',
      correo_electronico: 'admin@example.com',
      telefono: '3001234567',
      estado: 'activo',
      update: jest.fn().mockImplementation(async (data) => {
        Object.assign(mockAdmin, data);
        return mockAdmin;
      }),
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  describe('crearAdmin', () => {
    it('debe crear un nuevo administrador', async () => {
      AdminModel.Admin.create.mockResolvedValue(mockAdmin);

      const result = await adminRepository.crearAdmin(mockAdmin);

      expect(AdminModel.Admin.create).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdminPorId', () => {
    it('debe retornar un administrador por ID', async () => {
      AdminModel.Admin.findByPk.mockResolvedValue(mockAdmin);

      const result = await adminRepository.obtenerAdminPorId(1);

      expect(AdminModel.Admin.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAdmin);
    });

    it('debe retornar null si no encuentra el administrador', async () => {
      AdminModel.Admin.findByPk.mockResolvedValue(null);

      const result = await adminRepository.obtenerAdminPorId(99);

      expect(result).toBeNull();
    });
  });

  describe('obtenerAdminPorCedula', () => {
    it('debe retornar un administrador por número de cédula', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(mockAdmin);

      const result = await adminRepository.obtenerAdminPorCedula(mockAdmin.numero_cedula);

      expect(AdminModel.Admin.findOne).toHaveBeenCalledWith({
        where: { numero_cedula: mockAdmin.numero_cedula },
      });
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdminPorCorreo', () => {
    it('debe retornar un administrador por correo electrónico', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(mockAdmin);

      const result = await adminRepository.obtenerAdminPorCorreo(mockAdmin.correo_electronico);

      expect(AdminModel.Admin.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: mockAdmin.correo_electronico },
      });
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdmins', () => {
    it('debe retornar todos los administradores', async () => {
      AdminModel.Admin.findAll.mockResolvedValue([mockAdmin]);

      const result = await adminRepository.obtenerAdmins();

      expect(AdminModel.Admin.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockAdmin]);
    });
  });

  describe('actualizarAdmin', () => {
    it('debe actualizar los datos del administrador', async () => {
      AdminModel.Admin.findByPk.mockResolvedValue(mockAdmin);
      const nuevosDatos = { nombre: 'Super Admin' };

      const result = await adminRepository.actualizarAdmin(1, nuevosDatos);

      expect(AdminModel.Admin.findByPk).toHaveBeenCalledWith(1);
      expect(mockAdmin.update).toHaveBeenCalledWith(nuevosDatos);
      expect(result.nombre).toBe('Super Admin');
    });

    it('debe retornar null si el administrador no existe', async () => {
      AdminModel.Admin.findByPk.mockResolvedValue(null);

      const result = await adminRepository.actualizarAdmin(999, { nombre: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('eliminarAdmin', () => {
    it('debe cambiar estado a inactivo si el admin está activo', async () => {
      AdminModel.Admin.findByPk.mockResolvedValue(mockAdmin);

      const result = await adminRepository.eliminarAdmin(1);

      expect(AdminModel.Admin.findByPk).toHaveBeenCalledWith(1);
      expect(mockAdmin.estado).toBe('inactivo');
      expect(mockAdmin.save).toHaveBeenCalled();
      expect(AdminModel.Admin.destroy).not.toHaveBeenCalled();
      expect(result).toEqual(mockAdmin);
    });

    });
});