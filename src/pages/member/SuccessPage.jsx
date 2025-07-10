import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border border-green-100">
        <CheckCircle className="mx-auto text-green-500" size={64} strokeWidth={1.5} />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Đăng ký thành công!</h1>
        <p className="text-gray-600 mt-2">
          Cảm ơn bạn đã đăng ký hiến máu. Chúng tôi sẽ gửi thông báo nhắc nhở trước ngày hẹn.
        </p>

        <button
          onClick={handleBackHome}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
