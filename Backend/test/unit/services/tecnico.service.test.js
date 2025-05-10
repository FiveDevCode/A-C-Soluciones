import { jest } from '@jest/globals';
import { TecnicoService } from '../../../src/services/tecnico.services.js';
import { TecnicoRepository } from '../../../src/repository/tecnico.repository.js';

// Mock del TecnicoRepository
jest.mock('../../../src/repository/tecnico.repository.js');

describe('TecnicoService', () => {
  let tecnicoService;
  let mockTecnicoRepository;
  
  const mockTecnico = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    numero_de_cedula: '1006326701',
    correo_electronico: 'juan.perez@example.com',
    estado: 'activo'
  };

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar el mock del repositorio para esta prueba
    mockTecnicoRepository = {
      crearTecnico: jest.fn(),
      obtenerTecnicoPorId: jest.fn(),
      obtenerTecnicoPorCedula: jest.fn(),
      obtenerTecnicos: jest.fn(),
      actualizarTecnico: jest.fn(),
      eliminarTecnico: jest.fn(),
      obtenerTecnicoPorCorreo: jest.fn()
    };
    
    // Asignar el mock al constructor
    TecnicoRepository.mockImplementation(() => mockTecnicoRepository);
    
    // Instanciar el servicio con el repositorio mockeado
    tecnicoService = new TecnicoService();
  });

  describe('crearTecnico', () => {
    it('debe llamar al método crearTecnico del repositorio y devolver el resultado', async () => {
      const tecnicoData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        numero_de_cedula: '1006326701',
        correo_electronico: 'juan.perez@example.com'
      };
      mockTecnicoRepository.crearTecnico.mockResolvedValue(mockTecnico);

      const result = await tecnicoService.crearTecnico(tecnicoData);

      
      expect(mockTecnicoRepository.crearTecnico).toHaveBeenCalledWith(tecnicoData);
      expect(result).toEqual(mockTecnico);
    });
  });

  describe('obtenerTecnicoPorId', () => {
    it('debe llamar al método obtenerTecnicoPorId del repositorio y devolver el resultado', async () => {
      const id = 1;
      mockTecnicoRepository.obtenerTecnicoPorId.mockResolvedValue(mockTecnico);

      const result = await tecnicoService.obtenerTecnicoPorId(id);

      expect(mockTecnicoRepository.obtenerTecnicoPorId).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockTecnico);
    });

    it('debe devolver null cuando no existe un técnico con el ID proporcionado', async () => {
      const id = 999;
      mockTecnicoRepository.obtenerTecnicoPorId.mockResolvedValue(null);

      const result = await tecnicoService.obtenerTecnicoPorId(id);

      expect(mockTecnicoRepository.obtenerTecnicoPorId).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('obtenerTecnicoPorcedula', () => {
    it('debe llamar al método obtenerTecnicoPorCedula del repositorio y devolver el resultado', async () => {
      const cedula = '1006326701';
      mockTecnicoRepository.obtenerTecnicoPorCedula.mockResolvedValue(mockTecnico);

      const result = await tecnicoService.obtenerTecnicoPorcedula(cedula);

      expect(mockTecnicoRepository.obtenerTecnicoPorCedula).toHaveBeenCalledWith(cedula);
      expect(result).toEqual(mockTecnico);
    });

    it('debe devolver null cuando no existe un técnico con la cédula proporcionada', async () => {
      const cedula = '9999999999';
      mockTecnicoRepository.obtenerTecnicoPorCedula.mockResolvedValue(null);

      const result = await tecnicoService.obtenerTecnicoPorcedula(cedula);

      expect(mockTecnicoRepository.obtenerTecnicoPorCedula).toHaveBeenCalledWith(cedula);
      expect(result).toBeNull();
    });
  });

  describe('obtenerTecnicos', () => {
    it('debe llamar al método obtenerTecnicos del repositorio y devolver el resultado', async () => {
      const mockTecnicos = [mockTecnico, { ...mockTecnico, id: 2, correo_electronico: 'otro@example.com' }];
      mockTecnicoRepository.obtenerTecnicos.mockResolvedValue(mockTecnicos);

      const result = await tecnicoService.obtenerTecnicos();

      expect(mockTecnicoRepository.obtenerTecnicos).toHaveBeenCalled();
      expect(result).toEqual(mockTecnicos);
    });

    it('debe devolver un array vacío cuando no hay técnicos', async () => {
      mockTecnicoRepository.obtenerTecnicos.mockResolvedValue([]);

      const result = await tecnicoService.obtenerTecnicos();

      expect(mockTecnicoRepository.obtenerTecnicos).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('actualizarTecnico', () => {
    it('debe llamar al método actualizarTecnico del repositorio y devolver el resultado', async () => {
      const id = 1;
      const data = { nombre: 'Nuevo Nombre' };
      const tecnicoActualizado = { ...mockTecnico, nombre: 'Nuevo Nombre' };
      mockTecnicoRepository.actualizarTecnico.mockResolvedValue(tecnicoActualizado);

      const result = await tecnicoService.actualizarTecnico(id, data);

      expect(mockTecnicoRepository.actualizarTecnico).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(tecnicoActualizado);
    });

    it('debe devolver null cuando no existe un técnico con el ID proporcionado', async () => {
      const id = 999;
      const data = { nombre: 'Nuevo Nombre' };
      mockTecnicoRepository.actualizarTecnico.mockResolvedValue(null);

      const result = await tecnicoService.actualizarTecnico(id, data);

      expect(mockTecnicoRepository.actualizarTecnico).toHaveBeenCalledWith(id, data);
      expect(result).toBeNull();
    });
  });

  describe('eliminarTecnico', () => {
    it('debe llamar al método eliminarTecnico del repositorio y devolver el resultado', async () => {
      const id = 1;
      const tecnicoInactivo = { ...mockTecnico, estado: 'inactivo' };
      mockTecnicoRepository.eliminarTecnico.mockResolvedValue(tecnicoInactivo);

      const result = await tecnicoService.eliminarTecnico(id);

      expect(mockTecnicoRepository.eliminarTecnico).toHaveBeenCalledWith(id);
      expect(result).toEqual(tecnicoInactivo);
    });

    it('debe devolver null cuando no existe un técnico con el ID proporcionado', async () => {
      const id = 999;
      mockTecnicoRepository.eliminarTecnico.mockResolvedValue(null);

      const result = await tecnicoService.eliminarTecnico(id);

      expect(mockTecnicoRepository.eliminarTecnico).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('obtenerPorTecnicoCorreo', () => {
    it('debe llamar al método obtenerTecnicoPorCorreo del repositorio y devolver el resultado', async () => {
      const email = 'juan.perez@example.com';
      mockTecnicoRepository.obtenerTecnicoPorCorreo.mockResolvedValue(mockTecnico);

      const result = await tecnicoService.obtenerPorTecnicoCorreo(email);

      expect(mockTecnicoRepository.obtenerTecnicoPorCorreo).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockTecnico);
    });

    it('debe devolver null cuando no existe un técnico con el correo proporcionado', async () => {
      const email = 'noexiste@example.com';
      mockTecnicoRepository.obtenerTecnicoPorCorreo.mockResolvedValue(null);

      const result = await tecnicoService.obtenerPorTecnicoCorreo(email);

      expect(mockTecnicoRepository.obtenerTecnicoPorCorreo).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });
});