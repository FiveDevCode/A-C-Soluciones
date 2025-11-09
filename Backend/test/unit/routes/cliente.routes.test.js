// test/unit/routes/cliente.routes.test.js
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

jest.mock('../../../src/controllers/cliente.controller.js', () => ({
  ClienteController: jest.fn().mockImplementation(() => ({
    crearCliente: jest.fn(),
    obtenerTodosLosClientes: jest.fn(),
    actualizarMiPerfil: jest.fn(),
    obtenerClientesActivos: jest.fn(),
    obtenerClientePorId: jest.fn(),
    obtenerClientePorCedula: jest.fn(),
    obtenerClientePorEmail: jest.fn(),
    actualizarCliente: jest.fn(),
    eliminarCliente: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdmin: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/cliente.routes.js';
import { ClienteController } from '../../../src/controllers/cliente.controller.js';
import { authenticate, isAdmin } from '../../../src/middlewares/autenticacion.js';

describe('Cliente Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de clientes', () => {
    expect(ClienteController).toHaveBeenCalledTimes(1);
  });

  // 🔹 POST /api/cliente
  it('debería tener la ruta POST /api/cliente configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/cliente',
      expect.any(Function) // crearCliente
    );
  });

  // 🔹 GET /api/cliente/todos
  it('debería tener la ruta GET /api/cliente/todos configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/todos',
      expect.any(Function) // obtenerTodosLosClientes
    );
  });

  // 🔹 PUT /api/mi-perfil
  it('debería tener la ruta PUT /api/mi-perfil configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/mi-perfil',
      expect.any(Function), // authenticate
      expect.any(Function)  // actualizarMiPerfil
    );
  });

  // 🔹 GET /api/cliente (protegida)
  it('debería tener la ruta GET /api/cliente configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdmin
      expect.any(Function)  // obtenerClientesActivos
    );
  });

  // 🔹 GET /api/cliente/:id
  it('debería tener la ruta GET /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function) // obtenerClientePorId
    );
  });

  // 🔹 GET /api/cliente/cedula/:numero_de_cedula
  it('debería tener la ruta GET /api/cliente/cedula/:numero_de_cedula configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/cedula/:numero_de_cedula',
      expect.any(Function) // obtenerClientePorCedula
    );
  });

  // 🔹 GET /api/cliente/email/:correo_electronico
  it('debería tener la ruta GET /api/cliente/email/:correo_electronico configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/email/:correo_electronico',
      expect.any(Function) // obtenerClientePorEmail
    );
  });

  // 🔹 PUT /api/cliente/:id
  it('debería tener la ruta PUT /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function) // actualizarCliente
    );
  });

  // 🔹 DELETE /api/cliente/:id
  it('debería tener la ruta DELETE /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function) // eliminarCliente
    );
  });
});
