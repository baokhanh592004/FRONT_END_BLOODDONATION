// src/components/SendDonorNotification.js

import React, { useState } from 'react';
import axios from 'axios';

export default function SendDonorNotification() {
  // State để lưu trữ tiêu đề và nội dung thông báo từ form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // State để quản lý trạng thái của việc gửi request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form submit và tải lại trang

    // Reset các thông báo cũ
    setError(null);
    setSuccess(null);
    setLoading(true);

    // 1. Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      setError('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    // 2. Chuẩn bị dữ liệu và headers cho request
    const notificationData = {
      title: title,
      message: message,
    };

    const config = {
      headers: {
        // Chuẩn 'Bearer' được sử dụng rộng rãi cho việc gửi JWT
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // 3. Gửi request đến API bằng axios
    try {
      // Gọi API POST đến endpoint broadcast
      await axios.post(
        'http://localhost:8080/api/staff/notifications/broadcast',
        notificationData,
        config
      );

      // Nếu thành công
      setSuccess('Gửi thông báo thành công đến tất cả người dùng!');
      // Xóa nội dung form sau khi gửi thành công
      setTitle('');
      setMessage('');

    } catch (err) {
      // Nếu có lỗi, lấy thông báo lỗi từ response của server hoặc một thông báo chung
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      
      // Xử lý trường hợp token không hợp lệ (thường là lỗi 401 hoặc 403)
      if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Token không hợp lệ hoặc bạn không có quyền thực hiện hành động này.');
      } else {
          setError(errorMessage);
      }

    } finally {
      // Dù thành công hay thất bại, cũng dừng trạng thái loading
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gửi thông báo khẩn</h2>
      <p style={styles.subtitle}>
        Gửi một thông báo đến tất cả người hiến máu trong hệ thống.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Tiêu đề</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Khẩn cấp: Cần máu nhóm O"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="message" style={styles.label}>Nội dung</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập nội dung chi tiết của thông báo..."
            style={styles.textarea}
            rows="5"
            required
          />
        </div>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p style={styles.errorText}>{error}</p>}

        {/* Hiển thị thông báo thành công nếu có */}
        {success && <p style={styles.successText}>{success}</p>}

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi thông báo'}
        </button>
      </form>
    </div>
  );
}

// Styles để giao diện trông gọn gàng, bạn có thể tùy chỉnh
const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: '20px',
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  submitBtn: {
    backgroundColor: '#d32f2f',
    color: 'white',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorText: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    border: '1px solid #d32f2f',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  successText: {
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    border: '1px solid #2e7d32',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};