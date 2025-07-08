// src/routes/AdminRouter.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRouter = ({ children }) => {
  // 1. Lấy thông tin người dùng từ localStorage
  const userString = localStorage.getItem('user');

  // 2. Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  // 3. Parse chuỗi JSON thành object
  const user = JSON.parse(userString);

  // 4. Kiểm tra quyền là ADMIN
  const isAuthorized = user && user.role === 'ADMIN';

  // 5. Nếu có quyền, cho phép truy cập, ngược lại chuyển hướng về login
  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default AdminRouter;
