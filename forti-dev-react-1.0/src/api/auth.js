import api from './axiosInstance.js';

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const logout = () =>
  api.post('/auth/logout').then((r) => r.data);

export const refresh = () =>
  api.post('/auth/refresh').then((r) => r.data);

export const register = (data) =>
  api.post('/auth/register', data).then((r) => r.data);
