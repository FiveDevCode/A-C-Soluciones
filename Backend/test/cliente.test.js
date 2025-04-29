const request = require('supertest');
const App = require('../src/app.js'); // ✅ Corrección aquí
const { sequelize } = require('../src/database/conexion.js');

describe('Cliente Router', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/cliente', () => {
    test('debería crear un nuevo cliente', async () => {
      const response = await request(App)
        .post('/api/cliente')
        .send({
          numero_de_cedula: '1234567890',
          nombre: 'Test',
          apellido: 'User',
          correo_electronico: 'test@example.com',
          telefono: '3123456789',
          contrasenia: 'TestP@ss1',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
