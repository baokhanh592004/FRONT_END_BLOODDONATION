// src/components/ScreeningModal.js

import React, { useState } from 'react';

export default function ScreeningModal({ appointment, onClose, onSubmit, isSubmitting }) {
  // State nội bộ của form trong modal
  // Mặc định chọn "Đạt"
  const [passed, setPassed] = useState('true'); 
  const [remarks, setRemarks] = useState('');

  // Nếu không có appointment, không render gì cả
  if (!appointment) return null;

  // Hàm được gọi khi nhân viên nhấn nút "Lưu kết quả"
  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi hàm onSubmit được truyền từ component cha,
    // với dữ liệu đã được định dạng đúng (chuyển 'true'/'false' thành boolean)
    onSubmit({ 
      passed: passed === 'true', 
      remarks 
    });
  };

  return (
    // Lớp nền mờ bao phủ toàn màn hình
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity">
      {/* Cửa sổ Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Kết quả sàng lọc
        </h3>
        <p className="text-gray-600 mb-4">
          Người hiến máu: <span className="font-semibold">{appointment.user?.fullName || 'N/A'}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Phần chọn kết quả: Đạt / Không Đạt */}
          <div className="space-y-2 mb-4">
            <p className="font-medium text-gray-700">Kết quả:</p>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center">
                <input
                  id="passed-true"
                  name="screening-result"
                  type="radio"
                  value="true"
                  checked={passed === 'true'}
                  onChange={(e) => setPassed(e.target.value)}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="passed-true" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  Đạt
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="passed-false"
                  name="screening-result"
                  type="radio"
                  value="false"
                  checked={passed === 'false'}
                  onChange={(e) => setPassed(e.target.value)}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <label htmlFor="passed-false" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  Không Đạt
                </label>
              </div>
            </div>
          </div>

          {/* Phần nhập ghi chú */}
          <div className="mb-6">
            <label htmlFor="remarks" className="block text-sm font-medium leading-6 text-gray-900">
              Ghi chú
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="VD: Bệnh nhân đủ điều kiện hiến máu"
            />
          </div>

          {/* Các nút hành động */}
          <div className="flex justify-end gap-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu kết quả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}