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



import BloodInventoryPage from '../pages/staff/BloodInventoryPage';
import UrgentDonorSearchPage from '../pages/staff/UrgentDonorSearchPage';
import RequestApprovalPage from '../pages/staff/RequestApprovalPage';

// Route Protector
import StaffRoute from './StaffRoute';
// Admin Pages
import AdminRouter from './AdminRouter';
import UserManagement from '../pages/admin/UserManagement';
import HealthQuestion from '../pages/admin/HealthQuestion';
import About from '../pages/About';
import SendDonorNotification from '../pages/staff/SendDonorNotification';

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
          <Route path="donors" element={<DonationManagementPage />} /> {/*danh sách đăng kí hiến máu */}
          <Route path="inventory" element={<BloodInventoryPage />} /> {/* quản lý kho máu */}
          <Route path="notifications-broadcast" element={<SendDonorNotification/>} /> {/* gửi yêu cầu hiến máu khẩn cấp */}
          <Route path="search-urgent" element={<UrgentDonorSearchPage />} />
          <Route path="requests" element={<RequestApprovalPage />} />

       
      </Route>


      <Route
        path="/admin"
        element={
          <AdminRouter>
            <AdminLayout />
          </AdminRouter>
        }
      >
        <Route path="dashboard" element={<StaffDashboard/>} />
        <Route path="usermanagement" element={<UserManagement />} />
        <Route path="healthquestion" element={<HealthQuestion/>} />

      </Route>


    </Routes>
  );
}