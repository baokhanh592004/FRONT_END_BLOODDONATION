import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
export default function AppRouters() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<Dashboard />} />
       
      </Route>
      
    </Routes>
  );
}
