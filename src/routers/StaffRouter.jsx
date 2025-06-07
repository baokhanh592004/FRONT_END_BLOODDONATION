//KIỂM TRA
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const StaffRoute = ({ children }) => {
  // 1. Lấy thông tin người dùng đã lưu trong localStorage khi đăng nhập
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Kiểm tra xem người dùng có tồn tại VÀ có vai trò ('role') là 'staff' không
  const isAuthorized = user && user.role === 'staff';

  // 3. Lấy vị trí hiện tại để gửi thông báo cho trang login (không bắt buộc nhưng nên có)
  const location = useLocation();

  if (isAuthorized) {
    // Nếu có quyền, cho phép hiển thị component con (chính là trang StaffDashboard)
    return children;
  }

  // Nếu không có quyền, chuyển hướng người dùng về trang đăng nhập
  // Chúng ta gửi kèm một "state" chứa thông báo để trang login có thể hiển thị
  return (
    <Navigate 
      to="/login" 
      replace 
      state={{ from: location, message: "Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản nhân viên." }} 
    />
  );
};

export default StaffRoute;