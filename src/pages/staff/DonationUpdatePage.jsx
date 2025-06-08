import React from 'react';

const donations = [
  { name: 'Nguyễn Văn A', date: '2025-05-20', status: 'Đang chờ' },
  { name: 'Trần Thị B', date: '2025-04-15', status: 'Hoàn thành' },
  { name: 'Phạm Văn C', date: '2025-05-10', status: 'Đã hủy' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Đang chờ': 'bg-yellow-400 text-yellow-800',
    'Hoàn thành': 'bg-green-400 text-green-800',
    'Đã hủy': 'bg-red-400 text-red-800',
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const DonationUpdatePage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách người đăng ký hiến máu</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Họ tên</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Ngày đăng ký</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">{donation.name}</td>
                <td className="px-6 py-4">{donation.date}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={donation.status} />
                </td>
                <td className="px-6 py-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Cập nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationUpdatePage;