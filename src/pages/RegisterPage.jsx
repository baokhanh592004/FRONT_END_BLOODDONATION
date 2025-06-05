import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function RegisterPage() {

    const navigate = useNavigate();
    const handleSwitchToLogin = () => {
        navigate('/login');
    }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState(null);


  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      alert(res.data.message || "Đăng ký thành công!");
      navigate("/login"); // Chuyển sang trang đăng nhập sau khi đăng ký xong
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="fullName"
          placeholder="Họ và tên"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          {/* Icon mắt có thể thêm sau nếu cần */}
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />
          {/* Icon mắt có thể thêm sau nếu cần */}
        </div>
        <input
          name="phone"
          type="tel"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>Đăng ký</button>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      </form>
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
