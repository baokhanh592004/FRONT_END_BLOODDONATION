// src/pages/StaffDashboard.js
import React from "react";
import { FaUser, FaChartBar, FaTint, FaCheckCircle } from "react-icons/fa";

const bloodData = [
  { group: "O+", donors: 32, unitsLeft: 90 },
  { group: "A+", donors: 21, unitsLeft: 47 },
  { group: "B+", donors: 19, unitsLeft: 55 },
  { group: "AB+", donors: 11, unitsLeft: 33 },
];

const StaffDashboard = () => {
  return (
    // Component gốc bao gồm cả layout và nội dung
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Staff Panel</h2>
        <ul className="space-y-2 text-sm">
          <li className="font-medium">📋 Hồ sơ cá nhân</li>
          <li className="font-medium">📊 Dashboard</li>
          <li className="pl-2 text-gray-600">🔧 Quản lý tài khoản</li>
          <li className="pl-2 text-gray-600">🔄 Cập nhật trạng thái đơn hiến máu của bệnh nhân</li>
          <li className="font-bold text-red-600 mt-2">🩸 Quản lý kho máu</li>
          <li className="pl-2 text-green-600">🔍 Tìm kiếm người hiến máu khẩn cấp</li>
          <li className="pl-2 text-gray-600">✅ Phê duyệt yêu cầu hiến máu từ các bệnh viện</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <FaChartBar className="text-blue-600" />
            Dashboard Báo cáo & Thống kê
          </h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-600 text-white p-4 rounded shadow">
            <p className="text-sm">Tổng số người hiến</p>
            <p className="text-2xl font-bold">124</p>
          </div>
          <div className="bg-red-600 text-white p-4 rounded shadow">
            <p className="text-sm">Tổng đơn vị máu hiện có</p>
            <p className="text-2xl font-bold">380</p>
          </div>
          <div className="bg-cyan-500 text-white p-4 rounded shadow">
            <p className="text-sm">Yêu cầu đã đáp ứng</p>
            <p className="text-2xl font-bold">52</p>
          </div>
        </div>

        {/* Blood group table */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="bg-gray-600 text-white p-2 text-sm font-medium">
            Báo cáo theo nhóm máu
          </div>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Nhóm máu</th>
                <th className="px-4 py-2 border">Số người hiến</th>
                <th className="px-4 py-2 border">Số đơn vị còn lại</th>
              </tr>
            </thead>
            <tbody>
              {bloodData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 border">{item.group}</td>
                  <td className="px-4 py-2 border">{item.donors}</td>
                  <td className="px-4 py-2 border">{item.unitsLeft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;