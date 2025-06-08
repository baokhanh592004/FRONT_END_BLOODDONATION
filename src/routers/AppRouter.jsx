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

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import PatientManagementPage from '../pages/staff/PatientManagementPage';
import DonationUpdatePage from '../pages/staff/DonationUpdatePage';
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
        <Route path="patients" element={<PatientManagementPage />} />
        <Route path="donations" element={<DonationUpdatePage />} />
        <Route path="inventory" element={<BloodInventoryPage />} />
        <Route path="search-urgent" element={<UrgentDonorSearchPage />} />
        <Route path="requests" element={<RequestApprovalPage />} />
      </Route>
    </Routes>
  );
}