import { crearFichaMantenimiento, listarFichas } from '../../../src/controllers/ficha_mantenimiento.controller.js';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services.js';
import { sendEmail } from '../../../src/services/email.services.js';
import * as fichaRepo from '../../../src/repository/ficha_mantenimiento.repository';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';

jest.mock('../../../src/services/ficha_mantenimiento.services.js');
jest.mock('../../../src/services/email.services.js');
jest.mock('../../../src/repository/ficha_mantenimiento.repository');
jest.mock('../../../src/models/cliente.model.js');
jest.mock('../../../src/models/tecnico.model.js');

const mockRequest = (body, files = {}) => ({
  body,
  files
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('crearFichaMantenimiento', () => {
  const baseBody = {
    id_cliente: 1,
    id_tecnico: 2,
    introduccion: 'Intro',
    detalles_servicio: 'Detalles',
    observaciones: 'Obs',
    estado_antes: 'Antes',
    descripcion_trabajo: 'Descripción',
    materiales_utilizados: 'Materiales',
    estado_final: 'Final',
    tiempo_de_trabajo: '5h',
    recomendaciones: 'Recomendaciones',
    fecha_de_mantenimiento: '2024-01-01'
  };

  const baseFiles = {
    foto_estado_antes: [{ filename: 'antes.jpg' }],
    foto_estado_final: [{ filename: 'final.jpg' }],
    foto_descripcion_trabajo: [{ filename: 'desc.jpg' }]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    fichaRepo.crearFicha.mockResolvedValue({ id: 99, toJSON: () => ({ id: 99 }) });
    fichaRepo.actualizarPDFPath.mockResolvedValue(true);
    ClienteModel.Cliente.findByPk.mockResolvedValue({
      nombre: 'Juan',
      telefono: '123',
      correo_electronico: 'juan@example.com',
    });
    TecnicoModel.Tecnico.findByPk.mockResolvedValue({
      nombre: 'Carlos',
      apellido: 'Pérez',
      telefono: '456',
      correo_electronico: 'carlos@example.com',
    });
    generarPDF.mockResolvedValue('/ruta/pdf.pdf');
    sendEmail.mockResolvedValue(true);
  });

  it('debería crear la ficha exitosamente', async () => {
    const req = mockRequest(baseBody, baseFiles);
    const res = mockResponse();

    await crearFichaMantenimiento(req, res);

    expect(fichaRepo.crearFicha).toHaveBeenCalled();
    expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
    expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(2);
    expect(generarPDF).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      mensaje: expect.any(String),
      ficha: expect.objectContaining({
        id: 99,
        pdf_path: '/ruta/pdf.pdf'
      }),
    }));
  });
  it('debería devolver 404 si el cliente no existe', async () => {
    ClienteModel.Cliente.findByPk.mockResolvedValue(null);
    const req = mockRequest(baseBody, baseFiles);
    const res = mockResponse();

    await crearFichaMantenimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
  });
  it('debería devolver 404 si el técnico no existe', async () => {
    TecnicoModel.Tecnico.findByPk.mockResolvedValue(null);
    const req = mockRequest(baseBody, baseFiles);
    const res = mockResponse();

    await crearFichaMantenimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Técnico no encontrado' });
  });
  it('debería funcionar si no se suben imágenes', async () => {
    const req = mockRequest(baseBody); // sin `files`
    const res = mockResponse();

    await crearFichaMantenimiento(req, res);

    expect(generarPDF).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        estadoAntes: null,
        estadoFinal: null,
        descripcion: null,
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });
  it('debería devolver 500 si ocurre un error inesperado', async () => {
    fichaRepo.crearFicha.mockRejectedValue(new Error('DB error'));
    const req = mockRequest(baseBody, baseFiles);
    const res = mockResponse();

    await crearFichaMantenimiento(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear la ficha' });
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

