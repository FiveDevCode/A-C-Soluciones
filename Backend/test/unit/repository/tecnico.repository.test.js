import { jest } from '@jest/globals';
import { TecnicoRepository } from '../../../src/repository/tecnico.repository.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';

//definimos el mock
jest.mock('../../../src/models/tecnico.model.js', () => {
  return {
    TecnicoModel: {
      Tecnico: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

describe('TecnicoRepository', () => {
  let tecnicoRepository;
  
  const mockTecnico = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    numero_de_cedula: '1234567890',
    correo_electronico: 'juan.perez@example.com',
    estado: 'activo',
    update: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    tecnicoRepository = new TecnicoRepository();
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('debe buscar un técnico por correo electrónico', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(mockTecnico);
      const email = 'juan.perez@example.com';

      const result = await tecnicoRepository.findByEmail(email);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: email },
      });
      expect(result).toEqual(mockTecnico);
    });

    //primer test
    it('debe retornar null cuando no existe el técnico con el email proporcionado', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      const email = 'noexiste@example.com';

      const result = await tecnicoRepository.findByEmail(email);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: email },
      });
      expect(result).toBeNull();
    });
  });

  describe('crearTecnico', () => {
    it('debe crear un nuevo técnico', async () => {
      const tecnicoData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        numero_de_cedula: '1006326701',
        correo_electronico: 'juan.perez@example.com',
      };
      TecnicoModel.Tecnico.create.mockResolvedValue(mockTecnico);

      
      const result = await tecnicoRepository.crearTecnico(tecnicoData);

      expect(TecnicoModel.Tecnico.create).toHaveBeenCalledWith(tecnicoData);
      expect(result).toEqual(mockTecnico);
    });
  });

  describe('obtenerTecnicoPorId', () => {
    it('debe retornar un técnico por su ID', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue(mockTecnico);
      const id = 1;

      const result = await tecnicoRepository.obtenerTecnicoPorId(id);

      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockTecnico);
    });

    it('debe retornar null cuando no existe técnico con el ID proporcionado', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue(null);
      const id = 999;

      const result = await tecnicoRepository.obtenerTecnicoPorId(id);

      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('obtenerTecnicoPorCedula', () => {
    it('debe retornar un técnico por su número de cédula', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(mockTecnico);
      const cedula = '1006326701';

      const result = await tecnicoRepository.obtenerTecnicoPorCedula(cedula);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { numero_de_cedula: cedula },
      });
      expect(result).toEqual(mockTecnico);
    });

    it('debe retornar null cuando no existe técnico con la cédula proporcionada', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      const cedula = '9999999999';

      const result = await tecnicoRepository.obtenerTecnicoPorCedula(cedula);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { numero_de_cedula: cedula },
      });
      expect(result).toBeNull();
    });
  });

  describe('obtenerTecnicoPorCorreo', () => {
    it('debe retornar un técnico por su correo electrónico', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(mockTecnico);
      const email = 'juan.perez@example.com';

      const result = await tecnicoRepository.obtenerTecnicoPorCorreo(email);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: email },
      });
      expect(result).toEqual(mockTecnico);
    });

    it('debe retornar null cuando no existe técnico con el correo proporcionado', async () => {
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      const email = 'noexiste@example.com';

      const result = await tecnicoRepository.obtenerTecnicoPorCorreo(email);

      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalledWith({
        where: { correo_electronico: email },
      });
      expect(result).toBeNull();
    });
  });

  describe('obtenerTecnicos', () => {
    it('debe retornar todos los técnicos', async () => {
      const mockTecnicos = [mockTecnico, { ...mockTecnico, id: 2, correo_electronico: 'otro@example.com' }];
      TecnicoModel.Tecnico.findAll.mockResolvedValue(mockTecnicos);

      const result = await tecnicoRepository.obtenerTecnicos();

      expect(TecnicoModel.Tecnico.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTecnicos);
    });

    it('debe retornar un array vacío cuando no hay técnicos', async () => {
      TecnicoModel.Tecnico.findAll.mockResolvedValue([]);

      const result = await tecnicoRepository.obtenerTecnicos();

      expect(TecnicoModel.Tecnico.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('actualizarTecnico', () => {
    it('debe actualizar un técnico existente', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue(mockTecnico);
      const id = 1;
      const data = { nombre: 'Nuevo Nombre' };

      
      const result = await tecnicoRepository.actualizarTecnico(id, data);

     
      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(mockTecnico.update).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockTecnico);
    });

    it('debe retornar null cuando no existe técnico con el ID proporcionado', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue(null);
      const id = 999;
      const data = { nombre: 'Nuevo Nombre' };

      const result = await tecnicoRepository.actualizarTecnico(id, data);

      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });

  describe('eliminarTecnico', () => {
    it('debe cambiar el estado de un técnico a "inactivo"', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue({ ...mockTecnico });
      const id = 1;

      const result = await tecnicoRepository.eliminarTecnico(id);

      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(result.estado).toBe('inactivo');
      expect(mockTecnico.save).toHaveBeenCalled();
    });

    it('debe retornar null cuando no existe técnico con el ID proporcionado', async () => {
      TecnicoModel.Tecnico.findByPk.mockResolvedValue(null);
      const id = 999;

      const result = await tecnicoRepository.eliminarTecnico(id);

      expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(id);
      expect(result).toBeNull();
    });
  });
});