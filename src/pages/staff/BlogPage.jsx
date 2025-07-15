// src/pages/staff/BlogPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedImage from "../../components/AuthenticatedImage"; // Đảm bảo đường dẫn này đúng

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: 8 }}>
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
    </svg>
);

const API_URL = "http://localhost:8080";

export default function BlogPage() {
    const [formData, setFormData] = useState({ title: "", content: "", type: "BLOG", image: null });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // =======================================================
    // THAY ĐỔI 1: TÁCH HÀM LẤY DỮ LIỆU RA RIÊNG
    // =======================================================
    const fetchPosts = async () => {
        setLoadingPosts(true);
        setFetchError(null);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_URL}/api/blog/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (err) {
            setFetchError("Không thể tải danh sách bài viết.");
            console.error("Fetch posts error:", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    // Gọi hàm này khi component được tải lần đầu
    useEffect(() => {
        fetchPosts();
    }, []);

    // Effect dọn dẹp URL ảnh xem trước
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setFormData(prev => ({ ...prev, image: file }));
            if (file) {
                const newPreviewUrl = URL.createObjectURL(file);
                setImagePreviewUrl(newPreviewUrl);
            } else {
                setImagePreviewUrl(null);
            }
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
            await axios.post(`${API_URL}/api/blog/create`, data, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });

            setMessage("Tạo bài viết thành công!");
            
            // =======================================================
            // THAY ĐỔI 2: GỌI LẠI HÀM FETCHPOSTS ĐỂ LÀM MỚI DANH SÁCH
            // =======================================================
            await fetchPosts();

            // Reset form
            setFormData({ title: "", content: "", type: "BLOG", image: null });
            setImagePreviewUrl(null);
            if(document.getElementById("image-input")) {
                document.getElementById("image-input").value = "";
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi tạo bài viết");
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* Phần tạo bài viết không đổi */}
            <div style={styles.container}>
                <h2 style={styles.header}>Tạo Bài Viết Mới</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="title" style={styles.label}>Tiêu đề</label>
                        <input id="title" type="text" name="title" placeholder="Nhập tiêu đề bài viết..." value={formData.title} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="content" style={styles.label}>Nội dung</label>
                        <textarea id="content" name="content" placeholder="Soạn thảo nội dung của bạn tại đây..." value={formData.content} onChange={handleChange} required rows={8} style={{ ...styles.input, resize: "vertical", height: 'auto' }} />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="type" style={styles.label}>Thể loại</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} style={styles.input}>
                            <option value="BLOG">BLOG</option>
                            <option value="NEWS">NEWS</option>
                            <option value="GUIDE">GUIDE</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="image-input" style={styles.label}>Ảnh bìa</label>
                        {imagePreviewUrl && (
                            <div style={styles.imagePreviewContainer}>
                                <img src={imagePreviewUrl} alt="Xem trước ảnh bìa" style={styles.imagePreview} />
                            </div>
                        )}
                        <label htmlFor="image-input" style={styles.fileInputLabel}>
                            <UploadIcon />
                            <span>{formData.image ? formData.image.name : "Chọn một tệp ảnh"}</span>
                        </label>
                        <input id="image-input" type="file" name="image" accept="image/*" onChange={handleChange} style={styles.fileInput} />
                    </div>
                    <button type="submit" style={{ ...styles.button, ...(isHovered ? styles.buttonHover : null) }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>Đăng Bài</button>
                </form>
                {message && <div style={{ ...styles.alert, ...styles.alertSuccess }}>{message}</div>}
                {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
            </div>

            {/* Phần hiển thị danh sách bài viết */}
            <div style={styles.postListContainer}>
                <h2 style={styles.header}>Danh sách bài viết đã đăng</h2>
                {loadingPosts && <p style={{ textAlign: 'center' }}>Đang tải bài viết...</p>}
                {fetchError && <div style={{ ...styles.alert, ...styles.alertError }}>{fetchError}</div>}
                {!loadingPosts && posts.length === 0 && <p style={{ textAlign: 'center' }}>Chưa có bài viết nào.</p>}
                
                <div style={styles.postsGrid}>
                    {posts.map(post => (
                        <div key={post.postId} style={styles.postCard}>
                            <AuthenticatedImage 
                                src={post.image}
                                alt={post.title} 
                                style={styles.postImage} 
                            />
                            <div style={styles.postCardContent}>
                                <span style={styles.postType}>{post.type}</span>
                                <h3 style={styles.postTitle}>{post.title}</h3>
                                <p style={styles.postAuthor}>
                                    bởi {post.authorName} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Giữ nguyên toàn bộ đối tượng styles
const colors = {
    primary: '#d32f2f',
    primaryLight: '#e57373',
    background: '#f7f7f7',
    text: '#333',
    textLight: '#555',
    border: '#ddd',
    success: '#2e7d32',
    error: '#d32f2f',
};

const styles = {
    pageContainer: {
        backgroundColor: colors.background,
        padding: '40px 20px',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    container: {
        maxWidth: 700,
        margin: "0 auto",
        padding: '30px',
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
    header: {
        textAlign: "center",
        marginBottom: 30,
        color: colors.primary,
        fontSize: '28px',
        fontWeight: 700,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontWeight: 600,
        color: colors.textLight,
        fontSize: '14px',
    },
    input: {
        padding: "12px 15px",
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        fontSize: 16,
        color: colors.text,
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    fileInput: {
        display: 'none',
    },
    fileInputLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: "12px 15px",
        backgroundColor: '#fff',
        border: `2px dashed ${colors.border}`,
        borderRadius: 8,
        cursor: 'pointer',
        color: colors.textLight,
        transition: 'border-color 0.2s, color 0.2s',
    },
    imagePreviewContainer: {
        marginBottom: '10px',
        textAlign: 'center',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: '250px',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        objectFit: 'cover',
    },
    button: {
        backgroundColor: colors.primary,
        color: "white",
        padding: '15px',
        fontWeight: "bold",
        fontSize: 16,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: 10,
        transition: 'background-color 0.2s, transform 0.1s',
    },
    buttonHover: {
        backgroundColor: colors.primaryLight,
        transform: 'translateY(-2px)',
    },
    alert: {
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        border: '1px solid transparent',
        textAlign: 'center',
        fontWeight: 500,
    },
    alertSuccess: {
        backgroundColor: '#e8f5e9',
        color: colors.success,
        borderColor: '#c8e6c9',
    },
    alertError: {
        backgroundColor: '#ffebee',
        color: colors.error,
        borderColor: '#ffcdd2',
    },
    postListContainer: {
        maxWidth: 1000,
        margin: '60px auto 0 auto',
    },
    postsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    postImage: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        backgroundColor: '#f0f0f0',
    },
    postCardContent: {
        padding: '20px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    postType: {
        backgroundColor: colors.primaryLight,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: '12px',
    },
    postTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 600,
        color: colors.text,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        minHeight: '44px',
    },
    postAuthor: {
        margin: 'auto 0 0 0',
        fontSize: '13px',
        color: colors.textLight,
        paddingTop: '10px',
        borderTop: `1px solid ${colors.border}`,
    },
};