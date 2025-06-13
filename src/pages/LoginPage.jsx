import React, { useState } from "react";
import axios from "axios";
// Import thêm useNavigate và Link để xử lý sau khi đăng nhập
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  // Khởi tạo hook useNavigate để chuyển trang
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    remember: true,
  });

  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      // BƯỚC 1: GỬI ĐI - Phần này của bạn đã đúng
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        login: formData.login,
        password: formData.password,
      });

      // BƯỚC 2: XỬ LÝ VÀ LƯU PHẢN HỒI - Đây là phần quan trọng cần thêm vào
      // ======================================================================
      // Giả định backend trả về object có chứa 'user' và 'token'
      if (res.data && res.data.user && res.data.token) {
        // 2.1. Lưu thông tin người dùng vào localStorage.
        // Header sẽ đọc key 'user' này.
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // 2.2. Lưu token để dùng cho các yêu cầu xác thực sau này.
        localStorage.setItem("token", res.data.token);

        // 2.3. Chuyển hướng người dùng về trang chủ.
        navigate("/");

        // (Tùy chọn) Reload lại trang để đảm bảo mọi component (như Header) đều cập nhật.
        // Thường không cần thiết nhưng hữu ích trong một số trường hợp.
        // window.location.reload(); 
        
      } else {
        // Nếu backend trả về thành công nhưng cấu trúc dữ liệu không đúng
        setError("Dữ liệu đăng nhập trả về không hợp lệ.");
      }
      // ======================================================================

    } catch (err) {
      // Xử lý lỗi từ server (sai mật khẩu, user không tồn tại...)
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    }
  };

  // Phần JSX (giao diện) giữ nguyên như cũ, nó đã tốt rồi.
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="login"
          type="text"
          placeholder="Tên đăng nhập hoặc email"
          value={formData.login}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <label style={styles.label}>
          <input
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
          />{" "}
          Ghi nhớ đăng nhập
        </label>
        <button type="submit" style={styles.submitBtn}>Đăng nhập</button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10, textAlign: 'center' }}>{error}</p>}

      <p style={styles.switchText}>
        Chưa có tài khoản?{" "}
        <Link to="/register" style={styles.switchLink}>
          Đăng ký
        </Link>
      </p>
      <Link to="/forgot-password" style={styles.forgotLink}>
        Quên mật khẩu?
      </Link>
    </div>
  );
}

// Giữ nguyên styles, chỉ thêm style cho link quên mật khẩu
const styles = {
  container: {
    width: 320,
    margin: "auto",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px #ddd",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "white",
  },
  title: { marginBottom: 20, fontWeight: "bold", fontSize: 22, textAlign: "center", color: "#121212" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: "#d32f2f",
    color: "white",
    padding: 12,
    fontWeight: "bold",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
  },
  switchText: { marginTop: 20, color: "#121212", textAlign: "center" }, // Đổi màu cho dễ đọc
  switchLink: { fontWeight: "bold", cursor: "pointer", color: "#d32f2f", textDecoration: 'none' },
  forgotLink: { 
    display: 'block', // Để nó xuống dòng và căn giữa
    textAlign: 'center', 
    marginTop: 10, 
    cursor: "pointer", 
    color: "#d32f2f",
    textDecoration: 'none'
  },
};