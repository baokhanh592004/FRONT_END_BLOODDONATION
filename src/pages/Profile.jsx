
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiUser,
  HiCalendar,
  HiOutlineUserCircle,
  HiPhone,
  HiMail,
  HiHome,
} from "react-icons/hi";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    weight: "",
    bloodType: "",
    healthStatus: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy hồ sơ:", error);
      }
    };

    fetchProfile();
  }, []);

  // Cập nhật dữ liệu khi thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gửi dữ liệu lên backend hoặc bật chế độ chỉnh sửa
  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        await axios.put("/api/user/profile", profile);
        console.log("Cập nhật thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Hồ Sơ Cá Nhân</h2>

        <div className="flex justify-center mb-6">
          <img
            src="https://i.pravatar.cc/150?u=NguyenVanA"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-red-500 object-cover"
          />
        </div>

        <form className="space-y-4">
          {/* Họ và tên */}
          <div className="flex items-center">
            <HiUser className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={profile.fullName}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="flex items-center">
            <HiCalendar className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>

          {/* Giới tính */}
          <div className="flex items-center">
            <HiOutlineUserCircle className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center">
            <HiPhone className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <HiMail className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start">
            <HiHome className="text-red-500 text-xl flex-shrink-0 mr-3 mt-2" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={3}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>
          </div>

          {/* Nút chỉnh sửa / lưu */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleToggleEdit}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {isEditing ? "Lưu thông tin" : "Chỉnh sửa thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
