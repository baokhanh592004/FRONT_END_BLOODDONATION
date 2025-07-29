import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  HiUser,
  HiOutlineUserCircle,
  HiMail,
  HiPhone,
  HiHome,
} from "react-icons/hi";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
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
          fullName: data.fullName || "",
          gender: data.gender || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const confirm = window.confirm("Bạn có chắc muốn lưu thay đổi?");
    if (!confirm) return;

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
    <div className="bg-[#fff5f5] flex justify-center px-4 py-10 min-h-screen">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-6">
          Cập nhật Hồ Sơ Cá Nhân
        </h2>

        <div className="space-y-4">
          <Field
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            icon={<HiUser />}
          />
          <Field
            label="Giới tính"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            icon={<HiOutlineUserCircle />}
            type="select"
          />
          <Field
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<HiMail />}
          />
          <Field
            label="Số điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            icon={<HiPhone />}
          />
          <Field
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={<HiHome />}
            type="textarea"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg mt-6"
        >
          Lưu thay đổi
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="w-full text-red-600 border border-red-500 hover:bg-red-100 font-medium py-2 rounded-lg mt-3"
        >
          Quay lại trang hồ sơ
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, icon, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
      <span className="text-red-500 mr-2">{icon}</span>
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 rounded-lg py-2 px-3 focus:outline-none border border-gray-200"
      >
        <option value="">-- Giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
    ) : type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={2}
        className="bg-gray-100 rounded-lg py-2 px-3 resize-none focus:outline-none border border-gray-200"
        placeholder={label}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 rounded-lg py-2 px-3 focus:outline-none border border-gray-200"
        placeholder={label}
      />
    )}
  </div>
);

export default UpdateProfile;
