import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem lịch hẹn.');
      return;
    }

    try {
      const res = await axiosClient.get('user/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedAppointments = res.data
        .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
        .map((item, index) => {
          const fakeCreatedDate = new Date();
          fakeCreatedDate.setMinutes(fakeCreatedDate.getMinutes() - index);
          return { ...item, fakeCreatedDate };
        });

      setAppointments(sortedAppointments);
    } catch (err) {
      console.error('Lỗi khi lấy lịch hẹn:', err);
      setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(dateStr));
  };

  const formatStatusBackground = (status) => {
    switch (status) {
      case 'APPROVED':
        return { className: "bg-yellow-100 text-yellow-800", label: "ĐÃ DUYỆT" };
      case 'REJECTED':
        return { className: "bg-red-100 text-red-800", label: "BỊ TỪ CHỐI" };
      case 'COMPLETED':
        return { className: "bg-green-100 text-green-800", label: "HOÀN THÀNH" };
      default:
        return { className: "text-gray-800", label: "ĐANG CHỜ DUYỆT" };
    }
  };

  const filteredAppointments = appointments.filter(app =>
    filterStatus === 'ALL' || app.status === filterStatus
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Danh sách lịch hẹn hiến máu</h2>

        <div className="mb-6">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Lọc theo trạng thái
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Đang chờ</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-500">Không có lịch hẹn phù hợp.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentItems.map((appointment, index) => {
                const center = appointment.center || {};
                const { className, label } = formatStatusBackground(appointment.status);
                return (
                  <li key={index} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <p className="text-lg font-semibold text-blue-700">{center.name || 'Không có tên trung tâm'}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium text-gray-700">Ngày đăng ký:</span> {formatDate(appointment.fakeCreatedDate)}</p>
                      <p><span className="font-medium text-gray-700">Ngày hẹn:</span> {formatDate(appointment.scheduledDate)}</p>
                      <p><span className="font-medium text-gray-700">Trạng thái:</span>{' '}
                        <span className={`font-semibold ${className}`}>{label || 'Không rõ'}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistoryPage;
