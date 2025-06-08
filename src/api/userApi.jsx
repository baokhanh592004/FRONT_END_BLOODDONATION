import axios from 'axios';

export const fetchAllUsers = async () => {
  const token = localStorage.getItem('token'); // đảm bảo token được lưu khi login
  return axios.get('/api/admin/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const updateUserById = (id, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`/api/admin/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
  export const updateUserRole = (id, role) => {
  const token = localStorage.getItem('token');
  return axios.put(`/api/admin/users/${id}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateUserStatus = (id, status) => {
  const token = localStorage.getItem('token');
  return axios.put(`/api/admin/users/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteUserById = (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(`/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

