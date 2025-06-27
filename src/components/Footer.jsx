import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
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
{/* Cột bản đồ địa điểm */}
<div>
  <h6 className="uppercase font-semibold mb-2">Địa điểm bệnh viện</h6>
  <div className="w-full h-64 rounded overflow-hidden">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6100105376063!2d106.80730271125371!3d10.841127589267025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2sus!4v1751018614099!5m2!1svi!2sus"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
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
