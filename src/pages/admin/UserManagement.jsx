import React, { useEffect, useState } from 'react';
import {
  fetchAllUsers,
  updateUserById,
  updateUserRole,
  updateUserStatus,
  deleteUserById,
  createUser
} from '../../api/userApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    role: '',
    status: 'ACTIVE'
  });

const loadUsers = async () => {
  try {
    const res = await fetchAllUsers();
    console.log('Dữ liệu nhận được từ API:', res); // Kiểm tra toàn bộ dữ liệu trả về
    
    // Kiểm tra xem res có dữ liệu đúng không
    if (res && res.data && res.data.success) {
      setUsers(res.data.data); // Cập nhật dữ liệu người dùng
    } else {
      console.error('Lỗi API:', res?.data?.message || 'Không có thông báo lỗi');
    }
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
  }
};

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.userId);
    setFormData({
      username: user.username,
      password: 'Password@123',
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      address: user.address,
      role: user.role,
      status: user.status
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUserById(editingUserId, formData);
      alert('Cập nhật thông tin thành công!');
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      alert('Lỗi khi cập nhật thông tin!');
      console.error(err);
    }
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole(editingUserId, formData.role);
      alert('Cập nhật vai trò thành công!');
      loadUsers();
    } catch (err) {
      alert('Lỗi khi cập nhật vai trò!');
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const newStatus = formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateUserStatus(editingUserId, newStatus);
      alert(`Trạng thái đã được cập nhật thành ${newStatus}`);
      setFormData({ ...formData, status: newStatus });
      loadUsers();
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái!');
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await deleteUserById(editingUserId);
        alert('Xóa người dùng thành công!');
        setEditingUserId(null);
        loadUsers();
      } catch (err) {
        alert('Lỗi khi xóa người dùng!');
        console.error(err);
      }
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(formData);
      alert('Tạo người dùng thành công!');
      setIsCreating(false);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        address: '',
        role: '',
        status: 'ACTIVE'
      });
      loadUsers();
    } catch (err) {
      alert('Lỗi khi tạo người dùng!');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

      <button
        onClick={() => {
          setIsCreating(true);
          setEditingUserId(null);
          setFormData({
            username: '',
            password: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            gender: '',
            address: '',
            role: '',
            status: 'ACTIVE'
          });
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Tạo người dùng mới
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Họ tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Giới tính</th>
              <th className="px-4 py-2 border">Vai trò</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Điện thoại</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.userId || index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-sm">{u.userId}</td>
                <td className="px-4 py-2 border text-sm">{u.fullName}</td>
                <td className="px-4 py-2 border text-sm">{u.email}</td>
                <td className="px-4 py-2 border text-sm">{u.username}</td>
                <td className="px-4 py-2 border text-sm">{u.gender}</td>
                <td className="px-4 py-2 border text-sm">{u.role}</td>
                <td className="px-4 py-2 border text-sm">{u.status}</td>
                <td className="px-4 py-2 border text-sm">{u.phoneNumber}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingUserId || isCreating) && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">{isCreating ? 'Tạo người dùng' : 'Chỉnh sửa người dùng'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="border px-3 py-2 rounded" />
            <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Password mới" className="border px-3 py-2 rounded" />
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Họ và tên" className="border px-3 py-2 rounded" />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border px-3 py-2 rounded" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Số điện thoại" className="border px-3 py-2 rounded" />
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="border px-3 py-2 rounded">
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              
            </select>
            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" className="border px-3 py-2 rounded" />
            <select name="role" value={formData.role} onChange={handleInputChange} className="border px-3 py-2 rounded">
              <option value="">-- Chọn vai trò --</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>  
              <option value="MEMBER">MEMBER</option>
              <option value="GUEST">GUEST</option>
              <option value="CENTER">CENTER</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {isCreating ? (
              <>
                <button onClick={handleCreateUser} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Tạo</button>
                <button onClick={() => setIsCreating(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lưu</button>
                <button onClick={handleUpdateRole} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Cập nhật vai trò</button>
                <button onClick={handleUpdateStatus} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                  {formData.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </button>
                <button onClick={handleDeleteUser} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Xóa</button>
                <button onClick={() => setEditingUserId(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Hủy</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;