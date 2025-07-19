import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../api/axiosClient";

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [bloodTypeMap, setBloodTypeMap] = useState({});
  const [componentTypeMap, setComponentTypeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // State để lưu giá trị nhập vào ô input cộng/trừ
  const [adjustmentValues, setAdjustmentValues] = useState({});

  // State để lưu các thay đổi đang chờ lưu (chưa gửi lên server)
  // Key là ID của hàng, value là số lượng MỚI đã được tính toán
  const [pendingUpdates, setPendingUpdates] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem thông tin kho máu.');
        setLoading(false);
        return;
      }

      try {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const [bloodTypesRes, componentTypesRes, inventoryRes] = await Promise.all([
          axiosClient.get('/blood-types'),
          axiosClient.get('/component-types'),
          axiosClient.get('/staff/blood-inventory'),
        ]);

        const bloodMap = bloodTypesRes.data.reduce((map, item) => {
          map[item.id] = item.type;
          return map;
        }, {});

        const componentMap = componentTypesRes.data.reduce((map, item) => {
          map[item.id] = item.name.split(',')[0].trim();
          return map;
        }, {});

        setBloodTypeMap(bloodMap);
        setComponentTypeMap(componentMap);
        setInventory(inventoryRes.data);

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Không thể tải dữ liệu từ server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Hàm gốc để thực hiện gọi API cập nhật
  const handleUpdateUnits = async (bloodTypeId, componentTypeId, newUnits) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập.');
      throw new Error("Chưa đăng nhập");
    }
    const finalUnits = Math.max(0, Number(newUnits));

    try {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axiosClient.post('/staff/blood-inventory/update', {
        id: { bloodTypeId, componentTypeId },
        unitsAvailable: finalUnits,
      });

      const updatedItem = res.data;
      setInventory((prev) => {
        const exists = prev.some((inv) => inv.id.bloodTypeId === bloodTypeId && inv.id.componentTypeId === componentTypeId);
        if (exists) {
          return prev.map((inv) =>
            inv.id.bloodTypeId === bloodTypeId && inv.id.componentTypeId === componentTypeId ? updatedItem : inv
          );
        } else {
          return [...prev, updatedItem];
        }
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi khi cập nhật kho máu.');
      throw err; // Ném lỗi để hàm gọi có thể xử lý
    }
  };

  // Hàm xử lý khi giá trị trong ô input cộng/trừ thay đổi
  const handleAdjustmentChange = (key, value) => {
    const numericValue = value === '' ? '' : parseInt(value, 10);
    if (isNaN(numericValue) && value !== '') return;
    setAdjustmentValues((prev) => ({ ...prev, [key]: numericValue }));
  };

  // Hàm xử lý nút +/-: Chỉ cập nhật state ở client
  const handleAdjustUnits = (item, operation) => {
    const key = `${item.id.bloodTypeId}-${item.id.componentTypeId}`;
    const adjustmentValue = Number(adjustmentValues[key] || 0);

    if (adjustmentValue <= 0) {
      alert('Vui lòng nhập một số lượng dương để cộng hoặc trừ.');
      return;
    }

    const currentUnits = pendingUpdates[key] !== undefined ? pendingUpdates[key] : item.unitsAvailable;
    
    let newTotal;
    if (operation === 'add') {
      newTotal = currentUnits + adjustmentValue;
    } else {
      newTotal = currentUnits - adjustmentValue;
    }

    setPendingUpdates(prev => ({
      ...prev,
      [key]: Math.max(0, newTotal), // Đảm bảo không âm
    }));

    handleAdjustmentChange(key, '');
  };

  // Hàm xử lý khi nhấn nút "Lưu"
  const handleSaveUpdate = async (item) => {
    const key = `${item.id.bloodTypeId}-${item.id.componentTypeId}`;
    const newUnits = pendingUpdates[key];

    if (newUnits === undefined) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }
    
    try {
      await handleUpdateUnits(item.id.bloodTypeId, item.id.componentTypeId, newUnits);
      alert('Lưu thành công!');

      // Xóa thay đổi đang chờ cho hàng này sau khi lưu thành công
      setPendingUpdates(prev => {
        const newPending = { ...prev };
        delete newPending[key];
        return newPending;
      });
    } catch (error) {
      console.log("Lưu thất bại.");
    }
  };

  // Hàm xử lý khi nhấn nút "Hủy"
  const handleCancelUpdate = (item) => {
    const key = `${item.id.bloodTypeId}-${item.id.componentTypeId}`;
    
    // Xóa thay đổi đang chờ cho hàng này
    setPendingUpdates(prev => {
      const newPending = { ...prev };
      delete newPending[key];
      return newPending;
    });

    // Cũng xóa giá trị trong ô input +/-
    handleAdjustmentChange(key, '');
  };

  // ----- PHẦN HIỂN THỊ (RENDER) -----

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
          onClick={() => {
            setEditMode((prev) => !prev);
            // Khi thoát khỏi chế độ edit, xóa hết các thay đổi đang chờ
            if (editMode) {
              setPendingUpdates({});
              setAdjustmentValues({});
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {editMode ? 'Chế độ xem' : 'Cập nhật kho máu'}
        </button>
      </div>

      {editMode && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Thêm mới / Cập nhật trực tiếp</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const bloodTypeId = Number(e.target.bloodType.value);
              const componentTypeId = Number(e.target.componentType.value);
              const units = Number(e.target.units.value);
              try {
                await handleUpdateUnits(bloodTypeId, componentTypeId, units);
                alert('Thêm mới/cập nhật thành công!');
                e.target.reset();
              } catch (error) {
                // Lỗi đã được xử lý trong `handleUpdateUnits`
              }
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
              Thêm/Cập nhật
            </button>
          </form>
        </div>
      )}

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
                const itemKey = `${item.id.bloodTypeId}-${item.id.componentTypeId}`;
                const hasPendingUpdate = pendingUpdates[itemKey] !== undefined;
                const displayUnits = hasPendingUpdate ? pendingUpdates[itemKey] : item.unitsAvailable;
                const status = displayUnits < 100 ? 'Thiếu' : 'Đủ';
                const rowClass = status === 'Thiếu' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50';

                return (
                  <tr key={itemKey} className={rowClass}>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {bloodTypeMap[item.id.bloodTypeId] || `ID: ${item.id.bloodTypeId}`}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {componentTypeMap[item.id.componentTypeId] || `ID: ${item.id.componentTypeId}`}
                    </td>
                    <td className="px-6 py-4">
                      {editMode ? (
                        <div className="flex items-center gap-2">
                           <span
                            className={`font-mono w-16 text-right ${hasPendingUpdate ? 'text-blue-600 font-bold' : ''}`}
                            title={hasPendingUpdate ? `Thay đổi đang chờ: ${displayUnits}` : `Số lượng hiện tại: ${displayUnits}`}
                          >
                            {displayUnits}
                          </span>
                          <input
                            type="text" // Dùng text để cho phép rỗng và dễ dàng kiểm soát
                            value={adjustmentValues[itemKey] || ''}
                            onChange={(e) => handleAdjustmentChange(itemKey, e.target.value)}
                            className="w-20 border rounded px-2 py-1 text-right"
                            placeholder="+/-"
                          />
                          <button onClick={() => handleAdjustUnits(item, 'add')} className="bg-green-500 hover:bg-green-600 text-white font-bold w-6 h-6 rounded flex-shrink-0" title="Cộng">+</button>
                          <button onClick={() => handleAdjustUnits(item, 'subtract')} className="bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded flex-shrink-0" title="Trừ">-</button>
                          
                          <button
                            onClick={() => handleSaveUpdate(item)}
                            disabled={!hasPendingUpdate}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => handleCancelUpdate(item)}
                            disabled={!hasPendingUpdate}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono">{displayUnits}</span>
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