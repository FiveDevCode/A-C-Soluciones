// test/unit/routes/solicitud.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock de middlewares
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (req, res, next) => next(),
  isCliente: (req, res, next) => next(),
  isAdminOrCliente: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
  isTecnico: (req, res, next) => next()
}));

// Mock del controlador
jest.mock('../../../src/controllers/solicitud.controller.js', () => {
  const mockControllerMethods = {
    crear: jest.fn((req, res) => res.status(201).json({ message: 'crear' })),
    obtenerTodos: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTodos' })),
    obtenerPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerPorId' })),
    obtenerPorCliente: jest.fn((req, res) => res.status(200).json({ message: 'obtenerPorCliente' })),
    actualizarEstado: jest.fn((req, res) => res.status(200).json({ message: 'actualizarEstado' })),
    eliminar: jest.fn((req, res) => res.status(200).json({ message: 'eliminar' })),
  };

  return {
    SolicitudController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockSolicitudMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/solicitud.routes.js';
import { __mockSolicitudMethods } from '../../../src/controllers/solicitud.controller.js';

describe('Rutas de Solicitud', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/solicitudes llama a crear', async () => {
    const response = await request(app).post('/api/solicitudes').send({});
    expect(response.status).toBe(201);
    expect(__mockSolicitudMethods.crear).toHaveBeenCalled();
  });

  test('GET /api/solicitudes llama a obtenerTodos', async () => {
    const response = await request(app).get('/api/solicitudes');
    expect(response.status).toBe(200);
    expect(__mockSolicitudMethods.obtenerTodos).toHaveBeenCalled();
  });

  test('GET /api/solicitudes/:id llama a obtenerPorId', async () => {
    const response = await request(app).get('/api/solicitudes/123');
    expect(response.status).toBe(200);
    expect(__mockSolicitudMethods.obtenerPorId).toHaveBeenCalled();
  });

  test('GET /api/solicitudes/cliente/:cliente_id_fk llama a obtenerPorCliente', async () => {
    const response = await request(app).get('/api/solicitudes/cliente/456');
    expect(response.status).toBe(200);
    expect(__mockSolicitudMethods.obtenerPorCliente).toHaveBeenCalled();
  });

  test('PATCH /api/solicitudes/:id/estado llama a actualizarEstado', async () => {
    const response = await request(app).patch('/api/solicitudes/123/estado').send({ estado: 'aprobada' });
    expect(response.status).toBe(200);
    expect(__mockSolicitudMethods.actualizarEstado).toHaveBeenCalled();
  });

  test('DELETE /api/solicitud/:id llama a eliminar', async () => {
    const response = await request(app).delete('/api/solicitud/123');
    expect(response.status).toBe(200);
    expect(__mockSolicitudMethods.eliminar).toHaveBeenCalled();
  });
});
