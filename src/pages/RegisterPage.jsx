import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import heartImage from '../assets/a.jpg';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Password confirmation does not match!");
      return;
    }

    try {
      const res = await axiosClient.post("/auth/register", formData);
      setSuccess(res.data);
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });
    } catch (err) {
      setError(err.response?.data || "Registration failed.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.backgroundImage }} />
      <div style={styles.topRightText}>
        🩸<span style={{ color: '#C21310', fontWeight: 'bold' }}>Trung tâm</span><span style={{ color: '#000000' }}> Hiến Máu</span>
      </div>
      <div style={styles.description}>
        <h1>Một giọt máu – Ngàn hy vọng</h1>
      </div>

      <div style={styles.registerBox}>
        <h2 style={styles.title}>Đăng ký tài khoản</h2>
        <h3 style={styles.title1}> Kết nối và chia sẻ những điều hạnh phúc</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
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
          <input
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.submitBtn}>Đăng ký</button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
        {success && <p style={{ color: "green", marginTop: 10 }}>{success.message}</p>}

        <p style={styles.switchText}>
          Đã có tài khoản?{" "}
          <span style={styles.switchLink} onClick={handleSwitchToLogin}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: 320,
    margin: "auto",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 0 10px #ddd",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "white",
  },
  backgroundImage: {
    position: 'absolute', // dùng fixed để đảm bảo luôn phủ toàn màn hình
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundImage: `url(${heartImage})`,
    backgroundSize: '100% 100%',  // bạn muốn giữ nguyên hình không bị crop
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: 0,
    borderradius: '10px',

  },
  registerBox: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translateY(-50%)',
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255)',
    padding: 40,
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: { textAlign: "center", marginTop: 0, fontWeight: "bold", fontSize: 22, color: "#121212" },
  title1: { textAlign: "center", marginTop: 5, marginBottom: 20, fontWeight: "bold", fontSize: 22, color: "#7C7D80" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 5,
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
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
  switchText: { marginTop: 15, color: "#d32f2f" },
  switchLink: { fontWeight: "bold", cursor: "pointer" },

  topRightText: {
    position: 'absolute',
    top: 310,
    left: 95,
    fontSize: 50,
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: 8,
    zIndex: 2,
  },
  description: {
    position: 'absolute',
    top: 370,
    left: 160,
    fontSize: 35,
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: 8,
    zIndex: 2,
  },

};
