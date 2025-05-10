import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Simulación del controlador de servicios
jest.mock('../../../src/controllers/servicio.controller.js', () => {
  const mockControllerMethods = {
    obtenerServiciosActivos: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServiciosActivos' })),
    buscarServicios: jest.fn((req, res) => res.status(200).json({ message: 'buscarServicios' })),
    crearServicio: jest.fn((req, res) => res.status(201).json({ message: 'crearServicio' })),
    obtenerServicios: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServicios' })),
    obtenerServicioPorId: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServicioPorId' })),
    obtenerServicioPorNombre: jest.fn((req, res) => res.status(200).json({ message: 'obtenerServicioPorNombre' })),
    actualizarServicio: jest.fn((req, res) => res.status(200).json({ message: 'actualizarServicio' })),
    eliminarServicio: jest.fn((req, res) => res.status(200).json({ message: 'eliminarServicio' })),
    deshabilitarServicio: jest.fn((req, res) => res.status(200).json({ message: 'deshabilitarServicio' })),
    habilitarServicio: jest.fn((req, res) => res.status(200).json({ message: 'habilitarServicio' }))
  };

  return {
    ServicioController: jest.fn().mockImplementation(() => mockControllerMethods),
    __mockControllerMethods: mockControllerMethods
  };
});

// Simulación de los middlewares de autenticación
jest.mock('../../../src/middlewares/autenticacion.js', () => {
  const mockAuthenticate = jest.fn((req, res, next) => next());
  const mockIsAdmin = jest.fn((req, res, next) => next());

  return {
    authenticate: mockAuthenticate,
    isAdmin: mockIsAdmin,
    __mockedAuth: { authenticate: mockAuthenticate, isAdmin: mockIsAdmin }
  };
});

// Importaciones después de configurar las simulaciones
import router from '../../../src/routers/servicio.routes.js';
import { __mockControllerMethods } from '../../../src/controllers/servicio.controller.js';
import { __mockedAuth } from '../../../src/middlewares/autenticacion.js';

describe('Rutas de Servicios', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(router);
  });

  // Pruebas para rutas públicas
  describe('Rutas públicas', () => {
    test('GET /api/servicios/activos debe llamar a obtenerServiciosActivos', async () => {
      const response = await request(app).get('/api/servicios/activos');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.obtenerServiciosActivos).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).not.toHaveBeenCalled();
    });

    test('GET /api/servicios/buscar debe llamar a buscarServicios', async () => {
      const response = await request(app).get('/api/servicios/buscar');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.buscarServicios).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).not.toHaveBeenCalled();
    });
  });

  // Pruebas para rutas que requieren autenticación
  describe('Rutas protegidas - autenticación', () => {
    test('POST /api/servicios debe llamar a crearServicio y requerir autenticación e isAdmin', async () => {
      const response = await request(app).post('/api/servicios');
      expect(response.status).toBe(201);
      expect(__mockControllerMethods.crearServicio).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
      expect(__mockedAuth.isAdmin).toHaveBeenCalled();
    });

    test('GET /api/servicios debe llamar a obtenerServicios y requerir autenticación', async () => {
      const response = await request(app).get('/api/servicios');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.obtenerServicios).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
    });

    test('GET /api/servicios/:id debe llamar a obtenerServicioPorId y requerir autenticación', async () => {
      const response = await request(app).get('/api/servicios/123');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.obtenerServicioPorId).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
    });

    test('GET /api/servicios/nombre/:nombre debe llamar a obtenerServicioPorNombre y requerir autenticación', async () => {
      const response = await request(app).get('/api/servicios/nombre/test');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.obtenerServicioPorNombre).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
    });
  });

  // Pruebas para rutas que requieren ser administrador
  describe('Rutas protegidas - admin', () => {
    test('PUT /api/servicios/:id debe llamar a actualizarServicio y requerir autenticación e isAdmin', async () => {
      const response = await request(app).put('/api/servicios/123');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.actualizarServicio).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
      expect(__mockedAuth.isAdmin).toHaveBeenCalled();
    });

    test('DELETE /api/servicios/:id debe llamar a eliminarServicio y requerir autenticación e isAdmin', async () => {
      const response = await request(app).delete('/api/servicios/123');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.eliminarServicio).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
      expect(__mockedAuth.isAdmin).toHaveBeenCalled();
    });

    test('PATCH /api/servicios/:id/deshabilitar debe llamar a deshabilitarServicio y requerir autenticación e isAdmin', async () => {
      const response = await request(app).patch('/api/servicios/123/deshabilitar');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.deshabilitarServicio).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
      expect(__mockedAuth.isAdmin).toHaveBeenCalled();
    });

    test('PATCH /api/servicios/:id/habilitar debe llamar a habilitarServicio y requerir autenticación e isAdmin', async () => {
      const response = await request(app).patch('/api/servicios/123/habilitar');
      expect(response.status).toBe(200);
      expect(__mockControllerMethods.habilitarServicio).toHaveBeenCalled();
      expect(__mockedAuth.authenticate).toHaveBeenCalled();
      expect(__mockedAuth.isAdmin).toHaveBeenCalled();
    });
  });

  // Prueba adicional para verificar el orden de los middlewares
  describe('Orden de los middlewares', () => {
    test('Los middlewares de autenticación se aplican en el orden correcto', async () => {
      jest.clearAllMocks();

      let authOrder = 0;
      let adminOrder = 0;

      __mockedAuth.authenticate.mockImplementation((req, res, next) => {
        authOrder = 1;
        next();
      });

      __mockedAuth.isAdmin.mockImplementation((req, res, next) => {
        adminOrder = authOrder + 1;
        next();
      });

      await request(app).post('/api/servicios');

      expect(authOrder).toBe(1);
      expect(adminOrder).toBe(2);
    });
  });
});
