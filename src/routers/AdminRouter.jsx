// src/routes/StaffRouter.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const StaffRoute = ({ children }) => {
  // 1. Vệ sĩ hỏi: "Thẻ của anh là gì?"
  //    Code sẽ lấy thông tin người dùng đã được lưu trong localStorage khi đăng nhập.
  const userString = localStorage.getItem('user');
  
  // Nếu không có thẻ (chưa đăng nhập), vệ sĩ biết ngay là không được vào.
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  // 2. Vệ sĩ xem thẻ và kiểm tra chức vụ.
  const user = JSON.parse(userString);
  
  // "Thẻ của anh ghi chức vụ là 'staff' phải không?"
  // Đây là dòng code KIỂM TRA QUYỀN HẠN quan trọng nhất.
  const isAuthorized = user && user.role === 'ADMIN';

  // 3. Vệ sĩ ra quyết định
  if (isAuthorized) {
    // Nếu đúng là 'staff', vệ sĩ nói: "Mời anh vào".
    // {children} ở đây chính là <StaffLayout /> và các trang con của nó.
    return children; 
  } else {
    // Nếu không phải 'staff' (ví dụ role là 'user' hoặc một giá trị khác),
    // vệ sĩ nói: "Anh không có phận sự ở đây, mời quay lại".
    // Và đá người dùng về trang đăng nhập.
    return <Navigate to="/login" replace />;
  }
};

export default StaffRoute;