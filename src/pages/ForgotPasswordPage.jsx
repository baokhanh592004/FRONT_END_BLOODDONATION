import React, { useState } from "react";

export default function ForgotPasswordPage({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gọi API backend gửi mail đặt lại mật khẩu
    setMessage(`Yêu cầu đặt lại mật khẩu đã gửi tới: ${email}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.submitBtn}>Gửi yêu cầu</button>
      </form>
      {message && <p style={{ marginTop: 10, color: "green" }}>{message}</p>}
      <p style={styles.switchText}>
        Đã nhớ mật khẩu?{" "}
        <span style={styles.switchLink} onClick={onSwitchToLogin}>
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
