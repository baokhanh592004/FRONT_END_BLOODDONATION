// src/api/requestApi.js
import axiosClient from './axiosClient'; // dùng tên đúng, đừng rename thành `api`

export const sendRequestFromCenter = (data) =>
  axiosClient.post('/blood-requests', data);

export const getRequestsOfCenter = () =>
  axiosClient.get('/blood-requests/mine');

export const getRequestsForAdmin = () =>
  axiosClient.get('/blood-requests');

export const getAllStaffs = () =>
  axiosClient.get('/blood-requests/staffs');

export const getRequestsForStaff = () =>
  axiosClient.get('/blood-requests/assigned');

export const assignRequestToStaff = (id, staffId, status) =>
  axiosClient.put(`/blood-requests/${id}/assign?staffId=${staffId}&status=${status}`);

export const sendRequestToStaff = (requestId, staffId, status) =>
  axiosClient.put(`/blood-requests/${requestId}/assign?staffId=${staffId}&status=${status}`);

export const updateRequestStatus = (id, status) =>
  axiosClient.put(`/blood-requests/${id}/status?status=${status}`);