import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

//  Mock del middleware de autenticación ANTES de importar el router
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 1 }; // simula un usuario autenticado
    next();
  }
}));

// Mock del ClienteController
jest.mock('../../../src/controllers/cliente.controller.js', () => {
  const mockControllerMethods = {
    crearCliente: jest.fn((req, res) => res.status(201).json({ message: 'crearCliente' })),
    obtenerClientesActivos: jest.fn((req, res) => res.status(200).json({ message: 'obtenerClientesActivos' })),
    obtenerClientePorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerClientePorId' })),
    obtenerClientePorCedula: jest.fn((req, res) => res.status(200).json({ message: 'obtenerClientePorCedula' })),
    obtenerClientePorEmail: jest.fn((req, res) => res.status(200).json({ message: 'obtenerClientePorEmail' })),
    actualizarCliente: jest.fn((req, res) => res.status(200).json({ message: 'actualizarCliente' })),
    eliminarCliente: jest.fn((req, res) => res.status(200).json({ message: 'eliminarCliente' })),
    obtenerTodosLosClientes: jest.fn((req, res) => res.status(200).json({ message: 'obtenerTodosLosClientes' })),
    actualizarMiPerfil: jest.fn((req, res) => res.status(200).json({ message: 'actualizarMiPerfil' })),
  };

  return {
    ClienteController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockClienteMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/cliente.routes.js';
import { __mockClienteMethods } from '../../../src/controllers/cliente.controller.js';

describe('Rutas de Cliente', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/cliente llama a crearCliente', async () => {
    const response = await request(app).post('/api/cliente').send({});
    expect(response.status).toBe(201);
    expect(__mockClienteMethods.crearCliente).toHaveBeenCalled();
  });

  test('GET /api/cliente llama a obtenerClientesActivos', async () => {
    const response = await request(app).get('/api/cliente');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.obtenerClientesActivos).toHaveBeenCalled();
  });

  test('GET /api/cliente/:id llama a obtenerClientePorId', async () => {
    const response = await request(app).get('/api/cliente/123');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.obtenerClientePorId).toHaveBeenCalled();
  });

  test('GET /api/cliente/cedula/:numero_de_cedula llama a obtenerClientePorCedula', async () => {
    const response = await request(app).get('/api/cliente/cedula/123456789');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.obtenerClientePorCedula).toHaveBeenCalled();
  });

  test('GET /api/cliente/email/:correo_electronico llama a obtenerClientePorEmail', async () => {
    const response = await request(app).get('/api/cliente/email/test@example.com');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.obtenerClientePorEmail).toHaveBeenCalled();
  });

  test('PUT /api/cliente/:id llama a actualizarCliente', async () => {
    const response = await request(app).put('/api/cliente/123').send({});
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.actualizarCliente).toHaveBeenCalled();
  });

  test('DELETE /api/cliente/:id llama a eliminarCliente', async () => {
    const response = await request(app).delete('/api/cliente/123');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.eliminarCliente).toHaveBeenCalled();
  });

  test('GET /api/cliente/todos llama a obtenerTodosLosClientes', async () => {
    const response = await request(app).get('/api/cliente/todos');
    expect(response.status).toBe(200);
    expect(__mockClienteMethods.obtenerTodosLosClientes).toHaveBeenCalled();
  });

  test('PUT /api/mi-perfil llama a actualizarMiPerfil', async () => {
    const response = await request(app).put('/api/mi-perfil').send({
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '3001234567'
    });

    expect(response.status).toBe(200);
    expect(__mockClienteMethods.actualizarMiPerfil).toHaveBeenCalled();
  });
});
