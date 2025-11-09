
import { ContabilidadService } from '../../../src/services/contabilidad.services.js';
import { ContabilidadRepository } from '../../../src/repository/contabilidad.repository.js';

jest.mock('../../../src/repository/contabilidad.repository.js');

describe('ContabilidadService', () => {
  let service;
  let repositoryMock;

  beforeEach(() => {
    repositoryMock = new ContabilidadRepository();
    service = new ContabilidadService();
    service.contabilidadRepository = repositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearContabilidad', () => {
    it('debería llamar al método crearContabilidad del repositorio con los datos proporcionados', async () => {
      const data = { nombre: 'Contador Test' };
      const expectedResult = { id: 1, ...data };
      repositoryMock.crearContabilidad.mockResolvedValue(expectedResult);

      const result = await service.crearContabilidad(data);

      expect(repositoryMock.crearContabilidad).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorId', () => {
    it('debería llamar al método obtenerContabilidadPorId del repositorio con el id proporcionado', async () => {
      const id = 1;
      const expectedResult = { id: 1, nombre: 'Contador Test' };
      repositoryMock.obtenerContabilidadPorId.mockResolvedValue(expectedResult);

      const result = await service.obtenerContabilidadPorId(id);

      expect(repositoryMock.obtenerContabilidadPorId).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorCedula', () => {
    it('debería llamar al método obtenerContabilidadPorCedula del repositorio con la cédula proporcionada', async () => {
      const cedula = '123456789';
      const expectedResult = { id: 1, numero_de_cedula: cedula };
      repositoryMock.obtenerContabilidadPorCedula.mockResolvedValue(expectedResult);

      const result = await service.obtenerContabilidadPorCedula(cedula);

      expect(repositoryMock.obtenerContabilidadPorCedula).toHaveBeenCalledWith(cedula);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidadPorCorreo', () => {
    it('debería llamar al método obtenerContabilidadPorCorreo del repositorio con el correo proporcionado', async () => {
      const correo = 'test@correo.com';
      const expectedResult = { id: 1, correo_electronico: correo };
      repositoryMock.obtenerContabilidadPorCorreo.mockResolvedValue(expectedResult);

      const result = await service.obtenerContabilidadPorCorreo(correo);

      expect(repositoryMock.obtenerContabilidadPorCorreo).toHaveBeenCalledWith(correo);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('obtenerContabilidads', () => {
    it('debería llamar al método obtenerContabilidads del repositorio', async () => {
      const expectedResult = [{ id: 1, nombre: 'Contador Test' }];
      repositoryMock.obtenerContabilidads.mockResolvedValue(expectedResult);

      const result = await service.obtenerContabilidads();

      expect(repositoryMock.obtenerContabilidads).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('eliminarContabilidad', () => {
    it('debería llamar al método eliminarContabilidad del repositorio con el id proporcionado', async () => {
      const id = 1;
      const expectedResult = { id: 1, estado: 'inactivo' };
      repositoryMock.eliminarContabilidad.mockResolvedValue(expectedResult);

      const result = await service.eliminarContabilidad(id);

      expect(repositoryMock.eliminarContabilidad).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('actualizarContabilidad', () => {
    it('debería llamar al método actualizarContabilidad del repositorio con el id y los datos proporcionados', async () => {
      const id = 1;
      const data = { nombre: 'Contador Actualizado' };
      const expectedResult = { id: 1, ...data };
      repositoryMock.actualizarContabilidad.mockResolvedValue(expectedResult);

      const result = await service.actualizarContabilidad(id, data);

      expect(repositoryMock.actualizarContabilidad).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(expectedResult);
    });
  });
});
