
import { ContabilidadRepository } from '../../../src/repository/contabilidad.repository.js';
import { ContabilidadModel } from '../../../src/models/contabilidad.model.js';

jest.mock('../../../src/models/contabilidad.model.js');

describe('ContabilidadRepository', () => {
  let repository;
  let modelMock;

  beforeEach(() => {
    repository = new ContabilidadRepository();
    modelMock = ContabilidadModel.Contabilidad;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearContabilidad', () => {
    it('debería llamar a Contabilidad.create con los datos proporcionados', async () => {
      const data = { nombre: 'Contador Test' };
      const expectedResult = { id: 1, ...data };
      modelMock.create.mockResolvedValue(expectedResult);

      const result = await repository.crearContabilidad(data);

      expect(modelMock.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorId', () => {
    it('debería llamar a Contabilidad.findByPk con el id proporcionado', async () => {
      const id = 1;
      const expectedResult = { id: 1, nombre: 'Contador Test' };
      modelMock.findByPk.mockResolvedValue(expectedResult);

      const result = await repository.obtenerContabilidadPorId(id);

      expect(modelMock.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorCedula', () => {
    it('debería llamar a Contabilidad.findOne con la cédula proporcionada', async () => {
      const cedula = '123456789';
      const expectedResult = { id: 1, numero_de_cedula: cedula };
      modelMock.findOne.mockResolvedValue(expectedResult);

      const result = await repository.obtenerContabilidadPorCedula(cedula);

      expect(modelMock.findOne).toHaveBeenCalledWith({ where: { numero_de_cedula: cedula } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorCorreo', () => {
    it('debería llamar a Contabilidad.findOne con el correo proporcionado', async () => {
      const correo = 'test@correo.com';
      const expectedResult = { id: 1, correo_electronico: correo };
      modelMock.findOne.mockResolvedValue(expectedResult);

      const result = await repository.obtenerContabilidadPorCorreo(correo);

      expect(modelMock.findOne).toHaveBeenCalledWith({ where: { correo_electronico: correo } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidads', () => {
    it('debería llamar a Contabilidad.findAll', async () => {
      const expectedResult = [{ id: 1, nombre: 'Contador Test' }];
      modelMock.findAll.mockResolvedValue(expectedResult);

      const result = await repository.obtenerContabilidads();

      expect(modelMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('eliminarContabilidad', () => {
    it('debería cambiar el estado a inactivo si el contador existe y tiene estado', async () => {
      const id = 1;
      const mockContador = { id: 1, estado: 'activo', save: jest.fn().mockResolvedValue(true) };
      modelMock.findByPk.mockResolvedValue(mockContador);

      const result = await repository.eliminarContabilidad(id);

      expect(modelMock.findByPk).toHaveBeenCalledWith(id);
      expect(mockContador.estado).toBe('inactivo');
      expect(mockContador.save).toHaveBeenCalled();
      expect(result).toEqual(mockContador);
    });

    it('debería llamar a destroy si el contador no tiene estado', async () => {
        const id = 1;
        const mockContador = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
        modelMock.findByPk.mockResolvedValue(mockContador);
  
        const result = await repository.eliminarContabilidad(id);
  
        expect(modelMock.findByPk).toHaveBeenCalledWith(id);
        expect(mockContador.destroy).toHaveBeenCalled();
        expect(result).toEqual(mockContador);
      });

    it('debería devolver null si el contador no se encuentra', async () => {
      const id = 1;
      modelMock.findByPk.mockResolvedValue(null);

      const result = await repository.eliminarContabilidad(id);

      expect(modelMock.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('actualizarContabilidad', () => {
    it('debería llamar a Contabilidad.update con el id y los datos proporcionados', async () => {
      const id = 1;
      const data = { nombre: 'Contador Actualizado' };
      const expectedResult = [1]; 
      modelMock.update.mockResolvedValue(expectedResult);

      const result = await repository.actualizarContabilidad(id, data);

      expect(modelMock.update).toHaveBeenCalledWith(data, { where: { id } });
      expect(result).toEqual(expectedResult);
    });
  });
});
