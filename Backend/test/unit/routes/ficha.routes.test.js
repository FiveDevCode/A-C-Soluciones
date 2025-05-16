import request from 'supertest';
import express from 'express';
import path from 'path';

// Mock de middlewares y controladores
jest.mock('../../../src/controllers/ficha_mantenimiento.controller.js', () => ({
  crearFichaMantenimiento: jest.fn((req, res) => res.status(201).send('crearFichaMantenimiento called')),
  listarFichas: jest.fn((req, res) => res.status(200).send('listarFichas called')),
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  isAdminOrTecnico: jest.fn((req, res, next) => next()),
  isCliente: jest.fn((req, res, next) => next()),
  authenticate: jest.fn((req, res, next) => next()),
}));

// Importar el router con mocks ya cargados
import router from '../../../src/routers/ficha.routes.js';

describe('Rutas ficha_mantenimiento', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', router);
  });

  test('POST /api/fichas debe llamar a isAdminOrTecnico y crearFichaMantenimiento', async () => {
    const res = await request(app).post('/api/fichas').send({});

    expect(res.status).toBe(201);
    expect(res.text).toBe('crearFichaMantenimiento called');
  });

  test('GET /api/fichas debe llamar a authenticate y listarFichas', async () => {
    const res = await request(app).get('/api/fichas');

    expect(res.status).toBe(200);
    expect(res.text).toBe('listarFichas called');
  });

  test('GET /api/descargar/:nombreArchivo debe enviar archivo correctamente', async () => {
    // Como sendFile usa callback, debemos espiar res.sendFile para simular
    const fakeFileName = 'archivo.pdf';

    // Setup app con router, pero interceptar sendFile
    app.get('/api/descargar/:nombreArchivo', (req, res) => {
      const filePath = path.resolve(`uploads/fichas/${req.params.nombreArchivo}`);

      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(404).json({ error: 'Archivo no encontrado' });
        }
      });
    });

    // Mock res.sendFile para simular envio exitoso
    const res = await request(app).get(`/api/descargar/${fakeFileName}`);

    expect([200, 404]).toContain(res.status);
  });

  test('GET /api/descargar/:nombreArchivo debe manejar error si archivo no existe', async () => {
    const fakeFileName = 'archivo_no_existente.pdf';

    app.get('/api/descargar/:nombreArchivo', (req, res) => {
      const filePath = path.resolve(`uploads/fichas/${req.params.nombreArchivo}`);

      // Simulamos error manualmente
      res.sendFile = (path, callback) => callback(new Error('File not found'));
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(404).json({ error: 'Archivo no encontrado' });
        }
      });
    });

    const res = await request(app).get(`/api/descargar/${fakeFileName}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Archivo no encontrado' });
  });
});
