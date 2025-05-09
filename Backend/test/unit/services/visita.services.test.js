import { jest } from '@jest/globals';
import { VisitaService } from '../../../src/services/visita.services.js';
import { VisitaRepository } from '../../../src/repository/visita.repository.js';
import { TecnicoRepository } from '../../../src/repository/tecnico.repository.js';
import { SolicitudRepository } from '../../../src/repository/solicitud.repository.js';

jest.mock('../../../src/repository/visita.repository.js');
jest.mock('../../../src/repository/tecnico.repository.js');
jest.mock('../../../src/repository/solicitud.repository.js');

describe('VisitaService', () => {
  let visitaService;
  let mockVisitaRepository, mockTecnicoRepository, mockSolicitudRepository;

  const mockVisita = { id: 1, estado: 'programada' };
  const mockTecnico = { id: 1, nombre: 'Juan' };
  const mockSolicitud = { id: 1, descripcion: 'Revisión' };

  beforeEach(() => {
    jest.clearAllMocks();

    mockVisitaRepository = {
      crearVisita: jest.fn(),
      obtenerVisitas: jest.fn(),
      obtenerVisitaPorId: jest.fn(),
      actualizarVisita: jest.fn(),
      verificarDisponibilidadTecnico: jest.fn(),
      obtenerVisitasPorSolicitud: jest.fn(),
      obtenerTecnicosDisponibles: jest.fn(),
      obtenerServiciosPorTecnico: jest.fn(),
      obtenerServicioAsignadoPorId: jest.fn()
    };

    mockTecnicoRepository = {
      obtenerTecnicoPorId: jest.fn()
    };

    mockSolicitudRepository = {
      obtenerPorId: jest.fn()
    };

    VisitaRepository.mockImplementation(() => mockVisitaRepository);
    TecnicoRepository.mockImplementation(() => mockTecnicoRepository);
    SolicitudRepository.mockImplementation(() => mockSolicitudRepository);

    visitaService = new VisitaService();
  });

  describe('crearVisita', () => {
    it('debe crear una visita si técnico y solicitud existen y está disponible', async () => {
      mockTecnicoRepository.obtenerTecnicoPorId.mockResolvedValue(mockTecnico);
      mockSolicitudRepository.obtenerPorId.mockResolvedValue(mockSolicitud);
      mockVisitaRepository.verificarDisponibilidadTecnico.mockResolvedValue(true);
      mockVisitaRepository.crearVisita.mockResolvedValue(mockVisita);

      const result = await visitaService.crearVisita({
        tecnico_id_fk: 1,
        solicitud_id_fk: 1,
        fecha_programada: '2025-05-10',
        duracion_estimada: 60
      });

      expect(result).toEqual(mockVisita);
    });

    it('debe lanzar error si el técnico no existe', async () => {
      mockTecnicoRepository.obtenerTecnicoPorId.mockResolvedValue(null);

      await expect(
        visitaService.crearVisita({ tecnico_id_fk: 99 })
      ).rejects.toThrow('Técnico no encontrado');
    });
  });

  describe('obtenerVisitas', () => {
    it('debe retornar todas las visitas', async () => {
      const visitas = [mockVisita];
      mockVisitaRepository.obtenerVisitas.mockResolvedValue(visitas);

      const result = await visitaService.obtenerVisitas();
      expect(result).toEqual(visitas);
    });
  });

  describe('obtenerVisitaPorId', () => {
    it('debe retornar una visita por ID', async () => {
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue(mockVisita);
      const result = await visitaService.obtenerVisitaPorId(1);
      expect(result).toEqual(mockVisita);
    });

    it('debe lanzar error si no encuentra la visita', async () => {
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue(null);
      await expect(visitaService.obtenerVisitaPorId(99)).rejects.toThrow('Visita no encontrada');
    });
  });

  describe('actualizarVisita', () => {
    it('debe actualizar una visita si no está completada o cancelada', async () => {
      const visitaExistente = { ...mockVisita, estado: 'programada' };
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue(visitaExistente);
      mockVisitaRepository.actualizarVisita.mockResolvedValue({ ...visitaExistente, estado: 'reprogramada' });

      const result = await visitaService.actualizarVisita(1, { estado: 'reprogramada' });
      expect(result.estado).toBe('reprogramada');
    });

    it('debe lanzar error si la visita está completada o cancelada', async () => {
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue({ ...mockVisita, estado: 'completada' });

      await expect(
        visitaService.actualizarVisita(1, { estado: 'reprogramada' })
      ).rejects.toThrow('No se puede modificar una visita completada o cancelada');
    });
  });

  describe('cancelarVisita', () => {
    it('debe cancelar una visita y agregar motivo', async () => {
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue(mockVisita);
      mockVisitaRepository.actualizarVisita.mockResolvedValue({ ...mockVisita, estado: 'cancelada', notas_posteriores: 'Cliente no disponible' });

      const result = await visitaService.cancelarVisita(1, 'Cliente no disponible');
      expect(result.estado).toBe('cancelada');
      expect(result.notas_posteriores).toBe('Cliente no disponible');
    });

    it('debe lanzar error si la visita no existe', async () => {
      mockVisitaRepository.obtenerVisitaPorId.mockResolvedValue(null);
      await expect(visitaService.cancelarVisita(99, 'Motivo')).rejects.toThrow('Visita no encontrada');
    });
  });
});
