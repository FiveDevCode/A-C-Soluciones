// test/cliente.controller.test.js
import { ClienteController } from '../../../src/controllers/cliente.controller.js';
import { ClienteService } from '../../../src/services/cliente.services.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/cliente.services.js');

describe('ClienteController', () => {
  let req, res, clienteController;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    clienteController = new ClienteController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearCliente', () => {
    it('debe crear un cliente si no existe', async () => {
      req.body = { numero_de_cedula: '1007356754' };
      ClienteService.prototype.obtenerClientePorCedula.mockResolvedValue(null);
      ClienteService.prototype.crearCliente.mockResolvedValue({ id: 1, nombre: 'Juan' });

      await clienteController.crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Juan' });
    });

    it('debe retornar error si el cliente ya existe', async () => {
      req.body = { numero_de_cedula: '1007356754' };
      ClienteService.prototype.obtenerClientePorCedula.mockResolvedValue({ id: 1 });

      await clienteController.crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El cliente ya está registrado.' });
    });

    it('debe retornar errores de validación si ocurren', async () => {
      req.body = {};
      const error = new ValidationError('Error de validación', [
        { path: 'numero_de_cedula', message: 'Campo requerido' }
      ]);
      ClienteService.prototype.obtenerClientePorCedula.mockResolvedValue(null);
      ClienteService.prototype.crearCliente.mockRejectedValue(error);

      await clienteController.crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { numero_de_cedula: 'Campo requerido' }
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.body = { numero_de_cedula: '1007356754' };
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerClientePorCedula.mockRejectedValue(error);

      await clienteController.crearCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear el cliente.' });
    });
  });

  describe('obtenerClientePorId', () => {
    it('debe devolver el cliente si existe', async () => {
      req.params.id = 1;
      ClienteService.prototype.obtenerClientePorId.mockResolvedValue({ id: 1 });

      await clienteController.obtenerClientePorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('debe devolver 404 si no existe', async () => {
      req.params.id = 1;
      ClienteService.prototype.obtenerClientePorId.mockResolvedValue(null);

      await clienteController.obtenerClientePorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerClientePorId.mockRejectedValue(error);

      await clienteController.obtenerClientePorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el cliente.' });
    });
  });

  describe('obtenerClientePorCedula', () => {
    it('debe devolver cliente por cédula', async () => {
      req.params.numero_de_cedula = '1007356754';
      ClienteService.prototype.obtenerClientePorCedula.mockResolvedValue({ id: 1 });

      await clienteController.obtenerClientePorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ cliente: { id: 1 } });
    });

    it('debe devolver 404 si no existe', async () => {
      req.params.numero_de_cedula = '123';
      ClienteService.prototype.obtenerClientePorCedula.mockResolvedValue(null);

      await clienteController.obtenerClientePorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.numero_de_cedula = '123';
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerClientePorCedula.mockRejectedValue(error);

      await clienteController.obtenerClientePorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el cliente.' });
    });
  });

  describe('obtenerTodosLosClientes', () => {
    it('debe retornar todos los clientes', async () => {
      ClienteService.prototype.obtenerTodosLosClientes.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await clienteController.obtenerTodosLosClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    it('debe manejar errores inesperados', async () => {
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerTodosLosClientes.mockRejectedValue(error);

      await clienteController.obtenerTodosLosClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener los clientes.' });
    });
  });

  describe('obtenerClientesActivos', () => {
    it('debe retornar clientes activos', async () => {
      ClienteService.prototype.obtenerClientesActivos.mockResolvedValue([{ id: 1 }]);

      await clienteController.obtenerClientesActivos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('debe manejar errores inesperados', async () => {
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerClientesActivos.mockRejectedValue(error);

      await clienteController.obtenerClientesActivos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener los clientes activos.' });
    });
  });

  describe('actualizarCliente', () => {
    it('debe actualizar cliente si existe', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Actualizado' };
      ClienteService.prototype.actualizarCliente.mockResolvedValue({ id: 1, nombre: 'Actualizado' });

      await clienteController.actualizarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Actualizado' });
    });

    it('debe retornar 404 si no existe el cliente', async () => {
      req.params.id = 1;
      ClienteService.prototype.actualizarCliente.mockResolvedValue(null);

      await clienteController.actualizarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Actualizado' };
      const error = new Error('Error inesperado');
      ClienteService.prototype.actualizarCliente.mockRejectedValue(error);

      await clienteController.actualizarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al actualizar el cliente.' });
    });
  });

  describe('eliminarCliente', () => {
    it('debe eliminar cliente si existe', async () => {
      req.params.id = 1;
      ClienteService.prototype.eliminarCliente.mockResolvedValue({ id: 1 });

      await clienteController.eliminarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('debe retornar 404 si no existe', async () => {
      req.params.id = 1;
      ClienteService.prototype.eliminarCliente.mockResolvedValue(null);

      await clienteController.eliminarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      ClienteService.prototype.eliminarCliente.mockRejectedValue(error);

      await clienteController.eliminarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al eliminar el cliente.' });
    });
  });

  describe('obtenerClientePorEmail', () => {
    it('debe devolver cliente por email', async () => {
      req.params.correo_electronico = 'test@mail.com';
      ClienteService.prototype.obtenerClientePorEmail.mockResolvedValue({ id: 1 });

      await clienteController.obtenerClientePorEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('debe retornar 404 si no lo encuentra', async () => {
      req.params.correo_electronico = 'test@mail.com';
      ClienteService.prototype.obtenerClientePorEmail.mockResolvedValue(null);

      await clienteController.obtenerClientePorEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.correo_electronico = 'test@mail.com';
      const error = new Error('Error inesperado');
      ClienteService.prototype.obtenerClientePorEmail.mockRejectedValue(error);

      await clienteController.obtenerClientePorEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el cliente.' });
    });
  });


    describe('ClienteController - actualizarMiPerfil', () => {
    let clienteController;
    let clienteServiceMock;
    let req;
    let res;

    beforeEach(() => {
      // Mock del servicio con la función que nos interesa
      clienteServiceMock = {
        actualizarPerfilCliente: jest.fn(),
      };

      // Pasamos el mock al controlador
      clienteController = new ClienteController(clienteServiceMock);

      // Mock del request y response
      req = {
        user: { id: 1 },
        body: {
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '3001234567',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simula los campos permitidos (opcional: puedes omitir si no se usan internamente)
      global.camposPermitidosCliente = ['nombre', 'apellido', 'telefono'];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('debe actualizar correctamente el perfil del cliente', async () => {
      const clienteMock = {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
      };

      clienteServiceMock.actualizarPerfilCliente.mockResolvedValue(clienteMock);

      await clienteController.actualizarMiPerfil(req, res);

      expect(clienteServiceMock.actualizarPerfilCliente).toHaveBeenCalledWith(1, {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clienteMock);
    });

    it('debe responder 404 si el cliente no existe', async () => {
      clienteServiceMock.actualizarPerfilCliente.mockResolvedValue(null);

      await clienteController.actualizarMiPerfil(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente no encontrado.' });
    });

    it('debe responder 500 si ocurre un error', async () => {
      clienteServiceMock.actualizarPerfilCliente.mockRejectedValue(new Error('Fallo inesperado'));

      await clienteController.actualizarMiPerfil(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al actualizar el perfil del cliente.' });
    });
  });


});