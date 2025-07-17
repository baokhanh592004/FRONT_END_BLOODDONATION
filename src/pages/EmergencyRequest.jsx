import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedImage from '../components/AuthenticatedImage'; // Giả sử bạn có thể dùng lại component này

const API_URL = "http://localhost:8080";

export default function EmergencyRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Vui lòng đăng nhập để xem các yêu cầu.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/blog/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Lọc để chỉ lấy các yêu cầu khẩn cấp
                const emergencyPosts = response.data.filter(post => post.type === 'EMERGENCY_REQUEST');
                
                // Sắp xếp từ mới nhất đến cũ nhất
                const sortedRequests = emergencyPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setRequests(sortedRequests);
            } catch (err) {
                setError("Không thể tải danh sách yêu cầu khẩn cấp.");
                console.error("Fetch emergency requests error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.header}>Danh Sách Yêu Cầu Khẩn Cấp</h1>
            
            {loading && <p style={styles.message}>Đang tải dữ liệu...</p>}
            
            {error && <p style={styles.errorMessage}>{error}</p>}
            
            {!loading && !error && requests.length === 0 && (
                <p style={styles.message}>Hiện không có yêu cầu khẩn cấp nào.</p>
            )}

            <div style={styles.listContainer}>
                {requests.map(req => (
                    <div key={req.postId} style={styles.card}>
                        {req.image && (
                            <AuthenticatedImage 
                                src={req.image}
                                alt={req.title}
                                style={styles.cardImage}
                            />
                        )}
                        <div style={styles.cardContent}>
                            <h2 style={styles.cardTitle}>{req.title}</h2>
                            <p style={styles.cardMeta}>
                                Gửi bởi <strong>{req.authorName}</strong> lúc {new Date(req.createdAt).toLocaleString('vi-VN')}
                            </p>
                            <p style={styles.cardBody}>{req.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const colors = {
    primary: '#d32f2f',
    background: '#f7f7f7',
    text: '#333',
    textLight: '#555',
    border: '#e0e0e0',
};

const styles = {
    pageContainer: {
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: colors.background,
    },
    header: {
        textAlign: 'center',
        color: colors.primary,
        marginBottom: '40px',
        fontSize: '2.5rem',
    },
    message: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: colors.textLight,
    },
    errorMessage: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: colors.primary,
        backgroundColor: '#ffebee',
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${colors.primary}`
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: '250px',
        objectFit: 'cover',
        backgroundColor: '#f0f0f0',
    },
    cardContent: {
        padding: '25px',
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '1.5rem',
        color: colors.text,
    },
    cardMeta: {
        fontSize: '0.9rem',
        color: colors.textLight,
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: `1px solid ${colors.border}`,
    },
    cardBody: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: colors.text,
        whiteSpace: 'pre-wrap', // Giữ nguyên định dạng xuống dòng
    },
};