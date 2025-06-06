import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

   const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    login: "",  // username hoặc email
    password: "",
    remember: true,
  });




  const [error, setError] = useState(null);

    const handleSwitchToRegister = () => {
    navigate("/register"); // ✅ Chuyển sang trang đăng ký
  };
    


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
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      login: formData.login,
      password: formData.password,
    });

const { token, user } = res.data;

if (!token || !user) {
  setError("Dữ liệu đăng nhập không hợp lệ.");
  return;
}

localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

// 🔥 Tạo sự kiện tùy chỉnh để thông báo Header cập nhật
const loginEvent = new CustomEvent("userUpdated", { detail: user });
window.dispatchEvent(loginEvent);

navigate("/");
  } catch (err) {
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
