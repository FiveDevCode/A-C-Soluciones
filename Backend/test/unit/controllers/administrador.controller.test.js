// test/unit/controllers/administrador.controller.test.js
import { AdminController } from '../../../src/controllers/administrador.controller.js';
import { AdminService } from '../../../src/services/administrador.services.js';
import { ValidationError } from 'sequelize';

const mockAdminService = {
  obtenerAdminPorCedula: jest.fn(),
  obtenerAdminPorCorreo: jest.fn(),
  crearAdmin: jest.fn(),
  obtenerAdminPorId: jest.fn(),
  obtenerAdmins: jest.fn(),
  actualizarAdmin: jest.fn(),
  eliminarAdmin: jest.fn(),
  autenticarAdmin: jest.fn()
};

jest.mock('../../../src/services/administrador.services.js', () => {
  return {
    AdminService: jest.fn().mockImplementation(() => mockAdminService)
  };
});

describe('AdminController', () => {
  let req, res, adminController;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    adminController = new AdminController();
    
    jest.clearAllMocks();
  });

  describe('crearAdmin', () => {
    it('debe crear un administrador si no existe', async () => {
      req.body = { 
        numero_cedula: '1007652431', 
        correo_electronico: 'admin@test.com' 
      };
      
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue(null);
      mockAdminService.obtenerAdminPorCorreo.mockResolvedValue(null);
      mockAdminService.crearAdmin.mockResolvedValue({ 
        id: 1, 
        numero_cedula: '1007652431',
        correo_electronico: 'admin@test.com'
      });

      await adminController.crearAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Administrador creado exitosamente',
        data: { 
          id: 1, 
          numero_cedula: '1007652431',
          correo_electronico: 'admin@test.com'
        }
      });
    });

    it('debe retornar error si el admin ya existe por cédula', async () => {
      req.body = { 
        numero_cedula: '1007652431', 
        correo_electronico: 'admin@test.com' 
      };
      
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue({ id: 1 });

      await adminController.crearAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'El administrador ya está registrado (cédula o correo en uso)' 
      });
    });

    it('debe retornar error si el admin ya existe por correo', async () => {
      req.body = { 
        numero_cedula: '1007652431', 
        correo_electronico: 'admin@test.com' 
      };
      
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue(null);
      mockAdminService.obtenerAdminPorCorreo.mockResolvedValue({ id: 1 });

      await adminController.crearAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'El administrador ya está registrado (cédula o correo en uso)' 
      });
    });

    it('debe retornar errores de validación si ocurren', async () => {
      req.body = {};
      const error = new ValidationError('Error de validación', [
        { path: 'numero_cedula', message: 'Campo requerido' },
        { path: 'correo_electronico', message: 'Correo inválido' }
      ]);
      
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue(null);
      mockAdminService.obtenerAdminPorCorreo.mockResolvedValue(null);
      mockAdminService.crearAdmin.mockRejectedValue(error);

      await adminController.crearAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        errors: {
          numero_cedula: 'Campo requerido',
          correo_electronico: 'Correo inválido'
        }
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.body = { 
        numero_cedula: '1007652431', 
        correo_electronico: 'admin@test.com' 
      };
      const error = new Error('Error inesperado');
      
      mockAdminService.obtenerAdminPorCedula.mockRejectedValue(error);

      await adminController.crearAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al crear el administrador',
        error: 'Error inesperado' 
      });
    });
  });

  describe('obtenerAdminPorId', () => {
    it('debe devolver el admin si existe', async () => {
      req.params.id = 1;
      const mockAdmin = { 
        id: 1, 
        numero_cedula: '1007652431',
        correo_electronico: 'admin@test.com',
        contrasenia: 'Secret12@',
        get: jest.fn().mockReturnValue({
          id: 1, 
          numero_cedula: '1007652431',
          correo_electronico: 'admin@test.com',
          contrasenia: 'Secret12@'
        })
      };
      
      mockAdminService.obtenerAdminPorId.mockResolvedValue(mockAdmin);

      await adminController.obtenerAdminPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1, 
        numero_cedula: '1007652431',
        correo_electronico: 'admin@test.com'
      });
    });

    it('debe devolver 404 si no existe', async () => {
      req.params.id = 1;
      mockAdminService.obtenerAdminPorId.mockResolvedValue(null);

      await adminController.obtenerAdminPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Administrador no encontrado' 
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      mockAdminService.obtenerAdminPorId.mockRejectedValue(error);

      await adminController.obtenerAdminPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al obtener el administrador',
        error: 'Error inesperado' 
      });
    });
  });

  describe('obtenerAdminPorCedula', () => {
    it('debe devolver admin por cédula', async () => {
      req.params.numero_cedula = '123456789';
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue({ id: 1 });

      await adminController.obtenerAdminPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ admin: { id: 1 } });
    });

    it('debe devolver 404 si no existe', async () => {
      req.params.numero_cedula = '1007652431';
      mockAdminService.obtenerAdminPorCedula.mockResolvedValue(null);

      await adminController.obtenerAdminPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Administrador no encontrado' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.numero_cedula = '1007652431';
      const error = new Error('Error inesperado');
      mockAdminService.obtenerAdminPorCedula.mockRejectedValue(error);

      await adminController.obtenerAdminPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al obtener el administrador' 
      });
    });
  });

  describe('obtenerAdminPorCorreo', () => {
    it('debe devolver admin por correo', async () => {
      req.params.correo_electronico = 'admin@test.com';
      const mockAdmin = { 
        id: 1, 
        correo_electronico: 'admin@test.com',
        contrasenia: 'Secret12@',
        get: jest.fn().mockReturnValue({
          id: 1, 
          correo_electronico: 'admin@test.com',
          contrasenia: 'Secret12@'
        })
      };
      
      mockAdminService.obtenerAdminPorCorreo.mockResolvedValue(mockAdmin);

      await adminController.obtenerAdminPorCorreo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1, 
        correo_electronico: 'admin@test.com'
      });
    });

    it('debe devolver 404 si no existe', async () => {
      req.params.correo_electronico = 'admin@test.com';
      mockAdminService.obtenerAdminPorCorreo.mockResolvedValue(null);

      await adminController.obtenerAdminPorCorreo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Administrador no encontrado' 
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.correo_electronico = 'admin@test.com';
      const error = new Error('Error inesperado');
      mockAdminService.obtenerAdminPorCorreo.mockRejectedValue(error);

      await adminController.obtenerAdminPorCorreo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al buscar administrador por correo',
        error: 'Error inesperado' 
      });
    });
  });

  describe('obtenerAdmins', () => {
    it('debe retornar todos los admins sin contraseñas', async () => {
      const mockAdmins = [
        { 
          id: 1, 
          correo_electronico: 'admin1@test.com',
          contrasenia: 'Secret12@',
          get: jest.fn().mockReturnValue({
            id: 1, 
            correo_electronico: 'admin1@test.com',
            contrasenia: 'Secret12@'
          })
        },
        { 
          id: 2, 
          correo_electronico: 'admin2@test.com',
          contrasenia: 'Secret12@',
          get: jest.fn().mockReturnValue({
            id: 2, 
            correo_electronico: 'admin2@test.com',
            contrasenia: 'Secret12@'
          })
        }
      ];
      
      mockAdminService.obtenerAdmins.mockResolvedValue(mockAdmins);

      await adminController.obtenerAdmins(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, correo_electronico: 'admin1@test.com' },
        { id: 2, correo_electronico: 'admin2@test.com' }
      ]);
    });

    it('debe manejar errores inesperados', async () => {
      const error = new Error('Error inesperado');
      mockAdminService.obtenerAdmins.mockRejectedValue(error);

      await adminController.obtenerAdmins(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al obtener los administradores',
        error: 'Error inesperado' 
      });
    });
  });

  describe('actualizarAdmin', () => {
    it('debe actualizar admin si existe', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Admin Actualizado' };
      const mockAdmin = { 
        id: 1, 
        nombre: 'Admin Actualizado',
        contrasenia: 'Secret12@',
        get: jest.fn().mockReturnValue({
          id: 1, 
          nombre: 'Admin Actualizado',
          contrasenia: 'Secret12@'
        })
      };
      
      mockAdminService.actualizarAdmin.mockResolvedValue(mockAdmin);

      await adminController.actualizarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Administrador actualizado correctamente',
        data: {
          id: 1, 
          nombre: 'Admin Actualizado'
        }
      });
    });

    it('debe retornar 404 si no existe el admin', async () => {
      req.params.id = 1;
      mockAdminService.actualizarAdmin.mockResolvedValue(null);

      await adminController.actualizarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Administrador no encontrado' 
      });
    });

    it('debe retornar errores de validación si ocurren', async () => {
      req.params.id = 1;
      req.body = { correo_electronico: 'invalido' };
      const error = new ValidationError('Error de validación', [
        { path: 'correo_electronico', message: 'Correo inválido' }
      ]);
      
      mockAdminService.actualizarAdmin.mockRejectedValue(error);

      await adminController.actualizarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        errors: [
          { field: 'correo_electronico', message: 'Correo inválido' }
        ]
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Admin Actualizado' };
      const error = new Error('Error inesperado');
      mockAdminService.actualizarAdmin.mockRejectedValue(error);

      await adminController.actualizarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al actualizar el administrador',
        error: 'Error inesperado' 
      });
    });
  });

  describe('eliminarAdmin', () => {
    it('debe eliminar admin si existe', async () => {
      req.params.id = 1;
      mockAdminService.eliminarAdmin.mockResolvedValue({ id: 1 });

      await adminController.eliminarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Administrador desactivado correctamente' 
      });
    });

    it('debe retornar 404 si no existe', async () => {
      req.params.id = 1;
      mockAdminService.eliminarAdmin.mockResolvedValue(null);

      await adminController.eliminarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Administrador no encontrado' 
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      mockAdminService.eliminarAdmin.mockRejectedValue(error);

      await adminController.eliminarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error al desactivar el administrador',
        error: 'Error inesperado' 
      });
    });
  });

  describe('autenticarAdmin', () => {
    it('debe autenticar admin con credenciales válidas', async () => {
      req.body = { 
        correo_electronico: 'admin@test.com',
        contrasenia: 'Password142@'
      };
      
      const mockAdmin = {
        id: 1,
        nombre: 'Admin Test',
        correo_electronico: 'admin@test.com',
        rol: 'admin'
      };
      
      mockAdminService.autenticarAdmin.mockResolvedValue(mockAdmin);

      await adminController.autenticarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Autenticación exitosa',
        token: 'generar-token-jwt-aqui',
        admin: {
          id: 1,
          nombre: 'Admin Test',
          correo_electronico: 'admin@test.com',
          rol: 'admin'
        }
      });
    });

    it('debe manejar errores de autenticación', async () => {
      req.body = { 
        correo_electronico: 'admin@test.com',
        contrasenia: 'Password142@'
      };
      
      const error = new Error('Credenciales inválidas');
      mockAdminService.autenticarAdmin.mockRejectedValue(error);

      await adminController.autenticarAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Error de autenticación',
        error: 'Credenciales inválidas' 
      });
    });
  });
});