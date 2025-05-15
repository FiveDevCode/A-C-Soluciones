import { crearFichaMantenimiento, listarFichas } from '../../../src/controllers/ficha_mantenimiento.controller.js';
import * as fichaRepo from '../../../src/repository/ficha_mantenimiento.repository.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services.js';
import { sendEmail } from '../../../src/services/email.services.js';

jest.mock('../../../src/repository/ficha_mantenimiento.repository.js');
jest.mock('../../../src/models/cliente.model.js');
jest.mock('../../../src/models/tecnico.model.js');
jest.mock('../../../src/services/ficha_mantenimiento.services.js');
jest.mock('../../../src/services/email.services.js');

describe('crearFichaMantenimiento', () => {
  const mockReq = {
    body: {
      id_cliente: 1,
      id_tecnico: 2,
      descripcion: 'Test ficha',
    }
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const fichaFake = {
    id: 123,
    id_cliente: 1,
    id_tecnico: 2,
    descripcion: 'Test ficha',
    toJSON: () => ({ id: 123, descripcion: 'Test ficha' })
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear ficha y enviar email', async () => {
    fichaRepo.crearFicha.mockResolvedValue(fichaFake);

    ClienteModel.Cliente = {
      findByPk: jest.fn().mockResolvedValue({
        nombre: 'Carlos',
        telefono: '123456',
        correo_electronico: 'cliente@correo.com'
      })
    };

    TecnicoModel.Tecnico = {
      findByPk: jest.fn().mockResolvedValue({
        nombre: 'Luis',
        apellido: 'García',
        correo_electronico: 'tecnico@correo.com'
      })
    };

    generarPDF.mockResolvedValue('/ruta/ficha.pdf');
    fichaRepo.actualizarPDFPath.mockResolvedValue(true);
    sendEmail.mockResolvedValue(true);

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(fichaRepo.crearFicha).toHaveBeenCalled();
    expect(ClienteModel.Cliente.findByPk).toHaveBeenCalled();
    expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalled();
    expect(generarPDF).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      mensaje: expect.any(String),
      ficha: expect.objectContaining({ pdf_path: expect.any(String) })
    }));
  });

  it('debería retornar 404 si cliente no existe', async () => {
    fichaRepo.crearFicha.mockResolvedValue(fichaFake);
    ClienteModel.Cliente = { findByPk: jest.fn().mockResolvedValue(null) };

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
  });

  it('debería retornar 404 si técnico no existe', async () => {
    fichaRepo.crearFicha.mockResolvedValue(fichaFake);
    ClienteModel.Cliente = { findByPk: jest.fn().mockResolvedValue({ nombre: 'Carlos', correo_electronico: 'cliente@correo.com' }) };
    TecnicoModel.Tecnico = { findByPk: jest.fn().mockResolvedValue(null) };

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Tecnico no encontrado' });
  });

  it('debería manejar errores y retornar 500', async () => {
    fichaRepo.crearFicha.mockRejectedValue(new Error('DB error'));

    await crearFichaMantenimiento(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error al crear la ficha' });
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

  it('retorna 401 si no hay usuario autenticado', async () => {
    const req = {};
    await listarFichas(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('no existe') });
  });

  it('devuelve todas las fichas para admin', async () => {
    const req = { user: { rol: 'administrador', id: 1 } };
    const fichas = [{ id: 1 }, { id: 2 }];
    fichaRepo.obtenerTodasFichas.mockResolvedValue(fichas);

    await listarFichas(req, mockRes);

    expect(fichaRepo.obtenerTodasFichas).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(fichas);
  });

  it('devuelve fichas por técnico', async () => {
    const req = { user: { rol: 'tecnico', id: 3 } };
    const fichas = [{ id: 1 }];
    fichaRepo.obtenerFichasPorTecnico.mockResolvedValue(fichas);

    await listarFichas(req, mockRes);

    expect(fichaRepo.obtenerFichasPorTecnico).toHaveBeenCalledWith(3);
    expect(mockRes.json).toHaveBeenCalledWith(fichas);
  });

  it('devuelve fichas por cliente', async () => {
    const req = { user: { rol: 'cliente', id: 5 } };
    const fichas = [{ id: 10 }];
    fichaRepo.obtenerFichasPorCliente.mockResolvedValue(fichas);

    await listarFichas(req, mockRes);

    expect(fichaRepo.obtenerFichasPorCliente).toHaveBeenCalledWith(5);
    expect(mockRes.json).toHaveBeenCalledWith(fichas);
  });

  it('devuelve 403 si el rol no está permitido', async () => {
    const req = { user: { rol: 'visitante', id: 99 } };

    await listarFichas(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Rol no autorizado' });
  });

  it('maneja errores internos con status 500', async () => {
    const req = { user: { rol: 'admin', id: 1 } };
    fichaRepo.obtenerTodasFichas.mockRejectedValue(new Error('error db'));

    await listarFichas(req, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('Error interno') });
  });
});

