import request from 'supertest';
import  App  from '../src/app.js';
import { sequelize } from '../src/database/conexion.js';

describe('Tecnico Router', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  },20000);

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/tecnico', () => {
    test('debería crear un nuevo técnico', async () => {
      const response = await request(App)
        .post('/api/tecnico')
        .send({
         numero_de_cedula: "1123698860",
         nombre: "Test",
         apellido: "User",
         correo_electronico: "test@example.com",
         telefono: "3123456789",
         contrasenia: "Daniel21@",
         especialidad: "Mecanico",
         estado: "activo"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});