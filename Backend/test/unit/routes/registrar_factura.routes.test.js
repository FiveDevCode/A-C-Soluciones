
import express from 'express';
import request from 'supertest';

// Mock a los middlewares de autenticación
jest.mock('../../../src/middlewares/autenticacion.js', () => ({
  authenticate: (req, res, next) => next(),
  isAdminOrContabilidad: (req, res, next) => next(),
}));

// Mock al controlador completo
const mockController = {
    crearRegistroFactura: jest.fn(),
    obtenerRegistros: jest.fn(),
    obtenerRegistroPorCliente: jest.fn(),
    obtenerPorEstado: jest.fn(),
    obtenerPorSaldoPendiente: jest.fn(),
    obtenerRegistroPorNumero: jest.fn(),
    obtenerRegistroPorId: jest.fn(),
    actualizarRegistroFactura: jest.fn(),
    eliminarRegistroFactura: jest.fn(),
};

jest.mock('../../../src/controllers/registrar_facturas.controller.js', () => ({
    RegistrarFacturasController: jest.fn(() => mockController),
}));

const app = express();
app.use(express.json());

// Import router after mocks and app instantiation
const router = require('../../../src/routers/registrar_factura.routes.js').default;
app.use('/api', router); // Montamos el router en /api para que coincida con las rutas

describe('Registrar Factura Routes', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para POST /api/registrar-factura
  describe('POST /registrar-factura', () => {
    it('debe llamar a crearRegistroFactura y devolver 201', async () => {
      const facturaData = { numero_factura: 'F-001', monto: 100 };
      mockController.crearRegistroFactura.mockImplementation((req, res) => {
        res.status(201).json({ message: 'Factura creada' });
      });

      const response = await request(app)
        .post('/api/registrar-factura')
        .send(facturaData);

      expect(mockController.crearRegistroFactura).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Factura creada' });
    });
  });

  // Pruebas para GET /api/facturas
  describe('GET /facturas', () => {
    it('debe llamar a obtenerRegistros y devolver 200', async () => {
      const facturas = [{ id: 1 }];
      mockController.obtenerRegistros.mockImplementation((req, res) => {
        res.status(200).json(facturas);
      });

      const response = await request(app).get('/api/facturas');

      expect(mockController.obtenerRegistros).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(facturas);
    });
  });

  // Pruebas para GET /api/factura/:id
  describe('GET /factura/:id', () => {
    it('debe llamar a obtenerRegistroPorId y devolver 200', async () => {
        const factura = { id: 1 };
        mockController.obtenerRegistroPorId.mockImplementation((req, res) => {
            res.status(200).json(factura);
        });

        const response = await request(app).get('/api/factura/1');

        expect(mockController.obtenerRegistroPorId).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(factura);
    });
  });


});
