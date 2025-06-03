import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Cột giới thiệu */}
          <div>
            <h4 className="text-red-500 font-bold text-lg mb-2">Hiến Máu</h4>
            <p className="text-sm leading-relaxed">
              Chung tay vì cộng đồng, mỗi giọt máu cho đi là một cuộc đời ở lại.
              Cảm ơn bạn đã đồng hành cùng chúng tôi!
            </p>
          </div>

          {/* Cột liên kết */}
          <div>
            <h6 className="uppercase font-semibold mb-3">Liên kết</h6>
            <ul className="space-y-2 text-sm">
              
              <li>
                <a href="/" className="hover:text-red-400 transition">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/gioi-thieu" className="hover:text-red-400 transition">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/chien-dich" className="hover:text-red-400 transition">
                  Chiến dịch
                </a>
              </li>
              <li>
                <a href="/lien-he" className="hover:text-red-400 transition">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột tin tức mới */}
          <div>
            <h6 className="uppercase font-semibold mb-3">Tin mới nhất</h6>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Hành trình đỏ 2025
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Hướng dẫn hiến máu an toàn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Gương mặt tình nguyện tiêu biểu
                </a>
              </li>
            </ul>
          </div>

          {/* Cột đăng ký nhận tin */}
          <div>
            <h6 className="uppercase font-semibold mb-3">Đăng ký nhận tin</h6>
            <form>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full px-3 py-2 text-gray-900 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <hr className="border-t border-gray-700 my-6" />
        <div className="text-center text-xs text-gray-400">
          &copy; 2025 Hệ thống Hiến Máu Việt Nam. Bản quyền đã được bảo hộ.
        </div>
      </div>
    </footer>
  );
}
