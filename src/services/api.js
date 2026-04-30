import axios from 'axios';

// Cambia esta URL por la de tu backend REST real.
// Ejemplo: 'https://api.tudominio.com' o 'http://localhost:3000/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token si existe (autenticación futura)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas para manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  }
);

export default api;
