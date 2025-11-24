import express from 'express';
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

  it('debería tener la ruta POST /api/cliente configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/cliente',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/cliente/todos configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/todos',
      expect.any(Function)
    );
  });

  it('debería tener la ruta PUT /api/mi-perfil configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/mi-perfil',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/cliente configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/cliente/cedula/:numero_de_cedula configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/cedula/:numero_de_cedula',
      expect.any(Function)
    );
  });

  it('debería tener la ruta GET /api/cliente/email/:correo_electronico configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/cliente/email/:correo_electronico',
      expect.any(Function)
    );
  });

  it('debería tener la ruta PUT /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.put).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function)
    );
  });

  it('debería tener la ruta DELETE /api/cliente/:id configurada correctamente', () => {
    expect(mockRouterInstance.delete).toHaveBeenCalledWith(
      '/api/cliente/:id',
      expect.any(Function)
    );
  });
});
