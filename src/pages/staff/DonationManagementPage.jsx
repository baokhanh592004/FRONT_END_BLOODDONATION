import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import tất cả các modal cần thiết
import ScreeningModal from '../../components/ScreeningModal';
import DonationHistoryModal from '../../components/DonationHistoryModal';
import RecordDonationModal from '../../components/RecordDonationModal';

// --- TIỆN ÍCH & COMPONENT PHỤ ---
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

const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="w-full sm:w-auto bg-white text-left text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center" onClick={onClick} ref={ref}>
        {value || <span className="text-gray-400">Chọn một ngày</span>}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
    </button>
));

// --- COMPONENT CHÍNH ---
export default function DonationManagementPage() {
    // States chính
    const [groupedAppointments, setGroupedAppointments] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [bloodTypes, setBloodTypes] = useState([]);

    // States để điều khiển các loại modal khác nhau
    const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isRecordDonationModalOpen, setIsRecordDonationModalOpen] = useState(false);
    const [donationHistory, setDonationHistory] = useState([]);

    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchAllAppointments(), fetchBloodTypes()]);
            } catch (err) {
                 setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        initialFetch();
    }, []);

    // --- HÀM GỌI API ---
    const fetchBloodTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token không hợp lệ.");
            const response = await axios.get('http://localhost:8080/api/blood-types', {
                 headers: { Authorization: `Bearer ${token}` }
            });
            setBloodTypes(response.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhóm máu:", err);
        }
    };

    const fetchAllAppointments = async () => {
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
            setError("Không thể tải dữ liệu cuộc hẹn. Vui lòng thử lại.");
        }
    };

    const handleSearchByDate = async () => {
        if (!selectedDate) return alert("Vui lòng chọn một ngày để tìm kiếm.");
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
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
        } finally {
            setLoading(false);
        }
    };
    
    const handleScreeningSubmit = async (formData) => {
        if (!currentAppointment) return;
        setIsSubmitting(true);
        const { passed, remarks, weight, bloodTypeId, healthStatus } = formData;
        const token = localStorage.getItem('token');
        try {
            // Bước 1: Cập nhật User Profile
            const userProfilePayload = {
                userId: currentAppointment.user.userId,
                weight: parseFloat(weight),
                bloodTypeId: parseInt(bloodTypeId),
                healthStatus: healthStatus,
                lastScreeningDate: new Date().toISOString().split('T')[0],
            };
            await axios.post(`http://localhost:8080/api/staff/user-profile`, userProfilePayload, { headers: { Authorization: `Bearer ${token}` } });

            // Bước 2: Cập nhật trạng thái sàng lọc của cuộc hẹn
            const screeningPayload = { passed, remarks };
            await axios.post(`http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`, screeningPayload, { headers: { Authorization: `Bearer ${token}` } });

            alert('Cập nhật hồ sơ và kết quả sàng lọc thành công!');
            handleCloseAllModals();
            fetchAllAppointments();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi cập nhật.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // *** ĐÃ KHÔI PHỤC LẠI HÀM GỐC ***
    const handleRecordDonationSubmit = async (formData) => {
        if (!currentAppointment) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            // Gọi đúng API ban đầu
            await axios.post('http://localhost:8080/api/staff/donation-history/record', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Ghi nhận ca hiến máu thành công!');
            handleCloseAllModals();
            fetchAllAppointments();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi ghi nhận hiến máu.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HÀM XỬ LÝ MODAL ---
    const handleOpenModal = (modalType, appointment) => {
        setCurrentAppointment(appointment);
        if (modalType === 'screening') setIsScreeningModalOpen(true);
        if (modalType === 'recordDonation') setIsRecordDonationModalOpen(true);
        if (modalType === 'history') {
            const fetchHistory = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8080/api/staff/donation-history/user/${appointment.user.userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDonationHistory(response.data);
                    setIsHistoryModalOpen(true);
                } catch (err) {
                    alert("Không thể tải lịch sử hiến máu.");
                }
            };
            fetchHistory();
        }
    };
    
    const handleCloseAllModals = () => {
        setIsScreeningModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsRecordDonationModalOpen(false);
        setCurrentAppointment(null);
    };

    const handleReset = () => {
        setSelectedDate(null);
        setLoading(true);
        fetchAllAppointments().finally(() => setLoading(false));
    };

    const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(b) - new Date(a));
    const statusStyles = {
        PENDING: 'text-yellow-600 bg-yellow-100',
        APPROVED: 'text-green-600 bg-green-100',
        COMPLETED: 'text-indigo-600 bg-indigo-100',
        REJECTED: 'text-red-600 bg-red-100',
        CANCELLED: 'text-gray-600 bg-gray-100',
    };

    return (
        <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quản lý lịch hẹn hiến máu</h2>
                
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-52">
                        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="dd/MM/yyyy" customInput={<DatePickerCustomInput />} />
                    </div>
                    <button onClick={handleSearchByDate} className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700">Tìm kiếm</button>
                    <button onClick={handleReset} className="w-full sm:w-auto px-5 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700">Reset</button>
                </div>

                {loading ? ( <p className="text-center text-gray-500 py-10">Đang tải...</p> ) 
                : error ? ( <p className="text-center text-red-500 py-10">{error}</p> ) 
                : sortedDates.length > 0 ? (
                    <div className="space-y-8">
                        {sortedDates.map(date => (
                            <div key={date}>
                                <h3 className="text-lg font-semibold text-red-700 bg-red-100 px-4 py-2 rounded-t-lg">Ngày {formatDateForDisplay(date)}</h3>
                                <ul className="bg-white rounded-b-lg shadow-md divide-y divide-gray-200">
                                    {groupedAppointments[date].map(app => (
                                        <li key={app.appointmentId} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex-grow">
                                                <p className="text-lg font-semibold text-gray-800">{app.user?.fullName || 'Không rõ tên'}</p>
                                                <p className={`inline-block mt-1 px-2 py-0.5 text-sm font-medium rounded-full ${statusStyles[app.status] || 'text-gray-600 bg-gray-100'}`}>{app.status}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex flex-wrap gap-2 self-end sm:self-center">
                                                <button onClick={() => handleOpenModal('history', app)} className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600">Lịch sử</button>
                                                
                                                {app.status === 'PENDING' && (
                                                    <button onClick={() => handleOpenModal('screening', app)} className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600">Sàng lọc</button>
                                                )}

                                                {app.status === 'APPROVED' && (
                                                    <button onClick={() => handleOpenModal('recordDonation', app)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">Ghi nhận hiến máu</button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : ( <div className="text-center py-16 bg-white rounded-lg shadow-sm"><p className="text-gray-500">Không có lịch hẹn nào.</p></div> )}
            </div>

            {isScreeningModalOpen && <ScreeningModal appointment={currentAppointment} onClose={handleCloseAllModals} onSubmit={handleScreeningSubmit} isSubmitting={isSubmitting} bloodTypes={bloodTypes} />}
            {isHistoryModalOpen && <DonationHistoryModal isOpen={isHistoryModalOpen} onClose={handleCloseAllModals} donationHistory={donationHistory} />}
            {isRecordDonationModalOpen && <RecordDonationModal appointment={currentAppointment} onClose={handleCloseAllModals} onSubmit={handleRecordDonationSubmit} isSubmitting={isSubmitting} />}
        </div>
    );
}