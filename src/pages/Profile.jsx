
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiUser,
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const id = payload?.id;
    if (id){
      setUserId(id);
      fetchProfile(id);
    }    
  }, []);

  const fetchProfile = async (id) => {
      try {
        const res = await axios.get(`/api/user/${id}/profile`,
          {headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },}
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy hồ sơ:", err);
      }
    };

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
    if (isEditing && userId) {
      try {
        await axios.patch(`/api/user/${userId}/profile`, profile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Cập nhật thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">HỒ SƠ Cá Nhân</h2>

        <div className="flex justify-center mb-6">
          <img
            src="https://i.pravatar.cc/150?u=NguyenVanA"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-red-500 object-cover"
          />
        </div>

        <form className="space-y-4">
          <InputField
            icon={<HiUser />}
            label="Họ và tên"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            readOnly={!isEditing}
          />

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
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <InputField
            icon={<HiPhone />}
            label="Số điện thoại"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            readOnly={!isEditing}
          />

          <InputField
            icon={<HiMail />}
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
            type="email"
          />

          <div className="flex items-start">
            <HiHome className="text-red-500 text-xl flex-shrink-0 mr-3 mt-2" />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={2}
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>
          </div>

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

const InputField = ({ icon, label, name, value, onChange, readOnly, type = "text" }) => (
  <div className="flex items-center">
    <div className="text-red-500 text-xl flex-shrink-0 mr-3">{icon}</div>
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-300"
      />
    </div>
  </div>
);

export default Profile;
