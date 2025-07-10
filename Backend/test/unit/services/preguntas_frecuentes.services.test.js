import { FaqService } from '../../../src/services/preguntas_frecuentes.services.js';
import { FaqRepository } from '../../../src/repository/preguntas_frecuentes.repository.js';

jest.mock('../../../src/repository/preguntas_frecuentes.repository.js');

describe('FaqService', () => {
  let faqService;
  let faqRepositoryMock;

  const mockFaq = {
    id: 1,
    pregunta: '¿Cómo puedo solicitar un servicio?',
    respuesta: 'Desde el panel de cliente.',
    categoria: 'solicitud de un servicio',
    id_administrador: 1
  };

  beforeEach(() => {
    FaqRepository.mockClear();
    faqRepositoryMock = {
      crear: jest.fn(),
      obtenerTodos: jest.fn(),
      obtenerPorCategoria: jest.fn(),
      obtenerPorId: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn()
    };
    FaqRepository.mockImplementation(() => faqRepositoryMock);
    faqService = new FaqService();
  });

  test('crear() debe delegar al repositorio', async () => {
    faqRepositoryMock.crear.mockResolvedValue(mockFaq);
    const result = await faqService.crear(mockFaq);
    expect(faqRepositoryMock.crear).toHaveBeenCalledWith(mockFaq);
    expect(result).toBe(mockFaq);
  });

  test('obtenerTodas() debe delegar al repositorio', async () => {
    faqRepositoryMock.obtenerTodos.mockResolvedValue([mockFaq]);
    const result = await faqService.obtenerTodas();
    expect(faqRepositoryMock.obtenerTodos).toHaveBeenCalled();
    expect(result).toEqual([mockFaq]);
  });

  test('obtenerPorCategoria() debe delegar al repositorio', async () => {
    const categoria = 'solicitud de un servicio';
    faqRepositoryMock.obtenerPorCategoria.mockResolvedValue([mockFaq]);

    const result = await faqService.obtenerPorCategoria(categoria);
    expect(faqRepositoryMock.obtenerPorCategoria).toHaveBeenCalledWith(categoria);
    expect(result).toEqual([mockFaq]);
  });

  test('actualizar() debe actualizar si existe', async () => {
    faqRepositoryMock.obtenerPorId.mockResolvedValue(mockFaq);
    faqRepositoryMock.actualizar.mockResolvedValue([1]);

    const result = await faqService.actualizar(1, { pregunta: 'Nueva pregunta' });
    expect(faqRepositoryMock.obtenerPorId).toHaveBeenCalledWith(1);
    expect(faqRepositoryMock.actualizar).toHaveBeenCalledWith(1, { pregunta: 'Nueva pregunta' });
    expect(result).toEqual([1]);
  });

  test('actualizar() debe lanzar error si no existe', async () => {
    faqRepositoryMock.obtenerPorId.mockResolvedValue(null);
    await expect(faqService.actualizar(999, {})).rejects.toThrow('Pregunta frecuente no encontrada.');
  });

  test('eliminar() debe eliminar si existe', async () => {
    faqRepositoryMock.obtenerPorId.mockResolvedValue(mockFaq);
    faqRepositoryMock.eliminar.mockResolvedValue(1);

    const result = await faqService.eliminar(1);
    expect(faqRepositoryMock.obtenerPorId).toHaveBeenCalledWith(1);
    expect(faqRepositoryMock.eliminar).toHaveBeenCalledWith(1);
    expect(result).toBe(1);
  });

  test('eliminar() debe lanzar error si no existe', async () => {
    faqRepositoryMock.obtenerPorId.mockResolvedValue(null);
    await expect(faqService.eliminar(999)).rejects.toThrow('Pregunta frecuente no encontrada.');
  });
});
