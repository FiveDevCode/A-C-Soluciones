// tests/unit/services/admin.service.test.js
import { jest } from '@jest/globals';
import { AdminService } from '../../../src/services/administrador.services.js';
import { AdminRepository } from '../../../src/repository/administrador.repository.js';

jest.mock('../../../src/repository/administrador.repository.js');

describe('AdminService', () => {
  let adminService;
  let mockAdminRepository;

  const mockAdmin = {
    id: 1,
    nombre: 'Ana',
    apellido: 'Gómez',
    numero_de_cedula: '1006735412',
    correo_electronico: 'ana.gomez@example.com',
    estado: 'activo'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockAdminRepository = {
      crearAdmin: jest.fn(),
      obtenerAdminPorId: jest.fn(),
      obtenerAdminPorCedula: jest.fn(),
      obtenerAdminPorCorreo: jest.fn(),
      obtenerAdmins: jest.fn(),
      actualizarAdmin: jest.fn(),
      eliminarAdmin: jest.fn()
    };

    AdminRepository.mockImplementation(() => mockAdminRepository);
    adminService = new AdminService();
  });

  describe('crearAdmin', () => {
    it('debe crear un administrador y devolver el resultado', async () => {
      const adminData = { nombre: 'Ana', correo_electronico: 'ana@example.com' };
      mockAdminRepository.crearAdmin.mockResolvedValue(mockAdmin);

      const result = await adminService.crearAdmin(adminData);

      expect(mockAdminRepository.crearAdmin).toHaveBeenCalledWith(adminData);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdminPorId', () => {
    it('debe devolver el administrador correspondiente al ID', async () => {
      const id = 1;
      mockAdminRepository.obtenerAdminPorId.mockResolvedValue(mockAdmin);

      const result = await adminService.obtenerAdminPorId(id);

      expect(mockAdminRepository.obtenerAdminPorId).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdminPorCedula', () => {
    it('debe devolver el administrador correspondiente a la cédula', async () => {
      const cedula = '0987654321';
      mockAdminRepository.obtenerAdminPorCedula.mockResolvedValue(mockAdmin);

      const result = await adminService.obtenerAdminPorCedula(cedula);

      expect(mockAdminRepository.obtenerAdminPorCedula).toHaveBeenCalledWith(cedula);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdminPorCorreo', () => {
    it('debe devolver el administrador correspondiente al correo', async () => {
      const correo = 'ana.gomez@example.com';
      mockAdminRepository.obtenerAdminPorCorreo.mockResolvedValue(mockAdmin);

      const result = await adminService.obtenerAdminPorCorreo(correo);

      expect(mockAdminRepository.obtenerAdminPorCorreo).toHaveBeenCalledWith(correo);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('obtenerAdmins', () => {
    it('debe devolver todos los administradores', async () => {
      const mockAdmins = [mockAdmin];
      mockAdminRepository.obtenerAdmins.mockResolvedValue(mockAdmins);

      const result = await adminService.obtenerAdmins();

      expect(mockAdminRepository.obtenerAdmins).toHaveBeenCalled();
      expect(result).toEqual(mockAdmins);
    });
  });

  describe('actualizarAdmin', () => {
    it('debe actualizar un administrador y devolver el resultado', async () => {
      const data = { nombre: 'Ana Actualizada' };
      const actualizado = { ...mockAdmin, ...data };
      mockAdminRepository.actualizarAdmin.mockResolvedValue(actualizado);

      const result = await adminService.actualizarAdmin(1, data);

      expect(mockAdminRepository.actualizarAdmin).toHaveBeenCalledWith(1, data);
      expect(result).toEqual(actualizado);
    });
  });

  describe('eliminarAdmin', () => {
    it('debe eliminar un administrador y devolverlo si existe', async () => {
      mockAdminRepository.eliminarAdmin.mockResolvedValue(mockAdmin);

      const result = await adminService.eliminarAdmin(1);

      expect(mockAdminRepository.eliminarAdmin).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAdmin);
    });
  });
});
