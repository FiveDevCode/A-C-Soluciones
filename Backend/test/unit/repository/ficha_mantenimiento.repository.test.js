import {
  crearFicha,
  actualizarPDFPath,
  obtenerFichaPorId,
  obtenerFichasPorCliente,
  obtenerFichasPorTecnico,
  obtenerTodasFichas
} from '../../../src/repository/ficha_mantenimiento.repository.js';

import { FichaModel } from '../../../src/models/ficha_mantenimiento.model.js';

// ✅ Mock total del modelo
jest.mock('../../../src/models/ficha_mantenimiento.model.js', () => ({
  FichaModel: {
    FichaMantenimiento: {
      create: jest.fn(),
      update: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn()
    }
  }
}));

describe('Ficha Repository', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFicha = {
    id: 1,
    id_cliente: 5,
    id_tecnico: 2,
    pdf_path: 'archivo.pdf'
  };

  // ✅ crearFicha
  it('crearFicha - debe crear una ficha correctamente', async () => {
    FichaModel.FichaMantenimiento.create.mockResolvedValue(mockFicha);

    const result = await crearFicha(mockFicha);

    expect(result).toEqual(mockFicha);
    expect(FichaModel.FichaMantenimiento.create).toHaveBeenCalledWith(mockFicha);
  });

  it('crearFicha - debe lanzar error y capturarlo', async () => {
    FichaModel.FichaMantenimiento.create.mockRejectedValue(new Error('Error DB'));

    await expect(crearFicha(mockFicha)).rejects.toThrow('Error DB');
  });

  // ✅ actualizarPDFPath
  it('actualizarPDFPath - debe actualizar el PDF de una ficha', async () => {
    FichaModel.FichaMantenimiento.update.mockResolvedValue([1]);

    const result = await actualizarPDFPath(1, 'nuevo.pdf');

    expect(result).toEqual([1]);
    expect(FichaModel.FichaMantenimiento.update).toHaveBeenCalledWith(
      { pdf_path: 'nuevo.pdf' },
      { where: { id: 1 } }
    );
  });

  it('actualizarPDFPath - error en actualización', async () => {
    FichaModel.FichaMantenimiento.update.mockRejectedValue(new Error('Error DB'));

    await expect(actualizarPDFPath(1, 'nuevo.pdf')).rejects.toThrow('Error DB');
  });

  // ✅ obtenerFichaPorId
  it('obtenerFichaPorId - debe obtener ficha por ID', async () => {
    FichaModel.FichaMantenimiento.findByPk.mockResolvedValue(mockFicha);

    const result = await obtenerFichaPorId(1);

    expect(result).toEqual(mockFicha);
    expect(FichaModel.FichaMantenimiento.findByPk).toHaveBeenCalledWith(1);
  });

  it('obtenerFichaPorId - error al consultar', async () => {
    FichaModel.FichaMantenimiento.findByPk.mockRejectedValue(new Error('Error DB'));

    await expect(obtenerFichaPorId(1)).rejects.toThrow('Error DB');
  });

  // ✅ obtenerFichasPorCliente
  it('obtenerFichasPorCliente - consulta por cliente', async () => {
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue([mockFicha]);

    const result = await obtenerFichasPorCliente(5);

    expect(result).toEqual([mockFicha]);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 5 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerFichasPorCliente - error al consultar', async () => {
    FichaModel.FichaMantenimiento.findAll.mockRejectedValue(new Error('Error DB'));

    await expect(obtenerFichasPorCliente(5)).rejects.toThrow('Error DB');
  });

  // ✅ obtenerFichasPorTecnico
  it('obtenerFichasPorTecnico - consulta por técnico', async () => {
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue([mockFicha]);

    const result = await obtenerFichasPorTecnico(2);

    expect(result).toEqual([mockFicha]);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_tecnico: 2 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerFichasPorTecnico - error en consulta', async () => {
    FichaModel.FichaMantenimiento.findAll.mockRejectedValue(new Error('Error DB'));

    await expect(obtenerFichasPorTecnico(2)).rejects.toThrow('Error DB');
  });

  // ✅ obtenerTodasFichas
  it('obtenerTodasFichas - sin filtro', async () => {
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue([mockFicha]);

    const result = await obtenerTodasFichas();

    expect(result).toEqual([mockFicha]);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: {},
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerTodasFichas - con filtro id_visitas', async () => {
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue([mockFicha]);

    const result = await obtenerTodasFichas(3);

    expect(result).toEqual([mockFicha]);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_visitas: 3 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerTodasFichas - error al consultar', async () => {
    FichaModel.FichaMantenimiento.findAll.mockRejectedValue(new Error('Error DB'));

    await expect(obtenerTodasFichas()).rejects.toThrow('Error DB');
  });

});
