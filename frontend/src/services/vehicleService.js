import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const vehicleService = {
  // Registrar entrada de vehículo
  registerEntry: async (vehicleData) => {
    const response = await api.post('/vehicles/entry', vehicleData);
    return response.data;
  },

  // Registrar salida de vehículo
  registerExit: async (plate, observations = '') => {
    const response = await api.post(`/vehicles/exit/${plate}`, { observations });
    return response.data;
  },

  // Buscar vehículo por placa
  searchVehicle: async (plate) => {
    const response = await api.get(`/vehicles/search/${plate}`);
    return response.data;
  },

  // Listar vehículos activos
  listActiveVehicles: async () => {
    const response = await api.get('/vehicles/active');
    return response.data;
  },

  // Obtener historial de un vehículo
  getVehicleHistory: async (plate) => {
    const response = await api.get(`/vehicles/history/${plate}`);
    return response.data;
  },

  // Obtener todos los vehículos con paginación
  getAllVehicles: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/vehicles/stats');
    return response.data;
  },

  // Actualizar información de un vehículo
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },
};

export default vehicleService;
