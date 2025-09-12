import axios from 'axios';

const adminInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
adminInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Admintoken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
adminInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('Admintoken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminInstance;
