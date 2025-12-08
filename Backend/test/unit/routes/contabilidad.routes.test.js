// test/unit/routes/contabilidad.routes.test.js
import express from 'express';

// Mock de dependencias
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/contabilidad.controller.js', () => ({
  ContabilidadController: jest.fn().mockImplementation(() => ({
    crearContabilidad: jest.fn(),
    obtenerContabilidad: jest.fn(),
    obtenerContabilidadPorId: jest.fn(),
    obtenerContabilidadPorCedula: jest.fn(),
    obtenerContabilidadPorCorreo: jest.fn(),
    eliminarContabilidad: jest.fn(),
    autenticarContabilidad: jest.fn(),
    actualizarContabilidad: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdmin: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/contabilidad.routes.js';
import { ContabilidadController } from '../../../src/controllers/contabilidad.controller.js';
import { authenticate, isAdmin } from '../../../src/middlewares/autenticacion.js';

describe('Contabilidad Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de contabilidad', () => {
    expect(ContabilidadController).toHaveBeenCalledTimes(1);
  });

  it('debería tener la ruta POST /api/contabilidad configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/contabilidad',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // contabilidadController.crearContabilidad
    );
  });

  it('debería tener la ruta GET /api/contabilidad configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/contabilidad',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/contabilidad/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/contabilidad/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/contabilidad/cedula/:numero_cedula configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/contabilidad/cedula/:numero_cedula',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/contabilidad/correo/:correo_electronico configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/contabilidad/correo/:correo_electronico',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta DELETE /api/contabilidad/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/contabilidad/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta POST /api/admin/login configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/admin/login',
      expect.any(Function) // contabilidadController.autenticarContabilidad
    );
  });

  it('debería tener la ruta PUT /api/contabilidad/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/contabilidad/:id',
      expect.any(Function),
      expect.any(Function)
    );
  });
});
