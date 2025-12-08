import request from 'supertest';
import express from 'express';
import path from 'path';
import fichaRouter from '../../../src/routers/ficha.routes.js';
import * as controller from '../../../src/controllers/ficha_mantenimiento.controller.js';
import * as auth from '../../../src/middlewares/autenticacion.js';

jest.mock('../../../src/middlewares/autenticacion.js');
jest.mock('../../../src/controllers/ficha_mantenimiento.controller.js');
jest.mock('../../../src/middlewares/uploadImages.js', () => ({
  fields: () => (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/', fichaRouter);

// 🧪 Mocks
const dummyFicha = { mensaje: 'creada' };
const dummyList = [{ id: 1 }];

beforeEach(() => {
  jest.clearAllMocks();
  auth.isAdminOrTecnico.mockImplementation((req, res, next) => next());
  auth.authenticate.mockImplementation((req, res, next) => next());
  auth.isCliente.mockImplementation((req, res, next) => next());

  controller.crearFichaMantenimiento.mockImplementation((req, res) =>
    res.status(201).json(dummyFicha)
  );

  controller.listarFichas.mockImplementation((req, res) =>
    res.status(200).json(dummyList)
  );
});

it('debería crear una ficha con POST /fichas', async () => {
  const res = await request(app).post('/fichas').send({ id_cliente: 1 });

  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual(dummyFicha);
  expect(controller.crearFichaMantenimiento).toHaveBeenCalled();
});

it('debería listar fichas con GET /fichas', async () => {
  const res = await request(app).get('/fichas');

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual(dummyList);
  expect(controller.listarFichas).toHaveBeenCalled();
});

it.skip('debería enviar un archivo con GET /descargar/:nombreArchivo', async () => {
  const filePath = path.resolve('uploads/fichas/test.pdf');

  // Creamos el archivo temporal para test
  const fs = await import('fs');
  fs.writeFileSync(filePath, 'contenido');

  const res = await request(app).get('/descargar/test.pdf');

  expect(res.statusCode).toBe(200);

  fs.unlinkSync(filePath);
}, 10000);

it.skip('debería devolver 404 si el archivo no se encuentra', async () => {
  const originalSendFile = express.response.sendFile;
  express.response.sendFile = function (filePath, cb) {
    cb(new Error('No encontrado'));
  };

  const res = await request(app).get('/descargar/no-existe.pdf');
  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'Archivo no encontrado' });

  express.response.sendFile = originalSendFile; // restaurar
}, 10000);
