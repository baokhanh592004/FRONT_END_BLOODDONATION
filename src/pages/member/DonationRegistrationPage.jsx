import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axiosClient from '../../api/axiosClient';
import { FaUser, FaVenusMars, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { GiHeartPlus } from 'react-icons/gi';

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ✅ CHỈNH SỬA: Thêm prop `maxDate`
const StyledCalendar = ({ onChange, value, maxDate }) => {
  return (
    <Calendar
      onChange={onChange}
      value={value}
      minDate={new Date()}
      // ✅ SỬ DỤNG: Áp dụng ngày tối đa vào lịch
      maxDate={maxDate} 
      className="border-0"
      tileClassName={({ date, view }) => {
        const base = 'h-12 w-12 flex items-center justify-center rounded-full transition-colors duration-200';
        if (view === 'month') {
          if (value && date.toDateString() === value.toDateString()) {
            return `${base} bg-red-600 text-white font-bold`;
          }
          if (date.toDateString() === new Date().toDateString()) {
            return `${base} bg-red-100 text-red-700 font-bold`;
          }
          return `${base} hover:bg-red-50`;
        }
        return base;
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

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center text-sm py-2 border-b border-gray-100">
    <div className="flex-shrink-0 w-8 text-center text-red-500">{icon}</div>
    <span className="text-gray-600 w-28">{label}:</span>
    <span className="font-medium text-gray-900 break-words">{value || 'Chưa cập nhật'}</span>
  </div>
);

const UserInfoDisplay = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
        Đang tải thông tin...
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="space-y-3">
        <InfoRow icon={<FaUser size={16} />} label="Họ và tên" value={user.fullName} />
        <InfoRow icon={<FaVenusMars size={16} />} label="Giới tính" value={user.gender} />
        <InfoRow icon={<FaEnvelope size={16} />} label="Email" value={user.email} />
        <InfoRow icon={<FaPhone size={16} />} label="Số điện thoại" value={user.phoneNumber} />
        <InfoRow icon={<FaMapMarkerAlt size={16} />} label="Địa chỉ" value={user.address} />
      </div>
      <div className="mt-6 text-center text-xs text-gray-500 italic">
        <p>Vui lòng kiểm tra kỹ thông tin. Bạn có thể cập nhật trong trang cá nhân.</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ step, title }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500 text-white font-bold text-xl">
      {step}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  </div>
);

export default function DonationRegistrationPage() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [donationCenters, setDonationCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ✅ THÊM MỚI: Tính toán ngày tối đa có thể đăng ký
  const maxDonationDate = new Date();
  maxDonationDate.setDate(maxDonationDate.getDate() + 7);

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
        const userResponse = await axiosClient.get(`user/${storedUser.userId}/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...storedUser, ...userResponse.data });

        const centersResponse = await axiosClient.get('user/donation-center/names', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonationCenters(centersResponse.data);

        if (centersResponse.data.length > 0) {
          setSelectedCenter(centersResponse.data[0].center_id);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
        console.error('Fetch data error:', err);
      }
    };
    fetchInitialData();
  }, [navigate]);

  const handleDateChange = (date) => {
    // ✅ THÊM MỚI: Kiểm tra lại nếu người dùng có thể chọn ngày vượt quá giới hạn (dù đã disable)
    if (date > maxDonationDate) {
      setSelectedDate(null); // Reset nếu chọn ngày không hợp lệ
      setError('Bạn chỉ có thể đăng ký lịch hẹn trong vòng 7 ngày tới.');
    } else {
      setSelectedDate(date);
      setError('');
    }
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
      centerId: parseInt(selectedCenter, 10),
      scheduledDate: formatDateToYYYYMMDD(selectedDate),
    };

    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    navigate('/member/donation-questionnaire', { state: registrationData });
  };

  return (
    <div className="bg-red-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <GiHeartPlus className="text-red-500 mx-auto text-5xl mb-2" />
          <h2 className="text-4xl font-extrabold text-gray-800">Đăng ký Lịch hẹn Hiến máu</h2>
          <p className="text-lg text-gray-600 mt-2">"Mỗi giọt máu cho đi, một cuộc đời ở lại"</p>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-6 font-medium">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col">
            <SectionHeader step="1" title="Kiểm tra thông tin" />
            <UserInfoDisplay user={user} />
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
            <SectionHeader step="2" title="Chọn lịch hẹn" />
            <div className="mb-6">
              <label htmlFor="donation-center" className="flex items-center gap-2 block text-md font-semibold mb-2 text-gray-700">
                <FaMapMarkerAlt className="text-red-500" />
                Địa điểm hiến máu
              </label>
              <select
                id="donation-center"
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {donationCenters.length === 0 ? (
                  <option value="" disabled>Đang tải danh sách...</option>
                ) : (
                  donationCenters.map((center) => (
                    <option key={center.center_id} value={center.center_id}>
                      {`${center.name} - ${center.address}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex-grow">
              <label className="flex items-center gap-2 block text-md font-semibold mb-2 text-gray-700">
                <FaRegCalendarAlt className="text-red-500" />
                Ngày bạn có thể đến
              </label>
              {/* ✅ THÊM MỚI: Dòng chữ thông báo cho người dùng */}
              <p className="text-xs text-gray-500 mb-3 ml-1 italic">
                Lưu ý: Bạn chỉ có thể đăng ký lịch hẹn trong vòng 7 ngày tới.
              </p>
              <div className="flex justify-center">
                {/* ✅ CHỈNH SỬA: Truyền prop maxDate vào component lịch */}
                <StyledCalendar 
                  onChange={handleDateChange} 
                  value={selectedDate} 
                  maxDate={maxDonationDate}
                />
              </div>
            </div>

            {selectedDate && (
              <div className="text-center mt-6">
                <p className="text-gray-700 mb-3">
                  Bạn đã chọn: <span className="font-bold text-red-600">{selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
                <button
                  onClick={handleProceedToQuestionnaire}
                  disabled={!user || !selectedCenter}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                >
                  Tiếp tục <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}