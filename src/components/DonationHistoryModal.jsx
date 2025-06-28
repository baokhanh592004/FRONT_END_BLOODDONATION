import React from 'react';

export default function DonationHistoryModal({ isOpen, onClose, donationHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Lịch sử hiến máu</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] px-6 py-4">
          {donationHistory.length === 0 ? (
            <p className="text-gray-500">Không có dữ liệu hiến máu.</p>
          ) : (
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 border">Ngày hiến</th>
                  <th className="px-4 py-2 border">Bệnh viện</th>
                  <th className="px-4 py-2 border">Nhóm máu</th>
                  <th className="px-4 py-2 border">Số đơn vị</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation, index) => (
                  <tr key={donation.donationId || index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{donation.donationDate}</td>
                    <td className="px-4 py-2 border">{donation.centerName}</td>
                    <td className="px-4 py-2 border">{donation.bloodType}</td>
                    <td className="px-4 py-2 border">{donation.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
