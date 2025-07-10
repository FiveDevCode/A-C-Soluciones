import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock del middleware de autenticación
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 1 };
    next();
  }
}));

// Mock del controlador de preguntas frecuentes
jest.mock('../../../src/controllers/preguntas_freceuntes.controller.js', () => {
  const mockControllerMethods = {
    crearFaq: jest.fn((req, res) => res.status(201).json({ message: 'crearFaq' })),
    obtenerTodas: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTodas' })),
    obtenerPorCategoria: jest.fn((req, res) => res.status(200).json({ message: 'obtenerPorCategoria' })),
    actualizarFaq: jest.fn((req, res) => res.status(200).json({ message: 'actualizarFaq' })),
    eliminarFaq: jest.fn((req, res) => res.status(200).json({ message: 'eliminarFaq' }))
  };

  return {
    faqController: mockControllerMethods,
    __mockFaqMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/preguntas_frecuentes.routes.js';
import { __mockFaqMethods } from '../../../src/controllers/preguntas_freceuntes.controller.js';

describe('Rutas de Preguntas Frecuentes', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('GET /api/faqs llama a obtenerTodas', async () => {
    const response = await request(app).get('/api/faqs');
    expect(response.status).toBe(200);
    expect(__mockFaqMethods.obtenerTodas).toHaveBeenCalled();
  });

  test('GET /api/faqs/categoria/:categoria llama a obtenerPorCategoria', async () => {
    const response = await request(app).get('/api/faqs/categoria/servicio');
    expect(response.status).toBe(200);
    expect(__mockFaqMethods.obtenerPorCategoria).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
  });

  test('POST /api/faqs llama a crearFaq', async () => {
    const response = await request(app)
      .post('/api/faqs')
      .send({ pregunta: '¿Qué es esto?', respuesta: 'Una prueba' });
    expect(response.status).toBe(201);
    expect(__mockFaqMethods.crearFaq).toHaveBeenCalled();
  });

  test('PUT /api/faqs/:id llama a actualizarFaq', async () => {
    const response = await request(app)
      .put('/api/faqs/1')
      .send({ respuesta: 'Actualizada' });
    expect(response.status).toBe(200);
    expect(__mockFaqMethods.actualizarFaq).toHaveBeenCalled();
  });

  test('DELETE /api/faqs/:id llama a eliminarFaq', async () => {
    const response = await request(app).delete('/api/faqs/1');
    expect(response.status).toBe(200);
    expect(__mockFaqMethods.eliminarFaq).toHaveBeenCalled();
  });
});
