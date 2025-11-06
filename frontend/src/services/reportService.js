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

const reportService = {
  // Obtener ingresos diarios
  getDailyIncome: async (startDate, endDate) => {
    const response = await api.get('/reports/daily-income', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Obtener reporte por tipo de vehículo
  getByVehicleType: async (startDate, endDate) => {
    const response = await api.get('/reports/by-vehicle-type', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Obtener reporte por método de pago
  getByPaymentMethod: async (startDate, endDate) => {
    const response = await api.get('/reports/by-payment-method', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Obtener resumen general
  getSummary: async (startDate, endDate) => {
    const response = await api.get('/reports/summary', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Obtener lista detallada de pagos
  getPaymentsList: async (params) => {
    const response = await api.get('/reports/payments-list', { params });
    return response.data;
  },

  // Obtener top vehículos
  getTopVehicles: async (startDate, endDate) => {
    const response = await api.get('/reports/top-vehicles', {
      params: { startDate, endDate }
    });
    return response.data;
  }
};

export default reportService;
