import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import axiosClient from "../../api/axiosClient";

const DonationHistoryPage = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [componentTypeFilter, setComponentTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axiosClient
      .get("user/donation-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDonationHistory(res.data);
      })
      .catch((err) => {
        console.error("Error fetching donation history:", err);
      });
  }, []);

  const filteredData = donationHistory
    .slice()
    .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
    .filter((donation) => {
      const matchesSearch = donation.centerName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesComponentType =
        !componentTypeFilter || donation.componentType === componentTypeFilter;
      const matchesStartDate =
        !dateRange.start || new Date(donation.donationDate) >= new Date(dateRange.start);
      const matchesEndDate =
        !dateRange.end || new Date(donation.donationDate) <= new Date(dateRange.end);

      return matchesSearch && matchesComponentType && matchesStartDate && matchesEndDate;
    });

  const getComponentTypeLabel = (type) => {
    switch (type) {
      // Logic này không còn cần thiết nếu API trả về tên đầy đủ, nhưng giữ lại để không ảnh hưởng code cũ
      case "WHOLE":
        return "Máu toàn phần";
      case "PLASMA":
        return "Huyết tương";
      case "PLATELET":
        return "Tiểu cầu";
      case "RBC":
        return "Hồng cầu";
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đã hủy":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (donation) => {
    return donation.donationDate ? "Hoàn thành" : "Đã hủy";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử hiến máu</h1>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Thành phần máu</label>
              {/* ================================================================= */}
              {/* THAY ĐỔI: SỬA LẠI DROPDOWN VỚI DỮ LIỆU CỨNG                  */}
              {/* ================================================================= */}
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                value={componentTypeFilter}
                onChange={(e) => setComponentTypeFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Plasma">Plasma</option>
                <option value="Platelets">Platelets</option>
                <option value="Red Blood Cells">Red Blood Cells</option>
                <option value="Whole Blood">Whole Blood</option>
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
                setComponentTypeFilter("");
                setDateRange({ start: "", end: "" });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hiến</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhóm máu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành phần</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn vị</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cơ sở y tế</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((donation, index) => (
                  <tr key={donation.donationId} className={index % 2 === 1 ? "bg-gray-100" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(donation.donationDate), "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.bloodType}</td>
                    {/* Giữ nguyên logic hiển thị cũ để không ảnh hưởng */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getComponentTypeLabel(donation.componentType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.units}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.centerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(formatStatus(donation))}`}>
                        {formatStatus(donation)}
                      </span>
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
      </div>
    </div>
  );
};

export default DonationHistoryPage;