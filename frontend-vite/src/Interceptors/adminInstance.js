import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const adminInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to all requests
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

// Special config for file uploads with larger payload size
adminInstance.uploadFile = (url, data, onUploadProgress) => {
  const token = localStorage.getItem('Admintoken');
  
  return adminInstance.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    maxContentLength: 10 * 1024 * 1024, // 10MB max content length
    maxBodyLength: 10 * 1024 * 1024,    // 10MB max body length
    onUploadProgress
  });
};

export default adminInstance;
