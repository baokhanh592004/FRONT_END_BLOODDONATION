// src/pages/staff/DonationManagementPage.js

import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';

// Import thư viện DatePicker và CSS của nó
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import component Modal. Sửa lại đường dẫn nếu bạn đặt file ở chỗ khác.
import ScreeningModal from '../../components/ScreeningModal';

// --- CÁC HÀM TIỆN ÍCH (Không thay đổi) ---
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateForApi = (dateObject) => {
  if (!dateObject) return '';
  const offset = dateObject.getTimezoneOffset();
  const adjustedDate = new Date(dateObject.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
};

// --- COMPONENT TÙY CHỈNH CHO Ô CHỌN NGÀY (Không thay đổi) ---
const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    className="w-full sm:w-auto bg-white text-left text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center"
    onClick={onClick}
    ref={ref}
  >
    {value || <span className="text-gray-400">Chọn một ngày</span>}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  </button>
));


// --- COMPONENT CHÍNH ---
export default function DonationManagementPage() {
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State để quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy TẤT CẢ các cuộc hẹn khi component được tải
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Bạn chưa đăng nhập hoặc token không hợp lệ.");

      const response = await axios.get('http://localhost:8080/api/staff/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const grouped = response.data.reduce((acc, appointment) => {
        const date = appointment.scheduledDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(appointment);
        return acc;
      }, {});
      setGroupedAppointments(grouped);

    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error("API Error (fetchAll):", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  // Tìm kiếm cuộc hẹn theo ngày đã chọn
  const handleSearchByDate = async () => {
    if (!selectedDate) {
      alert("Vui lòng chọn một ngày để tìm kiếm.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Bạn chưa đăng nhập hoặc token không hợp lệ.");

      const dateForApi = formatDateForApi(selectedDate);

      const response = await axios.get('http://localhost:8080/api/staff/appointments/by-date', {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: dateForApi }
      });

      const newGroupedData = {};
      if (response.data && response.data.length > 0) {
        newGroupedData[dateForApi] = response.data;
      }
      setGroupedAppointments(newGroupedData);

    } catch (err) {
      setError("Không tìm thấy dữ liệu cho ngày đã chọn hoặc có lỗi xảy ra.");
      setGroupedAppointments({});
      console.error("API Error (searchByDate):", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset lại bộ lọc và hiển thị tất cả cuộc hẹn
  const handleReset = () => {
    setSelectedDate(null);
    fetchAllAppointments();
  };

  // Các hàm để điều khiển modal
  const handleOpenScreeningModal = (appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseScreeningModal = () => {
    setIsModalOpen(false);
    setCurrentAppointment(null);
  };

  // Hàm gọi API sàng lọc
  const handleScreeningSubmit = async ({ passed, remarks }) => {
    if (!currentAppointment) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token không hợp lệ.");

      await axios.post(
        `http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`,
        { passed, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Cập nhật kết quả sàng lọc thành công!');
      handleCloseScreeningModal();
      fetchAllAppointments();

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Có lỗi xảy ra, không thể cập nhật.";
      alert(`Lỗi: ${errorMessage}`);
      console.error("Screening API Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(b) - new Date(a));

  const statusStyles = {
    PENDING: 'text-yellow-600 bg-yellow-100',
    CONFIRMED: 'text-blue-600 bg-blue-100',
    CANCELLED: 'text-gray-600 bg-gray-100',
    REJECTED: 'text-red-600 bg-red-100',
    APPROVED: 'text-green-600 bg-green-100',
    COMPLETED: 'text-indigo-600 bg-indigo-100',
  };

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Quản lý lịch hẹn hiến máu</h2>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-52">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<DatePickerCustomInput />}
              wrapperClassName="w-full"
            />
          </div>
          <button
            onClick={handleSearchByDate}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Tìm kiếm
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Vùng hiển thị kết quả */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Đang tải...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : sortedDates.length > 0 ? (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-red-700 bg-red-100 px-4 py-2 rounded-t-lg">
                  Ngày {formatDateForDisplay(date)}
                </h3>
                <ul className="bg-white rounded-b-lg shadow-md divide-y divide-gray-200">
                  {groupedAppointments[date].map(app => (
                    <li key={app.appointmentId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex-grow">
                        <p className="text-lg font-semibold text-gray-800">{app.user?.fullName || 'Không rõ tên'}</p>
                        <p className={`inline-block mt-1 px-2 py-0.5 text-sm font-medium rounded-full ${statusStyles[app.status] || 'text-gray-600 bg-gray-100'}`}>
                          {app.status}
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenScreeningModal(app)}
                        className="ml-4 flex-shrink-0 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        
                        // <<< THAY ĐỔI DUY NHẤT NẰM Ở ĐÂY: Sửa điều kiện 'disabled' >>>
                        // Nút sẽ chỉ bị vô hiệu hóa nếu cuộc hẹn đã bị hủy hoặc đã hoàn thành.
                        // Cho phép sàng lọc lại các trạng thái PENDING, CONFIRMED, APPROVED, REJECTED.
                        disabled={app.status === 'CANCELLED' || app.status === 'COMPLETED'}
                      >
                        Sàng lọc
                      </button>

                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Không có lịch hẹn nào.</p>
          </div>
        )}
      </div>

      {/* Render Modal nếu isModalOpen là true */}
      {isModalOpen && (
        <ScreeningModal
          appointment={currentAppointment}
          onClose={handleCloseScreeningModal}
          onSubmit={handleScreeningSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}