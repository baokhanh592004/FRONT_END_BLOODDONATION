import React, { useState } from "react";

export default function LoginPage({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây (validate, call API...)
    console.log("Login form submitted:", formData);
  };

  const handleGoogleLogin = () => {
    // Logic đăng nhập với Google (nếu có)
    alert("Đăng nhập bằng Google");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Mật khẩu</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            name="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          {/* Icon mắt có thể thêm sau */}
        </div>

        <div style={styles.optionsRow}>
          <label>
            <input
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
            />{" "}
            Ghi nhớ đăng nhập
          </label>

      

        <button
          style={{ ...styles.forgotLink, background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={onSwitchToForgotPassword}
          type="button"
        >
          Quên mật khẩu?
        </button>
      

  
        </div>

        <button type="submit" style={styles.submitBtn}>Đăng nhập</button>
      </form>

      <button onClick={handleGoogleLogin} style={styles.googleBtn}>
        <span style={{ marginRight: 8, fontWeight: "bold" }}>G</span> Đăng nhập bằng Google
      </button>

      <p style={styles.switchText}>
        Chưa có tài khoản?{" "}
        <span style={styles.switchLink} onClick={onSwitchToRegister}>
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
  title: { marginBottom: 20, fontWeight: "bold", fontSize: 22, textAlign: "center", color: "#121212" },
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
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 13,
    marginTop: 4,
  },
  forgotLink: { color: "#d32f2f", cursor: "pointer", textDecoration: "none" },
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
  googleBtn: {
    marginTop: 15,
    width: "100%",
    borderRadius: 5,
    border: "1px solid #ddd",
    backgroundColor: "white",
    padding: 10,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    color: "#333",
  },
  switchText: { marginTop: 20, color: "#d32f2f", textAlign: "center" },
  switchLink: { fontWeight: "bold", cursor: "pointer" },
};
