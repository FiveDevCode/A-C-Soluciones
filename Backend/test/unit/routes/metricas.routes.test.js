// test/unit/routes/metricas.routes.test.js
import { Router } from 'express';

// Mock de dependencias
jest.mock('express', () => ({
  Router: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('../../../src/controllers/metricas.controller.js', () => ({
  MetricasController: jest.fn().mockImplementation(() => ({
    obtenerServiciosMasSolicitados: jest.fn(),
    obtenerSolicitudesPorEstado: jest.fn(),
    obtenerClientesMasActivos: jest.fn(),
    obtenerTecnicosMasActivos: jest.fn(),
    obtenerEstadisticasGenerales: jest.fn(),
    obtenerVisitasPorEstado: jest.fn(),
    obtenerDashboardCompleto: jest.fn(),
  })),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn(),
  isAdminOrContador: jest.fn(),
}));

// Importar después de los mocks
import router from '../../../src/routers/metricas.routes.js';
import { MetricasController } from '../../../src/controllers/metricas.controller.js';
import {
  authenticate,
  isAdminOrContador,
} from '../../../src/middlewares/autenticacion.js';

describe('Metricas Router', () => {
  let mockRouterInstance;

  beforeAll(() => {
    mockRouterInstance = Router.mock.results[0].value;
  });

  it('debería crear una instancia del router', () => {
    expect(Router).toHaveBeenCalledTimes(1);
  });

  it('debería crear una instancia del controlador de métricas', () => {
    expect(MetricasController).toHaveBeenCalledTimes(1);
  });

  it('debería tener la ruta GET /api/metricas/servicios-mas-solicitados configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/servicios-mas-solicitados',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerServiciosMasSolicitados
    );
  });

  it('debería tener la ruta GET /api/metricas/solicitudes-por-estado configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/solicitudes-por-estado',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerSolicitudesPorEstado
    );
  });

  it('debería tener la ruta GET /api/metricas/clientes-mas-activos configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/clientes-mas-activos',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerClientesMasActivos
    );
  });

  it('debería tener la ruta GET /api/metricas/tecnicos-mas-activos configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/tecnicos-mas-activos',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerTecnicosMasActivos
    );
  });

  it('debería tener la ruta GET /api/metricas/estadisticas-generales configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/estadisticas-generales',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerEstadisticasGenerales
    );
  });

  it('debería tener la ruta GET /api/metricas/visitas-por-estado configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/visitas-por-estado',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerVisitasPorEstado
    );
  });

  it('debería tener la ruta GET /api/metricas/dashboard configurada correctamente', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/api/metricas/dashboard',
      expect.any(Function), // authenticate
      expect.any(Function), // isAdminOrContador
      expect.any(Function)  // metricasController.obtenerDashboardCompleto
    );
  });

  it('debería configurar exactamente 7 rutas GET', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledTimes(7);
  });

  it('todas las rutas deben estar protegidas con authenticate', () => {
    const getCalls = mockRouterInstance.get.mock.calls;
    getCalls.forEach((call) => {
      // El segundo argumento debe ser authenticate
      expect(call[1]).toBe(authenticate);
    });
  });

  it('todas las rutas deben requerir isAdminOrContador', () => {
    const getCalls = mockRouterInstance.get.mock.calls;
    getCalls.forEach((call) => {
      // El tercer argumento debe ser isAdminOrContador
      expect(call[2]).toBe(isAdminOrContador);
    });
  });

  it('todas las rutas deben empezar con /api/metricas', () => {
    const getCalls = mockRouterInstance.get.mock.calls;
    getCalls.forEach((call) => {
      // El primer argumento (la ruta) debe empezar con /api/metricas
      expect(call[0]).toMatch(/^\/api\/metricas/);
    });
  });
});
