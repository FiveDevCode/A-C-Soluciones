import * as notificacionService from '../../../src/services/notificacion.services.js';
import * as notificacionRepository from '../../../src/repository/notificacion.repository.js';

jest.mock('../../../src/repository/notificacion.repository.js');

describe('NotificacionService', () => {
  let mockIo;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de Socket.io
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
  });

  describe('inicializarSocket', () => {
    it('debería inicializar Socket.io correctamente', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      notificacionService.inicializarSocket(mockIo);

      expect(consoleSpy).toHaveBeenCalledWith('Socket.io inicializado para notificaciones');
      consoleSpy.mockRestore();
    });
  });

  describe('crearNotificacion', () => {
    it('debería crear una notificación y emitirla en tiempo real', async () => {
      const mockData = {
        id_destinatario: 1,
        tipo_destinatario: 'cliente',
        tipo_notificacion: 'TEST',
        mensaje: 'Test notification'
      };

      const mockNotificacion = {
        id_notificacion: 123,
        ...mockData,
        leida: false,
        fecha_creacion: new Date()
      };

      notificacionRepository.crearNotificacion.mockResolvedValue(mockNotificacion);
      notificacionService.inicializarSocket(mockIo);

      const result = await notificacionService.crearNotificacion(mockData);

      expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockNotificacion);
      expect(mockIo.to).toHaveBeenCalledWith('usuario_cliente_1');
      expect(mockIo.emit).toHaveBeenCalledWith('nueva_notificacion', expect.objectContaining({
        id_notificacion: 123,
        tipo_notificacion: 'TEST',
        mensaje: 'Test notification'
      }));
    });

    it('debería crear notificación aunque Socket.io no esté inicializado', async () => {
      const mockData = { mensaje: 'Test' };
      const mockNotificacion = { id_notificacion: 1, ...mockData };

      notificacionRepository.crearNotificacion.mockResolvedValue(mockNotificacion);

      // Sin inicializar socket
      const result = await notificacionService.crearNotificacion(mockData);

      expect(result).toEqual(mockNotificacion);
    });
  });

  describe('obtenerNotificacionesUsuario', () => {
    it('debería delegar al repositorio con parámetros correctos', async () => {
      const mockNotificaciones = [
        { id_notificacion: 1, mensaje: 'Not 1' },
        { id_notificacion: 2, mensaje: 'Not 2' }
      ];

      notificacionRepository.obtenerNotificacionesPorUsuario.mockResolvedValue(mockNotificaciones);

      const result = await notificacionService.obtenerNotificacionesUsuario(5, 'cliente', 20);

      expect(notificacionRepository.obtenerNotificacionesPorUsuario).toHaveBeenCalledWith(5, 'cliente', 20);
      expect(result).toEqual(mockNotificaciones);
    });
  });

  describe('obtenerNotificacionesNoLeidas', () => {
    it('debería delegar al repositorio', async () => {
      const mockNotificaciones = [{ id_notificacion: 1, leida: false }];

      notificacionRepository.obtenerNotificacionesNoLeidas.mockResolvedValue(mockNotificaciones);

      const result = await notificacionService.obtenerNotificacionesNoLeidas(3, 'tecnico');

      expect(notificacionRepository.obtenerNotificacionesNoLeidas).toHaveBeenCalledWith(3, 'tecnico');
      expect(result).toEqual(mockNotificaciones);
    });
  });

  describe('contarNoLeidas', () => {
    it('debería retornar el conteo del repositorio', async () => {
      notificacionRepository.contarNoLeidas.mockResolvedValue(7);

      const result = await notificacionService.contarNoLeidas(2, 'administrador');

      expect(notificacionRepository.contarNoLeidas).toHaveBeenCalledWith(2, 'administrador');
      expect(result).toBe(7);
    });
  });

  describe('marcarComoLeida', () => {
    it('debería marcar como leída y emitir evento si hay filas afectadas', async () => {
      notificacionRepository.marcarComoLeida.mockResolvedValue([1]);
      notificacionService.inicializarSocket(mockIo);

      const result = await notificacionService.marcarComoLeida(10, 5, 'cliente');

      expect(notificacionRepository.marcarComoLeida).toHaveBeenCalledWith(10, 5, 'cliente');
      expect(result).toEqual([1]);
      expect(mockIo.to).toHaveBeenCalledWith('usuario_cliente_5');
      expect(mockIo.emit).toHaveBeenCalledWith('notificacion_leida', { id_notificacion: 10 });
    });

    it('no debería emitir evento si no hay filas afectadas', async () => {
      notificacionRepository.marcarComoLeida.mockResolvedValue([0]);
      notificacionService.inicializarSocket(mockIo);

      await notificacionService.marcarComoLeida(10, 5, 'cliente');

      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });

  describe('marcarTodasComoLeidas', () => {
    it('debería marcar todas como leídas y emitir evento si hay filas afectadas', async () => {
      notificacionRepository.marcarTodasComoLeidas.mockResolvedValue([5]);
      notificacionService.inicializarSocket(mockIo);

      const result = await notificacionService.marcarTodasComoLeidas(3, 'tecnico');

      expect(notificacionRepository.marcarTodasComoLeidas).toHaveBeenCalledWith(3, 'tecnico');
      expect(result).toEqual([5]);
      expect(mockIo.to).toHaveBeenCalledWith('usuario_tecnico_3');
      expect(mockIo.emit).toHaveBeenCalledWith('todas_notificaciones_leidas');
    });

    it('no debería emitir evento si no hay filas afectadas', async () => {
      notificacionRepository.marcarTodasComoLeidas.mockResolvedValue([0]);
      notificacionService.inicializarSocket(mockIo);

      await notificacionService.marcarTodasComoLeidas(3, 'tecnico');

      expect(mockIo.to).not.toHaveBeenCalled();
      expect(mockIo.emit).not.toHaveBeenCalled();
    });
  });

  describe('eliminarNotificacion', () => {
    it('debería delegar al repositorio', async () => {
      notificacionRepository.eliminarNotificacion.mockResolvedValue(1);

      const result = await notificacionService.eliminarNotificacion(15, 8, 'administrador');

      expect(notificacionRepository.eliminarNotificacion).toHaveBeenCalledWith(15, 8, 'administrador');
      expect(result).toBe(1);
    });
  });

  describe('Métodos Helper', () => {
    beforeEach(() => {
      const mockNotificacion = { id_notificacion: 1, mensaje: 'Test' };
      notificacionRepository.crearNotificacion.mockResolvedValue(mockNotificacion);
    });

    describe('notificarServicioSolicitado', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarServicioSolicitado(5, 10, 'Mantenimiento');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 5,
          tipo_destinatario: 'cliente',
          tipo_notificacion: 'SERVICIO_SOLICITADO',
          mensaje: 'Tu solicitud del servicio "Mantenimiento" ha sido registrada exitosamente.',
          id_referencia: 10,
          tipo_referencia: 'servicio'
        });
      });
    });

    describe('notificarFichaCreada', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarFichaCreada(3, 7, 'Carlos Ruiz');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 3,
          tipo_destinatario: 'cliente',
          tipo_notificacion: 'FICHA_CREADA',
          mensaje: 'Se ha creado una ficha de mantenimiento para tu equipo. Técnico asignado: Carlos Ruiz.',
          id_referencia: 7,
          tipo_referencia: 'ficha_mantenimiento'
        });
      });
    });

    describe('notificarTecnicoFichaAsignada', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarTecnicoFichaAsignada(2, 8, 'Juan Pérez');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 2,
          tipo_destinatario: 'tecnico',
          tipo_notificacion: 'FICHA_ASIGNADA',
          mensaje: 'Se te ha asignado una nueva ficha de mantenimiento para el cliente: Juan Pérez.',
          id_referencia: 8,
          tipo_referencia: 'ficha_mantenimiento'
        });
      });
    });

    describe('notificarAdminNuevaSolicitud', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarAdminNuevaSolicitud(1, 20, 'Ana García', 'Reparación');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 1,
          tipo_destinatario: 'administrador',
          tipo_notificacion: 'NUEVA_SOLICITUD',
          mensaje: 'Nueva solicitud de Reparación del cliente Ana García.',
          id_referencia: 20,
          tipo_referencia: 'solicitud'
        });
      });
    });

    describe('notificarCambioEstadoSolicitud', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarCambioEstadoSolicitud(4, 15, 'Aprobada');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 4,
          tipo_destinatario: 'cliente',
          tipo_notificacion: 'CAMBIO_ESTADO_SOLICITUD',
          mensaje: 'El estado de tu solicitud ha cambiado a: Aprobada.',
          id_referencia: 15,
          tipo_referencia: 'solicitud'
        });
      });
    });

    describe('notificarAdminVisitaCompletada', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarAdminVisitaCompletada(1, 25, 'Carlos Tech', 'María Cliente');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 1,
          tipo_destinatario: 'administrador',
          tipo_notificacion: 'VISITA_COMPLETADA',
          mensaje: 'El técnico Carlos Tech ha finalizado la visita con el cliente María Cliente.',
          id_referencia: 25,
          tipo_referencia: 'visita'
        });
      });
    });

    describe('notificarTecnicoNuevaVisita', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarTecnicoNuevaVisita(3, 30, 'Pedro López', '2025-12-10');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 3,
          tipo_destinatario: 'tecnico',
          tipo_notificacion: 'VISITA_ASIGNADA',
          mensaje: 'Se te ha asignado una nueva visita con el cliente Pedro López programada para el 2025-12-10.',
          id_referencia: 30,
          tipo_referencia: 'visita'
        });
      });
    });

    describe('notificarNuevaFactura', () => {
      it('debería crear notificación correcta', async () => {
        await notificacionService.notificarNuevaFactura(2, 'administrador', 'FAC-001', 'Cliente Test', '500.00');

        expect(notificacionRepository.crearNotificacion).toHaveBeenCalledWith({
          id_destinatario: 2,
          tipo_destinatario: 'administrador',
          tipo_notificacion: 'NUEVA_FACTURA',
          mensaje: 'Se ha registrado una nueva factura #FAC-001 para el cliente Cliente Test por un monto de $500.00.',
          id_referencia: null,
          tipo_referencia: 'factura'
        });
      });
    });
  });
});
