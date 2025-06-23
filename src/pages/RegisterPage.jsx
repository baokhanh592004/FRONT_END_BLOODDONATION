import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
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
      const res = await axios.post("http://localhost:8080/api/auth/register", formData);
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
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký tài khoản</h2>
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
        <input
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>Đăng ký</button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

      <p style={styles.switchText}>
        Đã có tài khoản?{" "}
        <span style={styles.switchLink} onClick={handleSwitchToLogin}>
          Đăng nhập
        </span>
      </p>
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
  title: { marginBottom: 20, fontWeight: "bold", fontSize: 22, color: "#121212" },
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
};
