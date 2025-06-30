import React, { useState } from 'react';

export default function ScreeningModal({ appointment, onClose, onSubmit, isSubmitting }) {
    const [passed, setPassed] = useState(true);
    const [remarks, setRemarks] = useState(appointment?.remarks || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ passed, remarks });
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kết quả sàng lọc</h3>
                <p className="text-gray-600 mb-4">Người hiến máu: <span className="font-semibold">{appointment.user?.fullName || 'N/A'}</span></p>

                <div className="space-y-4">
                    <div>
                        <p className="font-medium text-gray-700">Kết quả:</p>
                        <div className="mt-2 flex items-center gap-x-6">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="screeningResult" checked={passed === true} onChange={() => setPassed(true)} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
                                <span className="ml-3 block text-sm font-medium leading-6 text-gray-900">Đạt</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="screeningResult" checked={passed === false} onChange={() => setPassed(false)} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                                <span className="ml-3 block text-sm font-medium leading-6 text-gray-900">Không Đạt</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium leading-6 text-gray-900">Ghi chú</label>
                        <textarea id="remarks" name="remarks" rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="VD: Bệnh nhân đủ điều kiện hiến máu." />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-x-3">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Đang lưu...' : 'Lưu kết quả'}
                    </button>
                </div>
            </form>
        </div>
    );
}