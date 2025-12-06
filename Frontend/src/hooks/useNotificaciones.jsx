import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { 
  handleObtenerNotificaciones, 
  handleContarNoLeidas,
  handleMarcarComoLeida,
  handleMarcarTodasComoLeidas 
} from '../controllers/common/notificacion.controller';

const NotificacionContext = createContext();

export const useNotificaciones = () => {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error('useNotificaciones debe usarse dentro de NotificacionProvider');
  }
  return context;
};

export const NotificacionProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);

  // Inicializar Socket.io
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
      console.warn('⚠️ No hay token o rol de usuario');
      return;
    }

    // Decodificar token para obtener el userId
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded.userId || decoded.id_usuario;
      console.log('🔑 Token decodificado:', { userId, role: userRole });
    } catch (error) {
      console.error('❌ Error decodificando token:', error);
      return;
    }

    if (!userId) {
      console.warn('⚠️ No se pudo obtener userId del token');
      return;
    }

    // Conectar a Socket.io (sin /api en la URL)
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    console.log('🔌 Conectando a Socket.io:', socketUrl);
    
    const socketInstance = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('✅ Conectado a Socket.io:', socketInstance.id);
      setConectado(true);
      
      // Autenticar para notificaciones
      const authData = {
        id_usuario: parseInt(userId),
        tipo_usuario: userRole.toLowerCase()
      };
      console.log('📡 Autenticando notificaciones:', authData);
      socketInstance.emit('autenticar_notificaciones', authData);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Desconectado de Socket.io');
      setConectado(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.io:', error.message);
      setConectado(false);
    });

    // Escuchar nuevas notificaciones en tiempo real
    socketInstance.on('nueva_notificacion', (notificacion) => {
      console.log('📩 Nueva notificación recibida:', notificacion);
      
      // Agregar al inicio de la lista
      setNotificaciones(prev => [notificacion, ...prev]);
      
      // Incrementar contador si no está leída
      if (!notificacion.leida) {
        setCantidadNoLeidas(prev => prev + 1);
      }

      // Mostrar notificación del navegador (opcional)
      if (Notification.permission === 'granted') {
        new Notification('Nueva notificación', {
          body: notificacion.mensaje,
          icon: '/logoA&C.png'
        });
      }
    });

    // Escuchar cuando se marca una notificación como leída
    socketInstance.on('notificacion_leida', ({ id_notificacion }) => {
      setNotificaciones(prev => 
        prev.map(n => 
          n.id_notificacion === id_notificacion 
            ? { ...n, leida: true } 
            : n
        )
      );
      setCantidadNoLeidas(prev => Math.max(0, prev - 1));
    });

    // Escuchar cuando se marcan todas como leídas
    socketInstance.on('todas_notificaciones_leidas', () => {
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setCantidadNoLeidas(0);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      console.log('🧹 Limpiando conexión Socket.io');
      socketInstance.disconnect();
    };
  }, []); // Solo se ejecuta una vez al montar

  // Cargar notificaciones iniciales
  const cargarNotificaciones = useCallback(async (limite = 50) => {
    const result = await handleObtenerNotificaciones(limite);
    if (result.success) {
      setNotificaciones(result.data);
    }
  }, []);

  // Actualizar contador de no leídas
  const actualizarContador = useCallback(async () => {
    const result = await handleContarNoLeidas();
    if (result.success) {
      setCantidadNoLeidas(result.cantidad);
    }
  }, []);

  // Marcar como leída
  const marcarComoLeida = useCallback(async (idNotificacion) => {
    const result = await handleMarcarComoLeida(idNotificacion);
    if (result.success) {
      setNotificaciones(prev => 
        prev.map(n => 
          n.id_notificacion === idNotificacion 
            ? { ...n, leida: true } 
            : n
        )
      );
      setCantidadNoLeidas(prev => Math.max(0, prev - 1));
    }
    return result;
  }, []);

  // Marcar todas como leídas
  const marcarTodasComoLeidas = useCallback(async () => {
    const result = await handleMarcarTodasComoLeidas();
    if (result.success) {
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      setCantidadNoLeidas(0);
    }
    return result;
  }, []);

  // Cargar notificaciones y contador al iniciar
  useEffect(() => {
    if (conectado) {
      cargarNotificaciones();
      actualizarContador();
    }
  }, [conectado, cargarNotificaciones, actualizarContador]);

  // Solicitar permiso para notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Detectar cambios de autenticación (logout/login)
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('🔄 Cambio de autenticación detectado - recargando página');
      window.location.reload();
    };

    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const value = {
    notificaciones,
    cantidadNoLeidas,
    conectado,
    cargarNotificaciones,
    actualizarContador,
    marcarComoLeida,
    marcarTodasComoLeidas
  };

  return (
    <NotificacionContext.Provider value={value}>
      {children}
    </NotificacionContext.Provider>
  );
};
