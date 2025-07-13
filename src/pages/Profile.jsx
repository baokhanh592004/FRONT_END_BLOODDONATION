import React, { useEffect, useState } from "react";
import { HiUser, HiOutlineUserCircle, HiPhone, HiMail, HiHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser?.userId || !token) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8080/api/user/${storedUser.userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Không thể tải thông tin hồ sơ.");
      });
  }, []);

  const goToUpdate = () => {
    navigate("/update-profile");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Hồ Sơ Cá Nhân</h2>
        <div className="space-y-4">
          <Field icon={<HiUser />} label={formData.fullName} />
          <Field icon={<HiOutlineUserCircle />} label={formData.gender} />
          <Field icon={<HiMail />} label={formData.email} />
          <Field icon={<HiPhone />} label={formData.phoneNumber} />
          <Field icon={<HiHome />} label={formData.address} multiline />
        </div>

        <button
          onClick={goToUpdate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg mt-6"
        >
          Chỉnh sửa thông tin
        </button>

        {message && <p className="text-center text-sm mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

const Field = ({ icon, label, multiline }) => (
  <div className="flex items-start">
    <div className="text-red-500 text-xl mr-3 mt-1">{icon}</div>
    {multiline ? (
      <textarea
        readOnly
        value={label}
        className="w-full bg-gray-100 rounded-lg py-2 px-3 resize-none"
      />
    ) : (
      <input
        readOnly
        value={label}
        className="w-full bg-gray-100 rounded-lg py-2 px-3"
      />
    )}
  </div>
);

export default Profile;