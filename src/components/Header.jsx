import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Thanh thông tin liên hệ */}
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

      {/* Navbar chính */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo và brand */}
          <Link to="/" className="flex items-center text-red-600 font-semibold text-xl">
            <img
              src="https://i.pinimg.com/736x/3c/20/a1/3c20a16bccae26d05a27243f9259b86e.jpg"
              alt="logo"
              className="w-12 h-12 mr-3 rounded-full border border-red-600"
            />
            <span>Hiến Máu</span>
          </Link>

          {/* Toggle mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-red-600 focus:outline-none"
          >
            ☰
          </button>

          {/* Nav links */}
          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } lg:flex lg:items-center lg:space-x-6 font-medium mt-4 lg:mt-0`}
          >
            <Link to="/" className="block text-gray-800 hover:text-red-600">
              Trang chủ
            </Link>
            <Link to="/pages" className="block text-gray-800 hover:text-red-600">
              Giới thiệu
            </Link>
            <Link to="/Đăng_ký_hiến_máu" className="block text-gray-800 hover:text-red-600">
              Đăng ký hiến máu
            </Link>
            <Link to="/Thông_tin_nhóm_máu" className="block text-gray-800 hover:text-red-600">
              Thông tin nhóm máu 
            </Link>
            <Link to="/Yêu_cầu_máu_khẩn_cấp" className="block text-gray-800 hover:text-red-600">
              Yêu cầu máu khẩn cấp
            </Link>
            <Link to="/blog" className="block text-gray-800 hover:text-red-600">
              Tin tức
            </Link>
            <Link to="/login" className="block text-red-600 font-bold hover:underline">
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
