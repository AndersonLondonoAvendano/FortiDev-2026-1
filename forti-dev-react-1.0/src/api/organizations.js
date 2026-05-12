import api from './axiosInstance.js';

export const listOrganizations = () =>
  api.get('/organizations').then((r) => r.data);

export const getOrganization = (id) =>
  api.get(`/organizations/${id}`).then((r) => r.data);

export const createOrganization = (data) =>
  api.post('/organizations', data).then((r) => r.data);

export const updateOrganization = (id, data) =>
  api.put(`/organizations/${id}`, data).then((r) => r.data);

export const deleteOrganization = (id) =>
  api.delete(`/organizations/${id}`).then((r) => r.data);

export const listOrgMembers = (id) =>
  api.get(`/organizations/${id}/members`).then((r) => r.data);

export const inviteMember = (id, data) =>
  api.post(`/organizations/${id}/members`, data).then((r) => r.data);

export const updateMemberRole = (id, userId, role) =>
  api.patch(`/organizations/${id}/members/${userId}`, { role }).then((r) => r.data);

export const removeMember = (id, userId) =>
  api.delete(`/organizations/${id}/members/${userId}`).then((r) => r.data);

export const listOrgProjects = (id) =>
  api.get(`/organizations/${id}/projects`).then((r) => r.data);
