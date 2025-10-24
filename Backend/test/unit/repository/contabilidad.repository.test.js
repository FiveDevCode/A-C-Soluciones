import { ContabilidadRepository } from '../../../src/repository/contabilidad.repository.js';
import { ContabilidadModel } from '../../../src/models/contabilidad.model.js';

// Mock del modelo Sequelize
jest.mock('../../../src/models/contabilidad.model.js', () => ({
  ContabilidadModel: {
    Contabilidad: {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

describe('📘 ContabilidadRepository', () => {
  let repository;
  const mockContabilidad = { id: 1, nombre: 'Jonier', estado: 'activo' };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new ContabilidadRepository();
  });

  // 📄 crearContabilidad
  test('✅ crearContabilidad crea un nuevo registro correctamente', async () => {
    ContabilidadModel.Contabilidad.create.mockResolvedValue(mockContabilidad);
    const result = await repository.crearContabilidad(mockContabilidad);

    expect(ContabilidadModel.Contabilidad.create).toHaveBeenCalledWith(mockContabilidad);
    expect(result).toEqual(mockContabilidad);
  });

  // 🔍 obtenerContabilidadPorId
  test('✅ obtenerContabilidadPorId devuelve el registro correcto', async () => {
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue(mockContabilidad);
    const result = await repository.obtenerContabilidadPorId(1);

    expect(ContabilidadModel.Contabilidad.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockContabilidad);
  });

  test('❌ obtenerContabilidadPorId devuelve null si no existe', async () => {
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue(null);
    const result = await repository.obtenerContabilidadPorId(999);
    expect(result).toBeNull();
  });

  // 🔢 obtenerContabilidadPorCedula
  test('✅ obtenerContabilidadPorCedula busca correctamente por número de cédula', async () => {
    ContabilidadModel.Contabilidad.findOne.mockResolvedValue(mockContabilidad);
    const cedula = '123456789';
    const result = await repository.obtenerContabilidadPorCedula(cedula);

    expect(ContabilidadModel.Contabilidad.findOne).toHaveBeenCalledWith({
      where: { numero_de_cedula: cedula },
    });
    expect(result).toEqual(mockContabilidad);
  });

  // 📧 obtenerContabilidadPorCorreo
  test('✅ obtenerContabilidadPorCorreo busca correctamente por correo electrónico', async () => {
    ContabilidadModel.Contabilidad.findOne.mockResolvedValue(mockContabilidad);
    const correo = 'test@example.com';
    const result = await repository.obtenerContabilidadPorCorreo(correo);

    expect(ContabilidadModel.Contabilidad.findOne).toHaveBeenCalledWith({
      where: { correo_electronico: correo },
    });
    expect(result).toEqual(mockContabilidad);
  });

  // 📋 obtenerContabilidads
  test('✅ obtenerContabilidads devuelve todos los registros', async () => {
    const registros = [mockContabilidad, { id: 2, nombre: 'Luis' }];
    ContabilidadModel.Contabilidad.findAll.mockResolvedValue(registros);

    const result = await repository.obtenerContabilidads();

    expect(ContabilidadModel.Contabilidad.findAll).toHaveBeenCalled();
    expect(result).toEqual(registros);
  });

  // 🔄 actualizarContabilidad
  test('✅ actualizarContabilidad actualiza un registro existente', async () => {
    const updated = { ...mockContabilidad, nombre: 'Carlos' };
    const mockUpdate = jest.fn().mockResolvedValue(updated);

    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue({
      update: mockUpdate,
    });

    const result = await repository.actualizarContabilidad(1, { nombre: 'Carlos' });

    expect(ContabilidadModel.Contabilidad.findByPk).toHaveBeenCalledWith(1);
    expect(mockUpdate).toHaveBeenCalledWith({ nombre: 'Carlos' });
    expect(result).toEqual(updated);
  });

  test('❌ actualizarContabilidad devuelve null si no existe el registro', async () => {
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue(null);

    const result = await repository.actualizarContabilidad(999, { nombre: 'X' });

    expect(result).toBeNull();
  });

  // 🗑️ eliminarContabilidad
  test('✅ eliminarContabilidad cambia estado a inactivo si está activo', async () => {
    const saveMock = jest.fn();
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue({
      ...mockContabilidad,
      save: saveMock,
    });

    const result = await repository.eliminarContabilidad(1);

    expect(result.estado).toBe('inactivo');
    expect(saveMock).toHaveBeenCalled();
  });

  test('✅ eliminarContabilidad elimina el registro si no tiene estado activo', async () => {
    const destroyMock = jest.fn();
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue({
      estado: null,
      destroy: destroyMock,
    });

    const result = await repository.eliminarContabilidad(2);

    expect(destroyMock).toHaveBeenCalled();
    expect(result.estado).toBeNull();
  });

  test('❌ eliminarContabilidad devuelve null si no se encuentra el registro', async () => {
    ContabilidadModel.Contabilidad.findByPk.mockResolvedValue(null);
    const result = await repository.eliminarContabilidad(999);
    expect(result).toBeNull();
  });
});
