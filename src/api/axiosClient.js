// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Gắn token vào tất cả request tự động
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("📦 Token gửi lên:", token);
  } else {
    console.warn("⚠️ Không có token trong localStorage");
  }
  return config;
});


export default axiosClient;
