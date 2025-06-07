import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePages from '../pages/HomePages';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import StaffDashboard from '../pages/StaffDashboard'; // Import trang Dashboard của nhân viên

import StaffRoute from './StaffRouter'; // Import StaffRoute để bảo vệ route staff
export default function AppRouters() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />

        <Route path="/staff/dashboard" element= {
        <StaffRoute>
          {/* Chỉ nhân viên mới có thể truy cập trang này */}
          {/* Nếu không có quyền, sẽ chuyển hướng về trang đăng nhập */}
          <StaffDashboard />
        </StaffRoute>
        }/>
      </Route>
      
    </Routes>
  );
}
