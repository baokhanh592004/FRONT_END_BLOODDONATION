// src/pages/BloodInventoryPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypeMap, setBloodTypeMap] = useState({});
  const [componentTypeMap, setComponentTypeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem thông tin kho máu.');
        setLoading(false);
        return;
      }

      try {
        const [bloodTypesRes, componentTypesRes, inventoryRes] = await Promise.all([
          axiosClient.get('/blood-types'),
          axiosClient.get('/component-types'),
          axiosClient.get('/admin/blood-inventory'),
        ]);

        const bloodTypesData = bloodTypesRes.data;
        const componentTypesData = componentTypesRes.data;
        const inventoryData = inventoryRes.data;

        const bloodMap = bloodTypesData.reduce((map, item) => {
          map[item.id] = item.type;
          return map;
        }, {});

        const componentMap = componentTypesData.reduce((map, item) => {
          map[item.id] = item.name.split(',')[0].trim();
          return map;
        }, {});

        setBloodTypeMap(bloodMap);
        setComponentTypeMap(componentMap);
        setInventory(inventoryData);

      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu.');
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-lg">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 font-bold mb-4">Lỗi: {error}</p>
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
