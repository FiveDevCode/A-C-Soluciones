// test/unit/routes/visitas.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock de middlewares
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
  isTecnico: (req, res, next) => next(),
  isAdminOrTecnico: (req, res, next) => next()
}));

// Mock del controlador
jest.mock('../../../src/controllers/visita.controller.js', () => {
  const mockControllerMethods = {
    crearVisita: jest.fn((req, res) => res.status(201).json({ message: 'crearVisita' })),
    obtenerServiciosAsignados: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServiciosAsignados' })),
    obtenerServicioAsignadoPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServicioAsignadoPorId' })),
    obtenerVisitas: jest.fn((req, res) => res.status(200).json({ message: 'obtenerVisitas' })),
    obtenerVisitaPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerVisitaPorId' })),
    actualizarVisita: jest.fn((req, res) => res.status(200).json({ message: 'actualizarVisita' })),
    cancelarVisita: jest.fn((req, res) => res.status(200).json({ message: 'cancelarVisita' })),
  };

  return {
    VisitaController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockVisitaMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/visita.routes.js';
import { __mockVisitaMethods } from '../../../src/controllers/visita.controller.js';

describe('Rutas de Visitas', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/visitas llama a crearVisita', async () => {
    const response = await request(app).post('/api/visitas').send({});
    expect(response.status).toBe(201);
    expect(__mockVisitaMethods.crearVisita).toHaveBeenCalled();
  });

  test('GET /api/visitas/asignados llama a obtenerServiciosAsignados', async () => {
    const response = await request(app).get('/api/visitas/asignados');
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.obtenerServiciosAsignados).toHaveBeenCalled();
  });

  test('GET /api/visitas/asignados/:id llama a obtenerServicioAsignadoPorId', async () => {
    const response = await request(app).get('/api/visitas/asignados/123');
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.obtenerServicioAsignadoPorId).toHaveBeenCalled();
  });

  test('GET /api/visitas llama a obtenerVisitas', async () => {
    const response = await request(app).get('/api/visitas');
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.obtenerVisitas).toHaveBeenCalled();
  });

  test('GET /api/visitas/:id llama a obtenerVisitaPorId', async () => {
    const response = await request(app).get('/api/visitas/1');
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.obtenerVisitaPorId).toHaveBeenCalled();
  });

  test('PUT /api/visitas/:id llama a actualizarVisita', async () => {
    const response = await request(app).put('/api/visitas/1').send({ estado: 'completada' });
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.actualizarVisita).toHaveBeenCalled();
  });

  test('POST /api/visitas/:id/cancelar llama a cancelarVisita', async () => {
    const response = await request(app).post('/api/visitas/1/cancelar').send();
    expect(response.status).toBe(200);
    expect(__mockVisitaMethods.cancelarVisita).toHaveBeenCalled();
  });
});
