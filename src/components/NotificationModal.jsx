import React from 'react';

// SVG Icon cho trạng thái Thành công
const SuccessIcon = () => (
	<svg
		className="h-16 w-16 text-green-500 mx-auto"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

// SVG Icon cho trạng thái Lỗi
const ErrorIcon = () => (
	<svg
		className="h-16 w-16 text-red-500 mx-auto"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

/**
 * Modal thông báo tùy chỉnh với nút OK.
 * @param {object} props
 * @param {boolean} props.isOpen - Trạng thái mở/đóng của modal.
 * @param {function} props.onClose - Hàm được gọi khi nhấn nút OK hoặc backdrop.
 * @param {'success' | 'error'} props.type - Loại thông báo ('success' hoặc 'error').
 * @param {string} props.title - Tiêu đề của thông báo.
 * @param {string} props.message - Nội dung chi tiết của thông báo.
 */
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
	if (!isOpen) {
		return null;
	}

	const isSuccess = type === 'success';

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center font-sans p-4"
			onClick={onClose} // Đóng modal khi click vào backdrop
		>
			<div
				className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-md transform transition-all"
				onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra backdrop
			>
				{/* Icon */}
				<div className="mx-auto mb-4">
					{isSuccess ? <SuccessIcon /> : <ErrorIcon />}
				</div>

				{/* Title */}
				<h3
					className={`text-2xl font-bold mt-4 ${
						isSuccess ? 'text-gray-800' : 'text-red-600'
					}`}
				>
					{title}
				</h3>

				{/* Message */}
				<p className="text-gray-600 mt-2 mb-8 text-base">{message}</p>

				{/* OK Button */}
				<button
					onClick={onClose}
					className={`w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md focus:outline-none transition-transform transform hover:scale-105
            ${
				isSuccess
					? 'bg-green-600 hover:bg-green-700'
					: 'bg-red-600 hover:bg-red-700'
			}`}
				>
					OK
				</button>
			</div>
		</div>
	);
};

export default NotificationModal;