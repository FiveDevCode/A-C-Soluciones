// tests/repository/ficha_mantenimiento.repository.test.js

import * as fichaRepo from '../../../src/repository/ficha_mantenimiento.repository.js';
import { FichaModel } from '../../../src/models/ficha_mantenimiento.model.js';

// Mock del modelo
jest.mock('../../../src/models/ficha_mantenimiento.model.js', () => ({
  FichaModel: {
    FichaMantenimiento: {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn()
    }
  }
}));

describe('ficha_mantenimiento.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crearFicha - debe crear una ficha correctamente', async () => {
    const data = { id_cliente: 1, id_tecnico: 2 };
    const mockFicha = { id: 10, ...data };

    FichaModel.FichaMantenimiento.create.mockResolvedValue(mockFicha);

    const result = await fichaRepo.crearFicha(data);

    expect(FichaModel.FichaMantenimiento.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(mockFicha);
  });

  test('actualizarPDFPath - debe actualizar el path del PDF', async () => {
    FichaModel.FichaMantenimiento.update.mockResolvedValue([1]);

    const result = await fichaRepo.actualizarPDFPath(1, 'ruta.pdf');

    expect(FichaModel.FichaMantenimiento.update).toHaveBeenCalledWith(
      { pdf_path: 'ruta.pdf' },
      { where: { id: 1 } }
    );
    expect(result).toEqual([1]);
  });

  test('obtenerFichasPorCliente - debe retornar fichas por cliente', async () => {
    const mockFichas = [{ id: 1 }, { id: 2 }];
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue(mockFichas);

    const result = await fichaRepo.obtenerFichasPorCliente(5);

    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 5 }
    });
    expect(result).toEqual(mockFichas);
  });

  test('obtenerFichaPorId - debe retornar ficha por ID', async () => {
    const mockFicha = { id: 99 };
    FichaModel.FichaMantenimiento.findByPk.mockResolvedValue(mockFicha);

    const result = await fichaRepo.obtenerFichaPorId(99);

    expect(FichaModel.FichaMantenimiento.findByPk).toHaveBeenCalledWith(99);
    expect(result).toEqual(mockFicha);
  });

  test('buscarPorCliente - debe buscar fichas de cliente ordenadas', async () => {
    const mockFichas = [{ id: 1 }];
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue(mockFichas);

    const result = await fichaRepo.buscarPorCliente(1);

    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 1 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
    expect(result).toEqual(mockFichas);
  });

  test('obtenerFichasPorTecnico - debe retornar fichas por técnico ordenadas', async () => {
    const mockFichas = [{ id: 3 }];
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue(mockFichas);

    const result = await fichaRepo.obtenerFichasPorTecnico(10);

    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_tecnico: 10 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
    expect(result).toEqual(mockFichas);
  });

  test('obtenerTodasFichas - debe retornar todas las fichas ordenadas', async () => {
    const mockFichas = [{ id: 4 }];
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue(mockFichas);

    const result = await fichaRepo.obtenerTodasFichas();

    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
    expect(result).toEqual(mockFichas);
  });
});
