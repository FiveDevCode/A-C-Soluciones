// test/unit/routes/preguntas_frecuentes.routes.test.js
import express from 'express';

// Mock de dependencias principales
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/preguntas_freceuntes.controller.js', () => ({
  FaqController: jest.fn().mockImplementation(() => ({
    obtenerTodas: jest.fn(),
    obtenerPorCategoria: jest.fn(),
    crear: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdmin: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/preguntas_frecuentes.routes.js';
import { FaqController } from '../../../src/controllers/preguntas_freceuntes.controller.js';
import { authenticate, isAdmin } from '../../../src/middlewares/autenticacion.js';

describe('Preguntas Frecuentes (FAQ) Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de preguntas frecuentes', () => {
    expect(FaqController).toHaveBeenCalledTimes(1);
  });

  // 🔹 Rutas públicas
  it('debería tener la ruta GET /api/faqs configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/faqs',
      expect.any(Function) // obtenerTodas
    );
  });

  it('debería tener la ruta GET /api/faqs/categoria/:categoria configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/faqs/categoria/:categoria',
      expect.any(Function) // obtenerPorCategoria
    );
  });

  // 🔹 Rutas protegidas
  it('debería tener la ruta POST /api/faqs configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/faqs',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // crear
    );
  });

  it('debería tener la ruta PUT /api/faqs/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/faqs/:id',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // actualizar
    );
  });

  it('debería tener la ruta DELETE /api/faqs/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/faqs/:id',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // eliminar
    );
  });
});
