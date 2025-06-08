import React from 'react';

const patients = [
  { name: 'Nguyễn Văn A', bloodType: 'O+', dob: '12/01/1990' },
  { name: 'Trần Thị B', bloodType: 'A-', dob: '07/07/1985' },
];

const PatientManagementPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách hồ sơ bệnh nhân</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bệnh nhân theo tên..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Họ tên</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Ngày sinh</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">{patient.name}</td>
                <td className="px-6 py-4">{patient.bloodType}</td>
                <td className="px-6 py-4">{patient.dob}</td>
                <td className="px-6 py-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Chỉnh sửa
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

export default PatientManagementPage;