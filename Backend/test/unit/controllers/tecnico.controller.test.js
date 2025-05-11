import { TecnicoController } from '../../../src/controllers/tecnico.controller.js';
import { TecnicoService } from '../../../src/services/tecnico.services.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/tecnico.services.js');

describe('TecnicoController', () => {
  let req, res, tecnicoController;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    tecnicoController = new TecnicoController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearTecnico', () => {
    it('debe crear un técnico si no existe', async () => {
      req.body = { numero_de_cedula: '1004892314' };
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue(null);
      TecnicoService.prototype.crearTecnico.mockResolvedValue({ id: 1, nombre: 'Pedro' });

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Pedro' });
    });

    it('debe retornar 400 si el técnico ya existe', async () => {
      req.body = { numero_de_cedula: '1004892314' };
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue({ id: 1 });

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El técnico ya está registrado.' });
    });

    it('debe retornar errores de validación con path', async () => {
      req.body = {};
      const error = new ValidationError('Error', [
        { path: 'numero_de_cedula', message: 'Campo requerido' }
      ]);
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue(null);
      TecnicoService.prototype.crearTecnico.mockRejectedValue(error);

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { numero_de_cedula: 'Campo requerido' }
      });
    });

    it('debe manejar errores de validación sin path', async () => {
      req.body = {};
      const error = new ValidationError('Error', [
        { message: 'Error sin campo específico' } // Error sin path
      ]);
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue(null);
      TecnicoService.prototype.crearTecnico.mockRejectedValue(error);

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: {} });
    });

    it('debe manejar errores inesperados', async () => {
      req.body = { numero_de_cedula: '1004892314' };
      const error = new Error('Error inesperado');
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockRejectedValue(error);

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear el empleado.' });
    });
  });

  describe('obtenerTecnicoPorId', () => {
    it('debe devolver un técnico por id', async () => {
      req.params.id = 1;
      TecnicoService.prototype.obtenerTecnicoPorId.mockResolvedValue({ id: 1 });

      await tecnicoController.obtenerTecnicoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('debe retornar 404 si no existe', async () => {
      req.params.id = 1;
      TecnicoService.prototype.obtenerTecnicoPorId.mockResolvedValue(null);

      await tecnicoController.obtenerTecnicoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      TecnicoService.prototype.obtenerTecnicoPorId.mockRejectedValue(error);

      await tecnicoController.obtenerTecnicoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el empleado.' });
    });
  });

  describe('obtenerTecnicoPorCedula', () => {
    it('debe devolver técnico por cédula', async () => {
      req.params.numero_de_cedula = '123';
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue({ id: 1 });

      await tecnicoController.obtenerTecnicoPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tecnico: { id: 1 } });
    });

    it('debe retornar 404 si no lo encuentra', async () => {
      req.params.numero_de_cedula = '1004892314';
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue(null);

      await tecnicoController.obtenerTecnicoPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.numero_de_cedula = '123';
      const error = new Error('Error inesperado');
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockRejectedValue(error);

      await tecnicoController.obtenerTecnicoPorCedula(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener el empleado' });
    });
  });

  describe('obtenerTecnicos', () => {
    it('debe retornar todos los técnicos', async () => {
      TecnicoService.prototype.obtenerTecnicos.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await tecnicoController.obtenerTecnicos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    it('debe manejar caso cuando no hay técnicos', async () => {
      TecnicoService.prototype.obtenerTecnicos.mockResolvedValue([]);

      await tecnicoController.obtenerTecnicos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('debe manejar errores inesperados', async () => {
      const error = new Error('Error inesperado');
      TecnicoService.prototype.obtenerTecnicos.mockRejectedValue(error);

      await tecnicoController.obtenerTecnicos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener los empleados.' });
    });
  });

  describe('actualizarTecnico', () => {
    it('debe actualizar técnico si existe', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Actualizado' };
      TecnicoService.prototype.actualizarTecnico.mockResolvedValue({ id: 1, nombre: 'Actualizado' });

      await tecnicoController.actualizarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nombre: 'Actualizado' });
    });

    it('debe retornar 404 si no existe', async () => {
      req.params.id = 1;
      TecnicoService.prototype.actualizarTecnico.mockResolvedValue(null);

      await tecnicoController.actualizarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debe retornar errores de validación', async () => {
      req.params.id = 1;
      req.body = {};
      const error = new ValidationError('Error', [
        { message: 'Campo inválido' }
      ]);
      TecnicoService.prototype.actualizarTecnico.mockRejectedValue(error);

      await tecnicoController.actualizarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Campo inválido']
      });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      req.body = { nombre: 'Actualizado' };
      const error = new Error('Error inesperado');
      TecnicoService.prototype.actualizarTecnico.mockRejectedValue(error);

      await tecnicoController.actualizarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al actualizar el empleado.' });
    });
  });

  describe('eliminarTecnico', () => {
    it('debe eliminar técnico si existe', async () => {
      req.params.id = 1;
      TecnicoService.prototype.eliminarTecnico.mockResolvedValue(true);

      await tecnicoController.eliminarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Empleado eliminado correctamente.' });
    });

    it('debe retornar 404 si no existe', async () => {
      req.params.id = 1;
      TecnicoService.prototype.eliminarTecnico.mockResolvedValue(null);

      await tecnicoController.eliminarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debe manejar errores inesperados', async () => {
      req.params.id = 1;
      const error = new Error('Error inesperado');
      TecnicoService.prototype.eliminarTecnico.mockRejectedValue(error);

      await tecnicoController.eliminarTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al eliminar el empleado.' });
    });
  });
});