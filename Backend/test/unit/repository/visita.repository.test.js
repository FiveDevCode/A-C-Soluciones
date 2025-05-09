import { VisitaRepository } from '../../../src/repository/visita.repository.js';
import { VisitaModel } from '../../../src/models/visita.model.js';
import { SolicitudModel } from '../../../src/models/solicitud.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { ServicioModel } from '../../../src/models/servicios.model.js';
import { Op } from 'sequelize';

jest.mock('../../../src/models/visita.model.js');
jest.mock('../../../src/models/solicitud.model.js');
jest.mock('../../../src/models/tecnico.model.js');
jest.mock('../../../src/models/servicios.model.js');

describe('VisitaRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new VisitaRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear una visita', async () => {
    const mockVisita = { id: 1 };
    VisitaModel.Visita.create.mockResolvedValue(mockVisita);

    const result = await repo.crearVisita({ solicitud_id_fk: 1 });
    expect(result).toEqual(mockVisita);
    expect(VisitaModel.Visita.create).toHaveBeenCalledWith({ solicitud_id_fk: 1 });
  });

  it('debe obtener una visita por id con relaciones', async () => {
    const mockVisita = { id: 1 };
    VisitaModel.Visita.findByPk.mockResolvedValue(mockVisita);

    const result = await repo.obtenerVisitaPorId(1);
    expect(result).toEqual(mockVisita);
    expect(VisitaModel.Visita.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('debe obtener todas las visitas con relaciones', async () => {
    const mockVisitas = [{ id: 1 }, { id: 2 }];
    VisitaModel.Visita.findAll.mockResolvedValue(mockVisitas);

    const result = await repo.obtenerVisitas();
    expect(result).toEqual(mockVisitas);
    expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith(expect.any(Object));
  });

  it('debe obtener visitas por solicitud', async () => {
    const mockVisitas = [{ id: 1 }];
    VisitaModel.Visita.findAll.mockResolvedValue(mockVisitas);

    const result = await repo.obtenerVisitasPorSolicitud(5);
    expect(result).toEqual(mockVisitas);
    expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { solicitud_ID: 5 }
    }));
  });

  it('debe obtener visitas por técnico', async () => {
    const mockVisitas = [{ id: 1 }];
    VisitaModel.Visita.findAll.mockResolvedValue(mockVisitas);

    const result = await repo.obtenerVisitasPorTecnico(3);
    expect(result).toEqual(mockVisitas);
    expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { tecnico_ID: 3 }
    }));
  });

  it('debe actualizar una visita existente', async () => {
    const mockVisita = {
      update: jest.fn().mockResolvedValue({ id: 1, estado: 'actualizado' })
    };
    VisitaModel.Visita.findByPk.mockResolvedValue(mockVisita);

    const result = await repo.actualizarVisita(1, { estado: 'actualizado' });
    expect(result).toEqual({ id: 1, estado: 'actualizado' });
  });

  it('debe retornar null al intentar actualizar una visita inexistente', async () => {
    VisitaModel.Visita.findByPk.mockResolvedValue(null);
    const result = await repo.actualizarVisita(999, { estado: 'fallido' });
    expect(result).toBeNull();
  });

  it('debe eliminar una visita existente', async () => {
    const mockVisita = { destroy: jest.fn(), id: 1 };
    VisitaModel.Visita.findByPk.mockResolvedValue(mockVisita);

    const result = await repo.eliminarVisita(1);
    expect(mockVisita.destroy).toHaveBeenCalled();
    expect(result).toEqual(mockVisita);
  });

  it('debe retornar null al intentar eliminar una visita inexistente', async () => {
    VisitaModel.Visita.findByPk.mockResolvedValue(null);
    const result = await repo.eliminarVisita(404);
    expect(result).toBeNull();
  });

  describe('verificarDisponibilidadTecnico', () => {
    it('debe lanzar error si la fecha es inválida', async () => {
      await expect(repo.verificarDisponibilidadTecnico(1, 'invalid-date', 60)).rejects.toThrow();
    });

    it('debe lanzar error si la duración es inválida', async () => {
      await expect(repo.verificarDisponibilidadTecnico(1, new Date().toISOString(), 'bad')).rejects.toThrow();
    });

    it('debe retornar true si no hay conflictos de disponibilidad', async () => {
      VisitaModel.Visita.findAll.mockResolvedValue([]);
      const result = await repo.verificarDisponibilidadTecnico(1, new Date().toISOString(), 30);
      expect(result).toBe(true);
    });

    it('debe retornar false si hay conflictos de disponibilidad', async () => {
      VisitaModel.Visita.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await repo.verificarDisponibilidadTecnico(1, new Date().toISOString(), 30);
      expect(result).toBe(false);
    });
  });

  describe('obtenerServiciosPorTecnico', () => {
    it('debe retornar los servicios asociados a un técnico', async () => {
      const serviciosMock = [
        {
          id: 1,
          fecha_programada: new Date(),
          servicio: {
            id: 10,
            nombre: 'Mantenimiento',
            descripcion: 'Revisión general',
            estado: 'Pendiente'
          }
        }
      ];

      VisitaModel.Visita.findAll.mockResolvedValue(serviciosMock);

      const result = await repo.obtenerServiciosPorTecnico(1);
      expect(VisitaModel.Visita.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { tecnico_id_fk: 1 }
      }));
      expect(result).toEqual(serviciosMock);
    });
  });

  describe('obtenerServicioAsignadoPorId', () => {
    it('debe retornar el servicio específico de una visita asignada al técnico', async () => {
      const visitaConServicio = {
        id: 2,
        tecnico_id_fk: 1,
        servicio: {
          id: 20,
          nombre: 'Inspección',
          descripcion: 'Inspección de turbina',
          estado: 'Asignado'
        }
      };

      VisitaModel.Visita.findOne.mockResolvedValue(visitaConServicio);

      const result = await repo.obtenerServicioAsignadoPorId(1, 2);
      expect(VisitaModel.Visita.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          id: 2,
          tecnico_id_fk: 1
        }
      }));
      expect(result).toEqual(visitaConServicio);
    });
  });
});
