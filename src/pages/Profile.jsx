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
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: ""
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!storedUser || !token) {
      setMessage("Bạn chưa đăng nhập.");
      return;
    }
    axios
      .get(`http://localhost:8080/api/user/${storedUser.userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => {
        console.error(err);
        setMessage("Không thể tải thông tin hồ sơ.");
      });
  }, []);

  const handleChange = e => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = async () => {
    // Nếu đang trong chế độ editing thì thực hiện lưu
    if (isEditing) {
      setMessage("");  // clear cũ
      try {
        const res = await axios.patch(
          `http://localhost:8080/api/user/${storedUser.userId}/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        // Nếu server trả về object mới, update lại state
        if (res.data) setFormData(res.data);

        setMessage("✅ Cập nhật hồ sơ thành công!");
      } catch (err) {
        console.error(err);
        setMessage("❌ Cập nhật thất bại.");
        // Giữ isEditing = true, để user có thể thử lại
        return;
      }
    }
    // Chuyển chế độ (nếu lưu thành công hoặc vừa bấm Edit)
    setIsEditing(edit => !edit);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Hồ Sơ Cá Nhân</h2>
        <form className="space-y-4">
          {/* Họ và tên */}
          <div className="flex items-center">
            <HiUser className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <input
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full bg-gray-100 rounded-lg py-2 px-3"
            />
          </div>

          {/* Giới tính */}
          <div className="flex items-center">
            <HiOutlineUserCircle className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-gray-100 rounded-lg py-2 px-3"
            >
              <option value="">-- Giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <HiMail className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full bg-gray-100 rounded-lg py-2 px-3"
            />
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center">
            <HiPhone className="text-red-500 text-xl flex-shrink-0 mr-3" />
            <input
              name="phoneNumber"
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full bg-gray-100 rounded-lg py-2 px-3"
            />
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start">
            <HiHome className="text-red-500 text-xl flex-shrink-0 mr-3 mt-2" />
            <textarea
              name="address"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={handleChange}
              readOnly={!isEditing}
              rows={2}
              className="w-full bg-gray-100 rounded-lg py-2 px-3 resize-none"
            />
          </div>

          {/* Nút Chỉnh sửa / Lưu */}
          <button
            type="button"
            onClick={handleToggle}
            className={`w-full font-medium py-2 rounded-lg transition-colors ${
              isEditing
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isEditing ? "Lưu thông tin" : "Chỉnh sửa thông tin"}
          </button>
        </form>

        {message && <p className="text-center text-sm mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
