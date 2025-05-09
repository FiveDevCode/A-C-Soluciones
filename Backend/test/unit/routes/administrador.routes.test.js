// test/unit/routes/admin.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock del controlador
jest.mock('../../../src/controllers/administrador.controller.js', () => {
  const mockMethods = {
    crearAdmin: jest.fn((req, res) => res.status(201).json({ message: 'crearAdmin' })),
    obtenerAdmins: jest.fn((req, res) => res.status(200).json({ message: 'obtenerAdmins' })),
    obtenerAdminPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerAdminPorId' })),
    obtenerAdminPorCedula: jest.fn((req, res) => res.status(200).json({ message: 'obtenerAdminPorCedula' })),
    obtenerAdminPorCorreo: jest.fn((req, res) => res.status(200).json({ message: 'obtenerAdminPorCorreo' })),
    actualizarAdmin: jest.fn((req, res) => res.status(200).json({ message: 'actualizarAdmin' })),
    eliminarAdmin: jest.fn((req, res) => res.status(200).json({ message: 'eliminarAdmin' })),
    autenticarAdmin: jest.fn((req, res) => res.status(200).json({ message: 'autenticarAdmin' })),
  };

  return {
    AdminController: jest.fn().mockImplementation(() => mockMethods),
    __mockAdminMethods: mockMethods,
  };
});

import router from '../../../src/routers/administrador.routes.js';
import { __mockAdminMethods } from '../../../src/controllers/administrador.controller.js';

describe('Rutas de Administrador', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/admin llama a crearAdmin', async () => {
    const res = await request(app).post('/api/admin').send({});
    expect(res.status).toBe(201);
    expect(__mockAdminMethods.crearAdmin).toHaveBeenCalled();
  });

  test('GET /api/admin llama a obtenerAdmins', async () => {
    const res = await request(app).get('/api/admin');
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.obtenerAdmins).toHaveBeenCalled();
  });

  test('GET /api/admin/:id llama a obtenerAdminPorId', async () => {
    const res = await request(app).get('/api/admin/1');
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.obtenerAdminPorId).toHaveBeenCalled();
  });

  test('GET /api/admin/cedula/:numero_cedula llama a obtenerAdminPorCedula', async () => {
    const res = await request(app).get('/api/admin/cedula/12345678');
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.obtenerAdminPorCedula).toHaveBeenCalled();
  });

  test('GET /api/admin/correo/:correo_electronico llama a obtenerAdminPorCorreo', async () => {
    const res = await request(app).get('/api/admin/correo/test@example.com');
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.obtenerAdminPorCorreo).toHaveBeenCalled();
  });

  test('PUT /api/admin/:id llama a actualizarAdmin', async () => {
    const res = await request(app).put('/api/admin/1').send({ nombre: 'Nuevo Admin' });
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.actualizarAdmin).toHaveBeenCalled();
  });

  test('DELETE /api/admin/:id llama a eliminarAdmin', async () => {
    const res = await request(app).delete('/api/admin/1');
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.eliminarAdmin).toHaveBeenCalled();
  });

  test('POST /api/admin/login llama a autenticarAdmin', async () => {
    const res = await request(app).post('/api/admin/login').send({ correo: 'admin@example.com', password: '1234' });
    expect(res.status).toBe(200);
    expect(__mockAdminMethods.autenticarAdmin).toHaveBeenCalled();
  });
});
