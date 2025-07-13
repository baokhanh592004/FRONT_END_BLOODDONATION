import React from "react";
import { Routes, Route } from "react-router-dom";


// Layouts
import AppLayout from "../layouts/AppLayout";
import StaffLayout from "../layouts/StaffLayout";
import AdminLayout from "../layouts/AdminLayout";

// General Pages

import HomePages from "../pages/HomePages";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import Profile from "../pages/Profile";
import DonationRegistrationPage from "../pages/member/DonationRegistrationPage";
import DonationQuestionnairePage from "../pages/member/DonationQuestionnairePage"; // ✅ rename đúng chuẩn
import SuccessPage from "../pages/member/SuccessPage";
import About from "../pages/About";

// Staff Pages
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffRoute from "./StaffRoute";


// Admin Pages

import AdminRouter from "./AdminRouter";
import UserManagement from "../pages/admin/UserManagement";
import HealthQuestion from "../pages/admin/HealthQuestion";
import AdminPage from "../pages/admin/AdminPage";
import AdminDashboard from '../pages/admin/AdminDashboard';

import BloodInventory from '../pages/admin/BloodInventory';


// Center Pagé
import CenterRoute from './CenterRouter';
import CenterLayout from '../layouts/CenterLayout';
import CenterPage from '../pages/center/CenterPage';


// Route Protectors




export default function AppRouters() {
  return (

    <Routes>
      {/* ===== Public Routes ===== */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePages />} />


        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<About />} />

        <Route path="/profile" element={<Profile />} />

        {/* ✅ Trang đăng ký hiến máu (Step 1 & 2) */}
        <Route
          path="/register-donation"
          element={<DonationRegistrationPage />}
        />
        <Route
          path="/member/donation-questionnaire"
          element={<DonationQuestionnairePage />}
        />
        <Route path="/member/success" element={<SuccessPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Routes được bảo vệ cho Staff */}

       <Route path="/login" element={<LoginPage />} />

      {/* ===== Staff Routes (Protected) ===== */}

      <Route
        path="/staff"
        element={
          <StaffRoute>
            <StaffLayout />
          </StaffRoute>
        }
      >

        <Route path="dashboard" element={<StaffDashboard />} />


      </Route>

      {/* ===== Admin Routes (Protected) ===== */}
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

        <Route path='bloodinventory' element={<BloodInventory />} />
        



      </Route>

      <Route
        path="/center"
        element={
          <CenterRoute>
            <CenterLayout />
          </CenterRoute>
        }
      >
        <Route path="createrequest" element={<CenterPage />} />

      </Route>

    </Routes>




  );

}
