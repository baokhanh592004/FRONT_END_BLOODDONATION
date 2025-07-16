import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedImage from "../../components/AuthenticatedImage";

// =======================================================
// CÁC ICON (Không thay đổi)
// =======================================================
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: 8 }}>
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
);


const API_URL = "http://localhost:8080";

const PostDetailModal = ({ post, isLoading, error, onClose, onDelete }) => {
    // ... Component này giữ nguyên
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={handleOverlayClick}>
            <div style={styles.modalContent}>
                <button style={styles.modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </button>
                {isLoading && <p>Đang tải bài viết...</p>}
                {error && <div style={{ ...styles.alert, ...styles.alertError }}>{error}</div>}
                {post && !isLoading && (
                    <>
                        <h2 style={styles.modalTitle}>{post.title}</h2>
                        <p style={styles.modalMeta}>
                            bởi <strong>{post.authorName}</strong> - {new Date(post.createdAt).toLocaleString('vi-VN')}
                        </p>
                        {post.image && (
                            <AuthenticatedImage 
                                src={post.image} 
                                alt={post.title} 
                                style={styles.modalImage} 
                            />
                        )}
                        <div style={styles.modalBody}>{post.content}</div>
                        <div style={styles.modalActions}>
                            <button 
                                style={styles.deleteButtonModal} 
                                onClick={() => onDelete(post.postId)}
                            >
                                <TrashIcon /> Xóa bài viết này
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// =======================================================
// THAY ĐỔI 1: TẠO COMPONENT CONFIRMATIONMODAL MỚI
// =======================================================
const ConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.confirmModalContent}>
                <h3 style={styles.confirmModalTitle}>{title}</h3>
                <p style={styles.confirmModalMessage}>{message}</p>
                <div style={styles.confirmModalActions}>
                    <button style={styles.confirmButtonCancel} onClick={onCancel}>
                        Hủy
                    </button>
                    <button style={styles.confirmButtonConfirm} onClick={onConfirm}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function BlogPage() {
    // ... các state cũ giữ nguyên ...
    const [formData, setFormData] = useState({ title: "", content: "", type: "BLOG", image: null });
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingSelectedPost, setLoadingSelectedPost] = useState(false);
    const [fetchDetailError, setFetchDetailError] = useState(null);

    // =======================================================
    // THAY ĐỔI 2: THÊM STATE ĐỂ QUẢN LÝ MODAL XÁC NHẬN
    // =======================================================
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        postIdToDelete: null,
    });


    const fetchPosts = async () => {
        // ... hàm này giữ nguyên
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

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleChange = e => {
        // ... hàm này giữ nguyên
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
        // ... hàm này giữ nguyên
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
            await fetchPosts();

            setFormData({ title: "", content: "", type: "BLOG", image: null });
            setImagePreviewUrl(null);
            if(document.getElementById("image-input")) {
                document.getElementById("image-input").value = "";
            }
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi tạo bài viết");
        }
    };
    
    // =======================================================
    // THAY ĐỔI 3: CẬP NHẬT LOGIC XÓA BÀI VIẾT
    // =======================================================

    // Hàm này được gọi khi bấm nút thùng rác, nó sẽ mở modal xác nhận
    const handleDeleteRequest = (postId) => {
        setConfirmState({ isOpen: true, postIdToDelete: postId });
    };

    // Hàm này được gọi khi người dùng bấm nút "Cancel" trên modal
    const handleCancelDelete = () => {
        setConfirmState({ isOpen: false, postIdToDelete: null });
    };

    // Hàm này được gọi khi người dùng bấm nút "OK" để xác nhận xóa
    const handleConfirmDelete = async () => {
        const postId = confirmState.postIdToDelete;
        if (!postId) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_URL}/api/blog/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("Đã xóa bài viết thành công!");
            setError(null);
            await fetchPosts();

            if (selectedPost && selectedPost.postId === postId) {
                handleCloseModal();
            }

        } catch (err) {
            setError(err.response?.data || "Lỗi khi xóa bài viết.");
            setMessage(null);
            console.error("Delete post error:", err);
        } finally {
            // Đóng modal xác nhận sau khi hoàn tất
            handleCancelDelete();
        }
    };


    const handlePostClick = async (postId) => {
        // ... hàm này giữ nguyên
        setLoadingSelectedPost(true);
        setFetchDetailError(null);
        setSelectedPost(null); 
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_URL}/api/blog/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedPost(response.data);
        } catch (err) {
            setFetchDetailError("Không thể tải chi tiết bài viết.");
            console.error("Fetch post detail error:", err);
        } finally {
            setLoadingSelectedPost(false);
        }
    };
    
    const handleCloseModal = () => {
        // ... hàm này giữ nguyên
        setSelectedPost(null);
        setFetchDetailError(null);
    };

    return (
        <div style={styles.pageContainer}>
            {/* Phần tạo bài viết */}
            <div style={styles.container}>
                 {/* ... form giữ nguyên ... */}
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
                            {/* THAY ĐỔI 4: GỌI HÀM MỚI KHI CLICK NÚT XÓA */}
                            <button
                                style={styles.deleteButtonCard}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleDeleteRequest(post.postId);
                                }}
                            >
                                <TrashIcon />
                            </button>

                            {/* Nội dung card */}
                            <div onClick={() => handlePostClick(post.postId)} style={{ cursor: 'pointer' }}>
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
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal chi tiết bài viết */}
            {(loadingSelectedPost || selectedPost || fetchDetailError) && (
                <PostDetailModal
                    post={selectedPost}
                    isLoading={loadingSelectedPost}
                    error={fetchDetailError}
                    onClose={handleCloseModal}
                    // THAY ĐỔI 4 (tiếp): GỌI HÀM MỚI KHI CLICK NÚT XÓA TRONG MODAL
                    onDelete={handleDeleteRequest}
                />
            )}

            {/* ======================================================= */}
            {/* THAY ĐỔI 5: RENDER MODAL XÁC NHẬN MỚI */}
            {/* ======================================================= */}
            {confirmState.isOpen && (
                <ConfirmationModal
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
}

const colors = {
    // ... object colors giữ nguyên
    primary: '#d32f2f',
    primaryLight: '#e57373',
    background: '#f7f7f7',
    text: '#333',
    textLight: '#555',
    border: '#ddd',
    success: '#2e7d32',
    error: '#d32f2f',
    secondary: '#6c757d', // Thêm màu phụ cho nút cancel
    secondaryLight: '#f8f9fa', // Thêm màu sáng cho nút cancel
    confirmBlue: '#007bff', // Thêm màu xanh cho nút OK
};

// =======================================================
// THAY ĐỔI 6: THÊM STYLES CHO CONFIRMATIONMODAL
// =======================================================
const styles = {
    // ... các styles cũ giữ nguyên
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
        position: 'relative',
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
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)', // Thêm hiệu ứng blur cho nền
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        color: '#888',
    },
    modalTitle: {
        color: colors.primary,
        marginBottom: '10px',
        fontSize: '2rem',
    },
    modalMeta: {
        color: colors.textLight,
        fontSize: '14px',
        marginBottom: '20px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '15px',
    },
    modalImage: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '25px',
    },
    modalBody: {
        fontSize: '16px',
        lineHeight: 1.7,
        color: colors.text,
        whiteSpace: 'pre-wrap',
    },
    deleteButtonCard: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ddd',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: colors.error,
        transition: 'background-color 0.2s, color 0.2s',
    },
    modalActions: {
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: `1px solid ${colors.border}`,
        textAlign: 'right',
    },
    deleteButtonModal: {
        backgroundColor: '#fff0f0',
        color: colors.error,
        border: `1px solid ${colors.error}`,
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s',
    },

    // Styles mới cho Confirmation Modal
    confirmModalContent: {
        backgroundColor: '#fff',
        padding: '25px 30px',
        borderRadius: '12px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        animation: 'fadeIn 0.2s ease-out'
    },
    confirmModalTitle: {
        margin: '0 0 10px 0',
        color: colors.text,
        fontSize: '20px',
        fontWeight: '600',
    },
    confirmModalMessage: {
        margin: '0 0 25px 0',
        color: colors.textLight,
        fontSize: '16px',
        lineHeight: '1.5',
    },
    confirmModalActions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    confirmButtonCancel: {
        padding: '10px 25px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.secondaryLight,
        color: colors.secondary,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    confirmButtonConfirm: {
        padding: '10px 25px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: colors.confirmBlue,
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    }
};