// src/pages/NewBlogPost.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicImage from '../components/PublicImage'; // THAY ĐỔI: Import PublicImage

export default function NewBlogPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (postId) {
          const response = await axiosClient.get(`/blog/${postId}`);
          setPost(response.data);
        } else {
          const response = await axiosClient.get('/blog/all');
          const allowedTypes = ['BLOG', 'NEWS', 'GUIDE'];
          const filteredPosts = response.data.filter(p => allowedTypes.includes(p.type));
          const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedPosts);
        }
      } catch (err) {
        setError(err.response?.status === 401
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          : 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, navigate]);

  if (loading) return <div style={styles.centered}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ ...styles.centered, color: '#d32f2f' }}>{error}</div>;

  if (postId) return <PostDetail post={post} onBack={() => navigate('/blog')} />;
  return <PostList posts={posts} />;
}

const PostDetail = ({ post, onBack }) => {
  if (!post) return <div style={styles.centered}>Không tìm thấy bài viết.</div>;

  return (
    <div style={styles.detailContainer}>
      <button onClick={onBack} style={styles.backButton}>← Quay lại danh sách tin tức</button>
      <h1 style={styles.detailTitle}>{post.title}</h1>
      <p style={styles.meta}>
        bởi <strong>{post.authorName}</strong> • {new Date(post.createdAt).toLocaleString('vi-VN')}
      </p>
      {/* THAY ĐỔI: Sử dụng PublicImage */}
      {post.image && <PublicImage src={post.image} alt={post.title} style={styles.detailImage} />}
      <div style={styles.content} dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
    </div>
  );
};

const PostList = ({ posts }) => (
  <div style={styles.listContainer}>
    <h1 style={styles.listTitle}>Tin Tức & Sự Kiện</h1>
    {posts.length > 0 ? (
      <div style={styles.postsGrid}>
        {posts.map(post => (
          <Link to={`/blog/${post.postId}`} key={post.postId} style={styles.link}>
            <div style={styles.postCard}>
              {/* THAY ĐỔI: Sử dụng PublicImage */}
              <PublicImage src={post.image} alt={post.title} style={styles.postImage} />
              <div style={styles.postCardContent}>
                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postMeta}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <p style={styles.centered}>Chưa có bài viết nào để hiển thị.</p>
    )}
  </div>
);

const colors = {
  primary: '#d32f2f',
  background: '#f7f7f7',
  text: '#333',
  border: '#e0e0e0',
};

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontSize: '1.2rem',
    color: '#666',
    fontFamily: 'Arial, sans-serif',
  },
  listContainer: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  listTitle: {
    textAlign: 'center',
    color: colors.primary,
    marginBottom: '40px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  link: { textDecoration: 'none', color: 'inherit' },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  postImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#f0f0f0',
  },
  postCardContent: {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  postTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colors.text,
    minHeight: '58px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  postMeta: {
    fontSize: '0.9rem',
    color: '#777',
    margin: 0,
    marginTop: 'auto',
    paddingTop: '10px',
  },
  detailContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  backButton: {
    marginBottom: '30px',
    padding: '10px 18px',
    border: `1px solid ${colors.border}`,
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  detailTitle: {
    fontSize: '2.5rem',
    color: colors.primary,
    marginBottom: '10px',
    lineHeight: 1.2,
  },
  meta: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '30px',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '20px',
  },
  detailImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '450px',
    borderRadius: '8px',
    marginBottom: '30px',
    objectFit: 'cover',
    backgroundColor: '#f0f0f0',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: 1.7,
    color: '#444',
    whiteSpace: 'pre-wrap',
  },
};