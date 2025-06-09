import React, { useEffect, useState } from 'react';
import {
  fetchAllUsers,
  updateUserById,
  updateUserRole,
  updateUserStatus,
  deleteUserById,
  createUser
} from '../api/userApi';



const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    role: '',
    status: ''
  });

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers();
      if (res.data.success) setUsers(res.data.data);
      else console.error(res.data.message);
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
      }); // reset
      loadUsers();
    } catch (err) {
      alert('Lỗi khi tạo người dùng!');
      console.error(err);
    }
  };

  const [isCreating, setIsCreating] = useState(false);

  return (

    <div style={{ padding: '20px' }}>
      <h2>Quản lý người dùng</h2>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Username</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.userId || index}>
              <td>{u.userId}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>{u.phoneNumber}</td>
              <td>
                <button
                  onClick={() => handleEditClick(u)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(editingUserId) && (
        <div style={{ marginTop: '20px' }}>
          <h3>Chỉnh sửa người dùng</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px' }}>
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
            <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Password mới" />
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Họ và tên" />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Số điện thoại" />

            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" />

            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="">-- Chọn vai trò --</option>
              <option value="Adnin">ADMIN</option>
              <option value="Staff">STAFF</option>
              <option value="Member">MEMBER</option>
              <option value="Guest">GUEST</option>
              <option value="TREATMENT_CENTER">TREATMENT_CENTER</option>
            </select>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleUpdateRole}>Cập nhật vai trò</button>
            <button onClick={handleUpdateStatus}>
              {formData.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </button>
            <button onClick={handleDeleteUser} style={{ color: 'red' }}>Xóa</button>
            <button onClick={() => setEditingUserId(null)}>Hủy</button>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

          </div>
        </div>
      )}
      {isCreating && (
        <div style={{ marginTop: '20px' }}>
          <h3>Tạo người dùng</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px' }}>
            <input name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
            <input name="password" value={formData.password} onChange={handleInputChange} placeholder="Password mới" />
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Họ và tên" />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Số điện thoại" />

            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" />

            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="">-- Chọn vai trò --</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
              <option value="MEMBER">MEMBER</option>
            </select>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          </div>
          <div>
            <button onClick={handleCreateUser}>Tạo</button>
            <button onClick={() => setIsCreating(false)}>Hủy</button>
          </div>
        </div>
      )}
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
        style={{
          marginBottom: '12px',
          padding: '8px 14px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        + Tạo người dùng mới
      </button>

    </div>
  );
};

export default UserManagement;
