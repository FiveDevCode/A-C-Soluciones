import { AdminController } from '../../../src/controllers/administrador.controller.js';
import { AdminService } from '../../../src/services/administrador.services.js';
import { ValidationError } from 'sequelize';

// Mock del servicio
jest.mock('../../../src/services/administrador.services.js', () => ({
  AdminService: jest.fn().mockImplementation(() => ({
    obtenerAdminPorCedula: jest.fn(),
    obtenerAdminPorCorreo: jest.fn(),
    crearAdmin: jest.fn(),
    obtenerAdminPorId: jest.fn(),
    obtenerAdmins: jest.fn(),
    actualizarAdmin: jest.fn(),
    eliminarAdmin: jest.fn(),
    autenticarAdmin: jest.fn(),
  })),
}));

describe(' AdminController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new AdminController();
    mockService = controller.adminService;
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // crearAdmin
  // -------------------------------------------------------------------------
  describe('crearAdmin', () => {
    it('debería devolver 400 si ya existe admin por cédula o correo', async () => {
      mockService.obtenerAdminPorCedula.mockResolvedValue({ id: 1 });
      mockService.obtenerAdminPorCorreo.mockResolvedValue(null);
      mockReq.body = { numero_cedula: '1002981673', correo_electronico: 'admin@empresa.com' };

      await controller.crearAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'El administrador ya está registrado (cédula o correo en uso)',
      });
    });

    it('debería crear un admin correctamente', async () => {
      const nuevo = { id: 2, nombre: 'Jonier', correo_electronico: 'jonier@empresa.com' };
      mockService.obtenerAdminPorCedula.mockResolvedValue(null);
      mockService.obtenerAdminPorCorreo.mockResolvedValue(null);
      mockService.crearAdmin.mockResolvedValue(nuevo);
      mockReq.body = {
        numero_cedula: '1002981673',
        correo_electronico: 'jonier@empresa.com',
        contrasenia: 'Jonier12@',
        nombre: 'Jonier',
      };

      await controller.crearAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Administrador creado exitosamente',
        data: nuevo,
      });
    });

    it('debería manejar ValidationError', async () => {
      const error = new ValidationError('Error');
      error.errors = [{ path: 'correo_electronico', message: 'Correo inválido' }];
      mockService.obtenerAdminPorCedula.mockRejectedValue(error);

      await controller.crearAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { correo_electronico: 'Correo inválido' },
      });
    });

    it('debería manejar error genérico 500', async () => {
      mockService.obtenerAdminPorCedula.mockRejectedValue(new Error('DB error'));

      await controller.crearAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al crear el administrador' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // obtenerAdminPorId
  // -------------------------------------------------------------------------
  describe('obtenerAdminPorId', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.obtenerAdminPorId.mockResolvedValue(null);
      mockReq.params.id = '1';

      await controller.obtenerAdminPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debería devolver admin sin contraseña', async () => {
      const mockAdmin = { get: () => ({ id: 1, nombre: 'Pedro', contrasenia: 'Jonier12@' }) };
      mockService.obtenerAdminPorId.mockResolvedValue(mockAdmin);
      mockReq.params.id = '1';

      await controller.obtenerAdminPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const data = mockRes.json.mock.calls[0][0];
      expect(data.contrasenia).toBeUndefined();
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerAdminPorId.mockRejectedValue(new Error('DB error'));
      mockReq.params.id = '1';

      await controller.obtenerAdminPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al obtener el administrador' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // obtenerAdminPorCedula
  // -------------------------------------------------------------------------
  describe('obtenerAdminPorCedula', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.obtenerAdminPorCedula.mockResolvedValue(null);
      mockReq.params.numero_cedula = '1002981673';

      await controller.obtenerAdminPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debería devolver admin si existe', async () => {
      const admin = { id: 1, nombre: 'Carlos', numero_cedula: '1002981673' };
      mockService.obtenerAdminPorCedula.mockResolvedValue(admin);
      mockReq.params.numero_cedula = '1002981673';

      await controller.obtenerAdminPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ admin });
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerAdminPorCedula.mockRejectedValue(new Error('Error DB'));

      await controller.obtenerAdminPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error al obtener el administrador',
      });
    });
  });

  // -------------------------------------------------------------------------
  // obtenerAdminPorCorreo
  // -------------------------------------------------------------------------
  describe('obtenerAdminPorCorreo', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.obtenerAdminPorCorreo.mockResolvedValue(null);
      mockReq.params.correo_electronico = 'noexiste@empresa.com';

      await controller.obtenerAdminPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debería devolver admin sin contraseña', async () => {
      const mockAdmin = { get: () => ({ id: 1, nombre: 'Ana', contrasenia: 'Jonier12@' }) };
      mockService.obtenerAdminPorCorreo.mockResolvedValue(mockAdmin);
      mockReq.params.correo_electronico = 'ana@empresa.com';

      await controller.obtenerAdminPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const data = mockRes.json.mock.calls[0][0];
      expect(data.contrasenia).toBeUndefined();
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerAdminPorCorreo.mockRejectedValue(new Error('Error DB'));

      await controller.obtenerAdminPorCorreo(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al buscar administrador por correo' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // obtenerAdmins
  // -------------------------------------------------------------------------
  describe('obtenerAdmins', () => {
    it('debería devolver lista sin contraseñas', async () => {
      const admins = [
        { get: () => ({ id: 1, contrasenia: 'Jonier12@' }) },
        { get: () => ({ id: 2, contrasenia: 'OtraPass99!' }) },
      ];
      mockService.obtenerAdmins.mockResolvedValue(admins);

      await controller.obtenerAdmins(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const data = mockRes.json.mock.calls[0][0];
      expect(data.every(a => a.contrasenia === undefined)).toBe(true);
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerAdmins.mockRejectedValue(new Error('Error DB'));

      await controller.obtenerAdmins(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al obtener los administradores' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // actualizarAdmin
  // -------------------------------------------------------------------------
  describe('actualizarAdmin', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.actualizarAdmin.mockResolvedValue(null);
      mockReq.params.id = '1';

      await controller.actualizarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debería actualizar admin correctamente', async () => {
      const mockAdmin = {
        get: () => ({
          id: 1,
          nombre: 'Actualizado',
          contrasenia: 'Jonier12@',
        }),
      };
      mockService.actualizarAdmin.mockResolvedValue(mockAdmin);
      mockReq.params.id = '1';

      await controller.actualizarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Administrador actualizado correctamente' })
      );
    });

    it('debería manejar ValidationError', async () => {
      const error = new ValidationError('Error');
      error.errors = [{ path: 'nombre', message: 'Nombre inválido' }];
      mockService.actualizarAdmin.mockRejectedValue(error);

      await controller.actualizarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ errors: { nombre: 'Nombre inválido' } });
    });

    it('debería manejar error genérico 500', async () => {
      mockService.actualizarAdmin.mockRejectedValue(new Error('DB error'));

      await controller.actualizarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al actualizar el administrador' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // eliminarAdmin
  // -------------------------------------------------------------------------
  describe('eliminarAdmin', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.eliminarAdmin.mockResolvedValue(false);
      mockReq.params.id = '1';

      await controller.eliminarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debería eliminar correctamente', async () => {
      mockService.eliminarAdmin.mockResolvedValue(true);
      mockReq.params.id = '1';

      await controller.eliminarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Administrador desactivado correctamente',
      });
    });

    it('debería manejar error 500', async () => {
      mockService.eliminarAdmin.mockRejectedValue(new Error('Error DB'));

      await controller.eliminarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error al desactivar el administrador' })
      );
    });
  });

  // -------------------------------------------------------------------------
  // autenticarAdmin
  // -------------------------------------------------------------------------
  describe('autenticarAdmin', () => {
    it('debería autenticar correctamente', async () => {
      const admin = {
        id: 1,
        nombre: 'Jonier',
        correo_electronico: 'jonier@empresa.com',
        rol: 'admin',
      };
      mockService.autenticarAdmin.mockResolvedValue(admin);
      mockReq.body = { correo_electronico: 'jonier@empresa.com', contrasenia: 'Jonier12@' };

      await controller.autenticarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const data = mockRes.json.mock.calls[0][0];
      expect(data.token).toBeDefined();
      expect(data.admin.nombre).toBe('Jonier');
    });

    it('debería manejar error 401 si falla autenticación', async () => {
      mockService.autenticarAdmin.mockRejectedValue(new Error('Credenciales inválidas'));
      mockReq.body = { correo_electronico: 'jonier@empresa.com', contrasenia: 'Jonier12@' };

      await controller.autenticarAdmin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error de autenticación' })
      );
    });
  });
});
