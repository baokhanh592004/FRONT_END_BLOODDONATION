import React from 'react';
import { Navigate } from 'react-router-dom';

const MemberRoute = ({ children }) => {
  const userString = localStorage.getItem('user');

  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);
  const isAuthorized = user && user.role === 'MEMBER';

  if (isAuthorized) {
    return children;
  } else {
    // Nếu không phải member, có thể chuyển hướng về trang chính hoặc trang báo lỗi
    return <Navigate to="/" replace />;
  }
};

export default MemberRoute;