import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import LoginGoogle from '../pages/LoginGoogle';
import AppLayout from '../layouts/AppLayout';
export default function AppRouters() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginGoogle />} />
      </Route>
      
    </Routes>
  );
}
