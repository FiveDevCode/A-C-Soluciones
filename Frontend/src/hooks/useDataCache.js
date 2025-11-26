import { useState, useEffect, useRef } from "react";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook genérico para manejar caché de datos con sessionStorage
 * @param {string} cacheKey - Clave única para identificar el caché
 * @param {Function} fetchFunction - Función que obtiene los datos del servidor
 * @returns {Object} - { data, isLoading, reload, invalidateCache }
 */
const useDataCache = (cacheKey, fetchFunction) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingRef = useRef(false);
  const hasFetchedRef = useRef(false);

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

  const reload = () => {
    invalidateCache();
    hasFetchedRef.current = false;
    loadData(true);
  };

  // Cargar datos solo al montar el componente
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    reload,
    invalidateCache,
  };
};

export default useDataCache;
