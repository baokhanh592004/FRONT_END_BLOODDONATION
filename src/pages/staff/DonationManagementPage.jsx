import React, {
	useState,
	useEffect,
	forwardRef,
	useMemo,
	useCallback,
} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import Modals
import ScreeningModal from '../../components/ScreeningModal';
import DonationHistoryModal from '../../components/DonationHistoryModal';
import RecordDonationModal from '../../components/RecordDonationModal';
import UserProfileModal from '../../components/UserProfileModal';
import CancellationModal from '../../components/CancellationModal';
import NotificationModal from '../../components/NotificationModal';

// =======================================================
// ICONS
// =======================================================
const iconClass = 'h-5 w-5 mr-2';
const CalendarIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 text-gray-400"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
			clipRule="evenodd"
		/>
	</svg>
);
const UserIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 mr-2"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
			clipRule="evenodd"
		/>
	</svg>
);
const HistoryIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={iconClass}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);
const ProfileIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={iconClass}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
);
const ScreeningIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={iconClass}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
		/>
	</svg>
);
const CancelIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={iconClass}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);
const RecordIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={iconClass}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
);

// =======================================================
// CONSTANTS & UTILS
// =======================================================
const statusStyles = {
	PENDING: 'text-yellow-800 bg-yellow-100 border-yellow-300',
	APPROVED: 'text-green-800 bg-green-100 border-green-300',
	COMPLETED: 'text-blue-800 bg-blue-100 border-blue-300',
	REJECTED: 'text-red-800 bg-red-100 border-red-300',
	CANCELLED: 'text-gray-800 bg-gray-100 border-gray-300',
};

const formatDateForDisplay = (dateString) => {
	if (!dateString) return '';
	const [year, month, day] = dateString.split('-');
	return `${day}/${month}/${year}`;
};

const formatDateForApi = (dateObject) => {
	if (!dateObject) return '';
	const offset = dateObject.getTimezoneOffset();
	const adjustedDate = new Date(dateObject.getTime() - offset * 60 * 1000);
	return adjustedDate.toISOString().split('T')[0];
};

const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => (
	<button
		className="w-full sm:w-auto bg-white text-left text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-lg shadow-sm hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-between items-center"
		onClick={onClick}
		ref={ref}
	>
		{value || <span className="text-gray-400">Chọn một ngày</span>}
		<CalendarIcon />
	</button>
));

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
	const pageNumbers = [];
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	if (totalPages <= 1) return null;
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}
	return (
		<nav className="mt-6 flex justify-center">
			<ul className="inline-flex items-center -space-x-px text-sm">
				<li>
					<button
						onClick={() => paginate(currentPage - 1)}
						disabled={currentPage === 1}
						className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Trước
					</button>
				</li>
				{pageNumbers.map((number) => (
					<li key={number}>
						<button
							onClick={() => paginate(number)}
							className={`py-2 px-3 leading-tight border border-gray-300 ${
								currentPage === number
									? 'text-red-600 bg-red-50 font-bold'
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

// =======================================================
// CHILD COMPONENTS
// =======================================================

const PageHeader = React.memo(() => (
	<div className="mb-8">
		<h1 className="text-4xl font-bold text-gray-800">Quản lý Lịch hẹn</h1>
		<p className="text-lg text-gray-500 mt-1">
			Xem, sàng lọc và quản lý các lịch hẹn hiến máu.
		</p>
	</div>
));

const FilterBar = React.memo(({ selectedDate, onDateChange, onSearch, onReset }) => (
	<div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4 border border-gray-200">
		<div className="w-full sm:w-60">
			<DatePicker
				selected={selectedDate}
				onChange={onDateChange}
				dateFormat="dd/MM/yyyy"
				customInput={<DatePickerCustomInput />}
				placeholderText="Lọc theo ngày..."
			/>
		</div>
		<button
			onClick={onSearch}
			className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors duration-200"
		>
			Tìm kiếm
		</button>
		<button
			onClick={onReset}
			className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
		>
			Reset
		</button>
	</div>
));

const ActionButtons = React.memo(({ appointment, onOpenModal, isSubmitting }) => {
	const { status } = appointment;
	return (
		<div className="flex-shrink-0 flex flex-wrap gap-2 self-start sm:self-center mt-3 sm:mt-0">
			{status === 'PENDING' && (
				<>
					<button
						onClick={() => onOpenModal('screening', appointment)}
						className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
						disabled={isSubmitting}
					>
						<ScreeningIcon /> Sàng lọc
					</button>
					<button
						onClick={() => onOpenModal('cancel', appointment)}
						className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
						disabled={isSubmitting}
					>
						<CancelIcon /> Hủy đơn
					</button>
				</>
			)}
			{status === 'APPROVED' && (
				<button
					onClick={() => onOpenModal('recordDonation', appointment)}
					className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
					disabled={isSubmitting}
				>
					<RecordIcon /> Ghi nhận
				</button>
			)}
			<button
				onClick={() => onOpenModal('profile', appointment)}
				className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
			>
				<ProfileIcon /> Hồ sơ
			</button>
			<button
				onClick={() => onOpenModal('history', appointment)}
				className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
			>
				<HistoryIcon /> Lịch sử
			</button>
		</div>
	);
});

const AppointmentItem = React.memo(
	({ appointment, onOpenModal, isSubmitting }) => (
		<li className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
			<div className="flex-grow">
				<p className="text-base font-semibold text-gray-900">
					{appointment.user?.fullName || 'Không rõ tên'}
				</p>
				<div className="flex items-center mt-1">
					<p className="text-sm text-gray-500">
						{appointment.user?.email || ''}
					</p>
					<span className="mx-2 text-gray-300">|</span>
					<span
						className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
							statusStyles[appointment.status] || ''
						}`}
					>
						{appointment.status}
					</span>
				</div>
			</div>
			<ActionButtons
				appointment={appointment}
				onOpenModal={onOpenModal}
				isSubmitting={isSubmitting}
			/>
		</li>
	)
);

const AppointmentGroup = React.memo(
	({ date, appointments, onOpenModal, isSubmitting }) => (
		<div className="bg-white rounded-xl shadow-lg border border-gray-200">
			<h3 className="text-xl font-bold text-red-700 bg-red-50 px-6 py-4 rounded-t-xl border-b border-red-200">
				Ngày {formatDateForDisplay(date)}
			</h3>
			<ul className="divide-y divide-gray-200">
				{appointments.map((app) => (
					<AppointmentItem
						key={app.appointmentId}
						appointment={app}
						onOpenModal={onOpenModal}
						isSubmitting={isSubmitting}
					/>
				))}
			</ul>
		</div>
	)
);

const AppointmentList = React.memo(
	({ sortedDates, groupedAppointments, onOpenModal, isSubmitting }) => (
		<div className="space-y-8">
			{sortedDates.map((date) => (
				<AppointmentGroup
					key={date}
					date={date}
					appointments={groupedAppointments[date]}
					onOpenModal={onOpenModal}
					isSubmitting={isSubmitting}
				/>
			))}
		</div>
	)
);

// =======================================================
// MAIN PAGE COMPONENT
// =======================================================
export default function DonationManagementPage() {
	// === STATE MANAGEMENT ===
	const [appointments, setAppointments] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [selectedDate, setSelectedDate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// State cho Modals chức năng
	const [currentAppointment, setCurrentAppointment] = useState(null);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);
	const [donationHistory, setDonationHistory] = useState([]);
	const [bloodTypes, setBloodTypes] = useState([]);
	const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [isRecordDonationModalOpen, setIsRecordDonationModalOpen] =
		useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

	// State cho modal thông báo
	const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
	const [notificationContent, setNotificationContent] = useState({
		type: 'success',
		title: '',
		message: '',
	});

	// Hàm tiện ích để hiển thị modal thông báo
	const showNotification = useCallback((type, title, message) => {
		setNotificationContent({ type, title, message });
		setIsNotificationModalOpen(true);
	}, []);

	// === DATA FETCHING & BUSINESS LOGIC ===

	const fetchBloodTypes = useCallback(async () => {
		if (bloodTypes.length > 0) return;
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(
				'http://localhost:8080/api/blood-types',
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setBloodTypes(response.data);
		} catch (err) {
			console.error('Không thể tải danh sách nhóm máu.', err);
		}
	}, [bloodTypes.length]);

	const fetchAllAppointments = useCallback(async () => {
		setError(null);
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(
				'http://localhost:8080/api/staff/appointments',
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const sortedData = response.data.sort(
				(a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)
			);
			setAppointments(sortedData);
			setCurrentPage(1);
		} catch (err) {
			setError('Không thể tải danh sách lịch hẹn.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const initialFetch = async () => {
			await fetchBloodTypes();
			await fetchAllAppointments();
		};
		initialFetch();
	}, [fetchAllAppointments, fetchBloodTypes]);

	// === EVENT HANDLERS ===

	const handleSearchByDate = useCallback(async () => {
		if (!selectedDate) {
			showNotification('error', 'Lỗi', 'Vui lòng chọn một ngày để tìm kiếm.');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem('token');
			const dateForApi = formatDateForApi(selectedDate);
			const response = await axios.get(
				'http://localhost:8080/api/staff/appointments/by-date',
				{
					headers: { Authorization: `Bearer ${token}` },
					params: { date: dateForApi },
				}
			);
			setAppointments(response.data);
			setCurrentPage(1);
		} catch (err) {
			setError('Không tìm thấy dữ liệu cho ngày đã chọn hoặc có lỗi xảy ra.');
			setAppointments([]);
		} finally {
			setLoading(false);
		}
	}, [selectedDate, showNotification]);

	const handleReset = useCallback(() => {
		setSelectedDate(null);
		fetchAllAppointments();
	}, [fetchAllAppointments]);

	const handleCloseAllModals = useCallback(() => {
		setIsScreeningModalOpen(false);
		setIsHistoryModalOpen(false);
		setIsRecordDonationModalOpen(false);
		setIsProfileModalOpen(false);
		setIsCancelModalOpen(false);
		setCurrentAppointment(null);
		setCurrentUserProfile(null);
	}, []);

	const handleNotificationClose = useCallback(() => {
		setIsNotificationModalOpen(false);
		if (notificationContent.type === 'success') {
			handleCloseAllModals();
			fetchAllAppointments();
		}
	}, [
		notificationContent.type,
		handleCloseAllModals,
		fetchAllAppointments,
	]);

	const handleProfileUpdate = useCallback(() => {
		handleCloseAllModals();
		fetchAllAppointments();
		showNotification(
			'success',
			'Thành Công',
			'Hồ sơ người dùng đã được cập nhật.'
		);
	}, [handleCloseAllModals, fetchAllAppointments, showNotification]);

	const handleScreeningSubmit = useCallback(
		async (formData) => {
			if (!currentAppointment) return;
			setIsSubmitting(true);
			const { passed, remarks, weight, bloodTypeId, healthStatus } = formData;
			const token = localStorage.getItem('token');
			try {
				const userProfilePayload = {
					userId: currentAppointment.user.userId,
					weight,
					bloodTypeId,
					healthStatus,
					lastScreeningDate: new Date().toISOString().split('T')[0],
				};
				await axios.post(
					`http://localhost:8080/api/staff/user-profile`,
					userProfilePayload,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const screeningPayload = { passed, remarks };
				await axios.post(
					`http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`,
					screeningPayload,
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				showNotification(
					'success',
					'Thành Công!',
					'Cập nhật hồ sơ và kết quả sàng lọc thành công!'
				);
			} catch (err) {
				const errorMessage =
					err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.';
				showNotification('error', 'Thất Bại', `Lỗi: ${errorMessage}`);
			} finally {
				setIsSubmitting(false);
			}
		},
		[currentAppointment, showNotification]
	);

	const handleRecordDonationSubmit = useCallback(
		async (formData) => {
			if (!currentAppointment) return;
			setIsSubmitting(true);
			try {
				const token = localStorage.getItem('token');
				await axios.post(
					'http://localhost:8080/api/staff/donation-history/record',
					formData,
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				showNotification(
					'success',
					'Thành Công!',
					'Ghi nhận ca hiến máu thành công!'
				);
			} catch (err) {
				const errorMessage =
					err.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận hiến máu.';
				showNotification('error', 'Thất Bại', `Lỗi: ${errorMessage}`);
			} finally {
				setIsSubmitting(false);
			}
		},
		[currentAppointment, showNotification]
	);

	const handleCancelAppointmentSubmit = useCallback(
		async (remark) => {
			if (!currentAppointment) return;
			setIsSubmitting(true);
			setError(null);
			try {
				const token = localStorage.getItem('token');
				const payload = { passed: false, remarks: remark };
				await axios.post(
					`http://localhost:8080/api/staff/appointments/${currentAppointment.appointmentId}/screening`,
					payload,
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				showNotification('success', 'Thành Công', 'Đã hủy lịch hẹn thành công.');
			} catch (err) {
				const errorMessage =
					err.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch hẹn.';
				showNotification('error', 'Thất Bại', `Lỗi: ${errorMessage}`);
			} finally {
				setIsSubmitting(false);
			}
		},
		[currentAppointment, showNotification]
	);

	const handleOpenModal = useCallback(
		async (modalType, appointment) => {
			setCurrentAppointment(appointment);
			const token = localStorage.getItem('token');

			switch (modalType) {
				case 'screening':
					setIsScreeningModalOpen(true);
					break;
				case 'cancel':
					setIsCancelModalOpen(true);
					break;
				case 'history':
					try {
						const response = await axios.get(
							`http://localhost:8080/api/staff/donation-history/user/${appointment.user.userId}`,
							{ headers: { Authorization: `Bearer ${token}` } }
						);
						setDonationHistory(response.data);
						setIsHistoryModalOpen(true);
					} catch (err) {
						showNotification('error', 'Lỗi', 'Không thể tải lịch sử hiến máu.');
					}
					break;
				case 'recordDonation':
				case 'profile':
					let userProfile = null;
					try {
						const profileRes = await axios.get(
							`http://localhost:8080/api/staff/user-profile/${appointment.user.userId}`,
							{ headers: { Authorization: `Bearer ${token}` } }
						);
						userProfile = profileRes.data;
						setCurrentUserProfile(userProfile);
					} catch (err) {
						if (err.response && err.response.status !== 404) {
							showNotification(
								'error',
								'Lỗi',
								'Đã có lỗi xảy ra khi tải hồ sơ người dùng.'
							);
							return;
						}
						setCurrentUserProfile(null);
					}

					if (modalType === 'profile') {
						setIsProfileModalOpen(true);
					} else if (modalType === 'recordDonation') {
						if (!userProfile) {
							showNotification(
								'error',
								'Yêu Cầu Thông Tin',
								'Không tìm thấy hồ sơ của người dùng. Vui lòng hoàn thành bước sàng lọc trước.'
							);
							return;
						}
						if (!userProfile.bloodType) {
							showNotification(
								'error',
								'Thiếu Thông Tin',
								'Hồ sơ chưa có nhóm máu. Không thể ghi nhận hiến máu.'
							);
							return;
						}
						setIsRecordDonationModalOpen(true);
					}
					break;
				default:
					break;
			}
		},
		[showNotification]
	);

	// === MEMOIZED VALUES ===
	const { groupedAppointmentsOnPage, sortedDatesOnPage, totalPages } =
		useMemo(() => {
			const indexOfLastItem = currentPage * itemsPerPage;
			const indexOfFirstItem = indexOfLastItem - itemsPerPage;
			const currentItems = appointments.slice(
				indexOfFirstItem,
				indexOfLastItem
			);

			const grouped = currentItems.reduce((acc, appointment) => {
				const date = appointment.scheduledDate;
				if (!acc[date]) acc[date] = [];
				acc[date].push(appointment);
				return acc;
			}, {});

			const sorted = Object.keys(grouped).sort(
				(a, b) => new Date(b) - new Date(a)
			);

			return {
				groupedAppointmentsOnPage: grouped,
				sortedDatesOnPage: sorted,
				totalPages: Math.ceil(appointments.length / itemsPerPage),
			};
		}, [appointments, currentPage, itemsPerPage]);

	const paginate = (pageNumber) => {
		if (pageNumber > 0 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	// === RENDER LOGIC ===
	const renderContent = () => {
		if (loading) {
			return <p className="text-center text-gray-500 py-20">Đang tải dữ liệu...</p>;
		}
		if (error) {
			return (
				<p className="text-center text-red-600 font-semibold py-20">{error}</p>
			);
		}
		if (appointments.length === 0) {
			return (
				<div className="text-center py-20 bg-white rounded-xl shadow-lg border">
					<UserIcon className="mx-auto h-12 w-12 text-gray-300" />
					<p className="mt-2 text-lg text-gray-500">
						Không có lịch hẹn nào được tìm thấy.
					</p>
				</div>
			);
		}
		return (
			<>
				<AppointmentList
					sortedDates={sortedDatesOnPage}
					groupedAppointments={groupedAppointmentsOnPage}
					onOpenModal={handleOpenModal}
					isSubmitting={isSubmitting}
				/>
				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={appointments.length}
					paginate={paginate}
					currentPage={currentPage}
				/>
			</>
		);
	};

	return (
		<div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
			<div className="max-w-7xl mx-auto">
				<PageHeader />
				<FilterBar
					selectedDate={selectedDate}
					onDateChange={(date) => setSelectedDate(date)}
					onSearch={handleSearchByDate}
					onReset={handleReset}
				/>

				{renderContent()}
			</div>

			{/* Render Modals Chức Năng */}
			{isScreeningModalOpen && (
				<ScreeningModal
					appointment={currentAppointment}
					onClose={handleCloseAllModals}
					onSubmit={handleScreeningSubmit}
					isSubmitting={isSubmitting}
					bloodTypes={bloodTypes}
				/>
			)}
			{isHistoryModalOpen && (
				<DonationHistoryModal
					isOpen={isHistoryModalOpen}
					onClose={handleCloseAllModals}
					donationHistory={donationHistory}
				/>
			)}
			{isRecordDonationModalOpen && (
				<RecordDonationModal
					appointment={currentAppointment}
					userProfile={currentUserProfile}
					onClose={handleCloseAllModals}
					onSubmit={handleRecordDonationSubmit}
					isSubmitting={isSubmitting}
				/>
			)}
			{isProfileModalOpen && (
				<UserProfileModal
					appointment={currentAppointment}
					userProfile={currentUserProfile}
					onClose={handleCloseAllModals}
					bloodTypes={bloodTypes}
					onProfileUpdate={handleProfileUpdate}
				/>
			)}
			{isCancelModalOpen && (
				<CancellationModal
					isOpen={isCancelModalOpen}
					onClose={handleCloseAllModals}
					onSubmit={handleCancelAppointmentSubmit}
					isSubmitting={isSubmitting}
				/>
			)}

			{/* Render Modal Thông Báo */}
			<NotificationModal
				isOpen={isNotificationModalOpen}
				onClose={handleNotificationClose}
				type={notificationContent.type}
				title={notificationContent.title}
				message={notificationContent.message}
			/>
		</div>
	);
}