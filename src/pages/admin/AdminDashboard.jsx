import React from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { BarChart3, UserCog, Trash2, FileText } from "lucide-react";

export default function AdminDashboard() {

    
  return (
    <div className="min-h-screen flex bg-gray-100">


      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <UserCog className="text-red-600" size={32} />
              <div>
                <h3 className="text-xl font-semibold">Tổng số người dùng</h3>
                <p className="text-gray-600">+1,240</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <FileText className="text-blue-600" size={32} />
              <div>
                <h3 className="text-xl font-semibold">Báo cáo chờ duyệt</h3>
                <p className="text-gray-600">12 báo cáo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Trash2 className="text-gray-700" size={32} />
              <div>
                <h3 className="text-xl font-semibold">Dữ liệu cần xoá</h3>
                <p className="text-gray-600">3 bản ghi</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Logs */}
        <div className="bg-white rounded shadow-md p-4">
          <h2 className="text-xl font-bold mb-2">Nhật ký hoạt động gần đây</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Thời gian</th>
                <th>Người dùng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">2025-06-22 14:32</td>
                <td>admin01</td>
                <td>Tạo tài khoản nhân viên</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">2025-06-21 10:15</td>
                <td>admin02</td>
                <td>Cập nhật quyền hạn member123</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
