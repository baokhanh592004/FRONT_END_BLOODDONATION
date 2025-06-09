import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu giả, thêm ID, status và cancelReason
const mockDonors = [
  { id: 1, name: 'Nguyễn Văn A', bloodType: 'O+', dob: '12/01/1990', status: 'pending', cancelReason: '' },
  { id: 2, name: 'Trần Thị B', bloodType: 'A-', dob: '07/07/1985', status: 'pending', cancelReason: '' },
  { id: 3, name: 'Lê Văn Luyện', bloodType: 'B+', dob: '03/05/1995', status: 'completed', cancelReason: '' },
];

const StatusBadge = ({ status }) => {
  let className = '';
  let text = '';

  switch (status) {
    case 'pending':
      className = 'bg-yellow-200 text-yellow-800';
      text = 'Đang chờ';
      break;
    case 'completed':
      className = 'bg-green-200 text-green-800';
      text = 'Hoàn thành';
      break;
    case 'cancelled':
      className = 'bg-red-200 text-red-800';
      text = 'Đã hủy';
      break;
    default:
      break;
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
      {text}
    </span>
  );
};

const DonationManagementPage = () => {
  const [donors, setDonors] = useState(mockDonors);

  const handleStatusChange = (donorId, newStatus) => {
    if (newStatus === 'cancelled') {
      const reason = prompt('Vui lòng nhập lý do hủy đơn đăng ký:');
      if (!reason) return; // Không cập nhật nếu không có lý do

      setDonors(currentDonors =>
        currentDonors.map(donor =>
          donor.id === donorId ? { ...donor, status: newStatus, cancelReason: reason } : donor
        )
      );
    } else {
      setDonors(currentDonors =>
        currentDonors.map(donor =>
          donor.id === donorId ? { ...donor, status: newStatus, cancelReason: '' } : donor
        )
      );
    }
  };

  const handleSaveChanges = () => {
    // Trong thực tế, bạn sẽ gọi API để lưu trạng thái của 'donors' vào database
    console.log("Saving changes:", donors);
    alert("Đã lưu các thay đổi trạng thái!");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách đăng ký hiến máu</h1>
        <button 
          onClick={handleSaveChanges}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Lưu thay đổi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Họ tên</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Lý do hủy</th>
              <th className="px-6 py-3 text-center font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {donors.map((donor) => (
              <tr key={donor.id}>
                <td className="px-6 py-4 font-medium">{donor.name}</td>
                <td className="px-6 py-4">{donor.bloodType}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={donor.status} />
                </td>
                <td className="px-6 py-4 text-sm text-red-600 italic">
                  {donor.status === 'cancelled' ? donor.cancelReason : ''}
                </td>
                <td className="px-6 py-4 flex items-center justify-center gap-4">
                  <Link
                    to={`/staff/donors/${donor.id}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Khai báo sức khỏe
                  </Link>
                  <select
                    value={donor.status}
                    onChange={(e) => handleStatusChange(donor.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Đang chờ</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationManagementPage;
