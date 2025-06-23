// src/pages/member/DonationRegistrationPage.js

// --- PHẦN 1: IMPORT CÁC THƯ VIỆN CẦN THIẾT ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';

// --- PHẦN 2: CÁC COMPONENT CON (UI Components) ---

// Component StyledCalendar (Không thay đổi)
const StyledCalendar = ({ onChange, value }) => {
  return (
    <Calendar
      onChange={onChange}
      value={value}
      minDate={new Date()}
      className="border-0"
      tileClassName={({ date, view }) => {
        const classes = 'h-12 w-12 flex items-center justify-center rounded-full transition-colors duration-200';
        if (view === 'month') {
          if (value && date.toDateString() === value.toDateString()) {
            return `${classes} bg-blue-500 text-white font-bold`;
          }
          if (date.toDateString() === new Date().toDateString()) {
            return `${classes} bg-blue-100 text-blue-700`;
          }
          return `${classes} hover:bg-red-100`;
        }
        return classes;
      }}
      navigationLabel={({ date }) => (
        <span className="font-semibold text-lg text-gray-800">
          Tháng {date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
        </span>
      )}
      prev2Label={null}
      next2Label={null}
      prevLabel={<span className="text-2xl p-2 rounded-full hover:bg-gray-100">‹</span>}
      nextLabel={<span className="text-2xl p-2 rounded-full hover:bg-gray-100">›</span>}
    />
  );
};

// Component InfoRow (Không thay đổi)
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || 'Chưa cập nhật'}</span>
  </div>
);

// Component UserInfoDisplay (Không thay đổi)
const UserInfoDisplay = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
        Đang tải thông tin...
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin cá nhân</h3>
      <div className="space-y-3">
        <InfoRow label="Họ và tên" value={user.fullName} />
        <InfoRow label="Giới tính" value={user.gender} />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 border-b pb-2">Thông tin liên hệ</h3>
      <div className="space-y-3">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Số điện thoại" value={user.phoneNumber} />
        <InfoRow label="Địa chỉ" value={user.address} />
      </div>
    </div>
  );
};

// --- PHẦN 3: COMPONENT CHÍNH CỦA TRANG ---
export default function DonationRegistrationPage() {
  // --- Các State (Không thay đổi) ---
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [donationCenters, setDonationCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // --- useEffect (Không thay đổi) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      const storedUserJSON = localStorage.getItem('user');

      if (!token || !storedUserJSON) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const storedUser = JSON.parse(storedUserJSON);
        const userResponse = await axios.get(`http://localhost:8080/api/user/${storedUser.userId}/info`, { headers: { 'Authorization': `Bearer ${token}` } });
        setUser({ ...storedUser, ...userResponse.data });

        const centersResponse = await axios.get('http://localhost:8080/api/user/donation-center/names', { headers: { 'Authorization': `Bearer ${token}` } });
        setDonationCenters(centersResponse.data);

        if (centersResponse.data?.length > 0) {
          setSelectedCenter(centersResponse.data[0].center_id);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
        console.error("Fetch data error:", err);
      }
    };
    fetchInitialData();
  }, [navigate]);

  // --- Các hàm xử lý sự kiện (Không thay đổi) ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateSelected(true);
    setError('');
  };

  const handleProceedToQuestionnaire = () => {
    if (!selectedCenter) {
      setError('Vui lòng chọn một địa điểm hiến máu.');
      return;
    }
    if (!selectedDate) {
      setError('Vui lòng chọn một ngày hiến máu.');
      return;
    }
    const registrationData = {
      userId: user.userId,
      center_id: parseInt(selectedCenter, 10),
      scheduledDate: selectedDate.toISOString().split('T')[0],
    };
    navigate('/member/donation-questionnaire', { state: registrationData });
  };

  // --- PHẦN 4: RENDER GIAO DIỆN (JSX) ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Đăng ký lịch hẹn hiến máu</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-6 font-medium">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <UserInfoDisplay user={user} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
            <div className="mb-6">
              <label htmlFor="donation-center" className="block text-lg font-semibold mb-2 text-gray-700">Chọn địa điểm hiến máu</label>
              <select
                id="donation-center"
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {donationCenters.length === 0 ? (
                  <option value="" disabled>Đang tải...</option>
                ) : (
                  // ======> ĐÂY LÀ DÒNG ĐÃ THAY ĐỔI <======
                  donationCenters.map((center) => (
                    <option key={center.center_id} value={center.center_id}>
                      {`${center.name} - ${center.address}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Chọn ngày bạn có thể đến</h3>
              <div className="flex justify-center">
                <StyledCalendar onChange={handleDateChange} value={selectedDate} />
              </div>
            </div>

            {isDateSelected && (
              <div className="text-center mt-6">
                <button
                  onClick={handleProceedToQuestionnaire}
                  disabled={!user || !selectedCenter}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}