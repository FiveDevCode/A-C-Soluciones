import { useEffect, useState, useRef } from 'react';

/**
 * Hook para auto-refresh y mostrar tiempo transcurrido desde la última actualización
 * @param {Function} onRefresh - Función a ejecutar para refrescar los datos
 * @param {number} intervalMinutes - Intervalo en minutos para auto-refresh (default: 3)
 * @returns {Object} - { lastUpdate, timeAgo, manualRefresh }
 */
const useAutoRefresh = (onRefresh, intervalMinutes = 3) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [timeAgo, setTimeAgo] = useState('Hace unos segundos');
  const intervalRef = useRef(null);
  const timeAgoIntervalRef = useRef(null);

  // Función para calcular el tiempo transcurrido
  const calculateTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 10) return 'Hace unos segundos';
    if (seconds < 60) return `Hace ${seconds} segundos`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    
    const hours = Math.floor(minutes / 60);
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  };

  // Actualizar el texto de "hace cuánto"
  useEffect(() => {
    const updateTimeAgo = () => {
      setTimeAgo(calculateTimeAgo(lastUpdate));
    };

    updateTimeAgo();
    timeAgoIntervalRef.current = setInterval(updateTimeAgo, 30000); // Actualizar cada 30 segundos

    return () => {
      if (timeAgoIntervalRef.current) {
        clearInterval(timeAgoIntervalRef.current);
      }
    };
  }, [lastUpdate]);

  // Auto-refresh
  useEffect(() => {
    const doRefresh = async () => {
      await onRefresh();
      setLastUpdate(Date.now());
    };

    // Configurar intervalo de auto-refresh
    intervalRef.current = setInterval(doRefresh, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onRefresh, intervalMinutes]);

  // Función para refresh manual
  const manualRefresh = async () => {
    await onRefresh();
    setLastUpdate(Date.now());
  };

  return {
    lastUpdate,
    timeAgo,
    manualRefresh,
  };
};

export default useAutoRefresh;
