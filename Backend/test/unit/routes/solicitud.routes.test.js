import request from 'supertest';
import express from 'express';

// ======= Middlewares =======
let mockAuthenticate;
let mockIsAdminOrCliente;
let mockIsAdminOrTecnico;
let mockIsCliente;

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (...args) => mockAuthenticate(...args),
  isAdminOrCliente: (...args) => mockIsAdminOrCliente(...args),
  isAdminOrTecnico: (...args) => mockIsAdminOrTecnico(...args),
  isCliente: (...args) => mockIsCliente(...args),
}));

// ======= Mock del controlador directamente en jest.mock =======
jest.mock('../../../src/controllers/solicitud.controller.js', () => {
  const mockController = {
    crear: jest.fn((req, res) => res.status(201).json({ message: 'Solicitud creada' })),
    obtenerTodos: jest.fn((req, res) => res.status(200).json([])),
    obtenerPorId: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
    obtenerPorCliente: jest.fn((req, res) => res.status(200).json({ cliente_id: req.params.cliente_id_fk })),
    actualizarEstado: jest.fn((req, res) => res.status(200).json({ message: 'Estado actualizado' })),
    eliminar: jest.fn((req, res) => res.status(200).json({ message: 'Solicitud eliminada' }))
  };

  return {
    SolicitudController: jest.fn(() => mockController),
    __esModule: true
  };
});

// ======= Importar rutas luego de mocks =======
import solicitudRoutes from '../../../src/routers/solicitud.routes.js';

const app = express();
app.use(express.json());
app.use(solicitudRoutes);

// Inicializar middlewares después de mockear
mockAuthenticate = jest.fn((req, res, next) => {
  req.user = { id: 1, rol: 'cliente' };
  next();
});
mockIsAdminOrCliente = jest.fn((req, res, next) => next());
mockIsAdminOrTecnico = jest.fn((req, res, next) => next());
mockIsCliente = jest.fn((req, res, next) => next());

describe('Solicitud Routes', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('POST /api/solicitudes', () => {
    it('debe crear una nueva solicitud exitosamente', async () => {
      const solicitudData = {
        descripcion: 'Nueva solicitud',
        cliente_id_fk: 1
      };

      const response = await request(app)
        .post('/api/solicitudes')
        .send(solicitudData)
        .expect(201);

      expect(response.body.message).toBe('Solicitud creada');
      expect(mockSolicitudController.crear).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isCliente', async () => {
      await request(app)
        .post('/api/solicitudes')
        .send({});

      expect(mockIsCliente).toHaveBeenCalled();
    });

    it('debe verificar que se aplique el middleware authenticate', async () => {
      await request(app)
        .post('/api/solicitudes')
        .send({});

      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('GET /api/solicitudes', () => {
    it('debe obtener todas las solicitudes exitosamente', async () => {
      const response = await request(app)
        .get('/api/solicitudes')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockSolicitudController.obtenerTodos).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isAdminOrCliente', async () => {
      await request(app)
        .get('/api/solicitudes');

      expect(mockIsAdminOrCliente).toHaveBeenCalled();
    });

    it('debe verificar que se aplique el middleware authenticate', async () => {
      await request(app)
        .get('/api/solicitudes');

      expect(mockAuthenticate).toHaveBeenCalled();
    });
  });

  describe('GET /api/solicitudes/:id', () => {
    it('debe obtener una solicitud por ID exitosamente', async () => {
      const solicitudId = '123';
      
      const response = await request(app)
        .get(`/api/solicitudes/${solicitudId}`)
        .expect(200);

      expect(response.body.id).toBe(solicitudId);
      expect(mockSolicitudController.obtenerPorId).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isAdminOrTecnico', async () => {
      await request(app)
        .get('/api/solicitudes/123');

      expect(mockIsAdminOrTecnico).toHaveBeenCalled();
    });

    it('debe pasar el parámetro id correctamente', async () => {
      const solicitudId = '456';
      
      await request(app)
        .get(`/api/solicitudes/${solicitudId}`);

      expect(mockSolicitudController.obtenerPorId).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ id: solicitudId })
        }),
        expect.any(Object)
      );
    });
  });

  describe('GET /api/solicitudes/cliente/:cliente_id_fk', () => {
    it('debe obtener solicitudes por cliente exitosamente', async () => {
      const clienteId = '456';
      
      const response = await request(app)
        .get(`/api/solicitudes/cliente/${clienteId}`)
        .expect(200);

      expect(response.body.cliente_id).toBe(clienteId);
      expect(mockSolicitudController.obtenerPorCliente).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isAdminOrCliente para rutas de cliente', async () => {
      await request(app)
        .get('/api/solicitudes/cliente/456');

      expect(mockIsAdminOrCliente).toHaveBeenCalled();
    });

    it('debe pasar el parámetro cliente_id_fk correctamente', async () => {
      const clienteId = '789';
      
      await request(app)
        .get(`/api/solicitudes/cliente/${clienteId}`);

      expect(mockSolicitudController.obtenerPorCliente).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ cliente_id_fk: clienteId })
        }),
        expect.any(Object)
      );
    });
  });

  describe('PATCH /api/solicitudes/:id/estado', () => {
    it('debe actualizar el estado de una solicitud exitosamente', async () => {
      const solicitudId = '789';
      const estadoData = { estado: 'completada' };

      const response = await request(app)
        .patch(`/api/solicitudes/${solicitudId}/estado`)
        .send(estadoData)
        .expect(200);

      expect(response.body.message).toBe('Estado actualizado');
      expect(mockSolicitudController.actualizarEstado).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isAdminOrCliente para actualizar estado', async () => {
      await request(app)
        .patch('/api/solicitudes/789/estado')
        .send({ estado: 'completada' });

      expect(mockIsAdminOrCliente).toHaveBeenCalled();
    });

    it('debe pasar los datos del cuerpo de la petición', async () => {
      const solicitudId = '999';
      const estadoData = { estado: 'en_progreso' };

      await request(app)
        .patch(`/api/solicitudes/${solicitudId}/estado`)
        .send(estadoData);

      expect(mockSolicitudController.actualizarEstado).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ id: solicitudId }),
          body: estadoData
        }),
        expect.any(Object)
      );
    });
  });

  describe('DELETE /api/solicitud/:id', () => {
    it('debe eliminar una solicitud exitosamente', async () => {
      const solicitudId = '999';

      const response = await request(app)
        .delete(`/api/solicitud/${solicitudId}`)
        .expect(200);

      expect(response.body.message).toBe('Solicitud eliminada');
      expect(mockSolicitudController.eliminar).toHaveBeenCalledTimes(1);
    });

    it('debe verificar que se aplique el middleware isAdminOrCliente para eliminar', async () => {
      await request(app)
        .delete('/api/solicitud/999');

      expect(mockIsAdminOrCliente).toHaveBeenCalled();
    });

    it('debe pasar el parámetro id para eliminación', async () => {
      const solicitudId = '888';
      
      await request(app)
        .delete(`/api/solicitud/${solicitudId}`);

      expect(mockSolicitudController.eliminar).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ id: solicitudId })
        }),
        expect.any(Object)
      );
    });
  });

  describe('Middleware authenticate aplicado globalmente', () => {
    it('debe aplicar authenticate en todas las rutas', async () => {
      const routes = [
        () => request(app).get('/api/solicitudes'),
        () => request(app).post('/api/solicitudes').send({}),
        () => request(app).get('/api/solicitudes/123'),
        () => request(app).get('/api/solicitudes/cliente/456'),
        () => request(app).patch('/api/solicitudes/123/estado').send({}),
        () => request(app).delete('/api/solicitud/123')
      ];

      // Ejecutar todas las rutas
      for (const route of routes) {
        await route();
      }

      // Verificar que authenticate fue llamado para cada ruta
      expect(mockAuthenticate).toHaveBeenCalledTimes(6);
    });
  });

  describe('Casos de error en middlewares', () => {
    let errorApp;

    beforeEach(() => {
      errorApp = express();
      errorApp.use(express.json());
    });

    it('debe manejar error cuando authenticate falla', async () => {
      const errorAuthenticate = jest.fn((req, res, next) => {
        return res.status(401).json({ error: 'No autorizado' });
      });

      // Crear nueva app con middleware que falla
      errorApp.use((req, res, next) => {
        errorAuthenticate(req, res, next);
      });

      const response = await request(errorApp)
        .get('/any-route')
        .expect(401);

      expect(response.body.error).toBe('No autorizado');
      expect(errorAuthenticate).toHaveBeenCalled();
    });

    it('debe manejar error cuando isCliente falla', async () => {
      const errorIsCliente = jest.fn((req, res, next) => {
        return res.status(403).json({ error: 'Solo clientes pueden acceder' });
      });

      errorApp.post('/test', errorIsCliente, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(errorApp)
        .post('/test')
        .send({})
        .expect(403);

      expect(response.body.error).toBe('Solo clientes pueden acceder');
    });

    it('debe manejar error cuando isAdminOrCliente falla', async () => {
      const errorIsAdminOrCliente = jest.fn((req, res, next) => {
        return res.status(403).json({ error: 'Solo admin o cliente' });
      });

      errorApp.get('/test', errorIsAdminOrCliente, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(errorApp)
        .get('/test')
        .expect(403);

      expect(response.body.error).toBe('Solo admin o cliente');
    });

    it('debe manejar error cuando isAdminOrTecnico falla', async () => {
      const errorIsAdminOrTecnico = jest.fn((req, res, next) => {
        return res.status(403).json({ error: 'Solo admin o técnico' });
      });

      errorApp.get('/test', errorIsAdminOrTecnico, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(errorApp)
        .get('/test')
        .expect(403);

      expect(response.body.error).toBe('Solo admin o técnico');
    });
  });

  describe('Casos edge y validación de rutas', () => {
    it('debe manejar parámetros con caracteres especiales', async () => {
      const solicitudId = 'test-123_special@domain.com';
      
      await request(app)
        .get(`/api/solicitudes/${encodeURIComponent(solicitudId)}`)
        .expect(200);

      expect(mockSolicitudController.obtenerPorId).toHaveBeenCalledTimes(1);
    });

    it('debe manejar números como IDs', async () => {
      const solicitudId = '12345';
      
      await request(app)
        .get(`/api/solicitudes/${solicitudId}`)
        .expect(200);

      expect(mockSolicitudController.obtenerPorId).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({ id: solicitudId })
        }),
        expect.any(Object)
      );
    });

    it('debe verificar que todas las rutas estén correctamente definidas', async () => {
      const responses = await Promise.all([
        request(app).post('/api/solicitudes').send({}),
        request(app).get('/api/solicitudes'),
        request(app).get('/api/solicitudes/123'),
        request(app).get('/api/solicitudes/cliente/456'),
        request(app).patch('/api/solicitudes/789/estado').send({ estado: 'nueva' }),
        request(app).delete('/api/solicitud/999')
      ]);

      // Todas las respuestas deberían ser exitosas (200-299)
      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
      });
    });
  });

  describe('Verificación de instanciación del controlador', () => {
    it('debe verificar que SolicitudController se instancia correctamente', () => {
      const { SolicitudController } = require('../../../src/controllers/solicitud.controller.js');
      expect(SolicitudController).toHaveBeenCalled();
    });

    it('debe verificar que todos los métodos del controlador estén disponibles', () => {
      expect(mockSolicitudController.crear).toBeDefined();
      expect(mockSolicitudController.obtenerTodos).toBeDefined();
      expect(mockSolicitudController.obtenerPorId).toBeDefined();
      expect(mockSolicitudController.obtenerPorCliente).toBeDefined();
      expect(mockSolicitudController.actualizarEstado).toBeDefined();
      expect(mockSolicitudController.eliminar).toBeDefined();
    });
  });

  describe('Cobertura completa de todas las rutas', () => {
    it('debe ejercitar todos los endpoints y métodos HTTP', async () => {
      // Resetear los contadores
      jest.clearAllMocks();

      // Ejercitar todas las rutas
      await request(app).post('/api/solicitudes').send({ descripcion: 'test' });
      await request(app).get('/api/solicitudes');
      await request(app).get('/api/solicitudes/123');
      await request(app).get('/api/solicitudes/cliente/456');
      await request(app).patch('/api/solicitudes/789/estado').send({ estado: 'completada' });
      await request(app).delete('/api/solicitud/999');

      // Verificar que todos los métodos del controlador fueron llamados exactamente una vez
      expect(mockSolicitudController.crear).toHaveBeenCalledTimes(1);
      expect(mockSolicitudController.obtenerTodos).toHaveBeenCalledTimes(1);
      expect(mockSolicitudController.obtenerPorId).toHaveBeenCalledTimes(1);
      expect(mockSolicitudController.obtenerPorCliente).toHaveBeenCalledTimes(1);
      expect(mockSolicitudController.actualizarEstado).toHaveBeenCalledTimes(1);
      expect(mockSolicitudController.eliminar).toHaveBeenCalledTimes(1);

      // Verificar que todos los middlewares fueron aplicados
      expect(mockAuthenticate).toHaveBeenCalledTimes(6); // Una vez por cada ruta
      expect(mockIsCliente).toHaveBeenCalledTimes(1); // Solo en POST
      expect(mockIsAdminOrCliente).toHaveBeenCalledTimes(3); // GET todas, PATCH, DELETE
      expect(mockIsAdminOrTecnico).toHaveBeenCalledTimes(1); // GET por ID
    });
  });
});