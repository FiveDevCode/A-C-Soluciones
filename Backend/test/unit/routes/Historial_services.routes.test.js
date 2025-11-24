import express from 'express';

jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/Historial_services.controller.js', () => ({
  HistorialServicesController: jest.fn().mockImplementation(() => ({
    getServiciosByCliente: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
}));

import router from '../../../src/routers/Historial_services.route.js';
import { HistorialServicesController } from '../../../src/controllers/Historial_services.controller.js';
import { authenticate } from '../../../src/middlewares/autenticacion.js';

describe('Historial Services Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador', () => {
    expect(HistorialServicesController).toHaveBeenCalledTimes(1);
  });

  it('debería tener la ruta GET /api/cliente/:clienteId/servicios configurada', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/:clienteId/servicios',
      expect.any(Function)
    );
  });

  it('debería usar el método getServiciosByCliente del controlador', () => {
    const controllerInstance = HistorialServicesController.mock.results[0].value;
    expect(controllerInstance.getServiciosByCliente).toBeDefined();
  });
});

