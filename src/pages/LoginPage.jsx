import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    remember: true,
  });

  const [error, setError] = useState(null);

  const handleSwitchToRegister = () => {
    navigate("/register");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
const res = await api.post("/api/auth/login", {
  login: formData.login,
  password: formData.password,
});

      const { success, token, user, message } = res.data;

      if (!success || !token) {
        setError(message || "Đăng nhập thất bại.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const loginEvent = new CustomEvent("userUpdated", { detail: user });
      window.dispatchEvent(loginEvent);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

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

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <p style={styles.switchText}>
        Chưa có tài khoản?{" "}
        <span style={styles.switchLink} onClick={handleSwitchToRegister}>
          Đăng ký
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
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "white",
  },
  title: {
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    color: "#121212",
  },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontWeight: "600", fontSize: 14, marginBottom: 4, color: "#121212" },
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
  switchText: { marginTop: 20, color: "#d32f2f", textAlign: "center" },
  switchLink: { fontWeight: "bold", cursor: "pointer" },
};
