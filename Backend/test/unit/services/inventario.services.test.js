import { InventarioService, INVENTARIO_ERRORS } from '../../../src/services/inventario.services.js';
import { InventarioRepository } from '../../../src/repository/inventario.repository.js';

// Mock del repositorio
jest.mock('../../../src/repository/inventario.repository.js');

describe('🧰 InventarioService', () => {
  let service;
  let mockRepository;

  const mockHerramienta = {
    id: 1,
    codigo: 'H001',
    nombre: 'Llave inglesa',
    estado_herramienta: 'activo',
  };

  beforeEach(() => {
    mockRepository = {
      findByCodigo: jest.fn(),
      crearHerramienta: jest.fn(),
      obtenerHerramientaPorId: jest.fn(),
      obtenerTodas: jest.fn(),
      actualizarHerramienta: jest.fn(),
      eliminarInventario: jest.fn(),
    };

    InventarioRepository.mockImplementation(() => mockRepository);
    service = new InventarioService();
  });

  // 🧩 crearInventario
  describe('crearInventario', () => {
    test('✅ Crea un inventario nuevo si el código no existe', async () => {
      mockRepository.findByCodigo.mockResolvedValue(null);
      mockRepository.crearHerramienta.mockResolvedValue(mockHerramienta);

      const result = await service.crearInventario(mockHerramienta);

      expect(mockRepository.findByCodigo).toHaveBeenCalledWith('H001');
      expect(mockRepository.crearHerramienta).toHaveBeenCalledWith(mockHerramienta);
      expect(result).toEqual(mockHerramienta);
    });

    test('❌ Lanza error si el código ya existe', async () => {
      mockRepository.findByCodigo.mockResolvedValue(mockHerramienta);

      await expect(service.crearInventario(mockHerramienta)).rejects.toThrow(
        INVENTARIO_ERRORS.CODIGO_DUPLICADO
      );

      await expect(service.crearInventario(mockHerramienta)).rejects.toMatchObject({
        name: 'CodigoDuplicadoError',
        message: INVENTARIO_ERRORS.CODIGO_DUPLICADO,
      });

      expect(mockRepository.crearHerramienta).not.toHaveBeenCalled();
    });
  });

  // 🔎 obtenerInventarioPorId
  describe('obtenerInventarioPorId', () => {
    test('✅ Retorna una herramienta por su ID', async () => {
      mockRepository.obtenerHerramientaPorId.mockResolvedValue(mockHerramienta);

      const result = await service.obtenerInventarioPorId(1);

      expect(mockRepository.obtenerHerramientaPorId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockHerramienta);
    });

    test('❌ Devuelve null si no existe la herramienta', async () => {
      mockRepository.obtenerHerramientaPorId.mockResolvedValue(null);

      const result = await service.obtenerInventarioPorId(999);
      expect(result).toBeNull();
    });
  });

  // 📋 obtenerTodos
  describe('obtenerTodos', () => {
    test('✅ Retorna una lista de herramientas', async () => {
      const mockList = [
        mockHerramienta,
        { id: 2, codigo: 'H002', nombre: 'Martillo' },
      ];

      mockRepository.obtenerTodas.mockResolvedValue(mockList);

      const result = await service.obtenerTodos();

      expect(mockRepository.obtenerTodas).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });
  });

  // 🔄 actualizarInventario
  describe('actualizarInventario', () => {
    test('✅ Actualiza una herramienta correctamente', async () => {
      const updated = { ...mockHerramienta, nombre: 'Martillo' };
      mockRepository.actualizarHerramienta.mockResolvedValue(updated);

      const result = await service.actualizarInventario(1, { nombre: 'Martillo' });

      expect(mockRepository.actualizarHerramienta).toHaveBeenCalledWith(1, { nombre: 'Martillo' });
      expect(result).toEqual(updated);
    });

    test('❌ Retorna null si la herramienta no existe', async () => {
      mockRepository.actualizarHerramienta.mockResolvedValue(null);

      const result = await service.actualizarInventario(999, { nombre: 'X' });
      expect(result).toBeNull();
    });
  });

  // 🗑️ eliminarInventario
  describe('eliminarInventario', () => {
    test('✅ Elimina (inactiva) una herramienta correctamente', async () => {
      const inactivo = { ...mockHerramienta, estado_herramienta: 'inactivo' };
      mockRepository.eliminarInventario.mockResolvedValue(inactivo);

      const result = await service.eliminarInventario(1);

      expect(mockRepository.eliminarInventario).toHaveBeenCalledWith(1);
      expect(result.estado_herramienta).toBe('inactivo');
    });

    test('❌ Devuelve null si no existe la herramienta', async () => {
      mockRepository.eliminarInventario.mockResolvedValue(null);

      const result = await service.eliminarInventario(999);
      expect(result).toBeNull();
    });
  });
});
