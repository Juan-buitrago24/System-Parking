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

const paymentService = {
  // Calcular monto de pago
  calculatePayment: async (vehicleId, discount = 0, isPercentage = true) => {
    const response = await api.post('/payments/calculate', {
      vehicleId,
      discount,
      isPercentage
    });
    return response.data;
  },

  // Registrar pago
  registerPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Obtener todos los pagos
  getPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Obtener pago por ID
  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Procesar reembolso (Admin)
  processRefund: async (id, reason) => {
    const response = await api.post(`/payments/${id}/refund`, { reason });
    return response.data;
  },

  // Obtener estadísticas de pagos
  getStats: async () => {
    const response = await api.get('/payments/stats/summary');
    return response.data;
  }
};

export default paymentService;
