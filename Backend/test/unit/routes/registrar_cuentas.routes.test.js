// test/unit/routes/registrar_cuentas.routes.test.js
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

jest.mock('../../../src/controllers/registrar_cuentas.controller.js', () => ({
  RegistrarCuentasController: jest.fn().mockImplementation(() => ({
    crearRegistroCuenta: jest.fn(),
    obtenerCuentas: jest.fn(),
    obtenerCuentaPorId: jest.fn(),
    obtenerCuentaPorIdCuenta: jest.fn(),
    obtenerCuentaPorNumero: jest.fn(),
    obtenerCuentaPorNit: jest.fn(),
    actualizarRegistroCuenta: jest.fn(),
    eliminarRegistroCuenta: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdminOrContador: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/registrar_cuentas.routes.js';
import { RegistrarCuentasController } from '../../../src/controllers/registrar_cuentas.controller.js';
import { authenticate, isAdminOrContador } from '../../../src/middlewares/autenticacion.js';

describe('Registrar Cuentas Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de registrar cuentas', () => {
    expect(RegistrarCuentasController).toHaveBeenCalledTimes(1);
  });

  // 🔹 POST /api/registrar-cuenta
  it('debería tener la ruta POST /api/registrar-cuenta configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/registrar-cuenta',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // crearRegistroCuenta
    );
  });

  // 🔹 GET /api/cuentas
  it('debería tener la ruta GET /api/cuentas configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cuentas',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/cuentas-cliente/:id_cliente
  it('debería tener la ruta GET /api/cuentas-cliente/:id_cliente configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cuentas-cliente/:id_cliente',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/cuenta-id/:id
  it('debería tener la ruta GET /api/cuenta-id/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cuenta-id/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/cuenta-numero/:numero_cuenta
  it('debería tener la ruta GET /api/cuenta-numero/:numero_cuenta configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cuenta-numero/:numero_cuenta',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/cuenta-nit/:nit
  it('debería tener la ruta GET /api/cuenta-nit/:nit configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cuenta-nit/:nit',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 PUT /api/cuenta/:id
  it('debería tener la ruta PUT /api/cuenta/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/cuenta/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 DELETE /api/eliminar-cuenta/:id
  it('debería tener la ruta DELETE /api/eliminar-cuenta/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/eliminar-cuenta/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
