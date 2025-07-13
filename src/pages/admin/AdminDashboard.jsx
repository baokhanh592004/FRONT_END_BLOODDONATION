import React, { useState, useEffect } from "react";
import axios from "../../api/axiosClient";
import { Card, CardContent } from "../../components/ui/Card";
import { Users, Droplet, Clock, FileCheck, FileClock } from "lucide-react";
import { BarChart, Bar, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- Component StatCard (giữ nguyên) ---
const StatCard = ({ icon, title, value, color }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-4">
      {React.cloneElement(icon, { className: `text-${color}`, size: 40 })}
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value !== null ? value : "..."}</p>
      </div>
    </CardContent>
  </Card>
);

// --- Component Biểu đồ Chung ---
const MonthlyBarChart = ({ endpoint, title, barName, barColor }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get(endpoint)
            .then(res => setData(res.data))
            .catch(err => console.error(`Lỗi tải biểu đồ từ ${endpoint}:`, err));
    }, [endpoint]);

    return (
        <div className="bg-white rounded shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={barColor} name={barName}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- Component AdminDashboard chính (cập nhật) ---
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải dữ liệu dashboard:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><p>Đang tải dữ liệu...</p></div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-full"><p className="text-red-500">{error}</p></div>;
  }
  
  return (
    <div className="flex-1 p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống</p>
      </header>
{/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<Users />} title="Tổng người dùng" value={stats.totalUsers} color="blue-600"/>
        <StatCard icon={<Droplet />} title="Tổng lượt hiến máu" value={stats.totalBloodDonations} color="red-600"/>
        <StatCard icon={<Clock />} title="Lịch hẹn hôm nay" value={stats.appointmentsToday} color="green-600"/>
        <StatCard icon={<FileClock />} title="Yêu cầu chờ duyệt" value={stats.pendingBloodRequests} color="yellow-600"/>
        <StatCard icon={<FileCheck />} title="Yêu cầu hoàn thành" value={stats.completedBloodRequests} color="indigo-600"/>
      </div>
      
      {/* Vùng hiển thị biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyBarChart 
            endpoint="/admin/dashboard/donations-by-month"
            title="Lượt hiến máu (6 tháng qua)"
            barName="Số lượt hiến"
            barColor="#ef4444" // red
        />
        <MonthlyBarChart 
            endpoint="/admin/dashboard/requests-by-month"
            title="Lượt yêu cầu máu (6 tháng qua)"
            barName="Số lượt yêu cầu"
            barColor="#3b82f6" // blue
        />
      </div>

    </div>
  );
}