// test/unit/routes/solicitud.routes.test.js
import { Router } from 'express';

// Mock de dependencias
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/solicitud.controller.js', () => ({
  SolicitudController: jest.fn().mockImplementation(() => ({
    crear: jest.fn(),
    obtenerTodos: jest.fn(),
    obtenerPorId: jest.fn(),
    obtenerPorCliente: jest.fn(),
    actualizarEstado: jest.fn(),
    eliminar: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdminOrCliente: jest.fn(),
  isAdminOrTecnico: jest.fn(),
  isCliente: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/solicitud.routes.js';
import { SolicitudController } from '../../../src/controllers/solicitud.controller.js';
import {
  authenticate,
  isAdminOrCliente,
  isAdminOrTecnico,
  isCliente,
} from '../../../src/middlewares/autenticacion.js';

describe('Solicitud Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de solicitudes', () => {
    expect(SolicitudController).toHaveBeenCalledTimes(1);
  });

  it('debería tener la ruta POST /api/solicitudes configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/solicitudes',
      expect.any(Function), // authenticate
      expect.any(Function), // isCliente
      expect.any(Function)  // solicitudController.crear
    );
  });

  it('debería tener la ruta GET /api/solicitudes configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/solicitudes',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/solicitudes/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/solicitudes/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/solicitudes/cliente/:cliente_id_fk configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/solicitudes/cliente/:cliente_id_fk',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta PATCH /api/solicitudes/:id/estado configurada correctamente', () => {
    expect(mockRouterInstance.patch).toHaveBeenCalledWith(
      '/api/solicitudes/:id/estado',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta DELETE /api/solicitud/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/solicitud/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
