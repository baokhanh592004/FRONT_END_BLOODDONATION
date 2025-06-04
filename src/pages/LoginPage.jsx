import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LoginPage({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const [formData, setFormData] = useState({
    login: "",  // username hoặc email
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
      //=========================CODE CŨ =======================
      // const res = await axios.post("http://localhost:8080/api/auth/login", {
      //   login: formData.login,
      //   password: formData.password,
      // });
      // alert(res.data.message);

      //=========================CODE MỚI =======================
      const res = await axios.get(`https://683fa15a5b39a8039a552588.mockapi.io/api/login/user`, {
        params: {
          username: formData.login,
          password: formData.password,
        }
      });

      //============================ CODE THÊM====================
      // ❗ Sửa lại đoạn này vì res.data là MẢNG chứ không phải object có thuộc tính 'user'
      // ➤ Kiểm tra nếu có ít nhất 1 user phù hợp thì login thành công
      if (res.data.length > 0) {
        const user = res.data[0]; // lấy user đầu tiên trong kết quả tìm được
        localStorage.setItem("user", JSON.stringify(user)); // lưu user vào localStorage
        alert("Đăng nhập thành công!");
        window.location.href = "/"; // chuyển hướng về trang chủ
      } else {
        setError("Sai tên đăng nhập hoặc mật khẩu!"); // nếu không tìm thấy user
      }
      //=========================================================

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        {/* <span style={styles.switchLink} onClick={onSwitchToRegister}>
          Đăng ký
        </span> */}
        <Link to="/register" style={styles.switchLink}>
          Đăng ký
        </Link>
      </p>
      {/* <button onClick={onSwitchToForgotPassword} style={{ marginTop: 10, cursor: "pointer", background: "none", border: "none", color: "#d32f2f" }}>
        Quên mật khẩu?
      </button> */}
      <Link to="/forgotPassword" style={{ marginTop: 10, cursor: "pointer", background: "none", border: "none", color: "#d32f2f" }}>
        Quên mật khẩu?
      </Link>
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
  switchText: { marginTop: 20, color: "#d32f2f", textAlign: "center" },
  switchLink: { fontWeight: "bold", cursor: "pointer" },
};
