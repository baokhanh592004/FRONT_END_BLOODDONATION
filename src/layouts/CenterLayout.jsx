import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser, FaTachometerAlt, FaUsers, FaSyncAlt, FaTint, FaSearch, FaCheckSquare } from 'react-icons/fa';

// Dữ liệu cho các link trên sidebar
const navLinks = [

  { to: '/center/createrequest', icon: <FaTachometerAlt />, text: 'Tạo yêu cầu máu' },
  

  
];

const CenterLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-5 flex-shrink-0">
        <h2 className="text-xl font-bold text-green-700 mb-6"> Treatment_Center  </h2>
        <nav className="space-y-2">
          {/* Mục cá nhân */}
          <div className="flex items-center p-2 text-gray-700 rounded-md">
            <FaUser className="mr-3" />
            <span>Hồ sơ cá nhân</span>
          </div>
          <hr className="my-4" />

          {/* Các mục chức năng */}
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              // Dùng NavLink để tự động thêm class 'active' khi route khớp
              className={({ isActive }) =>
                `flex items-center p-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-4 text-lg">{link.icon}</span>
              {link.text}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content - Nội dung của các trang con sẽ được render ở đây */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CenterLayout;