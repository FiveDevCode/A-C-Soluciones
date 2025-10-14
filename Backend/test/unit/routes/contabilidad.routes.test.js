
import express from 'express';
import request from 'supertest';
import contabilidadRouter from '../../../src/routers/contabilidad.routes.js';
import { ContabilidadController } from '../../../src/controllers/contabilidad.controller.js';
import { authenticate, isAdmin } from '../../../src/middlewares/autenticacion.js';

jest.mock('../../../src/controllers/contabilidad.controller.js');
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use(contabilidadRouter);

describe('Contabilidad Routes', () => {
  let contabilidadControllerMock;

  beforeEach(() => {
    contabilidadControllerMock = new ContabilidadController();
    ContabilidadController.mock.instances[0] = contabilidadControllerMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería llamar a crearContabilidad en POST /api/contabilidad', async () => {
    contabilidadControllerMock.crearContabilidad = jest.fn((req, res) => res.sendStatus(201));
    await request(app).post('/api/contabilidad').send({});
    expect(contabilidadControllerMock.crearContabilidad).toHaveBeenCalled();
  });

  it('debería llamar a obtenerContabilidadPorId en GET /api/contabilidad/:id', async () => {
    contabilidadControllerMock.obtenerContabilidadPorId = jest.fn((req, res) => res.sendStatus(200));
    await request(app).get('/api/contabilidad/1');
    expect(contabilidadControllerMock.obtenerContabilidadPorId).toHaveBeenCalled();
  });

  it('debería llamar a obtenerContabilidadPorCedula en GET /api/contabilidad/cedula/:numero_cedula', async () => {
    contabilidadControllerMock.obtenerContabilidadPorCedula = jest.fn((req, res) => res.sendStatus(200));
    await request(app).get('/api/contabilidad/cedula/123');
    expect(contabilidadControllerMock.obtenerContabilidadPorCedula).toHaveBeenCalled();
  });

  it('debería llamar a obtenerContabilidadPorCorreo en GET /api/contabilidad/correo/:correo_electronico', async () => {
    contabilidadControllerMock.obtenerContabilidadPorCorreo = jest.fn((req, res) => res.sendStatus(200));
    await request(app).get('/api/contabilidad/correo/a@a.com');
    expect(contabilidadControllerMock.obtenerContabilidadPorCorreo).toHaveBeenCalled();
  });

  it('debería llamar a eliminarContabilidad en DELETE /api/contabilidad/:id', async () => {
    contabilidadControllerMock.eliminarContabilidad = jest.fn((req, res) => res.sendStatus(200));
    await request(app).delete('/api/contabilidad/1');
    expect(contabilidadControllerMock.eliminarContabilidad).toHaveBeenCalled();
  });

  it('debería llamar a autenticarContabilidad en POST /api/admin/login', async () => {
    contabilidadControllerMock.autenticarContabilidad = jest.fn((req, res) => res.sendStatus(200));
    await request(app).post('/api/admin/login').send({});
    expect(contabilidadControllerMock.autenticarContabilidad).toHaveBeenCalled();
  });

  it('debería usar los middlewares authenticate y isAdmin en las rutas protegidas', async () => {
    expect(authenticate).toHaveBeenCalled();
    expect(isAdmin).toHaveBeenCalled();
  });
});
