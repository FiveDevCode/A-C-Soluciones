import { RegistrarCuentasController } from '../../../src/controllers/registrar_cuentas.controller.js';
import { RegistrarCuentasService } from '../../../src/services/registrar_cuentas.services.js';
import { ValidationError } from 'sequelize';

// Mock del servicio
jest.mock('../../../src/services/registrar_cuentas.services.js');

describe('RegistrarCuentasController', () => {
  let registrarCuentasController;
  let mockService;
  let req;
  let res;

  beforeEach(() => {
    registrarCuentasController = new RegistrarCuentasController();
    mockService = RegistrarCuentasService.mock.instances[0];

    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- CREAR REGISTRO CUENTA ----------------
  describe('crearRegistroCuenta', () => {
    it('debe crear una cuenta exitosamente', async () => {
      req.body = { numero_cuenta: '123', nit: '900123' };
      mockService.obtenerCuentaPorNumero.mockResolvedValue(null);
      const nuevaCuenta = { id: 1, ...req.body };
      mockService.crearRegistroCuenta.mockResolvedValue(nuevaCuenta);

      await registrarCuentasController.crearRegistroCuenta(req, res);

      expect(mockService.obtenerCuentaPorNumero).toHaveBeenCalledWith('123');
      expect(mockService.crearRegistroCuenta).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cuenta registrada exitosamente',
        data: nuevaCuenta,
      });
    });

    it('debe retornar 400 si la cuenta ya existe', async () => {
      req.body = { numero_cuenta: '123' };
      mockService.obtenerCuentaPorNumero.mockResolvedValue({ id: 1 });

      await registrarCuentasController.crearRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'La cuenta ya está registrada (número de cuenta en uso)',
      });
    });

    it('debe manejar ValidationError', async () => {
      const error = new ValidationError('Error de validación');
      error.errors = [{ path: 'numero_cuenta', message: 'Requerido' }];
      mockService.obtenerCuentaPorNumero.mockResolvedValue(null);
      mockService.crearRegistroCuenta.mockRejectedValue(error);

      await registrarCuentasController.crearRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: { numero_cuenta: 'Requerido' } });
    });

    it('debe manejar errores generales (500)', async () => {
      mockService.obtenerCuentaPorNumero.mockResolvedValue(null);
      mockService.crearRegistroCuenta.mockRejectedValue(new Error('DB error'));

      await registrarCuentasController.crearRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al registrar la cuenta',
        error: 'DB error',
      });
    });
  });

  // ---------------- OBTENER POR ID CLIENTE ----------------
  describe('obtenerCuentaPorId', () => {
    it('debe retornar las cuentas de un cliente', async () => {
      req.params.id_cliente = 1;
      const cuentas = [{ id: 1 }];
      mockService.obtenerCuentaPorId.mockResolvedValue(cuentas);

      await registrarCuentasController.obtenerCuentaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cuentas);
    });

    it('debe retornar 404 si no hay cuentas', async () => {
      req.params.id_cliente = 1;
      mockService.obtenerCuentaPorId.mockResolvedValue([]);

      await registrarCuentasController.obtenerCuentaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No se encontraron cuentas para este cliente',
      });
    });

    it('debe manejar errores (500)', async () => {
      mockService.obtenerCuentaPorId.mockRejectedValue(new Error('Error interno'));

      await registrarCuentasController.obtenerCuentaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener las cuentas del cliente',
        error: 'Error interno',
      });
    });
  });

  // ---------------- OBTENER POR ID CUENTA ----------------
  describe('obtenerCuentaPorIdCuenta', () => {
    it('debe retornar una cuenta', async () => {
      req.params.id = 1;
      const cuenta = { id: 1 };
      mockService.obtenerCuentaPorIdCuenta.mockResolvedValue(cuenta);

      await registrarCuentasController.obtenerCuentaPorIdCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cuenta);
    });

    it('debe retornar 404 si no se encuentra', async () => {
      mockService.obtenerCuentaPorIdCuenta.mockResolvedValue(null);

      await registrarCuentasController.obtenerCuentaPorIdCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cuenta no encontrada' });
    });
  });

  // ---------------- OBTENER POR NUMERO ----------------
  describe('obtenerCuentaPorNumero', () => {
    it('debe retornar la cuenta', async () => {
      req.params.numero_cuenta = '123';
      const cuenta = { numero_cuenta: '123' };
      mockService.obtenerCuentaPorNumero.mockResolvedValue(cuenta);

      await registrarCuentasController.obtenerCuentaPorNumero(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cuenta);
    });

    it('debe retornar 404 si no se encuentra', async () => {
      mockService.obtenerCuentaPorNumero.mockResolvedValue(null);

      await registrarCuentasController.obtenerCuentaPorNumero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cuenta no encontrada' });
    });
  });

  // ---------------- OBTENER POR NIT ----------------
  describe('obtenerCuentaPorNit', () => {
    it('debe retornar la cuenta por NIT', async () => {
      req.params.nit = '900123';
      const cuenta = { nit: '900123' };
      mockService.obtenerCuentaPorNit.mockResolvedValue(cuenta);

      await registrarCuentasController.obtenerCuentaPorNit(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cuenta);
    });

    it('debe retornar 404 si no se encuentra', async () => {
      mockService.obtenerCuentaPorNit.mockResolvedValue(null);

      await registrarCuentasController.obtenerCuentaPorNit(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cuenta no encontrada' });
    });
  });

  // ---------------- OBTENER TODAS ----------------
  describe('obtenerCuentas', () => {
    it('debe retornar todas las cuentas', async () => {
      const cuentas = [{ id: 1 }, { id: 2 }];
      mockService.obtenerCuentas.mockResolvedValue(cuentas);

      await registrarCuentasController.obtenerCuentas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cuentas);
    });

    it('debe manejar errores (500)', async () => {
      mockService.obtenerCuentas.mockRejectedValue(new Error('DB error'));

      await registrarCuentasController.obtenerCuentas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener las cuentas',
        error: 'DB error',
      });
    });
  });

  // ---------------- ACTUALIZAR ----------------
  describe('actualizarRegistroCuenta', () => {
    it('debe actualizar una cuenta correctamente', async () => {
      req.params.id = 1;
      req.body = { saldo: 2000 };
      const cuentaActualizada = { id: 1, saldo: 2000 };
      mockService.actualizarRegistroCuenta.mockResolvedValue(cuentaActualizada);

      await registrarCuentasController.actualizarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cuenta actualizada exitosamente',
        data: cuentaActualizada,
      });
    });

    it('debe retornar 404 si la cuenta no se encuentra', async () => {
      mockService.actualizarRegistroCuenta.mockResolvedValue(null);

      await registrarCuentasController.actualizarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cuenta no encontrada' });
    });

    it('debe manejar ValidationError', async () => {
      const error = new ValidationError('Error de validación');
      error.errors = [{ path: 'saldo', message: 'Inválido' }];
      mockService.actualizarRegistroCuenta.mockRejectedValue(error);

      await registrarCuentasController.actualizarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: { saldo: 'Inválido' } });
    });
  });

  // ---------------- ELIMINAR ----------------
  describe('eliminarRegistroCuenta', () => {
    it('debe eliminar la cuenta exitosamente', async () => {
      req.params.id = 1;
      const cuentaEliminada = { id: 1 };
      mockService.eliminarRegistroCuenta.mockResolvedValue(cuentaEliminada);

      await registrarCuentasController.eliminarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cuenta eliminada exitosamente',
        data: cuentaEliminada,
      });
    });

    it('debe retornar 404 si no existe la cuenta', async () => {
      mockService.eliminarRegistroCuenta.mockResolvedValue(null);

      await registrarCuentasController.eliminarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cuenta no encontrada' });
    });

    it('debe manejar errores (500)', async () => {
      mockService.eliminarRegistroCuenta.mockRejectedValue(new Error('DB error'));

      await registrarCuentasController.eliminarRegistroCuenta(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al eliminar la cuenta',
        error: 'DB error',
      });
    });
  });
});
