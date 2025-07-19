import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // ✅ Sử dụng axiosClient

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Bạn chưa đăng nhập.");
      navigate("/login");
      return;
    }

    axiosClient
      .get("user/profile")
      .then((res) => {
        const data = res.data;
        setFormData({
          fullName:    data.fullName    || "",
          gender:      data.gender      || "",
          email:       data.email       || "",
          phoneNumber: data.phoneNumber || "",
          address:     data.address     || ""
        });
        setMessage("");
      })
      .catch((err) => {
        console.error("Lỗi khi tải profile:", err);
        if (err.response?.status === 403) {
          setMessage("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setMessage("Không thể tải hồ sơ.");
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Token không tồn tại. Vui lòng đăng nhập lại.");
      navigate("/login");
      return;
    }

    try {
      await axiosClient.patch("user/profile", formData);
      setMessage("✅ Cập nhật thành công!");
      setTimeout(() => navigate("/profile", { state: { updated: true } }), 800);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      if (err.response?.status === 403) {
        setMessage("Không có quyền cập nhật. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        setMessage("Cập nhật thất bại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Cập nhật hồ sơ</h2>

        <div className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-lg py-2 px-3"
            placeholder="Họ và tên"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-lg py-2 px-3"
          >
            <option value="">-- Giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-lg py-2 px-3"
            placeholder="Email"
          />
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-gray-100 rounded-lg py-2 px-3"
            placeholder="Số điện thoại"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full bg-gray-100 rounded-lg py-2 px-3 resize-none"
            placeholder="Địa chỉ"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg mt-4"
        >
          Lưu thay đổi
        </button>

        {message && <p className="text-center text-sm mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateProfile;
