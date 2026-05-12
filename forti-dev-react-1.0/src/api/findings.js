import api from './axiosInstance.js';

export const listFindings = (params) =>
  api.get('/findings', { params }).then((r) => r.data);
export const getFinding = (id) => api.get(`/findings/${id}`).then((r) => r.data);
export const updateFindingStatus = (id, status) =>
  api.patch(`/findings/${id}/status`, { status }).then((r) => r.data);
export const assignFinding = (id, assignedTo) =>
  api.patch(`/findings/${id}/assign`, { assignedTo }).then((r) => r.data);
