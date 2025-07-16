// src/components/Header.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  // --- SỬA ĐỔI 1: Khởi tạo state từ localStorage ---
  // Đọc danh sách ID đã chấp nhận từ localStorage khi component tải lần đầu.
  // `?? '[]'` để đảm bảo nếu không có gì trong localStorage, ta sẽ dùng một mảng rỗng.
  const [acceptedNotifications, setAcceptedNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("acceptedNotifications");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Lỗi khi đọc acceptedNotifications từ localStorage:", error);
      return [];
    }
  });

  // Hàm fetch thông báo từ API
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedNotifications = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);

      if (response.data.some((notif) => !notif.read)) {
        setHasUnread(true);
      } else {
        setHasUnread(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  const handleAcceptNotification = async (notificationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/notification/${notificationId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data);

      // --- SỬA ĐỔI 2: Lưu state vào localStorage sau khi cập nhật ---
      setAcceptedNotifications((prev) => {
        const newAccepted = [...prev, notificationId];
        // Lưu mảng ID mới vào localStorage
        localStorage.setItem("acceptedNotifications", JSON.stringify(newAccepted));
        return newAccepted;
      });

      // không cần fetch lại để giữ UI ổn định
    } catch (error) {
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi xác nhận.";
      alert(`Lỗi: ${errorMessage}`);
      console.error("Lỗi khi đồng ý hiến máu:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchNotifications();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // --- BỔ SUNG: Xóa luôn trạng thái đã chấp nhận khi đăng xuất ---
    localStorage.removeItem("acceptedNotifications");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-red-600 text-white text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-1 sm:flex">
            <FaEnvelope />
            <span>info@bloodcare.com</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <a href="#" aria-label="Facebook" className="hover:text-gray-200">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-200">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-200">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-red-600 font-semibold text-xl"
          >
            <img
              src="https://i.pinimg.com/736x/3c/20/a1/3c20a16bccae26d05a27243f9259b86e.jpg"
              alt="logo"
              className="w-12 h-12 mr-3 rounded-full border border-red-600"
            />
            <span>Hiến Máu</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-red-600 focus:outline-none text-2xl"
          >
            ☰
          </button>

          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } lg:flex lg:items-center lg:gap-6 font-medium mt-4 lg:mt-0 w-full lg:w-auto`}
          >
            {/* Navigation Links */}
            <Link to="/" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Trang chủ</Link>
            <Link to="/about" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Giới thiệu</Link>
            <Link to="/register-donation" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Đăng ký hiến máu</Link>
            <Link to="/Thong_tin_nhom_mau" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Thông tin nhóm máu</Link>
            <Link to="/Yeu_cau_mau_khan_cap" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Yêu cầu máu khẩn cấp</Link>
            <Link to="/blog" className="block py-2 lg:py-0 text-gray-800 hover:text-red-600">Tin tức</Link>

            {/* User Section */}
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {user ? (
                <>
                  {/* === Bell notification === */}
                  <div className="relative group">
                    <button className="relative text-gray-600 hover:text-red-600 focus:outline-none py-2">
                      <FaBell size={24} />
                      {hasUnread && (
                        <span className="absolute top-1.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                      )}
                    </button>
                    <div className="absolute right-0 top-full w-80 bg-white rounded-md shadow-xl z-20 hidden group-hover:block ring-1 ring-black ring-opacity-5">
                      <div className="p-2 font-semibold border-b">Thông báo</div>
                      <div className="py-1 max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.notificationId}
                              className={`p-3 border-b border-gray-100 ${
                                !notif.read ? "bg-red-50" : ""
                              }`}
                            >
                              <p
                                className={`text-sm font-bold ${
                                  !notif.read
                                    ? "text-red-700"
                                    : "text-gray-800"
                                }`}
                              >
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 text-right mt-1">
                                {new Date(
                                  notif.createdAt
                                ).toLocaleString("vi-VN")}
                              </p>

                              {/* Logic nút bấm không thay đổi, nó sẽ hoạt động đúng với state đã được khôi phục */}
                              {notif.type === "DONATION_REQUEST" && (
                                <div className="mt-2 text-right">
                                  {acceptedNotifications.includes(
                                    notif.notificationId
                                  ) ? (
                                    <button
                                      disabled
                                      className="bg-gray-400 text-white text-xs font-bold py-1 px-3 rounded cursor-not-allowed"
                                    >
                                      Đã đồng ý
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAcceptNotification(
                                          notif.notificationId
                                        );
                                      }}
                                      className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                      Đồng ý hiến máu
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="p-4 text-sm text-center text-gray-500">
                            Không có thông báo nào.
                          </p>
                        )}
                      </div>
                      <div className="p-2 border-t text-center">
                        <Link
                          to="/notifications"
                          className="text-sm text-red-600 hover:underline"
                        >
                          Xem tất cả
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* === Avatar dropdown === */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none py-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="avatar"
                        className="w-8 h-8 rounded-full border-2 border-red-200"
                      />
                      <span className="text-gray-800 font-semibold hidden md:block">
                        {user.full_name || user.username}
                      </span>
                    </button>
                    <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                        >
                          Tài Khoản Của Tôi
                        </Link>

                        {user.role === "MEMBER" &&
                          <Link
                            to="/member/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                          >
                            Quản Lý Chung
                          </Link>
                        }

                        {user.role === "STAFF" && (
                          <Link
                            to="/staff/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                          >
                            Quản Lý Chung
                          </Link>
                        )}
                        {user.role === "ADMIN" && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                          >
                            Quản Lý Chung
                          </Link>
                        )}

                        {user.role === "TREATMENT_CENTER" && (
                          <Link
                            to="/center/createrequest"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                          >
                            Yêu cầu máu
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                        >
                          Đăng Xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 lg:py-0 text-red-600 font-bold hover:underline"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}