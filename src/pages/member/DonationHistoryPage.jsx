import React, { useState } from "react";
import { FaSearch, FaCalendarAlt, FaDownload, FaTimes } from "react-icons/fa";
import { format } from "date-fns";

const DonationHistoryPage = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const mockData = [
    {
      id: 1,
      date: "2024-01-15",
      bloodType: "A+",
      units: 2,
      facility: "Bệnh viện Chợ Rẫy",
      status: "Hoàn thành"
    },
    {
      id: 2,
      date: "2024-01-01",
      bloodType: "O-",
      units: 1,
      facility: "Bệnh viện Đa khoa Thủ Đức",
      status: "Đang chờ"
    },
    {
      id: 3,
      date: "2023-12-25",
      bloodType: "B+",
      units: 2,
      facility: "Bệnh viện 115",
      status: "Đã hủy"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang chờ":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = mockData.filter((donation) => {
    const matchesSearch = donation.facility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodType = !selectedBloodType || donation.bloodType === selectedBloodType;
    return matchesSearch && matchesBloodType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử hiến máu</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm cơ sở y tế</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập tên cơ sở y tế..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm máu</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBloodType("");
                setDateRange({ start: "", end: "" });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Xóa bộ lọc
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Áp dụng
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày hiến
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại nhóm máu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng đơn vị
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cơ sở y tế
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(donation.date), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.bloodType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.units}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.facility}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-red-600 hover:text-red-800">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy kết quả phù hợp</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">3</span> trong số{" "}
                <span className="font-medium">3</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Trước
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistoryPage;


