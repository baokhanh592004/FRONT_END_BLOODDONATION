// src/api/authApi.js
import api from './axiosClient';

export const login = (login, password) => {
  return api.post('/auth/login', { login, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};
