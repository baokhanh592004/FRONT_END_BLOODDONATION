import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FiHome, FiHeart, FiActivity, FiDatabase, FiUsers, FiFileText, FiBarChart2, FiMenu } from "react-icons/fi";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);


const DashboardPage = () => {
  const bloodStats = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
    datasets: [
      {
        label: "Đơn vị máu",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "#DC2626",
        backgroundColor: "rgba(220, 38, 38, 0.5)",
      },
    ],
  };


  const urgentRequests = [
    { id: 1, bloodType: "A+", hospital: "Bệnh viện Bạch Mai", urgency: "Cao", timeRemaining: "2 giờ" },
    { id: 2, bloodType: "O-", hospital: "Bệnh viện Việt Đức", urgency: "Trung bình", timeRemaining: "5 giờ" },
  ];


  const activeDonors = [
    { id: 1, name: "Nguyễn Văn A", status: "Đang hiến máu", bloodType: "B+" },
    { id: 2, name: "Trần Thị B", status: "Chờ khám", bloodType: "AB+" },
  ];


  return (
    <div className="p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Tổng đơn vị máu", value: "1,234", color: "bg-blue-500" },
          { label: "Yêu cầu khẩn cấp", value: "5", color: "bg-red-500" },
          { label: "Người hiến máu hôm nay", value: "28", color: "bg-green-500" },
          { label: "Đơn vị máu sẵn có", value: "856", color: "bg-purple-500" },
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-6 text-white`}>
            <h3 className="text-lg font-semibold">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Thống kê hiến máu</h2>
          <Line data={bloodStats} options={{ responsive: true }} />
        </div>


        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Yêu cầu khẩn cấp</h2>
          <div className="space-y-4">
            {urgentRequests.map((request) => (
              <div key={request.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-600">{request.bloodType}</span>
                  <span
                    className={`px-3 py-1 rounded ${
                      request.urgency === "Cao" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>
                <p className="mt-2">{request.hospital}</p>
                <p className="text-sm text-gray-500">Còn lại: {request.timeRemaining}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Người hiến máu đang hoạt động</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Tên</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-left">Nhóm máu</th>
              </tr>
            </thead>
            <tbody>
              {activeDonors.map((donor) => (
                <tr key={donor.id} className="border-t">
                  <td className="p-4">{donor.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded ${
                        donor.status === "Đang hiến máu" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {donor.status}
                    </span>
                  </td>
                  <td className="p-4">{donor.bloodType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const UrgentRequestsPage = () => {
  const urgentRequests = [
    { id: 1, bloodType: "A+", hospital: "Bệnh viện Bạch Mai", urgency: "Cao", timeRemaining: "2 giờ", contact: "0123456789" },
    { id: 2, bloodType: "O-", hospital: "Bệnh viện Việt Đức", urgency: "Trung bình", timeRemaining: "5 giờ", contact: "0987654321" },
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Yêu cầu máu khẩn cấp</h1>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Nhóm máu</th>
              <th className="p-3">Bệnh viện</th>
              <th className="p-3">Mức độ khẩn cấp</th>
              <th className="p-3">Thời gian còn lại</th>
              <th className="p-3">Liên hệ</th>
            </tr>
          </thead>
          <tbody>
            {urgentRequests.map(({ id, bloodType, hospital, urgency, timeRemaining, contact }) => (
              <tr key={id} className="border-b hover:bg-red-50">
                <td className="p-3 font-semibold text-red-600">{bloodType}</td>
                <td className="p-3">{hospital}</td>
                <td
                  className={`p-3 font-semibold ${
                    urgency === "Cao" ? "text-red-600" : "text-yellow-600"
                  }`}
                >
                  {urgency}
                </td>
                <td className="p-3">{timeRemaining}</td>
                <td className="p-3">{contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const BloodProcessPage = () => {
  const steps = [
    "Đăng ký thông tin cá nhân",
    "Khám sức khỏe sơ bộ",
    "Lấy mẫu máu để xét nghiệm",
    "Thực hiện hiến máu",
    "Nghỉ ngơi và nhận hỗ trợ sau hiến máu",
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quy trình hiến máu</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          {steps.map((step, idx) => (
            <li key={idx} className="text-lg">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};


const BloodStoragePage = () => {
  const bloodStocks = [
    { bloodType: "A+", quantity: 150, status: "Đủ" },
    { bloodType: "O-", quantity: 40, status: "Thiếu" },
    { bloodType: "B+", quantity: 80, status: "Đủ" },
    { bloodType: "AB+", quantity: 30, status: "Thiếu" },
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý kho máu</h1>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3">Nhóm máu</th>
              <th className="p-3">Số lượng (đơn vị)</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bloodStocks.map(({ bloodType, quantity, status }, idx) => (
              <tr
                key={idx}
                className={`border-b hover:bg-gray-100 ${
                  status === "Thiếu" ? "bg-red-50" : ""
                }`}
              >
                <td className="p-3 font-semibold">{bloodType}</td>
                <td className="p-3">{quantity}</td>
                <td
                  className={`p-3 font-semibold ${
                    status === "Thiếu" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const DonorsPage = () => {
  const donors = [
    { id: 1, name: "Nguyễn Văn A", status: "Đang hiến máu", bloodType: "B+" },
    { id: 2, name: "Trần Thị B", status: "Chờ khám", bloodType: "AB+" },
    { id: 3, name: "Lê Văn C", status: "Sẵn sàng", bloodType: "O-" },
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Người hiến máu</h1>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3">Tên</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Nhóm máu</th>
            </tr>
          </thead>
          <tbody>
            {donors.map(({ id, name, status, bloodType }) => (
              <tr key={id} className="border-b hover:bg-gray-100">
                <td className="p-3">{name}</td>
                <td
                  className={`p-3 font-semibold ${
                    status === "Đang hiến máu" ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {status}
                </td>
                <td className="p-3 font-semibold">{bloodType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const DocumentsPage = () => {
  const documents = [
    { id: 1, title: "Hướng dẫn hiến máu an toàn", link: "#" },
    { id: 2, title: "Quy trình tiếp nhận máu", link: "#" },
    { id: 3, title: "Thông tin về nhóm máu", link: "#" },
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tài liệu</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ul className="list-disc list-inside space-y-3 text-blue-700">
          {documents.map(({ id, title, link }) => (
            <li key={id}>
              <a href={link} className="hover:underline" target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const ReportsPage = () => {
  const reports = [
    { id: 1, title: "Báo cáo hiến máu tháng 5/2025", date: "29/05/2025" },
    { id: 2, title: "Báo cáo nhu cầu máu khẩn cấp", date: "20/05/2025" },
  ];


  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Báo cáo</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ul className="divide-y divide-gray-200">
          {reports.map(({ id, title, date }) => (
            <li
              key={id}
              className="py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-semibold">{title}</span>
              <span className="text-gray-500 text-sm">{date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { path: "/", icon: FiHome, label: "Trang chủ" },
    { path: "/urgent-requests", icon: FiHeart, label: "Yêu cầu khẩn cấp" },
    { path: "/blood-process", icon: FiActivity, label: "Quy trình hiến máu" },
    { path: "/blood-storage", icon: FiDatabase, label: "Quản lý kho máu" },
    { path: "/donors", icon: FiUsers, label: "Người hiến máu" },
    { path: "/documents", icon: FiFileText, label: "Tài liệu" },
    { path: "/reports", icon: FiBarChart2, label: "Báo cáo" },
  ];


  return (
    <aside className={`bg-white shadow-lg ${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between">
        <h2 className={`text-red-600 font-bold ${!isSidebarOpen && "hidden"}`}>Quản lý Hiến máu</h2>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded">
          <FiMenu className="text-gray-600" />
        </button>
      </div>
      <nav className="mt-4 flex flex-col">
        {menuItems.map(({ path, icon: Icon, label }, index) => (
          <Link
            to={path}
            key={index}
            className="w-full flex items-center p-4 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Icon className="w-6 h-6" />
            {isSidebarOpen && <span className="ml-4">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/urgent-requests" element={<UrgentRequestsPage />} />
            <Route path="/blood-process" element={<BloodProcessPage />} />
            <Route path="/blood-storage" element={<BloodStoragePage />} />
            <Route path="/donors" element={<DonorsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};


export default Dashboard;



