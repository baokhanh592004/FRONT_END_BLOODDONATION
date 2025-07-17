import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import ScreeningModal from '../../components/ScreeningModal';
import DonationHistoryModal from '../../components/DonationHistoryModal';
import RecordDonationModal from '../../components/RecordDonationModal';
import UserProfileModal from '../../components/UserProfileModal';
import CancellationModal from '../../components/CancellationModal';

// Các hàm tiện ích không đổi
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

// Component input tùy chỉnh cho DatePicker
const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="w-full sm:w-auto bg-white text-left text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center" onClick={onClick} ref={ref}>
        {value || <span className="text-gray-400">Chọn một ngày</span>}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
    </button>
));

// Component Phân trang
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-8 flex justify-center">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`py-2 px-3 leading-tight border border-gray-300 ${
                                currentPage === number
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-500 bg-white'
                            } hover:bg-gray-100 hover:text-gray-700`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tiếp
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default function DonationManagementPage() {
    // State
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [donationHistory, setDonationHistory] = useState([]);

    // State quản lý các modal
    const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isRecordDonationModalOpen, setIsRecordDonationModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // Hooks
    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            try {
                await fetchBloodTypes();
                await fetchAllAppointments();
            } catch (err) {
                 setError("Không thể tải dữ liệu ban đầu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        initialFetch();
    }, []);

    // Các hàm xử lý dữ liệu
    const fetchBloodTypes = async () => {
        if (bloodTypes.length > 0) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/blood-types', {
                 headers: { Authorization: `Bearer ${token}` }
            });
            setBloodTypes(response.data);
        } catch (err) {
            alert("Không thể tải danh sách nhóm máu.");
        }
    };

    const fetchAllAppointments = async () => {
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/staff/appointments', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const sortedData = response.data.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
        setAppointments(sortedData);
        setCurrentPage(1);
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
            setAppointments(response.data);
            setCurrentPage(1);
        } catch (err) {
            setError("Không tìm thấy dữ liệu cho ngày đã chọn hoặc có lỗi xảy ra.");
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        setSelectedDate(null);
        setLoading(true);
        try {
            await fetchAllAppointments();
        } catch(err) {
             setError("Không thể tải lại dữ liệu.");
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
            const userProfilePayload = {
                userId: currentAppointment.user.userId, weight, bloodTypeId, healthStatus,
                lastScreeningDate: new Date().toISOString().split('T')[0],
            };
            await axios.post(`http://localhost:8080/api/staff/user-profile`, userProfilePayload, { headers: { Authorization: `Bearer ${token}` } });
            
            const screeningPayload = { passed, remarks };
            await axios.post(`http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`, screeningPayload, { headers: { Authorization: `Bearer ${token}` } });
            
            alert('Cập nhật hồ sơ và kết quả sàng lọc thành công!');
            handleCloseAllModals();
            await fetchAllAppointments();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi cập nhật.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRecordDonationSubmit = async (formData) => {
        if (!currentAppointment) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/staff/donation-history/record', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Ghi nhận ca hiến máu thành công!');
            handleCloseAllModals();
            await fetchAllAppointments();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi ghi nhận hiến máu.";
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelAppointmentSubmit = async (remark) => {
        if (!currentAppointment) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                passed: false,
                remarks: remark,
            };

            await axios.post(`http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Đã hủy lịch hẹn thành công.');
            handleCloseAllModals();
            await fetchAllAppointments();

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Có lỗi xảy ra khi hủy lịch hẹn.";
            setError(errorMessage);
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleProfileUpdate = async () => {
        handleCloseAllModals();
        setLoading(true);
        try {
            await fetchAllAppointments();
        } catch (err) {
            setError("Không thể làm mới dữ liệu sau khi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    // Các hàm quản lý Modal
    const handleOpenModal = async (modalType, appointment) => {
        setCurrentAppointment(appointment);
        const token = localStorage.getItem('token');
        await fetchBloodTypes();

        if (modalType === 'screening') setIsScreeningModalOpen(true);
        else if (modalType === 'cancel') setIsCancelModalOpen(true);
        else if (modalType === 'history') {
            try {
                const response = await axios.get(`http://localhost:8080/api/staff/donation-history/user/${appointment.user.userId}`, { headers: { Authorization: `Bearer ${token}` } });
                setDonationHistory(response.data);
                setIsHistoryModalOpen(true);
            } catch (err) { alert("Không thể tải lịch sử hiến máu."); }
        }
        else if (modalType === 'recordDonation' || modalType === 'profile') {
            try {
                const profileRes = await axios.get(`http://localhost:8080/api/staff/user-profile/${appointment.user.userId}`, { headers: { Authorization: `Bearer ${token}` } });
                
                if (!profileRes.data) {
                    alert("Không tìm thấy hồ sơ của người dùng. Vui lòng hoàn thành bước sàng lọc trước.");
                    return;
                }
                
                setCurrentUserProfile(profileRes.data);
                
                if (modalType === 'recordDonation') {
                     if (!profileRes.data.bloodType) {
                        alert("Hồ sơ chưa có nhóm máu. Không thể ghi nhận hiến máu.");
                        return;
                    }
                    setIsRecordDonationModalOpen(true);
                } else {
                    setIsProfileModalOpen(true);
                }

            } catch (err) {
                alert("Không thể lấy hồ sơ người dùng. Vui lòng đảm bảo người dùng đã được sàng lọc.");
            }
        }
    };
    
    const handleCloseAllModals = () => {
        setIsScreeningModalOpen(false);
        setIsHistoryModalOpen(false);
        setIsRecordDonationModalOpen(false);
        setIsProfileModalOpen(false);
        setIsCancelModalOpen(false);
        setCurrentAppointment(null);
        setCurrentUserProfile(null);
    };
    
    // Logic phân trang và chuẩn bị dữ liệu
    const { groupedAppointmentsOnPage, sortedDatesOnPage, totalPages } = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

        const grouped = currentItems.reduce((acc, appointment) => {
            const date = appointment.scheduledDate;
            if (!acc[date]) acc[date] = [];
            acc[date].push(appointment);
            return acc;
        }, {});

        const sorted = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
        
        return {
            groupedAppointmentsOnPage: grouped,
            sortedDatesOnPage: sorted,
            totalPages: Math.ceil(appointments.length / itemsPerPage)
        };
    }, [appointments, currentPage, itemsPerPage]);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const statusStyles = {
        PENDING: 'text-yellow-600 bg-yellow-100', APPROVED: 'text-green-600 bg-green-100',
        COMPLETED: 'text-indigo-600 bg-indigo-100', REJECTED: 'text-red-600 bg-red-100',
        CANCELLED: 'text-gray-600 bg-gray-100',
    };

    // Render JSX
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

                {loading ? <p className="text-center text-gray-500 py-10">Đang tải...</p> 
                : error ? <p className="text-center text-red-500 py-10">{error}</p> 
                : appointments.length > 0 ? (
                    <>
                        <div className="space-y-8">
                            {sortedDatesOnPage.map(date => (
                                <div key={date}>
                                    <h3 className="text-lg font-semibold text-red-700 bg-red-100 px-4 py-2 rounded-t-lg">Ngày {formatDateForDisplay(date)}</h3>
                                    <ul className="bg-white rounded-b-lg shadow-md divide-y divide-gray-200">
                                        {groupedAppointmentsOnPage[date]?.map(app => (
                                            <li key={app.appointmentId} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex-grow">
                                                    <p className="text-lg font-semibold text-gray-800">{app.user?.fullName || 'Không rõ tên'}</p>
                                                    <p className={`inline-block mt-1 px-2 py-0.5 text-sm font-medium rounded-full ${statusStyles[app.status] || ''}`}>{app.status}</p>
                                                </div>
                                                <div className="flex-shrink-0 flex flex-wrap gap-2 self-end sm:self-center">
                                                    <button onClick={() => handleOpenModal('history', app)} className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600">Lịch sử</button>
                                                    {app.status !== 'PENDING' && (
                                                        <button onClick={() => handleOpenModal('profile', app)} className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600">Hồ sơ</button>
                                                    )}
                                                    {app.status === 'PENDING' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleOpenModal('screening', app)} 
                                                                className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                Sàng lọc
                                                            </button>
                                                            <button 
                                                                onClick={() => handleOpenModal('cancel', app)} 
                                                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                Hủy đơn
                                                            </button>
                                                        </>
                                                    )}
                                                    {app.status === 'APPROVED' && <button onClick={() => handleOpenModal('recordDonation', app)} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">Ghi nhận</button>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        
                        <Pagination 
                            itemsPerPage={itemsPerPage}
                            totalItems={appointments.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </>
                ) : <div className="text-center py-16 bg-white rounded-lg shadow-sm"><p className="text-gray-500">Không có lịch hẹn nào.</p></div>}
            </div>

            {/* Render các Modal */}
            {isScreeningModalOpen && <ScreeningModal appointment={currentAppointment} onClose={handleCloseAllModals} onSubmit={handleScreeningSubmit} isSubmitting={isSubmitting} bloodTypes={bloodTypes} />}
            {isHistoryModalOpen && <DonationHistoryModal isOpen={isHistoryModalOpen} onClose={handleCloseAllModals} donationHistory={donationHistory} />}
            {isRecordDonationModalOpen && <RecordDonationModal appointment={currentAppointment} userProfile={currentUserProfile} onClose={handleCloseAllModals} onSubmit={handleRecordDonationSubmit} isSubmitting={isSubmitting} />}
            {isProfileModalOpen && <UserProfileModal appointment={currentAppointment} userProfile={currentUserProfile} onClose={handleCloseAllModals} bloodTypes={bloodTypes} onProfileUpdate={handleProfileUpdate} />}
            {isCancelModalOpen && <CancellationModal isOpen={isCancelModalOpen} onClose={handleCloseAllModals} onSubmit={handleCancelAppointmentSubmit} isSubmitting={isSubmitting} />}
        </div>
    );
}