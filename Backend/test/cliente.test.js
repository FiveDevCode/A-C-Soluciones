import { jest } from '@jest/globals';
import request from 'supertest';
import App from '../src/app.js';
import { sequelize } from '../src/database/conexion.js';

import { ClienteService } from '../src/services/cliente.services.js';
import { ClienteRepository } from '../src/repository/cliente.repository.js';

// ----------- TEST DE RUTA -----------
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

// ----------- TEST DE SERVICIO -----------
describe('ClienteService', () => {
  let clienteService;

  const mockCliente = {
    id: 1,
    numero_de_cedula: '12345678',
    nombre: 'Juan',
    apellido: 'Pérez',
    correo_electronico: 'juan@example.com',
    telefono: '3123456789',
    direccion: 'Calle 123',
    contrasenia: 'encriptada123'
  };

  beforeEach(() => {
    clienteService = new ClienteService();

    // Mock manual de los métodos del repositorio
    clienteService.clienteRepository = {
      crearCliente: jest.fn(),
      obtenerClientePorId: jest.fn(),
      obtenerClientePorEmail: jest.fn(),
      obtenerTodosLosClientes: jest.fn(),
      ObtenerClientesActivos: jest.fn(),
      obtenerClientePorCedula: jest.fn(),
      eliminarCliente: jest.fn(),
      actualizarCliente: jest.fn()
    };
  });

  test('crearCliente debería llamar al método del repositorio', async () => {
    clienteService.clienteRepository.crearCliente.mockResolvedValue(mockCliente);

    const result = await clienteService.crearCliente(mockCliente);

    expect(result).toEqual(mockCliente);
    expect(clienteService.clienteRepository.crearCliente).toHaveBeenCalledWith(mockCliente);
  });

  test('obtenerClientePorId debería retornar un cliente', async () => {
    clienteService.clienteRepository.obtenerClientePorId.mockResolvedValue(mockCliente);

    const result = await clienteService.obtenerClientePorId(1);

    expect(result).toEqual(mockCliente);
  });

  test('obtenerClientePorEmail debería retornar un cliente', async () => {
    clienteService.clienteRepository.obtenerClientePorEmail.mockResolvedValue(mockCliente);

    const result = await clienteService.obtenerClientePorEmail('juan@example.com');

    expect(result).toEqual(mockCliente);
  });

  test('obtenerTodosLosClientes debería retornar un array de clientes', async () => {
    clienteService.clienteRepository.obtenerTodosLosClientes.mockResolvedValue([mockCliente]);

    const result = await clienteService.obtenerTodosLosClientes();

    expect(result).toEqual([mockCliente]);
  });

  test('obtenerClientesActivos debería retornar clientes activos', async () => {
    clienteService.clienteRepository.ObtenerClientesActivos.mockResolvedValue([mockCliente]);

    const result = await clienteService.obtenerClientesActivos();

    expect(result).toEqual([mockCliente]);
  });

  test('obtenerClientePorCedula debería retornar un cliente', async () => {
    clienteService.clienteRepository.obtenerClientePorCedula.mockResolvedValue(mockCliente);

    const result = await clienteService.obtenerClientePorCedula('12345678');

    expect(result).toEqual(mockCliente);
  });

  test('eliminarCliente debería retornar cliente eliminado', async () => {
    clienteService.clienteRepository.eliminarCliente.mockResolvedValue(mockCliente);

    const result = await clienteService.eliminarCliente(1);

    expect(result).toEqual(mockCliente);
  });

  test('eliminarCliente lanza error si no encuentra cliente', async () => {
    clienteService.clienteRepository.eliminarCliente.mockResolvedValue(null);

    await expect(clienteService.eliminarCliente(999)).rejects.toThrow('Cliente no encontrado');
  });

  test('actualizarCliente debería actualizar correctamente', async () => {
    const updatedData = { nombre: 'NuevoNombre' };
    clienteService.clienteRepository.actualizarCliente.mockResolvedValue({
      ...mockCliente,
      ...updatedData
    });

    const result = await clienteService.actualizarCliente(1, updatedData);

    expect(result.nombre).toBe('NuevoNombre');
  });
});
