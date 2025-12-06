import { useState, useEffect, useRef } from "react";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook genérico para manejar caché de datos con sessionStorage
 * @param {string} cacheKey - Clave única para identificar el caché
 * @param {Function} fetchFunction - Función que obtiene los datos del servidor
 * @param {Object} options - Opciones: { lazy: boolean } - Si es true, no carga automáticamente
 * @returns {Object} - { data, isLoading, reload, invalidateCache, init }
 */
const useDataCache = (cacheKey, fetchFunction, options = {}) => {
  const { lazy = false } = options;
  
  // Inicializar con datos del caché si existen
  const getInitialData = () => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      const timestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (err) {
      console.error(`Error al leer caché inicial [${cacheKey}]:`, err);
    }
    return [];
  };
  
  const [data, setData] = useState(getInitialData);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const isMountedRef = useRef(false);

  const getCachedData = () => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      const timestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (err) {
      console.error(`Error al leer caché [${cacheKey}]:`, err);
    }
    return null;
  };

  const setCachedData = (newData) => {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(newData));
      sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
    } catch (err) {
      console.error(`Error al guardar caché [${cacheKey}]:`, err);
    }
  };

  const invalidateCache = () => {
    try {
      sessionStorage.removeItem(cacheKey);
      sessionStorage.removeItem(`${cacheKey}_timestamp`);
      hasFetchedRef.current = false;
    } catch (err) {
      console.error(`Error al invalidar caché [${cacheKey}]:`, err);
    }
  };

  const loadData = async (force = false) => {
    // Evitar múltiples llamadas simultáneas
    if (isLoadingRef.current) {
      return;
    }

    // Si ya cargamos y no es forzado, no recargar
    if (hasFetchedRef.current && !force) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      // Intentar obtener del caché primero
      if (!force) {
        const cached = getCachedData();
        if (cached) {
          setData(cached);
          setIsLoading(false);
          isLoadingRef.current = false;
          hasFetchedRef.current = true;
          return;
        }
      }

      // 🚀 Obtener datos del servidor
      const result = await fetchFunction();
      const newData = result?.data?.data || result?.data || result || [];

      // Guardar en caché
      setCachedData(newData);
      setData(newData);
      hasFetchedRef.current = true;
    } catch (err) {
      console.error(`Error al obtener datos [${cacheKey}]:`, err);
      setData([]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  // Función para iniciar la carga manualmente (útil en modo lazy)
  const init = () => {
    if (!hasFetchedRef.current) {
      loadData();
    }
  };

  const reload = async () => {
    invalidateCache();
    hasFetchedRef.current = false;
    setIsLoading(true);
    await loadData(true);
  };

  // Cargar datos automáticamente solo si no es lazy Y no hay datos en caché
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!lazy && data.length === 0) {
      // Solo cargar del servidor si no hay datos en caché
      loadData();
    } else if (data.length > 0) {
      // Si ya hay datos del caché, marcar como cargado
      hasFetchedRef.current = true;
    }
    
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    reload,
    invalidateCache,
    init, // Para modo lazy: llamar manualmente cuando se necesite
  };
};

export default useDataCache;
