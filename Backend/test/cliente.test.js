import request from 'supertest';
import App from '../src/app.js'; 
import { sequelize } from '../src/database/conexion.js';
import { encryptPasswordHook } from '../src/hooks/encryptPassword.js';

describe('Cliente Router', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  }, 30000); // Aumenta el timeout a 30 segundos
  
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/cliente', () => {
    test('debería crear un nuevo cliente', async () => {
      const response = await request(App)
        .post('/api/cliente')
        .send({
          numero_de_cedula: '66779008',
          nombre: 'Test',
          apellido: 'User',
          correo_electronico: 'test@example.com',
          telefono: '3123456789',
          contrasenia: 'TestP@ss1',
          direccion: 'Calle falsa 123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
