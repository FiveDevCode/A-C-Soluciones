// test/unit/services/servicio.services.test.js
import { ServicioService } from '../../../src/services/servicio.services.js';
import { ServicioRepository } from '../../../src/repository/servicio.repository.js';

// Mock manual del ServicioRepository
jest.mock('../../../src/repository/servicio.repository.js');

describe('ServicioService', () => {
  let servicioService;
  let mockRepo;

  beforeEach(() => {
    ServicioRepository.mockClear();

    mockRepo = {
      crearServicio: jest.fn(),
      obtenerServicioPorId: jest.fn(),
      obtenerServicioPorNombre: jest.fn(),
      buscarServicios: jest.fn(),
      obtenerServicios: jest.fn(),
      obtenerServiciosActivos: jest.fn(),
      actualizarServicio: jest.fn(),
      eliminarServicio: jest.fn(),
      deshabilitarServicio: jest.fn(),
      habilitarServicio: jest.fn(),
    };

    ServicioRepository.mockImplementation(() => mockRepo);
    servicioService = new ServicioService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crearServicio debe delegar en el repositorio', async () => {
    const data = { nombre: 'Nuevo' };
    await servicioService.crearServicio(data);
    expect(mockRepo.crearServicio).toHaveBeenCalledWith(data);
  });

  test('obtenerServicioPorId debe delegar en el repositorio', async () => {
    await servicioService.obtenerServicioPorId(1);
    expect(mockRepo.obtenerServicioPorId).toHaveBeenCalledWith(1);
  });

  test('obtenerServicioPorNombre debe delegar en el repositorio', async () => {
    await servicioService.obtenerServicioPorNombre('Mantenimiento');
    expect(mockRepo.obtenerServicioPorNombre).toHaveBeenCalledWith('Mantenimiento');
  });

  test('buscarServicios debe delegar en el repositorio', async () => {
    await servicioService.buscarServicios('electrico');
    expect(mockRepo.buscarServicios).toHaveBeenCalledWith('electrico');
  });

  test('obtenerServicios debe delegar en el repositorio', async () => {
    await servicioService.obtenerServicios();
    expect(mockRepo.obtenerServicios).toHaveBeenCalled();
  });

  test('obtenerServiciosActivos debe delegar en el repositorio', async () => {
    await servicioService.obtenerServiciosActivos();
    expect(mockRepo.obtenerServiciosActivos).toHaveBeenCalled();
  });

  test('actualizarServicio debe delegar en el repositorio', async () => {
    await servicioService.actualizarServicio(5, { nombre: 'Actualizado' });
    expect(mockRepo.actualizarServicio).toHaveBeenCalledWith(5, { nombre: 'Actualizado' });
  });

  test('eliminarServicio debe delegar en el repositorio', async () => {
    await servicioService.eliminarServicio(7);
    expect(mockRepo.eliminarServicio).toHaveBeenCalledWith(7);
  });

  test('deshabilitarServicio debe delegar en el repositorio', async () => {
    await servicioService.deshabilitarServicio(8);
    expect(mockRepo.deshabilitarServicio).toHaveBeenCalledWith(8);
  });

  test('habilitarServicio debe delegar en el repositorio', async () => {
    await servicioService.habilitarServicio(9);
    expect(mockRepo.habilitarServicio).toHaveBeenCalledWith(9);
  });
});
