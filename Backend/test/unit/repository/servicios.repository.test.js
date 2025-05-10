import { ServicioRepository } from '../../../src/repository/servicio.repository.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';
import { Op } from 'sequelize';

jest.mock('../../../src/models/servicios.model.js', () => ({
  ServicioModel: {
    Servicio: {
      create: jest.fn(),
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

describe('ServicioRepository', () => {
  const repo = new ServicioRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crearServicio debe llamar a Servicio.create con los datos', async () => {
    const data = { nombre: 'Limpieza' };
    await repo.crearServicio(data);
    expect(ServicioModel.Servicio.create).toHaveBeenCalledWith(data);
  });

  test('obtenerServicioPorId debe llamar a findByPk con el ID', async () => {
    await repo.obtenerServicioPorId(10);
    expect(ServicioModel.Servicio.findByPk).toHaveBeenCalledWith(10);
  });

  test('obtenerServicioPorNombre debe buscar por nombre con Op.iLike', async () => {
    const nombre = 'limpieza';
    await repo.obtenerServicioPorNombre(nombre);
    expect(ServicioModel.Servicio.findOne).toHaveBeenCalledWith({
      where: { nombre: { [Op.iLike]: nombre } },
    });
  });

  test('buscarServicios debe buscar por término parcial con Op.iLike', async () => {
    await repo.buscarServicios('limp');
    expect(ServicioModel.Servicio.findAll).toHaveBeenCalledWith({
      where: { nombre: { [Op.iLike]: '%limp%' } },
    });
  });

  test('obtenerServicios debe retornar todos los servicios', async () => {
    await repo.obtenerServicios();
    expect(ServicioModel.Servicio.findAll).toHaveBeenCalled();
  });

  test('obtenerServiciosActivos debe filtrar por estado activo', async () => {
    await repo.obtenerServiciosActivos();
    expect(ServicioModel.Servicio.findAll).toHaveBeenCalledWith({
      where: { estado: 'activo' },
    });
  });

  test('actualizarServicio debe actualizar un servicio existente', async () => {
    const mockServicio = { update: jest.fn(), id: 1 };
    ServicioModel.Servicio.findByPk.mockResolvedValue(mockServicio);

    const result = await repo.actualizarServicio(1, { nombre: 'Nuevo' });
    expect(mockServicio.update).toHaveBeenCalledWith({ nombre: 'Nuevo' });
    expect(result).toBe(mockServicio);
  });

  test('actualizarServicio retorna null si no se encuentra', async () => {
    ServicioModel.Servicio.findByPk.mockResolvedValue(null);
    const result = await repo.actualizarServicio(999, {});
    expect(result).toBeNull();
  });

  test('eliminarServicio debe eliminar si existe', async () => {
    const mockServicio = { destroy: jest.fn() };
    ServicioModel.Servicio.findByPk.mockResolvedValue(mockServicio);

    const result = await repo.eliminarServicio(1);
    expect(mockServicio.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test('eliminarServicio retorna null si no se encuentra', async () => {
    ServicioModel.Servicio.findByPk.mockResolvedValue(null);
    const result = await repo.eliminarServicio(123);
    expect(result).toBeNull();
  });

  test('deshabilitarServicio debe cambiar estado a inactivo', async () => {
    const mockServicio = { save: jest.fn(), estado: 'activo' };
    ServicioModel.Servicio.findByPk.mockResolvedValue(mockServicio);

    const result = await repo.deshabilitarServicio(1);
    expect(mockServicio.estado).toBe('inactivo');
    expect(mockServicio.save).toHaveBeenCalled();
    expect(result).toBe(mockServicio);
  });

  test('deshabilitarServicio retorna null si no se encuentra', async () => {
    ServicioModel.Servicio.findByPk.mockResolvedValue(null);
    const result = await repo.deshabilitarServicio(123);
    expect(result).toBeNull();
  });

  test('habilitarServicio debe cambiar estado a activo', async () => {
    const mockServicio = { save: jest.fn(), estado: 'inactivo' };
    ServicioModel.Servicio.findByPk.mockResolvedValue(mockServicio);

    const result = await repo.habilitarServicio(1);
    expect(mockServicio.estado).toBe('activo');
    expect(mockServicio.save).toHaveBeenCalled();
    expect(result).toBe(mockServicio);
  });

  test('habilitarServicio retorna null si no se encuentra', async () => {
    ServicioModel.Servicio.findByPk.mockResolvedValue(null);
    const result = await repo.habilitarServicio(321);
    expect(result).toBeNull();
  });
});
