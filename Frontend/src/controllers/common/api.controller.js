// src/services/api.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_KEY, // puedes usar una variable de entorno
  
});

// Agrega el token en cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maneja token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 && message === 'Token expirado') {
      console.warn('Token expirado, redirigiendo al inicio de sesión...');

      // Limpieza de sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionId');

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('tab_')) localStorage.removeItem(key);
      });

      window.location.href = '/iniciar-sesion?sessionExpired=true';
    }

    return Promise.reject(error);
  }
);

export default api;
