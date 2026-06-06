import axios from 'axios';

const api = axios.create({
  baseURL: window.location.origin.includes('localhost') ? 'http://localhost:5000/api/v1' : '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage dynamically to authorization headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
