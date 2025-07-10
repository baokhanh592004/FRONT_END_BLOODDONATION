import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaUser, FaTachometerAlt, FaUsers, FaSyncAlt, FaTint, FaSearch, FaCheckSquare, FaSignOutAlt } from 'react-icons/fa';

const navLinks = [
  { to: '/staff/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
  { to: '/staff/donors', icon: <FaUsers />, text: 'Danh sách đăng ký hiến máu' },
  { to: '/staff/inventory', icon: <FaTint />, text: 'Quản lý kho máu' },
  { to: '/staff/notifications-broadcast', icon: <FaSyncAlt />, text: 'Gửi yêu cầu hiến máu khẩn cấp' },
  { to: '/staff/search-urgent', icon: <FaSearch />, text: 'Tìm kiếm người hiến máu khẩn cấp' },
  { to: '/staff/search-nearby', icon: <FaSearch />, text: 'Tìm người hiến gần' },
  { to: '/staff/requests', icon: <FaCheckSquare />, text: 'Phê duyệt yêu cầu' },
  { to: '/staff/bloodrequests', icon: <FaCheckSquare />, text: 'Yêu cầu máu' },
];

const StaffLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-5 flex-shrink-0">
        <h2 className="text-xl font-bold text-green-700 mb-6">Staff</h2>
        <nav className="space-y-2">
          <div className="flex items-center p-2 text-gray-700 rounded-md">
            <FaUser className="mr-3" />
            <span>Hồ sơ cá nhân</span>
          </div>
          <hr className="my-4" />

          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
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

          {/* Nút Đăng xuất */}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-100 hover:text-red-800 transition-colors duration-200 mt-4"
          >
            <FaSignOutAlt className="mr-4 text-lg" />
            Đăng xuất
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

export default StaffLayout;
