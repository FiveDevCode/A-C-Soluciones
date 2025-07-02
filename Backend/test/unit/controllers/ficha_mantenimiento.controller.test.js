import { crearFichaMantenimiento, listarFichas } from '../../../src/controllers/ficha_mantenimiento.controller.js';
import * as fichaRepo from '../../../src/repository/ficha_mantenimiento.repository.js';
import * as pdfService from '../../../src/services/ficha_mantenimiento.services.js';
import * as emailService from '../../../src/services/email.services.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { ValidationError } from 'sequelize';

jest.mock('../../../src/services/ficha_mantenimiento.services.js');
jest.mock('../../../src/services/email.services.js');

describe('crearFichaMantenimiento', () => {
  const mockReq = {
    body: {
      id_cliente: 1,
      id_tecnico: 2,
      introduccion: 'Intro',
      detalles_servicio: 'Detalles',
      observaciones: 'Observaciones',
      estado_antes: 'Antes',
      descripcion_trabajo: 'Trabajo',
      materiales_utilizados: 'Materiales',
      estado_final: 'Final',
      tiempo_de_trabajo: '2h',
      recomendaciones: 'Recomendaciones',
      fecha_de_mantenimiento: '2025-07-01',
      id_visitas: 99
    },
    files: {
      foto_estado_antes: [{ filename: 'antes.jpg' }],
      foto_estado_final: [{ filename: 'final.jpg' }],
      foto_descripcion_trabajo: [{ filename: 'desc.jpg' }]
    }
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea la ficha correctamente y responde con 201', async () => {
    const fichaFake = {
      id: 123,
      toJSON: () => ({ id: 123 })
    };

    fichaRepo.crearFicha = jest.fn().mockResolvedValue(fichaFake);
    ClienteModel.Cliente.findByPk = jest.fn().mockResolvedValue({
      nombre: 'Cliente',
      telefono: '123456789',
      correo_electronico: 'cliente@test.com'
    });

    TecnicoModel.Tecnico.findByPk = jest.fn().mockResolvedValue({
      nombre: 'Tecnico',
      apellido: 'Apellido',
      telefono: '987654321',
      correo_electronico: 'tecnico@test.com'
    });

    pdfService.generarPDF.mockResolvedValue('uploads/fichas/ficha_123.pdf');
    fichaRepo.actualizarPDFPath = jest.fn();
    emailService.sendEmail = jest.fn();

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(fichaRepo.crearFicha).toHaveBeenCalled();
    expect(pdfService.generarPDF).toHaveBeenCalled();
    expect(fichaRepo.actualizarPDFPath).toHaveBeenCalledWith(123, 'uploads/fichas/ficha_123.pdf');
    expect(emailService.sendEmail).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      mensaje: 'Ficha creada correctamente y enviada al cliente.',
      ficha: { id: 123, pdf_path: 'uploads/fichas/ficha_123.pdf' }
    });
  });

  it('devuelve 404 si cliente no existe', async () => {
    fichaRepo.crearFicha = jest.fn().mockResolvedValue({ id: 1 });
    ClienteModel.Cliente.findByPk = jest.fn().mockResolvedValue(null);

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
  });

  it('devuelve 404 si técnico no existe', async () => {
    fichaRepo.crearFicha = jest.fn().mockResolvedValue({ id: 1 });
    ClienteModel.Cliente.findByPk = jest.fn().mockResolvedValue({ nombre: 'Ok', correo_electronico: 'ok@mail.com' });
    TecnicoModel.Tecnico.findByPk = jest.fn().mockResolvedValue(null);

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Técnico no encontrado' });
  });

  it('maneja errores de validación con 400', async () => {
    const sequelizeError = new ValidationError('Error de validación', [
      { path: 'campo', message: 'Mensaje de error' }
    ]);

    fichaRepo.crearFicha = jest.fn().mockRejectedValue(sequelizeError);

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      errors: [{ path: 'campo', message: 'Mensaje de error' }]
    });
  });

  it('maneja error interno con 500', async () => {
    fichaRepo.crearFicha = jest.fn().mockRejectedValue(new Error('Error interno'));

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error al crear la ficha' });
  });
});

describe('listarFichas', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve fichas para admin', async () => {
    const mockReq = {
      user: { rol: 'admin', id: 1 },
      query: { id_visitas: 10 }
    };

    fichaRepo.obtenerTodasFichas = jest.fn().mockResolvedValue([{ id: 1 }]);

    await listarFichas(mockReq, mockRes);

    expect(fichaRepo.obtenerTodasFichas).toHaveBeenCalledWith(10);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('devuelve fichas para tecnico', async () => {
    const mockReq = {
      user: { rol: 'tecnico', id: 2 },
      query: { id_visitas: null }
    };

    fichaRepo.obtenerTodasFichas = jest.fn().mockResolvedValue([{ id: 2 }]);

    await listarFichas(mockReq, mockRes);

    expect(fichaRepo.obtenerTodasFichas).toHaveBeenCalledWith(null);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 2 }]);
  });

  it('devuelve fichas para cliente', async () => {
    const mockReq = {
      user: { rol: 'cliente', id: 3 },
      query: {}
    };

    fichaRepo.obtenerFichasPorCliente = jest.fn().mockResolvedValue([{ id: 3 }]);

    await listarFichas(mockReq, mockRes);

    expect(fichaRepo.obtenerFichasPorCliente).toHaveBeenCalledWith(3, undefined);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 3 }]);
  });

  it('devuelve 403 si rol no autorizado', async () => {
    const mockReq = {
      user: { rol: 'otro', id: 4 },
      query: {}
    };

    await listarFichas(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Rol no autorizado' });
  });

  it('devuelve 401 si req.user no existe', async () => {
    const mockReq = { query: {} };

    await listarFichas(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Usuario no autenticado (req.user no existe)'
    });
  });

  it('maneja error interno 500', async () => {
    const mockReq = {
      user: { rol: 'admin', id: 1 },
      query: {}
    };

    fichaRepo.obtenerTodasFichas = jest.fn().mockRejectedValue(new Error('error'));

    await listarFichas(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error interno al obtener fichas' });
  });
});
