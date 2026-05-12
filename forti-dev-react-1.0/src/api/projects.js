import api from './axiosInstance.js';

export const listProjects = () => api.get('/projects').then((r) => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then((r) => r.data);
export const createProject = (data) => api.post('/projects', data).then((r) => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);

export const startScan = (projectId) =>
  api.post(`/projects/${projectId}/scans`).then((r) => r.data);
export const listProjectScans = (projectId) =>
  api.get(`/projects/${projectId}/scans`).then((r) => r.data);
export const createManualReview = (projectId, data) =>
  api.post(`/projects/${projectId}/reviews`, data).then((r) => r.data);
