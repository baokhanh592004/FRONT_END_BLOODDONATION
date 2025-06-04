import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
export default function AppRouters() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      </Route>
      
    </Routes>
  );
}
