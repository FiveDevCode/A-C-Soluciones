import { jest } from '@jest/globals';
import * as notificacionRepository from '../../../src/repository/notificacion.repository.js';
import { Notificacion } from '../../../src/models/notificacion.model.js';
import { Op } from 'sequelize';

jest.mock('../../../src/models/notificacion.model.js', () => ({
  Notificacion: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock('sequelize', () => ({
  Op: {
    lt: Symbol('lt')
  }
}));

describe('NotificacionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearNotificacion', () => {
    it('debería crear una nueva notificación', async () => {
      const mockData = {
        id_destinatario: 1,
        tipo_destinatario: 'cliente',
        tipo_notificacion: 'TEST',
        mensaje: 'Test notification'
      };

      const mockNotificacion = { id_notificacion: 1, ...mockData };
      Notificacion.create.mockResolvedValue(mockNotificacion);

      const result = await notificacionRepository.crearNotificacion(mockData);

      expect(Notificacion.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockNotificacion);
    });
  });

  describe('obtenerNotificacionesPorUsuario', () => {
    it('debería obtener notificaciones con límite por defecto', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, mensaje: 'Not 1' },
        { id_notificacion: 2, mensaje: 'Not 2' }
      ];

      Notificacion.findAll.mockResolvedValue(mockNotificaciones);

      const result = await notificacionRepository.obtenerNotificacionesPorUsuario(5, 'cliente');

      expect(Notificacion.findAll).toHaveBeenCalledWith({
        where: {
          id_destinatario: 5,
          tipo_destinatario: 'cliente'
        },
        order: [['fecha_creacion', 'DESC']],
        limit: 50
      });
      expect(result).toEqual(mockNotificaciones);
    });

    it('debería respetar el límite personalizado', async () => {
      Notificacion.findAll.mockResolvedValue([]);

      await notificacionRepository.obtenerNotificacionesPorUsuario(3, 'tecnico', 10);

      expect(Notificacion.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10 })
      );
    });

    it('debería retornar array vacío si no hay notificaciones', async () => {
      Notificacion.findAll.mockResolvedValue([]);

      const result = await notificacionRepository.obtenerNotificacionesPorUsuario(1, 'cliente');

      expect(result).toEqual([]);
    });
  });

  describe('obtenerNotificacionesNoLeidas', () => {
    it('debería obtener solo notificaciones no leídas', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, leida: false },
        { id_notificacion: 3, leida: false }
      ];

      Notificacion.findAll.mockResolvedValue(mockNotificaciones);

      const result = await notificacionRepository.obtenerNotificacionesNoLeidas(2, 'administrador');

      expect(Notificacion.findAll).toHaveBeenCalledWith({
        where: {
          id_destinatario: 2,
          tipo_destinatario: 'administrador',
          leida: false
        },
        order: [['fecha_creacion', 'DESC']]
      });
      expect(result).toEqual(mockNotificaciones);
    });

    it('debería retornar array vacío si no hay notificaciones no leídas', async () => {
      Notificacion.findAll.mockResolvedValue([]);

      const result = await notificacionRepository.obtenerNotificacionesNoLeidas(1, 'cliente');

      expect(result).toEqual([]);
    });
  });

  describe('contarNoLeidas', () => {
    it('debería contar notificaciones no leídas correctamente', async () => {
      Notificacion.count.mockResolvedValue(7);

      const result = await notificacionRepository.contarNoLeidas(4, 'tecnico');

      expect(Notificacion.count).toHaveBeenCalledWith({
        where: {
          id_destinatario: 4,
          tipo_destinatario: 'tecnico',
          leida: false
        }
      });
      expect(result).toBe(7);
    });

    it('debería retornar 0 si no hay notificaciones no leídas', async () => {
      Notificacion.count.mockResolvedValue(0);

      const result = await notificacionRepository.contarNoLeidas(1, 'cliente');

      expect(result).toBe(0);
    });
  });

  describe('marcarComoLeida', () => {
    it('debería marcar una notificación como leída', async () => {
      Notificacion.update.mockResolvedValue([1]); // 1 fila afectada

      const result = await notificacionRepository.marcarComoLeida(10, 5, 'cliente');

      expect(Notificacion.update).toHaveBeenCalledWith(
        { leida: true },
        {
          where: {
            id_notificacion: 10,
            id_destinatario: 5,
            tipo_destinatario: 'cliente'
          }
        }
      );
      expect(result).toEqual([1]);
    });

    it('debería retornar [0] si la notificación no existe o no pertenece al usuario', async () => {
      Notificacion.update.mockResolvedValue([0]);

      const result = await notificacionRepository.marcarComoLeida(99, 5, 'cliente');

      expect(result).toEqual([0]);
    });
  });

  describe('marcarTodasComoLeidas', () => {
    it('debería marcar todas las notificaciones no leídas como leídas', async () => {
      Notificacion.update.mockResolvedValue([5]); // 5 filas afectadas

      const result = await notificacionRepository.marcarTodasComoLeidas(3, 'administrador');

      expect(Notificacion.update).toHaveBeenCalledWith(
        { leida: true },
        {
          where: {
            id_destinatario: 3,
            tipo_destinatario: 'administrador',
            leida: false
          }
        }
      );
      expect(result).toEqual([5]);
    });

    it('debería retornar [0] si no hay notificaciones no leídas', async () => {
      Notificacion.update.mockResolvedValue([0]);

      const result = await notificacionRepository.marcarTodasComoLeidas(1, 'cliente');

      expect(result).toEqual([0]);
    });
  });

  describe('obtenerNotificacionPorId', () => {
    it('debería obtener una notificación por ID', async () => {
      const mockNotificacion = { id_notificacion: 15, mensaje: 'Test' };
      Notificacion.findByPk.mockResolvedValue(mockNotificacion);

      const result = await notificacionRepository.obtenerNotificacionPorId(15);

      expect(Notificacion.findByPk).toHaveBeenCalledWith(15);
      expect(result).toEqual(mockNotificacion);
    });

    it('debería retornar null si la notificación no existe', async () => {
      Notificacion.findByPk.mockResolvedValue(null);

      const result = await notificacionRepository.obtenerNotificacionPorId(999);

      expect(result).toBeNull();
    });
  });

  describe('eliminarNotificacion', () => {
    it('debería eliminar una notificación existente', async () => {
      Notificacion.destroy.mockResolvedValue(1); // 1 fila eliminada

      const result = await notificacionRepository.eliminarNotificacion(20, 8, 'tecnico');

      expect(Notificacion.destroy).toHaveBeenCalledWith({
        where: {
          id_notificacion: 20,
          id_destinatario: 8,
          tipo_destinatario: 'tecnico'
        }
      });
      expect(result).toBe(1);
    });

    it('debería retornar 0 si la notificación no existe o no pertenece al usuario', async () => {
      Notificacion.destroy.mockResolvedValue(0);

      const result = await notificacionRepository.eliminarNotificacion(99, 1, 'cliente');

      expect(result).toBe(0);
    });
  });

  describe('eliminarNotificacionesAntiguas', () => {
    it('debería eliminar notificaciones antiguas leídas con días por defecto', async () => {
      Notificacion.destroy.mockResolvedValue(10);

      const result = await notificacionRepository.eliminarNotificacionesAntiguas();

      expect(Notificacion.destroy).toHaveBeenCalledWith({
        where: {
          fecha_creacion: {
            [Op.lt]: expect.any(Date)
          },
          leida: true
        }
      });
      expect(result).toBe(10);
    });

    it('debería respetar días de antigüedad personalizados', async () => {
      Notificacion.destroy.mockResolvedValue(5);

      const result = await notificacionRepository.eliminarNotificacionesAntiguas(60);

      expect(Notificacion.destroy).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('debería retornar 0 si no hay notificaciones para eliminar', async () => {
      Notificacion.destroy.mockResolvedValue(0);

      const result = await notificacionRepository.eliminarNotificacionesAntiguas(30);

      expect(result).toBe(0);
    });
  });

  describe('obtenerNotificacionesPorTipo', () => {
    it('debería obtener notificaciones filtradas por tipo', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, tipo_notificacion: 'FICHA_CREADA' },
        { id_notificacion: 2, tipo_notificacion: 'FICHA_CREADA' }
      ];

      Notificacion.findAll.mockResolvedValue(mockNotificaciones);

      const result = await notificacionRepository.obtenerNotificacionesPorTipo(
        3,
        'cliente',
        'FICHA_CREADA'
      );

      expect(Notificacion.findAll).toHaveBeenCalledWith({
        where: {
          id_destinatario: 3,
          tipo_destinatario: 'cliente',
          tipo_notificacion: 'FICHA_CREADA'
        },
        order: [['fecha_creacion', 'DESC']]
      });
      expect(result).toEqual(mockNotificaciones);
    });

    it('debería retornar array vacío si no hay notificaciones de ese tipo', async () => {
      Notificacion.findAll.mockResolvedValue([]);

      const result = await notificacionRepository.obtenerNotificacionesPorTipo(
        1,
        'cliente',
        'VISITA_COMPLETADA'
      );

      expect(result).toEqual([]);
    });
  });
});
