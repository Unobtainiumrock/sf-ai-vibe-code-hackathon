/**
 * API service for communicating with AHA backend
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const incidentAPI = {
  /**
   * Get all incidents
   */
  getIncidents: async () => {
    try {
      const response = await api.get('/api/incidents');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      throw error;
    }
  },

  /**
   * Get a specific incident by ID
   */
  getIncident: async (incidentId) => {
    try {
      const response = await api.get(`/api/incidents/${incidentId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch incident ${incidentId}:`, error);
      throw error;
    }
  },

  /**
   * Clear all incidents (for demo)
   */
  clearIncidents: async () => {
    try {
      const response = await api.delete('/api/incidents');
      return response.data;
    } catch (error) {
      console.error('Failed to clear incidents:', error);
      throw error;
    }
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default api;
