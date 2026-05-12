import api from './axiosInstance.js';

export const getScan = (id) => api.get(`/scans/${id}`).then((r) => r.data);
export const getScanFindings = (id, params) =>
  api.get(`/scans/${id}/findings`, { params }).then((r) => r.data);
