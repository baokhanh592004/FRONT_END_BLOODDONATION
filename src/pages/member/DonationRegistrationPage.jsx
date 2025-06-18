// src/pages/member/DonationRegistrationPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import axios from 'axios';

// ====================================================================
// COMPONENT 1: StyledCalendar (No changes needed)
// ====================================================================
const StyledCalendar = ({ onChange, value }) => {
  return (
    <Calendar
      onChange={onChange}
      value={value}
      minDate={new Date()} // Ngăn người dùng chọn ngày trong quá khứ
      className="border-0"
      tileClassName={({ date, view }) => {
        const classes = 'h-12 w-12 flex items-center justify-center rounded-full transition-colors duration-200';
        if (view === 'month') {
          if (date.toDateString() === new Date().toDateString()) {
            return `${classes} bg-blue-100 text-blue-700 font-bold`;
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
// ====================================================================
// COMPONENT 2: UserInfoDisplay (No changes needed)
// ====================================================================
const UserInfoDisplay = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin cá nhân</h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
            <span>Họ và tên:</span> 
            <span className="font-medium text-gray-900">{user.fullName || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Giới tính:</span> 
            <span className="font-medium text-gray-900">{user.gender || 'Chưa cập nhật'}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 border-b pb-2">Thông tin liên hệ</h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
            <span>Email:</span> 
            <span className="font-medium text-gray-900">{user.email || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between items-center">
            <span>Số điện thoại:</span> 
            <span className="font-medium text-gray-900">{user.phoneNumber || 'Chưa cập nhật'}</span>
        </div>
        <div className="flex justify-between items-start">
            <span>Địa chỉ:</span> 
            <span className="font-medium text-gray-900 text-right w-3/4">{user.address || 'Chưa cập nhật'}</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// COMPONENT 3: Trang chính DonationRegistrationPage
// ====================================================================
export default function DonationRegistrationPage() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [donationCenters, setDonationCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      const storedUserJSON = localStorage.getItem('user');

      if (!token || !storedUserJSON) {
        console.error("Không tìm thấy token hoặc thông tin người dùng. Đang chuyển hướng...");
        navigate('/login', { replace: true });
        return;
      }

      // ========= START: Tải thông tin User (giữ nguyên) ==========
      try {
        const storedUser = JSON.parse(storedUserJSON);
        const userId = storedUser.userId; 

        if (!userId) {
          throw new Error("Không tìm thấy ID người dùng trong dữ liệu đã lưu.");
        }

        const userResponse = await axios.get(
          `http://localhost:8080/api/user/${userId}/info`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        const fullUserData = { ...storedUser, ...userResponse.data };
        setUser(fullUserData);

      } catch (err) {
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            navigate('/login', { replace: true });
        }
        return; // Dừng lại nếu không tải được user
      }
      // ========= END: Tải thông tin User ==========


      // ========= START: BỔ SUNG API TẢI DANH SÁCH TRUNG TÂM HIẾN MÁU =========
      try {
        // Sử dụng API endpoint từ Postman của bạn.
        // Thêm header Authorization vì đây là route cần xác thực.
        const centersResponse = await axios.get(
            'http://localhost:8080/api/user/donation-center/names', 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        // Lưu ý: Giả định API trả về một mảng các object, mỗi object có `centerId` và `name`.
        // Ví dụ: [{ "centerId": 1, "name": "Bach Mai Hospital" }, ...]
        setDonationCenters(centersResponse.data);

        // Tự động chọn trung tâm đầu tiên trong danh sách
        if (centersResponse.data && centersResponse.data.length > 0) {
          setSelectedCenter(centersResponse.data[0].centerId); 
        }
      } catch (err) {
        setError('Lỗi: Không thể tải danh sách trung tâm hiến máu.');
        console.error("Fetch centers error:", err);
      }
      // ========= END: BỔ SUNG API ==========
    };

    fetchInitialData();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedCenter) {
      setError('Vui lòng chọn một địa điểm hiến máu.');
      return;
    }
    if (!user) {
      setError('Thông tin người dùng chưa sẵn sàng. Vui lòng tải lại trang.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      
      // SỬA LẠI API ENDPOINT VÀ PAYLOAD CHO ĐÚNG VỚI YÊU CẦU
      // Dựa vào các tab trong Postman, API đăng ký có thể là /api/user/appointments/register
      const registrationData = {
        userId: user.userId,
        centerId: parseInt(selectedCenter, 10),
        scheduledDate: selectedDate.toISOString().split('T')[0], // Gửi định dạng YYYY-MM-DD
      };
      
      await axios.post(
        'http://localhost:8080/api/user/appointments/register', // API endpoint để đăng ký
        registrationData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert('Bạn đã đăng ký lịch hẹn thành công! Chúng tôi sẽ sớm liên hệ để xác nhận.');
      navigate('/member/my-appointments');

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.');
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Thông tin đăng ký hiến máu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex flex-col gap-8">
                <UserInfoDisplay user={user} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <div className="mb-6">
                <label htmlFor="donation-center" className="block text-lg font-semibold mb-2 text-gray-700">
                  Chọn địa điểm hiến máu
                </label>
                <select
                  id="donation-center"
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {donationCenters.length === 0 ? (
                    <option value="" disabled>Đang tải hoặc không có địa điểm...</option>
                  ) : (
                    // SỬA LẠI: Dùng `centerId` để nhất quán
                    donationCenters.map((center) => (
                      <option key={center.centerId} value={center.centerId}>
                        {center.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Chọn ngày bạn có thể đến</h3>
                <div className="flex justify-center">
                    <StyledCalendar onChange={setSelectedDate} value={selectedDate} />
                </div>
              </div>

              {error && <p className="text-red-500 text-center mt-4 font-medium">{error}</p>}
              <div className="text-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !user || !selectedCenter}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang gửi đăng ký...' : 'Xác nhận đăng ký'}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}