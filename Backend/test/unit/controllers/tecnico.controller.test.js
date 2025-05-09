// test/tecnico.controller.test.js
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

    it('debe retornar errores de validación', async () => {
      req.body = {};
      TecnicoService.prototype.obtenerTecnicoPorcedula.mockResolvedValue(null);
      const error = new ValidationError('Error', [
        { path: 'numero_de_cedula', message: 'Campo requerido' }
      ]);
      TecnicoService.prototype.crearTecnico.mockRejectedValue(error);

      await tecnicoController.crearTecnico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { numero_de_cedula: 'Campo requerido' }
      });
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
  });

  describe('obtenerTecnicos', () => {
    it('debe retornar todos los técnicos', async () => {
      TecnicoService.prototype.obtenerTecnicos.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await tecnicoController.obtenerTecnicos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
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
  });
});
