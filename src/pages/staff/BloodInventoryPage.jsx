import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link để tạo nút đăng nhập

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypeMap, setBloodTypeMap] = useState({});
  const [componentTypeMap, setComponentTypeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      // Lấy token từ localStorage mà trang Login đã lưu
      const token = localStorage.getItem('token');

      // Nếu chưa đăng nhập, hiển thị lỗi và không làm gì thêm
      if (!token) {
        setError('Bạn cần đăng nhập để xem thông tin kho máu.');
        setLoading(false);
        return;
      }

      try {
        // Tạo headers chứa token để tái sử dụng
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // GỌI ĐỒNG THỜI CẢ 3 API ĐỂ TĂNG TỐC ĐỘ
        const [bloodTypesRes, componentTypesRes, inventoryRes] = await Promise.all([
          fetch('http://localhost:8080/api/blood-types', { headers }),
          fetch('http://localhost:8080/api/component-types', { headers }),
          fetch('http://localhost:8080/api/staff/blood-inventory', { headers }),
        ]);
        
        // Kiểm tra nếu bất kỳ API nào thất bại
        if (!bloodTypesRes.ok || !componentTypesRes.ok || !inventoryRes.ok) {
            // Bạn có thể thêm logic để kiểm tra từng response và đưa ra lỗi cụ thể hơn
            throw new Error('Không thể tải toàn bộ dữ liệu cần thiết từ server.');
        }

        // Chuyển đổi response thành JSON
        const bloodTypesData = await bloodTypesRes.json();
        const componentTypesData = await componentTypesRes.json();
        const inventoryData = await inventoryRes.json();

        // XỬ LÝ DỮ LIỆU ĐỂ TẠO MAP "DỊCH" ID -> TÊN
        // Tạo map cho Nhóm Máu (ví dụ: {1: "A+", 2: "A-"})
        const bloodMap = bloodTypesData.reduce((map, item) => {
          map[item.id] = item.type;
          return map;
        }, {});

        // Tạo map cho Thành Phần Máu (ví dụ: {1: "Máu toàn phần", 2: "Huyết tương"})
        const componentMap = componentTypesData.reduce((map, item) => {
          // Lấy phần tên tiếng Việt từ trường description cho dễ đọc
          map[item.id] = item.description.split(',')[0].trim();
          return map;
        }, {});
        
        // CẬP NHẬT STATE VỚI DỮ LIỆU ĐÃ XỬ LÝ
        setBloodTypeMap(bloodMap);
        setComponentTypeMap(componentMap);
        setInventory(inventoryData);

      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Giao diện khi đang tải
  if (loading) {
    return <div className="text-center p-8 text-lg">Đang tải dữ liệu...</div>;
  }

  // Giao diện khi có lỗi
  if (error) {
    return (
        <div className="text-center p-8">
            <p className="text-red-600 font-bold mb-4">Lỗi: {error}</p>
            {/* Nếu lỗi do chưa đăng nhập, hiện nút đăng nhập */}
            {!localStorage.getItem('token') && (
                <Link 
                    to="/login" 
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                    Đi đến trang đăng nhập
                </Link>
            )}
        </div>
    );
  }

  // Giao diện chính
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Quản lý kho máu</h1>
      <p className="text-gray-600 mb-6">Dữ liệu được cập nhật tự động từ hệ thống.</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Thành phần</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Số lượng (đơn vị)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Cập nhật lần cuối</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const status = item.unitsAvailable < 100 ? 'Thiếu' : 'Đủ';
                const rowClass = status === 'Thiếu' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50';

                return (
                  <tr key={`${item.id.bloodTypeId}-${item.id.componentTypeId}`} className={rowClass}>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {bloodTypeMap[item.id.bloodTypeId] || `Unknown (ID: ${item.id.bloodTypeId})`}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {componentTypeMap[item.id.componentTypeId] || `Unknown (ID: ${item.id.componentTypeId})`}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-mono">{item.unitsAvailable}</td>
                    <td className={`px-6 py-4 font-semibold ${status === 'Thiếu' ? 'text-red-600' : 'text-green-600'}`}>
                      {status}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.updatedAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Không có dữ liệu trong kho máu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodInventoryPage;