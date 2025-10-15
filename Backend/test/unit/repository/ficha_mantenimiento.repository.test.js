// test/unit/repositories/ficha_mantenimiento.repository.test.js
import * as fichaRepository from '../../../src/repository/ficha_mantenimiento.repository.js';
import { FichaModel } from '../../../src/models/ficha_mantenimiento.model.js';

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
  const mockFicha = { id: 1, id_cliente: 10, id_tecnico: 20, fecha_de_mantenimiento: new Date() };

  it('crearFicha debe crear una ficha', async () => {
    FichaModel.FichaMantenimiento.create.mockResolvedValue(mockFicha);
    const result = await fichaRepository.crearFicha(mockFicha);
    expect(FichaModel.FichaMantenimiento.create).toHaveBeenCalledWith(mockFicha);
    expect(result).toBe(mockFicha);
  });

  it('actualizarPDFPath debe actualizar el path del PDF', async () => {
    const updateMock = [1]; // Sequelize update returns [affectedCount]
    FichaModel.FichaMantenimiento.update.mockResolvedValue(updateMock);
    const result = await fichaRepository.actualizarPDFPath(1, 'path/to/file.pdf');
    expect(FichaModel.FichaMantenimiento.update).toHaveBeenCalledWith(
      { pdf_path: 'path/to/file.pdf' },
      { where: { id: 1 } }
    );
    expect(result).toBe(updateMock);
  });

  it('obtenerFichasPorCliente sin visitas', async () => {
    FichaModel.FichaMantenimiento.findAll.mockResolvedValue([mockFicha]);
    const result = await fichaRepository.obtenerFichasPorCliente(10);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 10 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
    expect(result).toEqual([mockFicha]);
  });

  it('obtenerFichasPorCliente con visitas', async () => {
    await fichaRepository.obtenerFichasPorCliente(10, 5);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 10, id_visitas: 5 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerFichaPorId debe retornar ficha por ID', async () => {
    FichaModel.FichaMantenimiento.findByPk.mockResolvedValue(mockFicha);
    const result = await fichaRepository.obtenerFichaPorId(1);
    expect(FichaModel.FichaMantenimiento.findByPk).toHaveBeenCalledWith(1);
    expect(result).toBe(mockFicha);
  });

  it('buscarPorCliente debe buscar por id_cliente', async () => {
    await fichaRepository.buscarPorCliente(10);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_cliente: 10 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerFichasPorTecnico sin visitas', async () => {
    await fichaRepository.obtenerFichasPorTecnico(20);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_tecnico: 20 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerFichasPorTecnico con visitas', async () => {
    await fichaRepository.obtenerFichasPorTecnico(20, 5);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_tecnico: 20, id_visitas: 5 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerTodasFichas sin visitas', async () => {
    await fichaRepository.obtenerTodasFichas();
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: {},
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });

  it('obtenerTodasFichas con visitas', async () => {
    await fichaRepository.obtenerTodasFichas(8);
    expect(FichaModel.FichaMantenimiento.findAll).toHaveBeenCalledWith({
      where: { id_visitas: 8 },
      order: [['fecha_de_mantenimiento', 'DESC']]
    });
  });
});
