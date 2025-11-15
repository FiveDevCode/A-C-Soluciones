import { Op } from 'sequelize';
import { ChatbotRepository } from '../../../src/repository/chatbot.repository.js';
import { PatternModel, IntentModel } from '../../../src/models/chatbot.model.js';
import { PendingPatternModel } from '../../../src/models/pendingPattern.model.js';

// Mocks de los modelos
jest.mock('../../../src/models/chatbot.model.js', () => ({
  PatternModel: {
    findOne: jest.fn(),
    bulkCreate: jest.fn(),
    create: jest.fn(),
  },
  IntentModel: {
    create: jest.fn(),
  },
}));

jest.mock('../../../src/models/pendingPattern.model.js', () => ({
  PendingPatternModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('💬 ChatbotRepository', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------------------------------
  // buscarIntentPorMensaje
  // ------------------------------------------------------------
  describe('buscarIntentPorMensaje', () => {
    it('debería buscar un intent correctamente con LIKE y activo true', async () => {
      const mockIntent = { id: 1, response: 'Hola!' };
      const mensaje = 'hola';

      PatternModel.findOne.mockResolvedValue(mockIntent);

      const result = await ChatbotRepository.buscarIntentPorMensaje(mensaje);

      expect(PatternModel.findOne).toHaveBeenCalledWith({
        where: { patron: { [Op.like]: `%${mensaje}%` } },
        include: [{ model: IntentModel, where: { activo: true } }],
      });
      expect(result).toBe(mockIntent);
    });
  });

  // ------------------------------------------------------------
  // crearIntent
  // ------------------------------------------------------------
  describe('crearIntent', () => {
    it('debería crear un intent y sus patrones correctamente', async () => {
      const response = 'Respuesta automática';
      const patrones = ['hola', 'buenas'];
      const mockIntent = { id: 10, response };

      IntentModel.create.mockResolvedValue(mockIntent);
      PatternModel.bulkCreate.mockResolvedValue(undefined);

      const result = await ChatbotRepository.crearIntent(response, patrones);

      expect(IntentModel.create).toHaveBeenCalledWith({ response });
      expect(PatternModel.bulkCreate).toHaveBeenCalledWith([
        { patron: 'hola', intent_id: 10 },
        { patron: 'buenas', intent_id: 10 },
      ]);
      expect(result).toBe(mockIntent);
    });
  });

  // ------------------------------------------------------------
  // guardarPatronPendiente
  // ------------------------------------------------------------
  describe('guardarPatronPendiente', () => {
    it('debería crear un patrón pendiente si no existe', async () => {
      PendingPatternModel.findOne.mockResolvedValue(null);

      await ChatbotRepository.guardarPatronPendiente('mensaje nuevo');

      expect(PendingPatternModel.findOne).toHaveBeenCalledWith({ where: { mensaje: 'mensaje nuevo' } });
      expect(PendingPatternModel.create).toHaveBeenCalledWith({ mensaje: 'mensaje nuevo' });
    });

    it('no debería crear si ya existe un patrón pendiente', async () => {
      PendingPatternModel.findOne.mockResolvedValue({ id: 1, mensaje: 'ya existe' });

      await ChatbotRepository.guardarPatronPendiente('ya existe');

      expect(PendingPatternModel.create).not.toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------
  // obtenerPendientes
  // ------------------------------------------------------------
  describe('obtenerPendientes', () => {
    it('debería devolver la lista de pendientes ordenados por fecha DESC', async () => {
      const mockPendientes = [{ id: 1 }, { id: 2 }];
      PendingPatternModel.findAll.mockResolvedValue(mockPendientes);

      const result = await ChatbotRepository.obtenerPendientes();

      expect(PendingPatternModel.findAll).toHaveBeenCalledWith({ order: [['fecha', 'DESC']] });
      expect(result).toBe(mockPendientes);
    });
  });

  // ------------------------------------------------------------
  // asociarPendienteAIntent
  // ------------------------------------------------------------
  describe('asociarPendienteAIntent', () => {
    it('debería asociar un pendiente a un intent y eliminarlo', async () => {
      const mockPendiente = {
        mensaje: 'nuevo patrón',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      PendingPatternModel.findByPk.mockResolvedValue(mockPendiente);
      PatternModel.create.mockResolvedValue(undefined);

      await ChatbotRepository.asociarPendienteAIntent(5, 20);

      expect(PendingPatternModel.findByPk).toHaveBeenCalledWith(5);
      expect(PatternModel.create).toHaveBeenCalledWith({
        patron: 'nuevo patrón',
        intent_id: 20,
      });
      expect(mockPendiente.destroy).toHaveBeenCalled();
    });

    it('debería lanzar error si el pendiente no existe', async () => {
      PendingPatternModel.findByPk.mockResolvedValue(null);

      await expect(ChatbotRepository.asociarPendienteAIntent(99, 10))
        .rejects.toThrow('Pendiente no encontrado');

      expect(PatternModel.create).not.toHaveBeenCalled();
    });
  });
});
