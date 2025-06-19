import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AppLayout from '../layouts/AppLayout';
import StaffLayout from '../layouts/StaffLayout'; // <-- IMPORT

// General Pages
import HomePages from '../pages/HomePages';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DonationRegistrationPage from '../pages/member/DonationRegistrationPage'; // <-- THÊM MỚI
import DonationQuestionnairePage from '../pages/member/DonationQuestionnairePage'; // <-- THÊM MỚI
// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import DonationManagementPage from '../pages/staff/DonationManagementPage'; // THAY THẾ PatientManagementPage
import DonorHealthCheckPage from '../pages/staff/DonorHealthCheckPage'; // <-- THÊM MỚI


import BloodInventoryPage from '../pages/staff/BloodInventoryPage';
import UrgentDonorSearchPage from '../pages/staff/UrgentDonorSearchPage';
import RequestApprovalPage from '../pages/staff/RequestApprovalPage';

// Route Protector
import StaffRoute from './StaffRoute';

export default function AppRouters() {
  return (
    <Routes>
      {/* Routes cho người dùng chung */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />

        {/* === SỬ DỤNG ROUTE MỚI === */}
        <Route path="/register-donation" element={<DonationRegistrationPage />} />
        <Route path="/member/donation-questionnaire" element={<DonationQuestionnairePage />} />
      </Route>

      {/* Routes được bảo vệ cho Staff */}
      <Route
        path="/staff"
        element={
          <StaffRoute>
            <StaffLayout />
          </StaffRoute>
        }
      >
        <Route path="dashboard" element={<StaffDashboard />} />
          {/* PHẦN NÀY LẤY ID TỪ BACKEND LÊN */}
          <Route path="donors" element={<DonationManagementPage />} /> {/* Route cho danh sách */}
          <Route path="donors/:donorId" element={<DonorHealthCheckPage />} /> {/* Route cho trang chi tiết/khai báo */} 
        <Route path="inventory" element={<BloodInventoryPage />} />
        <Route path="search-urgent" element={<UrgentDonorSearchPage />} />
        <Route path="requests" element={<RequestApprovalPage />} />
      </Route>
    </Routes>
  );
}