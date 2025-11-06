import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const parkingService = {
  createSpace: async (data) => {
    const res = await api.post('/parking-spaces', data);
    return res.data;
  },
  getSpaces: async () => {
    const res = await api.get('/parking-spaces');
    return res.data;
  },
  getSpace: async (id) => {
    const res = await api.get(`/parking-spaces/${id}`);
    return res.data;
  },
  updateSpace: async (id, data) => {
    const res = await api.put(`/parking-spaces/${id}`, data);
    return res.data;
  },
  deleteSpace: async (id) => {
    const res = await api.delete(`/parking-spaces/${id}`);
    return res.data;
  },
  assignSpace: async (id, body) => {
    const res = await api.post(`/parking-spaces/${id}/assign`, body);
    return res.data;
  },
  autoAssign: async (body) => {
    const res = await api.post(`/parking-spaces/auto-assign`, body);
    return res.data;
  },
  releaseSpace: async (id) => {
    const res = await api.post(`/parking-spaces/${id}/release`);
    return res.data;
  }
};

export default parkingService;

