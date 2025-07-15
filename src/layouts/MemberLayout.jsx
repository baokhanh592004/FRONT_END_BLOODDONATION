import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// Bỏ icon FaTachometerAlt không còn dùng đến
import { FaHistory, FaCalendarCheck, FaCertificate, FaArrowLeft } from 'react-icons/fa';

// Xóa mục "Quản lý chung" ra khỏi mảng navLinks
const navLinks = [
  { to: '/member/history', icon: <FaHistory />, text: 'Lịch Sử Hiến Máu' },
  { to: '/member/appointments', icon: <FaCalendarCheck />, text: 'Lịch Hẹn Hiến Máu' },
  { to: '/member/certificate', icon: <FaCertificate />, text: 'Chứng Nhận Hiến Máu' },
];

const MemberLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-5 flex-shrink-0">
        <h2 className="text-xl font-bold text-red-700 mb-6">Trang thành viên</h2>
        <nav className="space-y-2">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center p-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-4 text-lg">{link.icon}</span>
              {link.text}
            </NavLink>
          ))}
          <hr className="my-4" />
           <button
            onClick={() => navigate('/')}
            className="flex items-center w-full p-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-200"
           >
             <FaArrowLeft className="mr-4 text-lg" />
             Quay lại trang chủ
           </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;