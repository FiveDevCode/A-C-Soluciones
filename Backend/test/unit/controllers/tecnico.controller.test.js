import { TecnicoController } from '../../../src/controllers/tecnico.controller.js';
import { TecnicoService } from '../../../src/services/tecnico.services.js';
import { ValidationError } from 'sequelize';

// Mock del servicio
jest.mock('../../../src/services/tecnico.services.js', () => ({
  TecnicoService: jest.fn().mockImplementation(() => ({
    obtenerTecnicoPorcedula: jest.fn(),
    crearTecnico: jest.fn(),
    obtenerTecnicoPorId: jest.fn(),
    obtenerTecnicos: jest.fn(),
    actualizarTecnico: jest.fn(),
    eliminarTecnico: jest.fn(),
  })),
}));

describe(' TecnicoController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    controller = new TecnicoController();
    mockService = controller.tecnicoService;
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // -------------------------------------------------------------------
  // crearTecnico
  // -------------------------------------------------------------------
  describe('crearTecnico', () => {
    it('debería devolver 400 si el técnico ya existe', async () => {
      mockService.obtenerTecnicoPorcedula.mockResolvedValue({ id: 1 });
      mockReq.body = { numero_de_cedula: '123' };

      await controller.crearTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'El técnico ya está registrado.' });
    });

    it('debería crear un técnico si no existe', async () => {
      const nuevo = { id: 2, nombre: 'Pedro' };
      mockService.obtenerTecnicoPorcedula.mockResolvedValue(null);
      mockService.crearTecnico.mockResolvedValue(nuevo);
      mockReq.body = { numero_de_cedula: '999' };

      await controller.crearTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(nuevo);
    });

    it('debería manejar ValidationError correctamente', async () => {
      const error = new ValidationError('Error');
      error.errors = [{ path: 'nombre', message: 'Nombre inválido' }];
      mockService.obtenerTecnicoPorcedula.mockRejectedValue(error);

      await controller.crearTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { nombre: 'Nombre inválido' },
      });
    });

    it('debería manejar error genérico 500', async () => {
      mockService.obtenerTecnicoPorcedula.mockRejectedValue(new Error('Boom'));

      await controller.crearTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al crear el empleado.' });
    });
  });

  // -------------------------------------------------------------------
  // obtenerTecnicoPorId
  // -------------------------------------------------------------------
  describe('obtenerTecnicoPorId', () => {
    it('debería devolver 404 si no se encuentra el técnico', async () => {
      mockService.obtenerTecnicoPorId.mockResolvedValue(null);
      mockReq.params.id = '1';

      await controller.obtenerTecnicoPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debería devolver el técnico encontrado', async () => {
      const tecnico = { id: 1, nombre: 'Juan' };
      mockService.obtenerTecnicoPorId.mockResolvedValue(tecnico);
      mockReq.params.id = '1';

      await controller.obtenerTecnicoPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(tecnico);
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerTecnicoPorId.mockRejectedValue(new Error('DB Error'));
      mockReq.params.id = '2';

      await controller.obtenerTecnicoPorId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al obtener el empleado.' });
    });
  });

  // -------------------------------------------------------------------
  // obtenerTecnicoPorCedula
  // -------------------------------------------------------------------
  describe('obtenerTecnicoPorCedula', () => {
    it('debería devolver 404 si no existe', async () => {
      mockService.obtenerTecnicoPorcedula.mockResolvedValue(null);
      mockReq.params.numero_de_cedula = '123';

      await controller.obtenerTecnicoPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado' });
    });

    it('debería devolver técnico si existe', async () => {
      const tecnico = { id: 1, nombre: 'Mario' };
      mockService.obtenerTecnicoPorcedula.mockResolvedValue(tecnico);
      mockReq.params.numero_de_cedula = '123';

      await controller.obtenerTecnicoPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ tecnico });
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerTecnicoPorcedula.mockRejectedValue(new Error('DB error'));
      await controller.obtenerTecnicoPorCedula(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al obtener el empleado' });
    });
  });

  // -------------------------------------------------------------------
  // obtenerTecnicos
  // -------------------------------------------------------------------
  describe('obtenerTecnicos', () => {
    it('debería devolver todos los técnicos', async () => {
      const tecnicos = [{ id: 1 }, { id: 2 }];
      mockService.obtenerTecnicos.mockResolvedValue(tecnicos);

      await controller.obtenerTecnicos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(tecnicos);
    });

    it('debería manejar error 500', async () => {
      mockService.obtenerTecnicos.mockRejectedValue(new Error('Error DB'));

      await controller.obtenerTecnicos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al obtener los empleados.' });
    });
  });

  // -------------------------------------------------------------------
  // actualizarTecnico
  // -------------------------------------------------------------------
  describe('actualizarTecnico', () => {
    it('debería devolver 404 si no se encuentra el técnico', async () => {
      mockService.actualizarTecnico.mockResolvedValue(null);
      mockReq.params.id = '1';

      await controller.actualizarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debería actualizar técnico correctamente', async () => {
      const actualizado = { id: 1, nombre: 'Actualizado' };
      mockService.actualizarTecnico.mockResolvedValue(actualizado);
      mockReq.params.id = '1';

      await controller.actualizarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(actualizado);
    });

    it('debería manejar ValidationError correctamente', async () => {
      const error = new ValidationError('Error');
      error.errors = [{ path: 'telefono', message: 'Teléfono inválido' }];
      mockService.actualizarTecnico.mockRejectedValue(error);

      await controller.actualizarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: { telefono: 'Teléfono inválido' },
      });
    });

    it('debería manejar error genérico 500', async () => {
      mockService.actualizarTecnico.mockRejectedValue(new Error('DB error'));

      await controller.actualizarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al actualizar el empleado.' });
    });
  });

  // -------------------------------------------------------------------
  // eliminarTecnico
  // -------------------------------------------------------------------
  describe('eliminarTecnico', () => {
    it('debería devolver 404 si no se encuentra el técnico', async () => {
      mockService.eliminarTecnico.mockResolvedValue(false);
      mockReq.params.id = '5';

      await controller.eliminarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Empleado no encontrado.' });
    });

    it('debería eliminar técnico correctamente', async () => {
      mockService.eliminarTecnico.mockResolvedValue(true);
      mockReq.params.id = '5';

      await controller.eliminarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Empleado eliminado correctamente.' });
    });

    it('debería manejar error 500', async () => {
      mockService.eliminarTecnico.mockRejectedValue(new Error('Error'));

      await controller.eliminarTecnico(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al eliminar el empleado.' });
    });
  });
});
