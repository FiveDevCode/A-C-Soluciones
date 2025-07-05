import { FaqRepository } from '../../../src/repository/preguntas_frecuentes.repository.js';
import { FaqModel } from '../../../src/models/preguntas_frecuentes.model.js';

jest.mock('../../../src/models/preguntas_frecuentes.model.js', () => ({
  FaqModel: {
    Faq: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    }
  }
}));

describe('FaqRepository', () => {
  const repository = new FaqRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockFaq = {
    id: 1,
    pregunta: '¿Cómo puedo solicitar un servicio?',
    respuesta: 'Desde el panel de cliente.',
    categoria: 'solicitud de un servicio',
    id_administrador: 1
  };

  test('crear() debe llamar a Faq.create con los datos correctos', async () => {
    FaqModel.Faq.create.mockResolvedValue(mockFaq);

    const result = await repository.crear(mockFaq);
    expect(FaqModel.Faq.create).toHaveBeenCalledWith(mockFaq);
    expect(result).toBe(mockFaq);
  });

  test('obtenerTodos() debe llamar a Faq.findAll', async () => {
    FaqModel.Faq.findAll.mockResolvedValue([mockFaq]);

    const result = await repository.obtenerTodos();
    expect(FaqModel.Faq.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockFaq]);
  });

  test('obtenerPorCategoria() debe llamar a Faq.findAll con where: { categoria }', async () => {
    const categoria = 'solicitud de un servicio';
    FaqModel.Faq.findAll.mockResolvedValue([mockFaq]);

    const result = await repository.obtenerPorCategoria(categoria);
    expect(FaqModel.Faq.findAll).toHaveBeenCalledWith({ where: { categoria } });
    expect(result).toEqual([mockFaq]);
  });

  test('obtenerPorId() debe llamar a Faq.findByPk con el ID', async () => {
    FaqModel.Faq.findByPk.mockResolvedValue(mockFaq);

    const result = await repository.obtenerPorId(1);
    expect(FaqModel.Faq.findByPk).toHaveBeenCalledWith(1);
    expect(result).toBe(mockFaq);
  });

  test('actualizar() debe llamar a Faq.update con los datos correctos', async () => {
    FaqModel.Faq.update.mockResolvedValue([1]);

    const result = await repository.actualizar(1, { pregunta: 'Nueva pregunta' });
    expect(FaqModel.Faq.update).toHaveBeenCalledWith({ pregunta: 'Nueva pregunta' }, { where: { id: 1 } });
    expect(result).toEqual([1]);
  });

  test('eliminar() debe llamar a Faq.destroy con el ID', async () => {
    FaqModel.Faq.destroy.mockResolvedValue(1);

    const result = await repository.eliminar(1);
    expect(FaqModel.Faq.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(1);
  });
});
