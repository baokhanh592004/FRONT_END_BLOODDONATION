import React, { useState } from 'react';

const CancellationModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [remark, setRemark] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!remark.trim()) {
            alert('Vui lòng nhập lý do hủy lịch hẹn.');
            return;
        }
        onSubmit(remark);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Lý do hủy lịch hẹn</h3>
                        <p className="text-gray-600 mb-4">Vui lòng nhập lý do hủy bỏ lịch hẹn này. Ghi chú sẽ được lưu lại.</p>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className="w-full h-28 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Ví dụ: Người dùng báo bận, không đủ điều kiện sức khỏe tạm thời,..."
                            required
                        />
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 disabled:bg-red-400"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancellationModal;