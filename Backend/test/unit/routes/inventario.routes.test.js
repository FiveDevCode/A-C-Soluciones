// test/unit/routes/inventario.routes.test.js
import express from 'express';

// ✅ Mock de dependencias principales
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/inventario.controller.js', () => ({
  InventarioController: jest.fn().mockImplementation(() => ({
    crearInventario: jest.fn(),
    obtenerTodos: jest.fn(),
    obtenerInventarioPorId: jest.fn(),
    actualizarInventario: jest.fn(),
    eliminarInventario: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdminOrContador: jest.fn(),
  isAdminOrContadorOrTecnico: jest.fn(),
}));

// ✅ Importar después de los mocks
import router from '../../../src/routers/inventario.routes.js';
import { InventarioController } from '../../../src/controllers/inventario.controller.js';
import {
  authenticate,
  isAdminOrContador,
  isAdminOrContadorOrTecnico,
} from '../../../src/middlewares/autenticacion.js';

describe('Inventario Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de inventario', () => {
    expect(InventarioController).toHaveBeenCalledTimes(1);
  });

  // 🔹 POST /api/inventario
  it('debería tener la ruta POST /api/inventario configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/inventario',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // crearInventario
    );
  });

  // 🔹 GET /api/inventario
  it('debería tener la ruta GET /api/inventario configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/inventario',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContadorOrTecnico
      expect.any(Function)  // obtenerTodos
    );
  });

  // 🔹 GET /api/inventario/:id
  it('debería tener la ruta GET /api/inventario/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/inventario/:id',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContadorOrTecnico
      expect.any(Function)  // obtenerInventarioPorId
    );
  });

  // 🔹 PUT /api/inventario/:id
  it('debería tener la ruta PUT /api/inventario/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/inventario/:id',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // actualizarInventario
    );
  });

  // 🔹 DELETE /api/inventario/:id
  it('debería tener la ruta DELETE /api/inventario/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/inventario/:id',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // eliminarInventario
    );
  });
});
