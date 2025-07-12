import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypeMap, setBloodTypeMap] = useState({});
  const [componentTypeMap, setComponentTypeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // ⬅️ Trạng thái xem / cập nhật

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem thông tin kho máu.');
        setLoading(false);
        return;
      }

      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [bloodTypesRes, componentTypesRes, inventoryRes] = await Promise.all([
          fetch('http://localhost:8080/api/blood-types', { headers }),
          fetch('http://localhost:8080/api/component-types', { headers }),
          fetch('http://localhost:8080/api/staff/blood-inventory', { headers }),
        ]);

        if (!bloodTypesRes.ok || !componentTypesRes.ok || !inventoryRes.ok) {
          throw new Error('Không thể tải toàn bộ dữ liệu cần thiết từ server.');
        }

        const bloodTypesData = await bloodTypesRes.json();
        const componentTypesData = await componentTypesRes.json();
        const inventoryData = await inventoryRes.json();

        const bloodMap = bloodTypesData.reduce((map, item) => {
          map[item.id] = item.type;
          return map;
        }, {});

        const componentMap = componentTypesData.reduce((map, item) => {
          map[item.id] = item.description.split(',')[0].trim();
          return map;
        }, {});

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

  const handleUpdateUnits = async (bloodTypeId, componentTypeId, newUnits) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/staff/blood-inventory/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: {
            bloodTypeId,
            componentTypeId,
          },
          unitsAvailable: Number(newUnits),
        }),
      });

      if (!res.ok) throw new Error('Cập nhật thất bại');

      const updatedItem = await res.json();

      setInventory((prev) => {
        const exists = prev.some(
          (inv) =>
            inv.id.bloodTypeId === bloodTypeId &&
            inv.id.componentTypeId === componentTypeId
        );

        if (exists) {
          return prev.map((inv) =>
            inv.id.bloodTypeId === bloodTypeId && inv.id.componentTypeId === componentTypeId
              ? updatedItem
              : inv
          );
        } else {
          return [...prev, updatedItem];
        }
      });

      alert('Cập nhật thành công!');
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi cập nhật kho máu.');
    }
  };

  if (loading) return <div className="text-center p-8 text-lg">Đang tải dữ liệu...</div>;

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý kho máu</h1>
          <p className="text-gray-600">Dữ liệu được cập nhật tự động từ hệ thống.</p>
        </div>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {editMode ? 'Chế độ xem' : 'Cập nhật kho máu'}
        </button>
      </div>

      {/* FORM THÊM MỚI */}
      {editMode && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Thêm mới vào kho máu</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const bloodTypeId = Number(e.target.bloodType.value);
              const componentTypeId = Number(e.target.componentType.value);
              const units = Number(e.target.units.value);
              await handleUpdateUnits(bloodTypeId, componentTypeId, units);
              e.target.reset();
            }}
            className="flex flex-wrap gap-4 items-center"
          >
            <select name="bloodType" required className="border rounded px-3 py-2">
              <option value="">Chọn nhóm máu</option>
              {Object.entries(bloodTypeMap).map(([id, type]) => (
                <option key={id} value={id}>{type}</option>
              ))}
            </select>

            <select name="componentType" required className="border rounded px-3 py-2">
              <option value="">Chọn thành phần máu</option>
              {Object.entries(componentTypeMap).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            <input
              type="number"
              name="units"
              required
              min="0"
              placeholder="Số lượng"
              className="border rounded px-3 py-2 w-32"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Thêm vào kho máu
            </button>
          </form>
        </div>
      )}

      {/* BẢNG DỮ LIỆU */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Nhóm máu</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Thành phần</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Số lượng (đơn vị)</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const status = item.unitsAvailable < 100 ? 'Thiếu' : 'Đủ';
                const rowClass = status === 'Thiếu' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50';
                const inputName = `units-${item.id.bloodTypeId}-${item.id.componentTypeId}`;

                return (
                  <tr key={`${item.id.bloodTypeId}-${item.id.componentTypeId}`} className={rowClass}>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {bloodTypeMap[item.id.bloodTypeId] || `Unknown (ID: ${item.id.bloodTypeId})`}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {componentTypeMap[item.id.componentTypeId] || `Unknown (ID: ${item.id.componentTypeId})`}
                    </td>
                    <td className="px-6 py-4">
                      {editMode ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const newUnits = e.target.elements[inputName].value;
                            handleUpdateUnits(item.id.bloodTypeId, item.id.componentTypeId, newUnits);
                          }}
                          className="flex gap-2 items-center"
                        >
                          <input
                            type="number"
                            name={inputName}
                            defaultValue={item.unitsAvailable}
                            className="w-16 border rounded px-2 py-1 text-right"
                            min={0}
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Cập nhật
                          </button>
                        </form>
                      ) : (
                        <span className="font-mono">{item.unitsAvailable}</span>
                      )}
                    </td>
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
