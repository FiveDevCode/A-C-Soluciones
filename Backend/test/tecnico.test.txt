const request = require('supertest');
const { App } = require('../src/app.js');  // Cambia import a require
const { sequelize } = require('../src/database/conexion.js');

describe('Tecnico Router', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/tecnico', () => {
    test('debería crear un nuevo técnico', async () => {
      const response = await request(App)  // Usa App directamente (sin new)
        .post('/api/tecnico')
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