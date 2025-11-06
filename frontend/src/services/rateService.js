import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const rateService = {
  // Obtener todas las tarifas
  getRates: async (params = {}) => {
    const response = await api.get('/rates', { params });
    return response.data;
  },

  // Obtener tarifa por ID
  getRate: async (id) => {
    const response = await api.get(`/rates/${id}`);
    return response.data;
  },

  // Obtener tarifas activas por tipo de vehículo
  getActiveRatesByType: async (vehicleType) => {
    const response = await api.get(`/rates/active/${vehicleType}`);
    return response.data;
  },

  // Crear nueva tarifa (Admin)
  createRate: async (rateData) => {
    const response = await api.post('/rates', rateData);
    return response.data;
  },

  // Actualizar tarifa (Admin)
  updateRate: async (id, rateData) => {
    const response = await api.put(`/rates/${id}`, rateData);
    return response.data;
  },

  // Eliminar tarifa (Admin) - soft delete
  deleteRate: async (id) => {
    const response = await api.delete(`/rates/${id}`);
    return response.data;
  }
};

export default rateService;
