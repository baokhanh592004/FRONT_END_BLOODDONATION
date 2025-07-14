import React, { useState } from "react";
import axios from "axios";

// Thêm một icon nhỏ để trang trí cho phần upload file
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={{ marginRight: 8 }}
  >
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
  </svg>
);

export default function BlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "BLOG",
    image: null,
  });
  const [isHovered, setIsHovered] = useState(false); // State cho hiệu ứng hover của button

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn cần đăng nhập");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("type", formData.type);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await axios.post("http://localhost:8080/api/blog/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Tạo bài viết thành công!");
      setFormData({ title: "", content: "", type: "BLOG", image: null });
      // Xóa input file sau khi submit
      document.getElementById("image-input").value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo bài viết");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.header}>Tạo Bài Viết Mới</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Tiêu đề</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Nhập tiêu đề bài viết..."
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="content" style={styles.label}>Nội dung</label>
            <textarea
              id="content"
              name="content"
              placeholder="Soạn thảo nội dung của bạn tại đây..."
              value={formData.content}
              onChange={handleChange}
              required
              rows={8}
              style={{ ...styles.input, resize: "vertical", height: 'auto' }}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="type" style={styles.label}>Thể loại</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="BLOG">BLOG</option>
              <option value="NEWS">NEWS</option>
              <option value="GUIDE">GUIDE</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="image" style={styles.label}>Ảnh bìa</label>
            {/* Custom File Input */}
            <label htmlFor="image-input" style={styles.fileInputLabel}>
              <UploadIcon />
              <span>{formData.image ? formData.image.name : "Chọn một tệp ảnh"}</span>
            </label>
            <input
              id="image-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={styles.fileInput} // Ẩn input mặc định
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...(isHovered ? styles.buttonHover : null) }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Đăng Bài
          </button>
        </form>
        {message && <div style={{...styles.alert, ...styles.alertSuccess}}>{message}</div>}
        {error && <div style={{...styles.alert, ...styles.alertError}}>{error}</div>}
      </div>
    </div>
  );
}

const colors = {
    primary: '#d32f2f', // Một màu đỏ đậm hơn, chuyên nghiệp hơn
    primaryLight: '#e57373',
    background: '#f7f7f7',
    text: '#333',
    textLight: '#555',
    border: '#ddd',
    success: '#2e7d32',
    error: '#d32f2f',
};

const styles = {
  pageContainer: {
    backgroundColor: colors.background,
    padding: '40px 20px',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    maxWidth: 700,
    margin: "0 auto",
    padding: '30px',
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    color: colors.primary,
    fontSize: '28px',
    fontWeight: 700,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontWeight: 600,
    color: colors.textLight,
    fontSize: '14px',
  },
  input: {
    padding: "12px 15px",
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    fontSize: 16,
    color: colors.text,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  // Custom style cho file input
  fileInput: {
    display: 'none', // Ẩn đi input file gốc
  },
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: "12px 15px",
    backgroundColor: '#fff',
    border: `2px dashed ${colors.border}`,
    borderRadius: 8,
    cursor: 'pointer',
    color: colors.textLight,
    transition: 'border-color 0.2s, color 0.2s',
  },
  // Nút submit chính
  button: {
    backgroundColor: colors.primary,
    color: "white",
    padding: '15px',
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: 10,
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonHover: {
    backgroundColor: colors.primaryLight,
    transform: 'translateY(-2px)',
  },
  // Styles cho các thông báo
  alert: {
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    border: '1px solid transparent',
    textAlign: 'center',
    fontWeight: 500,
  },
  alertSuccess: {
    backgroundColor: '#e8f5e9',
    color: colors.success,
    borderColor: '#c8e6c9',
  },
  alertError: {
    backgroundColor: '#ffebee',
    color: colors.error,
    borderColor: '#ffcdd2',
  },
};