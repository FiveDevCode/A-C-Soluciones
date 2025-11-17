import express from 'express';

// Mocks de express y sus métodos
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

// Mock de controladores
jest.mock('../../../src/controllers/chatbot.controller.js', () => ({
  chatbotReply: jest.fn(),
  addIntent: jest.fn(),
  verPendientes: jest.fn(),
  asociarPendiente: jest.fn(),
}));

// Importar después de mockear
import router from '../../../src/routers/chatbot.routes.js';
import {
  chatbotReply,
  addIntent,
  verPendientes,
  asociarPendiente,
} from '../../../src/controllers/chatbot.controller.js';

describe('Chatbot Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = express.Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(express.Router).toHaveBeenCalledTimes(1);
  });

  it(' debería tener la ruta POST /api/intent configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/intent',
      addIntent
    );
  });

  it('debería tener la ruta POST /api/chat configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/chat',
      chatbotReply
    );
  });

  it(' debería tener la ruta GET /api/pendientes configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/pendientes',
      verPendientes
    );
  });

  it(' debería tener la ruta POST /api/pendientes/asociar configurada correctamente', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      '/api/pendientes/asociar',
      asociarPendiente
    );
  });

  it('debería exportar correctamente el router', () => {
    expect(router).toBe(mockRouterInstance);
  });
});
