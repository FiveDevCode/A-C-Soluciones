import { FaqController } from '../../../src/controllers/preguntas_freceuntes.controller.js';
import { FaqService } from '../../../src/services/preguntas_frecuentes.services.js';

jest.mock('../../../src/services/preguntas_frecuentes.services.js');

describe('FaqController', () => {
  let controller;
  let faqServiceMock;
  let req, res;

  const mockFaq = {
    id: 1,
    pregunta: '¿Cómo puedo solicitar un servicio?',
    respuesta: 'Desde el panel de cliente.',
    categoria: 'solicitud',
    id_administrador: 1
  };

  beforeEach(() => {
    faqServiceMock = {
      crear: jest.fn(),
      obtenerTodas: jest.fn(),
      obtenerPorCategoria: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn()
    };
    FaqService.mockImplementation(() => faqServiceMock);

    controller = new FaqController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('crear - éxito', async () => {
    req = {
      body: {
        pregunta: mockFaq.pregunta,
        respuesta: mockFaq.respuesta,
        categoria: mockFaq.categoria
      },
      user: { id: mockFaq.id_administrador }
    };

    faqServiceMock.crear.mockResolvedValue(mockFaq);

    await controller.crear(req, res);

    expect(faqServiceMock.crear).toHaveBeenCalledWith({
      ...req.body,
      id_administrador: req.user.id
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockFaq,
      message: "Pregunta frecuente creada correctamente."
    });
  });

  test('crear - error', async () => {
    req = {
      body: {},
      user: { id: 1 }
    };
    faqServiceMock.crear.mockRejectedValue(new Error('Error al crear'));

    await controller.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error al crear'
    });
  });

  test('obtenerTodas - éxito', async () => {
    req = {};
    faqServiceMock.obtenerTodas.mockResolvedValue([mockFaq]);

    await controller.obtenerTodas(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [mockFaq]
    });
  });

  test('obtenerTodas - error', async () => {
    req = {};
    faqServiceMock.obtenerTodas.mockRejectedValue(new Error('DB error'));

    await controller.obtenerTodas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'DB error'
    });
  });

  test('obtenerPorCategoria - éxito', async () => {
    req = { params: { categoria: 'solicitud' } };
    faqServiceMock.obtenerPorCategoria.mockResolvedValue([mockFaq]);

    await controller.obtenerPorCategoria(req, res);

    expect(faqServiceMock.obtenerPorCategoria).toHaveBeenCalledWith('solicitud');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [mockFaq]
    });
  });

  test('obtenerPorCategoria - error', async () => {
    req = { params: { categoria: 'error' } };
    faqServiceMock.obtenerPorCategoria.mockRejectedValue(new Error('Error de búsqueda'));

    await controller.obtenerPorCategoria(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error de búsqueda'
    });
  });

  test('actualizar - éxito', async () => {
    req = {
      params: { id: '1' },
      body: {
        pregunta: 'Nueva pregunta',
        respuesta: 'Nueva respuesta',
        categoria: 'soporte'
      }
    };

    faqServiceMock.actualizar.mockResolvedValue();

    await controller.actualizar(req, res);

    expect(faqServiceMock.actualizar).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Pregunta frecuente actualizada correctamente."
    });
  });

  test('actualizar - error', async () => {
    req = { params: { id: '1' }, body: {} };
    faqServiceMock.actualizar.mockRejectedValue(new Error('Error al actualizar'));

    await controller.actualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error al actualizar'
    });
  });

  test('eliminar - éxito', async () => {
    req = { params: { id: '1' } };
    faqServiceMock.eliminar.mockResolvedValue();

    await controller.eliminar(req, res);

    expect(faqServiceMock.eliminar).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Pregunta frecuente eliminada correctamente."
    });
  });

  test('eliminar - error', async () => {
    req = { params: { id: '1' } };
    faqServiceMock.eliminar.mockRejectedValue(new Error('No se pudo eliminar'));

    await controller.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No se pudo eliminar'
    });
  });
});
