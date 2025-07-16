import React, { useEffect, useState } from 'react';
import {
  fetchAllUsers,
  updateUserById,
  updateUserRole,
  updateUserStatus,
  deleteUserById,
  createUser,
} from '../../api/userApi';

const PAGE_SIZE = 10;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    role: '',
    status: 'Active',
  });

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers();
      if (res?.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const currentUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.userId);
    setIsCreating(false);
    setFormData({
      username: user.username,
      password: 'Password@123',
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      address: user.address,
      role: user.role,
      status: user.status,
    });
    setShowFormModal(true);
  };

  const handleSave = async () => {
    try {
      await updateUserById(editingUserId, formData);
      alert('Đã cập nhật thành công!');
      setShowFormModal(false);
      loadUsers();
    } catch (err) {
      alert('Lỗi cập nhật!');
      console.error(err);
    }
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole(editingUserId, formData.role);
      alert('Đã cập nhật vai trò!');
      loadUsers();
    } catch (err) {
      alert('Lỗi cập nhật vai trò!');
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    const newStatus = formData.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUserStatus(editingUserId, newStatus);
      setFormData((prev) => ({ ...prev, status: newStatus }));
      alert('Đã cập nhật trạng thái!');
      loadUsers();
    } catch (err) {
      alert('Lỗi cập nhật trạng thái!');
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUserById(editingUserId);
        alert('Xóa thành công!');
        setShowFormModal(false);
        loadUsers();
      } catch (err) {
        alert('Lỗi khi xóa người dùng!');
        console.error(err);
      }
    }
  };

  const handleCreate = async () => {
    try {
      await createUser(formData);
      alert('Tạo người dùng thành công!');
      setShowFormModal(false);
      loadUsers();
    } catch (err) {
      alert('Lỗi tạo người dùng!');
      console.error(err);
    }
  };

  const handleNewUserClick = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      address: '',
      role: '',
      status: 'Active',
    });
    setIsCreating(true);
    setEditingUserId(null);
    setShowFormModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Quản lý người dùng</h2>

      <button
        onClick={handleNewUserClick}
        className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        + Tạo người dùng mới
      </button>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Họ tên</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Giới tính</th>
              <th className="py-2 px-4 text-left">Vai trò</th>
              <th className="py-2 px-4 text-left">Trạng thái</th>
              <th className="py-2 px-4 text-left">Điện thoại</th>
              <th className="py-2 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentUsers.map((user) => (
              <tr key={user.userId} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{user.userId}</td>
                <td className="py-2 px-4">{user.fullName}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.gender}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.status}</td>
                <td className="py-2 px-4">{user.phoneNumber}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {isCreating ? 'Tạo người dùng' : 'Chỉnh sửa người dùng'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Tên tài khoản" className="border p-2 rounded" />
              <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Mật khẩu" className="border p-2 rounded" />
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Họ và tên" className="border p-2 rounded" />
              <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border p-2 rounded" />
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Số điện thoại" className="border p-2 rounded" />
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="border p-2 rounded">
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" className="border p-2 rounded" />
              <select name="role" value={formData.role} onChange={handleInputChange} className="border p-2 rounded">
                <option value="">-- Chọn vai trò --</option>
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="MEMBER">MEMBER</option>
                <option value="GUEST">GUEST</option>
                <option value="TREATMENT_CENTER">TREATMENT_CENTER</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {isCreating ? (
                <>
                  <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Tạo</button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Lưu</button>
                  <button onClick={handleUpdateRole} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Cập nhật vai trò</button>
                  <button onClick={handleUpdateStatus} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    {formData.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  </button>
                  <button onClick={handleDeleteUser} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Xóa</button>
                </>
              )}
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setIsCreating(false);
                  setEditingUserId(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
