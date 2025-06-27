// test/unit/routes/tecnico.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock del TecnicoController
jest.mock('../../../src/controllers/tecnico.controller.js', () => {
  const mockControllerMethods = {
    crearTecnico: jest.fn((req, res) => res.status(201).json({ message: 'crearTecnico' })),
    obtenerTecnicos: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTecnicos' })),
    obtenerTecnicoPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTecnicoPorId' })),
    obtenerTecnicoPorCedula: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTecnicoPorCedula' })),
    actualizarTecnico: jest.fn((req, res) => res.status(200).json({ message: 'actualizarTecnico' })),
    eliminarTecnico: jest.fn((req, res) => res.status(200).json({ message: 'eliminarTecnico' })),
  };

  return {
    TecnicoController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockTecnicoMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/tecnico.routes.js';
import { __mockTecnicoMethods } from '../../../src/controllers/tecnico.controller.js';

describe('Rutas de Técnico', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/tecnico llama a crearTecnico', async () => {
    const response = await request(app).post('/api/tecnico').send({});
    expect(response.status).toBe(201);
    expect(__mockTecnicoMethods.crearTecnico).toHaveBeenCalled();
  });

  test('GET /api/tecnico llama a obtenerTecnicos', async () => {
    const response = await request(app).get('/api/tecnico');
    expect(response.status).toBe(200);
    expect(__mockTecnicoMethods.obtenerTecnicos).toHaveBeenCalled();
  });

  test('GET /api/tecnico/:id llama a obtenerTecnicoPorId', async () => {
    const response = await request(app).get('/api/tecnico/123');
    expect(response.status).toBe(200);
    expect(__mockTecnicoMethods.obtenerTecnicoPorId).toHaveBeenCalled();
  });

  test('GET /api/tecnico/cedula/:numero_de_cedula llama a obtenerTecnicoPorCedula', async () => {
    const response = await request(app).get('/api/tecnico/cedula/123456789');
    expect(response.status).toBe(200);
    expect(__mockTecnicoMethods.obtenerTecnicoPorCedula).toHaveBeenCalled();
  });

  test('PUT /api/tecnico/:id llama a actualizarTecnico', async () => {
    const response = await request(app).put('/api/tecnico/123').send({});
    expect(response.status).toBe(200);
    expect(__mockTecnicoMethods.actualizarTecnico).toHaveBeenCalled();
  });

  test('DELETE /api/tecnico/:id llama a eliminarTecnico', async () => {
    const response = await request(app).delete('/api/tecnico/123');
    expect(response.status).toBe(200);
    expect(__mockTecnicoMethods.eliminarTecnico).toHaveBeenCalled();
  });
});
