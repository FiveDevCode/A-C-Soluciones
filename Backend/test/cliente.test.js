import request from 'supertest';
import App from '../src/app.js';
import { sequelize } from '../src/database/conexion.js';
import { describe, test, expect, jest } from '@jest/globals';

describe('Tecnico Router', () => {
  // Conexión a la base de datos antes de todos los tests
  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true }); // recrea las tablas
    } catch (error) {
      console.error('Error en beforeAll:', error);
    }
  }, 30000); // aumenta el timeout

  // Cierra la conexión después de todos los tests
  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error('Error cerrando la conexión:', error);
    }
  });

  test('debería crear un nuevo cliente', async () => {
    const response = await request(App)
      .post('/api/cliente')
      .send({
        numero_de_cedula: "1006326601",
         nombre: "Test",
         apellido: "User",
         correo_electronico: "test@example.com",
         telefono: "3123456789",
         contrasenia: "Daniel21@",
         especialidad: "Mecanico",
         estado: "activo" // <<--- este campo era necesario
      });
  
    console.log('🧪 Response:', response.body);
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
  
});
