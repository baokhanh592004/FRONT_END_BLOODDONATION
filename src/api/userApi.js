import axiosClient from './axiosClient';

export const fetchAllUsers = async () => {
  return axiosClient.get('/admin/users');
};

export const updateUserById = (id, data) => {
  return axiosClient.put(`/admin/users/${id}`, data);
};

export const updateUserRole = (id, role) => {
  return axiosClient.put(`/admin/users/${id}/role`, { role });
};

export const createUser = (data) => {
  return axiosClient.post("/admin/users", data);
};

export const updateUserStatus = (id, status) => {
  return axiosClient.put(`/admin/users/${id}/status`, { status });
};

export const deleteUserById = (id) => {
  return axiosClient.delete(`/admin/users/${id}`);
};
