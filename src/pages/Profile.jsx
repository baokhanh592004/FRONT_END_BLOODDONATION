import React, { useEffect, useState } from "react";
import {
  HiUser,
  HiOutlineUserCircle,
  HiPhone,
  HiMail,
  HiHome
} from "react-icons/hi";
import { FaTint } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    totalDonations: 0
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
          totalDonations: data.totalDonations || 0
        });
        setMessage("");
      })
      .catch((err) => {
        console.error("Lỗi khi tải hồ sơ:", err);
        setMessage("Không thể tải thông tin hồ sơ.");
      });
  }, [location.state, navigate]);

  const goToUpdate = () => {
    navigate("/profile/update");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1588776814546-ec7e1df6c318?auto=format&fit=crop&w=1400&q=80')"
      }}
    >
      {/* Overlay blur */}
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white border-t-[6px] border-[#e53935] rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <FaTint className="text-[#e53935] text-4xl mb-1 animate-pulse" />
          <h2 className="text-3xl font-bold text-[#e53935] text-center">
            Hồ Sơ Cá Nhân
          </h2>
          {formData.totalDonations > 0 && (
            <span className="mt-2 text-green-600 text-sm font-medium bg-green-100 px-3 py-1 rounded-full">
              ✅ Đã từng hiến máu
            </span>
          )}
        </div>

        <div className="space-y-5">
          <Field
            icon={<HiUser />}
            labelTitle="Họ và tên"
            labelValue={formData.fullName}
          />
          <Field
            icon={<HiOutlineUserCircle />}
            labelTitle="Giới tính"
            labelValue={formData.gender}
          />
          <Field
            icon={<HiMail />}
            labelTitle="Email"
            labelValue={formData.email}
          />
          <Field
            icon={<HiPhone />}
            labelTitle="Số điện thoại"
            labelValue={formData.phoneNumber}
          />
          <Field
            icon={<HiHome />}
            labelTitle="Địa chỉ"
            labelValue={formData.address}
            multiline
          />
        </div>

        <button
          onClick={goToUpdate}
          className="w-full bg-[#e53935] hover:bg-[#d32f2f] transition-all text-white font-semibold py-2.5 rounded-xl mt-8"
        >
          Chỉnh sửa thông tin
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};

const Field = ({ icon, labelTitle, labelValue, multiline }) => (
  <div className="space-y-1">
    <label className="flex items-center text-sm font-medium text-gray-700">
      <span className="text-[#e53935] text-base mr-2">{icon}</span>
      {labelTitle}
    </label>
    {multiline ? (
      <textarea
        readOnly
        value={labelValue}
        className="w-full bg-[#fff5f5] rounded-lg py-2 px-3 resize-none focus:outline-none border border-gray-200"
      />
    ) : (
      <input
        readOnly
        value={labelValue}
        className="w-full bg-[#fff5f5] rounded-lg py-2 px-3 focus:outline-none border border-gray-200"
      />
    )}
  </div>
);

export default Profile;
