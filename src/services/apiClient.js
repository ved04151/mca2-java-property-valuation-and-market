import axios from 'axios';

/**
 * CENTRALIZED AXIOS INSTANCE
 * 
 * Configured for future Spring Boot 3.x backend integration.
 * - Base URL defaults to VITE_API_BASE_URL or http://localhost:8080
 * - Automatically attaches JWT Bearer token from localStorage
 * - Handles global 401 Unauthorized by clearing session and redirecting
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor for injecting JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('propval_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 / expired JWT
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
      localStorage.removeItem('propval_token');
      localStorage.removeItem('propval_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
