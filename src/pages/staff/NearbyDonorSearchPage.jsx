import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../api/axiosClient";

const NearbyDonorSearchPage = () => {
  const [radiusKm, setRadiusKm] = useState(5);
  const [bloodType, setBloodType] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fixedLatitude = 10.8411;
  const fixedLongitude = 106.8106;

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để sử dụng chức năng này.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const params = {
        latitude: fixedLatitude,
        longitude: fixedLongitude,
        radiusKm,
      };
      if (bloodType) params.bloodType = bloodType;

      const response = await axiosClient.get("/blood-search/nearby-donors", { params });

      setDonors(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Không thể tìm kiếm người hiến máu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để sử dụng chức năng này.');
      return;
    }

    const eligibleDonors = donors.filter(donor => donor.eligible);
    if (eligibleDonors.length === 0) {
      alert('Không có người hiến máu đủ điều kiện để gửi email.');
      return;
    }

    try {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axiosClient.post("/blood-search/send-email", {
        userIds: eligibleDonors.map(donor => donor.userId),
      });

      alert('✅ Đã gửi email thành công đến tất cả người hiến máu đủ điều kiện!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ Gửi email thất bại.');
    }
  };

  const sliderColor = `linear-gradient(to right, #4ade80 0%, #22c55e ${radiusKm * 2}%, #e5e7eb ${radiusKm * 2}%, #e5e7eb 100%)`;

  const eligibleDonors = donors.filter(d => d.eligible);
  const ineligibleDonors = donors.filter(d => !d.eligible);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-xl shadow-xl w-full">
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center tracking-wide">
        🧭 Tìm kiếm người hiến máu gần FPT TP.HCM
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 Bán kính tìm kiếm: <span className="font-bold text-blue-700">{radiusKm} km</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderColor }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">🩸 Nhóm máu</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn nhóm máu --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 hover:scale-105 transition-transform duration-300 shadow-md"
        >
          🔍 Tìm kiếm
        </button>
      </div>

      {loading && <p className="mt-6 text-center text-blue-600">⏳ Đang tìm kiếm...</p>}

      {error && (
        <div className="text-red-600 mt-6 text-center">
          <p>{error}</p>
          {!localStorage.getItem('token') && (
            <Link to="/login" className="underline text-blue-600">Đăng nhập</Link>
          )}
        </div>
      )}

      {donors.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-green-700 mb-2">🟢 Người hiến máu đủ điều kiện ({eligibleDonors.length})</h2>
          <DonorTable donors={eligibleDonors} />

          <h2 className="text-xl font-bold text-yellow-600 mt-8 mb-2">🕒 Chưa đủ thời gian hồi phục ({ineligibleDonors.length})</h2>
          <DonorTable donors={ineligibleDonors} />

          <div className="mt-6 text-center">
            <button
              onClick={handleSendEmails}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              ✉️ Gửi Email cho người hiến máu đủ điều kiện
            </button>
          </div>
        </div>
      )}

      {donors.length === 0 && !loading && (
        <p className="mt-6 text-center text-gray-600">😢 Không tìm thấy người hiến máu nào phù hợp.</p>
      )}
    </div>
  );
};

const DonorTable = ({ donors }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-lg">
      <thead className="bg-blue-100 text-blue-800">
        <tr>
          <th className="p-3 border">#</th>
          <th className="p-3 border">Họ tên</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Địa chỉ</th>
          <th className="p-3 border">Nhóm máu</th>
        </tr>
      </thead>
      <tbody>
        {donors.map((donor, index) => (
          <tr key={donor.userId} className="text-center hover:bg-blue-50 transition">
            <td className="p-3 border font-semibold">{index + 1}</td>
            <td className="p-3 border">{donor.fullName}</td>
            <td className="p-3 border">{donor.email}</td>
            <td className="p-3 border">{donor.address}</td>
            <td className="p-3 border font-semibold text-red-600">{donor.bloodType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NearbyDonorSearchPage;
