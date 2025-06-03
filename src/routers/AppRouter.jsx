import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import LoginGoogle from '../pages/LoginGoogle';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
export default function AppRouters() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginGoogle />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      
    </Routes>
  );
}
