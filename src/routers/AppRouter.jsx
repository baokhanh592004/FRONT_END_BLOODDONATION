import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminLayout from '../layouts/AdminLayout';

export default function AppRouters() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      

    {/* Admin layout routes */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="profile" element={<AdminProfile />} />
    {/* <Route path="dashboard" element={<Dashboard />} /> */}
    {/* <Route path="users" element={<UserManagement />} /> */}
  </Route>

      {/* Protected/App routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Thêm các route khác cần AppLayout tại đây */}


      </Route>
    </Routes>
  );
}
