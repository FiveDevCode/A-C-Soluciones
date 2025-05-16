import { jest } from '@jest/globals';
import { ClienteService } from '../../../src/services/cliente.services.js';
import { ClienteRepository } from '../../../src/repository/cliente.repository.js';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js'; 

jest.mock('../../../src/repository/cliente.repository.js');
jest.mock('../../../src/hooks/encryptPassword.js', () => ({
  encryptPasswordHook: jest.fn((pass) => Promise.resolve(`hashed_${pass}`))
}));

describe('ClienteService', () => {
  let clienteService;
  let mockClienteRepository;

  const mockCliente = {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Ramírez',
    numero_de_cedula: '1234567890',
    correo_electronico: 'carlos.ramirez@example.com',
    estado: 'activo'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockClienteRepository = {
      crearCliente: jest.fn(),
      obtenerClientePorId: jest.fn(),
      obtenerClientePorEmail: jest.fn(),
      obtenerTodosLosClientes: jest.fn(),
      ObtenerClientesActivos: jest.fn(),
      obtenerClientePorCedula: jest.fn(),
      eliminarCliente: jest.fn(),
      actualizarCliente: jest.fn(),
      actualizarinfoCliente: jest.fn(),  
    };

    ClienteRepository.mockImplementation(() => mockClienteRepository);
    clienteService = new ClienteService();
  });

  describe('crearCliente', () => {
    it('debe crear un cliente y devolver el resultado', async () => {
      const clienteData = { nombre: 'Carlos', correo_electronico: 'carlos@example.com' };
      mockClienteRepository.crearCliente.mockResolvedValue(mockCliente);

      const result = await clienteService.crearCliente(clienteData);

      expect(mockClienteRepository.crearCliente).toHaveBeenCalledWith(clienteData);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('obtenerClientePorId', () => {
    it('debe devolver el cliente correspondiente al ID', async () => {
      const id = 1;
      mockClienteRepository.obtenerClientePorId.mockResolvedValue(mockCliente);

      const result = await clienteService.obtenerClientePorId(id);

      expect(mockClienteRepository.obtenerClientePorId).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockCliente);
    });

    it('debe devolver null si no encuentra al cliente', async () => {
      mockClienteRepository.obtenerClientePorId.mockResolvedValue(null);

      const result = await clienteService.obtenerClientePorId(999);

      expect(result).toBeNull();
    });
  });

  describe('obtenerClientePorEmail', () => {
    it('debe devolver el cliente correspondiente al correo', async () => {
      const correo = 'carlos.ramirez@example.com';
      mockClienteRepository.obtenerClientePorEmail.mockResolvedValue(mockCliente);

      const result = await clienteService.obtenerClientePorEmail(correo);

      expect(mockClienteRepository.obtenerClientePorEmail).toHaveBeenCalledWith(correo);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('obtenerTodosLosClientes', () => {
    it('debe devolver todos los clientes', async () => {
      const mockClientes = [mockCliente];
      mockClienteRepository.obtenerTodosLosClientes.mockResolvedValue(mockClientes);

      const result = await clienteService.obtenerTodosLosClientes();

      expect(mockClienteRepository.obtenerTodosLosClientes).toHaveBeenCalled();
      expect(result).toEqual(mockClientes);
    });
  });

  describe('obtenerClientesActivos', () => {
    it('debe devolver los clientes con estado activo', async () => {
      const mockActivos = [mockCliente];
      mockClienteRepository.ObtenerClientesActivos.mockResolvedValue(mockActivos);

      const result = await clienteService.obtenerClientesActivos();

      expect(mockClienteRepository.ObtenerClientesActivos).toHaveBeenCalled();
      expect(result).toEqual(mockActivos);
    });
  });

  describe('obtenerClientePorCedula', () => {
    it('debe devolver el cliente correspondiente a la cédula', async () => {
      const cedula = '1234567890';
      mockClienteRepository.obtenerClientePorCedula.mockResolvedValue(mockCliente);

      const result = await clienteService.obtenerClientePorCedula(cedula);

      expect(mockClienteRepository.obtenerClientePorCedula).toHaveBeenCalledWith(cedula);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('eliminarCliente', () => {
    it('debe eliminar un cliente y devolverlo si existe', async () => {
      mockClienteRepository.eliminarCliente.mockResolvedValue(mockCliente);

      const result = await clienteService.eliminarCliente(1);

      expect(mockClienteRepository.eliminarCliente).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCliente);
    });

    it('debe lanzar un error si el cliente no se encuentra', async () => {
      mockClienteRepository.eliminarCliente.mockResolvedValue(null);

      await expect(clienteService.eliminarCliente(999))
        .rejects
        .toThrow('Cliente no encontrado');
    });
  });

  describe('actualizarCliente', () => {
    it('debe actualizar un cliente y devolver el resultado', async () => {
      const data = { nombre: 'Carlos Actualizado' };
      const actualizado = { ...mockCliente, ...data };
      mockClienteRepository.actualizarCliente.mockResolvedValue(actualizado);

      const result = await clienteService.actualizarCliente(1, data);

      expect(mockClienteRepository.actualizarCliente).toHaveBeenCalledWith(1, data);
      expect(result).toEqual(actualizado);
    });
  });

  describe('actualizarPerfilCliente', () => {
    it('debe actualizar el perfil con contraseña encriptada', async () => {
      const clienteId = 1;
      const datos = { nombre: 'Carlos', contrasenia: 'secreta' };
      const datosEncriptados = { ...datos, contrasenia: 'hashed_secreta' };

      mockClienteRepository.actualizarinfoCliente.mockResolvedValue({ id: clienteId, ...datosEncriptados });

      const result = await clienteService.actualizarPerfilCliente(clienteId, datos);

      expect(encryptPasswordHook).toHaveBeenCalledWith('secreta');
      expect(mockClienteRepository.actualizarinfoCliente).toHaveBeenCalledWith(clienteId, datosEncriptados);
      expect(result).toEqual({ id: clienteId, ...datosEncriptados });
    });

    it('debe actualizar el perfil sin contraseña', async () => {
      const clienteId = 1;
      const datos = { nombre: 'Carlos' };

      mockClienteRepository.actualizarinfoCliente.mockResolvedValue({ id: clienteId, ...datos });

      const result = await clienteService.actualizarPerfilCliente(clienteId, datos);

      expect(encryptPasswordHook).not.toHaveBeenCalled();
      expect(mockClienteRepository.actualizarinfoCliente).toHaveBeenCalledWith(clienteId, datos);
      expect(result).toEqual({ id: clienteId, ...datos });
    });
  });
});
