import { jest } from '@jest/globals';
import { ClienteRepository } from '../../../src/repository/cliente.repository.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';

jest.mock('../../../src/models/cliente.model.js', () => {
  return {
    ClienteModel: {
      Cliente: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
    },
  };
});

describe('ClienteRepository', () => {
  let clienteRepository;
  const mockCliente = {
    id: 1,
    nombre: 'Ana',
    apellido: 'Gómez',
    numero_de_cedula: '123456789',
    correo_electronico: 'ana.gomez@example.com',
    telefono: '3216549870',
    estado: 'activo',
    update: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    clienteRepository = new ClienteRepository();
    jest.clearAllMocks();
  });

  describe('crearCliente', () => {
    it('debe crear un nuevo cliente', async () => {
      ClienteModel.Cliente.create.mockResolvedValue(mockCliente);

      const result = await clienteRepository.crearCliente(mockCliente);

      expect(ClienteModel.Cliente.create).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockCliente);
    });
  });

  describe('obtenerClientePorId', () => {
    it('debe retornar un cliente por ID', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);

      const result = await clienteRepository.obtenerClientePorId(1);

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCliente);
    });

    it('debe retornar null si no encuentra el cliente', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(null);

      const result = await clienteRepository.obtenerClientePorId(99);

      expect(result).toBeNull();
    });
  });

  describe('obtenerClientePorEmail', () => {
    it('debe retornar un cliente por correo', async () => {
      ClienteModel.Cliente.findOne.mockResolvedValue(mockCliente);

      const result = await clienteRepository.obtenerClientePorEmail(mockCliente.correo_electronico);

      expect(ClienteModel.Cliente.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: mockCliente.correo_electronico },
      });
      expect(result).toEqual(mockCliente);
    });
  });

  describe('obtenerClientePorTelefono', () => {
    it('debe retornar un cliente por teléfono', async () => {
      ClienteModel.Cliente.findOne.mockResolvedValue(mockCliente);

      const result = await clienteRepository.obtenerClientePorTelefono(mockCliente.telefono);

      expect(ClienteModel.Cliente.findOne).toHaveBeenCalledWith({
        where: { telefono: mockCliente.telefono },
      });
      expect(result).toEqual(mockCliente);
    });
  });

  describe('obtenerTodosLosClientes', () => {
    it('debe retornar todos los clientes', async () => {
      ClienteModel.Cliente.findAll.mockResolvedValue([mockCliente]);

      const result = await clienteRepository.obtenerTodosLosClientes();

      expect(ClienteModel.Cliente.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCliente]);
    });
  });

  describe('ObtenerClientesActivos', () => {
    it('debe retornar solo los clientes activos', async () => {
      ClienteModel.Cliente.findAll.mockResolvedValue([mockCliente]);

      const result = await clienteRepository.ObtenerClientesActivos();

      expect(ClienteModel.Cliente.findAll).toHaveBeenCalledWith({
        where: { estado: 'activo' },
      });
      expect(result).toEqual([mockCliente]);
    });
  });

  describe('eliminarCliente', () => {
    it('debe cambiar estado a inactivo si el cliente existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);

      const result = await clienteRepository.eliminarCliente(1);

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
      expect(mockCliente.estado).toBe('inactivo');
      expect(mockCliente.save).toHaveBeenCalled();
      expect(result).toEqual(mockCliente);
    });

    it('debe retornar null si el cliente no existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(null);

      const result = await clienteRepository.eliminarCliente(99);

      expect(result).toBeNull();
    });
  });

  describe('obtenerClientePorCedula', () => {
    it('debe retornar un cliente por número de cédula', async () => {
      ClienteModel.Cliente.findOne.mockResolvedValue(mockCliente);

      const result = await clienteRepository.obtenerClientePorCedula(mockCliente.numero_de_cedula);

      expect(ClienteModel.Cliente.findOne).toHaveBeenCalledWith({
        where: { numero_de_cedula: mockCliente.numero_de_cedula },
      });
      expect(result).toEqual(mockCliente);
    });
  });

  describe('actualizarCliente', () => {
    it('debe actualizar los datos del cliente', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);
      const nuevosDatos = { nombre: 'Andrea' };

      const result = await clienteRepository.actualizarCliente(1, nuevosDatos);

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
      expect(mockCliente.update).toHaveBeenCalledWith(nuevosDatos);
      expect(result).toEqual(mockCliente);
    });

    it('debe retornar null si el cliente no existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(null);

      const result = await clienteRepository.actualizarCliente(999, { nombre: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('actualizarinfoCliente', () => {
    it('debe actualizar la información del cliente si existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);
      const camposActualizados = { telefono: '3100000000' };

      const result = await clienteRepository.actualizarinfoCliente(1, camposActualizados);

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
      expect(mockCliente.update).toHaveBeenCalledWith(camposActualizados);
      expect(result).toEqual(mockCliente);
    });

    it('debe retornar null si el cliente no existe', async () => {
      ClienteModel.Cliente.findByPk.mockResolvedValue(null);

      const result = await clienteRepository.actualizarinfoCliente(999, { telefono: '000' });

      expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });


});
