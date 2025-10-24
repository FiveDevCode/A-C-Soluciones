// test/unit/routes/registrar_facturas.routes.test.js
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

jest.mock('../../../src/controllers/registrar_facturas.controller.js', () => ({
  RegistrarFacturasController: jest.fn().mockImplementation(() => ({
    crearRegistroFactura: jest.fn(),
    obtenerRegistros: jest.fn(),
    obtenerRegistroPorCliente: jest.fn(),
    obtenerPorEstado: jest.fn(),
    obtenerPorSaldoPendiente: jest.fn(),
    obtenerRegistroPorNumero: jest.fn(),
    obtenerRegistroPorId: jest.fn(),
    actualizarRegistroFactura: jest.fn(),
    eliminarRegistroFactura: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdminOrContador: jest.fn(),
}));

// ✅ Importar después de los mocks
import router from '../../../src/routers/registrar_factura.routes.js';
import { RegistrarFacturasController } from '../../../src/controllers/registrar_facturas.controller.js';
import { authenticate, isAdminOrContador } from '../../../src/middlewares/autenticacion.js';

describe('Registrar Facturas Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de registrar facturas', () => {
    expect(RegistrarFacturasController).toHaveBeenCalledTimes(1);
  });

  // 🔹 POST /api/registrar-factura
  it('debería tener la ruta POST /api/registrar-factura configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/registrar-factura',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // crearRegistroFactura
    );
  });

  // 🔹 GET /api/facturas
  it('debería tener la ruta GET /api/facturas configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/facturas',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/facturas-cliente/:id_cliente
  it('debería tener la ruta GET /api/facturas-cliente/:id_cliente configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/facturas-cliente/:id_cliente',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/facturas-estado/:estado_factura
  it('debería tener la ruta GET /api/facturas-estado/:estado_factura configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/facturas-estado/:estado_factura',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/facturas-saldo
  it('debería tener la ruta GET /api/facturas-saldo configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/facturas-saldo',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/factura-numero/:numero_factura
  it('debería tener la ruta GET /api/factura-numero/:numero_factura configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/factura-numero/:numero_factura',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 GET /api/factura/:id
  it('debería tener la ruta GET /api/factura/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/factura/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 PUT /api/factura/:id
  it('debería tener la ruta PUT /api/factura/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/factura/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  // 🔹 DELETE /api/eliminar-factura/:id
  it('debería tener la ruta DELETE /api/eliminar-factura/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/eliminar-factura/:id',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
