import React from 'react';
import { Routes, Route } from 'react-router-dom';


// Layouts
import AppLayout from '../layouts/AppLayout';
import StaffLayout from '../layouts/StaffLayout'; // <-- IMPORT
import AdminLayout from '../layouts/AdminLayout';

// General Pages
import HomePages from '../pages/HomePages';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Profile from '../pages/Profile'; // <-- THÊM MỚI
import DonationRegistrationPage from '../pages/member/DonationRegistrationPage'; // <-- THÊM MỚI
import HealthAnswer from '../pages/member/HealthAnswer';
// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import DonationManagementPage from '../pages/staff/DonationManagementPage'; // THAY THẾ PatientManagementPage

import DonorHealthCheckPage from '../pages/staff/DonorHealthCheckPage'; // <-- THÊM MỚI




import BloodInventoryPage from '../pages/staff/BloodInventoryPage';
import UrgentDonorSearchPage from '../pages/staff/UrgentDonorSearchPage';
import RequestApprovalPage from '../pages/staff/RequestApprovalPage';
import StaffPage from '../pages/staff/StaffPage';

// Route Protector
import StaffRoute from './StaffRoute';
// Admin Pages
import AdminRouter from './AdminRouter';
import UserManagement from '../pages/admin/UserManagement';
import HealthQuestion from '../pages/admin/HealthQuestion';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPage from '../pages/admin/AdminPage';
// Center Pagé
import CenterRoute from './CenterRouter';
import CenterLayout from '../layouts/CenterLayout';
import CenterPage from '../pages/center/CenterPage';

//
import { AuthProvider } from '../auth/AuthProvider';

import AdminPage from '../pages/admin/AdminPage';

import About from '../pages/About';


export default function AppRouters() {
  return (

    <Routes>
      {/* Routes cho người dùng chung */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<About/>} />

        {/* === SỬ DỤNG ROUTE MỚI === */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-donation" element={<DonationRegistrationPage />} />
        <Route path="/member/donation-questionnaire" element={<HealthAnswer />} />
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
        <Route path="bloodrequests" element={<StaffPage />} />

      </Route>


      <Route
        path="/admin"
        element={
          <AdminRouter>
            <AdminLayout />
          </AdminRouter>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="usermanagement" element={<UserManagement />} />

        <Route path="healthquestion" element={<HealthQuestion />} />
        <Route path="requests" element={<AdminPage />} />

      </Route>
      
      <Route
        path="/center"
        element={
          <CenterRoute>
            <CenterLayout />
          </CenterRoute>
        }
      >
        <Route path="createrequest" element={<CenterPage/>} />


      </Route>



    </Routes>




  );
  function App() {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }
}