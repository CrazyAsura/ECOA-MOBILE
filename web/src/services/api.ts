import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[ECOA API] Initialized with baseURL:', api.defaults.baseURL);

// Interceptor for Auth
api.interceptors.request.use((config) => {
  // You can pull the token from Redux state or Cookies
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
