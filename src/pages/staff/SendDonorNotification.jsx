import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function SendDonorNotification() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.');
      setLoading(false);
      return;
    }

    try {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axiosClient.post('/staff/notifications/broadcast', {
        title,
        message,
        type: 'DONATION_REQUEST',
      });

      setSuccess('Gửi thông báo thành công đến tất cả người dùng!');
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Token không hợp lệ hoặc bạn không có quyền thực hiện hành động này.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gửi thông báo kêu gọi hiến máu</h2>
      <p style={styles.subtitle}>Gửi một thông báo khẩn đến tất cả người hiến máu trong hệ thống.</p>
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

        {error && <p style={styles.errorText}>{error}</p>}
        {success && <p style={styles.successText}>{success}</p>}

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi thông báo'}
        </button>
      </form>
    </div>
  );
}

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
  title: { textAlign: 'center', color: '#333', marginBottom: '10px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' },
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
