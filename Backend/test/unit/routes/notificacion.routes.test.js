// test/unit/routes/notificacion.routes.test.js
import { Router } from 'express';

// Mock de dependencias
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/notificacion.controller.js', () => ({
  obtenerNotificaciones: jest.fn(),
  obtenerNotificacionesNoLeidas: jest.fn(),
  contarNoLeidas: jest.fn(),
  marcarComoLeida: jest.fn(),
  marcarTodasComoLeidas: jest.fn(),
  eliminarNotificacion: jest.fn(),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/notificacion.routes.js';
import * as notificacionController from '../../../src/controllers/notificacion.controller.js';
import { authenticate } from '../../../src/middlewares/autenticacion.js';

describe('Notificacion Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('debería tener la ruta GET /api/notificaciones/count configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/notificaciones/count',
      expect.any(Function), // authenticate
      notificacionController.contarNoLeidas
    );
  });

  it('debería tener la ruta GET /api/notificaciones/no-leidas configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/notificaciones/no-leidas',
      expect.any(Function), // authenticate
      notificacionController.obtenerNotificacionesNoLeidas
    );
  });

  it('debería tener la ruta PUT /api/notificaciones/leer-todas configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/notificaciones/leer-todas',
      expect.any(Function), // authenticate
      notificacionController.marcarTodasComoLeidas
    );
  });

  it('debería tener la ruta GET /api/notificaciones configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/notificaciones',
      expect.any(Function), // authenticate
      notificacionController.obtenerNotificaciones
    );
  });

  it('debería tener la ruta PUT /api/notificaciones/:id_notificacion/leer configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/notificaciones/:id_notificacion/leer',
      expect.any(Function), // authenticate
      notificacionController.marcarComoLeida
    );
  });

  it('debería tener la ruta DELETE /api/notificaciones/:id_notificacion configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/notificaciones/:id_notificacion',
      expect.any(Function), // authenticate
      notificacionController.eliminarNotificacion
    );
  });

  it('debería configurar exactamente 3 rutas GET', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledTimes(3);
  });

  it('debería configurar exactamente 2 rutas PUT', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledTimes(2);
  });

  it('debería configurar exactamente 1 ruta DELETE', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('todas las rutas deben estar protegidas con authenticate', () => {
    const allCalls = [
      ...mockRouterInstance.get.mock.calls,
      ...mockRouterInstance.put.mock.calls,
      ...mockRouterInstance.delete.mock.calls
    ];

    allCalls.forEach((call) => {
      // El segundo argumento debe ser authenticate
      expect(call[1]).toBe(authenticate);
    });
  });

  it('todas las rutas deben empezar con /api/notificaciones', () => {
    const allCalls = [
      ...mockRouterInstance.get.mock.calls,
      ...mockRouterInstance.put.mock.calls,
      ...mockRouterInstance.delete.mock.calls
    ];

    allCalls.forEach((call) => {
      // El primer argumento (la ruta) debe empezar con /api/notificaciones
      expect(call[0]).toMatch(/^\/api\/notificaciones/);
    });
  });
});
