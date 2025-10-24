// test/unit/routes/servicio.routes.test.js
import express from 'express';

// Mock de dependencias
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/servicio.controller.js', () => ({
  ServicioController: jest.fn().mockImplementation(() => ({
    obtenerServiciosActivos: jest.fn(),
    buscarServicios: jest.fn(),
    crearServicio: jest.fn(),
    obtenerServicios: jest.fn(),
    obtenerServicioPorId: jest.fn(),
    obtenerServicioPorNombre: jest.fn(),
    actualizarServicio: jest.fn(),
    eliminarServicio: jest.fn(),
    deshabilitarServicio: jest.fn(),
    habilitarServicio: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdmin: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/servicio.routes.js';
import { ServicioController } from '../../../src/controllers/servicio.controller.js';
import { authenticate, isAdmin } from '../../../src/middlewares/autenticacion.js';

describe('Servicio Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de servicios', () => {
    expect(ServicioController).toHaveBeenCalledTimes(1);
  });

  // 🔹 Rutas públicas
  it('debería tener la ruta GET /api/servicios/activos configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/servicios/activos',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/servicios/buscar configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/servicios/buscar',
      expect.any(Function)
    );
  });

  // 🔹 Rutas protegidas
  it('debería tener la ruta POST /api/servicios configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/servicios',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // crearServicio
    );
  });

  it('debería tener la ruta GET /api/servicios configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/servicios',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/servicios/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/servicios/:id',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/servicios/nombre/:nombre configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/servicios/nombre/:nombre',
      expect.any(Function)
    );
  });

  it('debería tener la ruta PUT /api/servicios/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/servicios/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta DELETE /api/servicios/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/servicios/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta PATCH /api/servicios/:id/deshabilitar configurada correctamente', () => {
    expect(mockRouterInstance.patch).toHaveBeenCalledWith(
      '/api/servicios/:id/deshabilitar',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta PATCH /api/servicios/:id/habilitar configurada correctamente', () => {
    expect(mockRouterInstance.patch).toHaveBeenCalledWith(
      '/api/servicios/:id/habilitar',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
