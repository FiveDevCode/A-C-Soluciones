// test/unit/routes/usuario.routes.test.js
import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock del AuthController
jest.mock('../../../src/controllers/usuario.controller.js', () => {
  const mockControllerMethods = {
    login: jest.fn((req, res) => res.status(200).json({ message: 'login' })),
  };

  return {
    AuthController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockAuthMethods: mockControllerMethods
  };
});

import router from '../../../src/routers/usuario.routes.js';
import { __mockAuthMethods } from '../../../src/controllers/usuario.controller.js';

describe('Rutas de Usuario', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use(router);
  });

  test('POST /api/login llama a login', async () => {
    const response = await request(app).post('/api/login').send({ email: 'test@example.com', password: '123456' });
    expect(response.status).toBe(200);
    expect(__mockAuthMethods.login).toHaveBeenCalled();
  },10000);
});
