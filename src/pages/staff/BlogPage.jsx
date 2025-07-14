import React, { useState } from "react";
import axios from "axios";

export default function BlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "BLOG",
    image: null,
  });

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
      setMessage("Tạo bài viết thành công");
      setFormData({ title: "", content: "", type: "BLOG", image: null });
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo bài viết");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Tạo bài viết</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="content"
          placeholder="Nội dung bài viết"
          value={formData.content}
          onChange={handleChange}
          required
          rows={5}
          style={{ ...styles.input, resize: "vertical" }}
        ></textarea>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="BLOG">BLOG</option>
          <option value="NEWS">NEWS</option>
          <option value="GUIDE">GUIDE</option>
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Gửi bài viết
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    color: "#c62828",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#c62828",
    color: "white",
    padding: 12,
    fontWeight: "bold",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
  },
};
