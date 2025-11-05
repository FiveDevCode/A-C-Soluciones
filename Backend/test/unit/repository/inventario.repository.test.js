import { InventarioRepository } from '../../../src/repository/inventario.repository.js';
import { InventarioModel } from '../../../src/models/inventario.model.js';

// Mock del modelo Sequelize
jest.mock('../../../src/models/inventario.model.js', () => ({
  InventarioModel: {
    Inventario: {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

describe('🧰 InventarioRepository', () => {
  let repository;
  const mockHerramienta = {
    id: 1,
    codigo: 'H001',
    nombre: 'Llave inglesa',
    estado_herramienta: 'activo',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new InventarioRepository();
  });

  // 🔍 findByCodigo
  test('✅ findByCodigo devuelve la herramienta con el código indicado', async () => {
    InventarioModel.Inventario.findOne.mockResolvedValue(mockHerramienta);

    const result = await repository.findByCodigo('H001');

    expect(InventarioModel.Inventario.findOne).toHaveBeenCalledWith({
      where: { codigo: 'H001' },
    });
    expect(result).toEqual(mockHerramienta);
  });

  test('❌ findByCodigo devuelve null si no existe la herramienta', async () => {
    InventarioModel.Inventario.findOne.mockResolvedValue(null);

    const result = await repository.findByCodigo('X999');
    expect(result).toBeNull();
  });

  // 🧩 crearHerramienta
  test('✅ crearHerramienta crea un nuevo registro', async () => {
    InventarioModel.Inventario.create.mockResolvedValue(mockHerramienta);

    const result = await repository.crearHerramienta(mockHerramienta);

    expect(InventarioModel.Inventario.create).toHaveBeenCalledWith(mockHerramienta);
    expect(result).toEqual(mockHerramienta);
  });

  // 🔎 obtenerHerramientaPorId
  test('✅ obtenerHerramientaPorId obtiene una herramienta por su ID', async () => {
    InventarioModel.Inventario.findByPk.mockResolvedValue(mockHerramienta);

    const result = await repository.obtenerHerramientaPorId(1);

    expect(InventarioModel.Inventario.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockHerramienta);
  });

  test('❌ obtenerHerramientaPorId devuelve null si no existe', async () => {
    InventarioModel.Inventario.findByPk.mockResolvedValue(null);

    const result = await repository.obtenerHerramientaPorId(999);
    expect(result).toBeNull();
  });

  // 📋 obtenerTodas
  test('✅ obtenerTodas devuelve todas las herramientas del inventario', async () => {
    const mockList = [
      mockHerramienta,
      { id: 2, codigo: 'H002', nombre: 'Martillo' },
    ];
    InventarioModel.Inventario.findAll.mockResolvedValue(mockList);

    const result = await repository.obtenerTodas();

    expect(InventarioModel.Inventario.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockList);
  });

  // 🔄 actualizarHerramienta
  test('✅ actualizarHerramienta actualiza una herramienta existente', async () => {
    const updateMock = jest.fn().mockResolvedValue({ ...mockHerramienta, nombre: 'Martillo' });
    const herramientaMock = { ...mockHerramienta, update: updateMock };

    jest
      .spyOn(repository, 'obtenerHerramientaPorId')
      .mockResolvedValue(herramientaMock);

    const result = await repository.actualizarHerramienta(1, { nombre: 'Martillo' });

    expect(repository.obtenerHerramientaPorId).toHaveBeenCalledWith(1);
    expect(updateMock).toHaveBeenCalledWith({ nombre: 'Martillo' });
    expect(result).toEqual(herramientaMock);
  });

  test('❌ actualizarHerramienta devuelve null si la herramienta no existe', async () => {
    jest.spyOn(repository, 'obtenerHerramientaPorId').mockResolvedValue(null);

    const result = await repository.actualizarHerramienta(999, { nombre: 'X' });
    expect(result).toBeNull();
  });

  // 🗑️ eliminarInventario
  test('✅ eliminarInventario cambia el estado a inactivo y guarda los cambios', async () => {
    const saveMock = jest.fn();
    const herramientaMock = { ...mockHerramienta, save: saveMock };

    InventarioModel.Inventario.findByPk.mockResolvedValue(herramientaMock);

    const result = await repository.eliminarInventario(1);

    expect(InventarioModel.Inventario.findByPk).toHaveBeenCalledWith(1);
    expect(result.estado_herramienta).toBe('inactivo');
    expect(saveMock).toHaveBeenCalled();
  });

  test('❌ eliminarInventario devuelve null si no se encuentra la herramienta', async () => {
    InventarioModel.Inventario.findByPk.mockResolvedValue(null);

    const result = await repository.eliminarInventario(999);
    expect(result).toBeNull();
  });
});
