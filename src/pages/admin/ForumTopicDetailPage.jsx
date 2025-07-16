import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import forumApi from '../../api/forumApi';
import { toast } from 'react-toastify';
import { FaEyeSlash, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const ForumTopicDetailPage = () => {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await forumApi.getPostsByTopic(topicId);
      setPosts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải bài đăng:", error);
      toast.error("Không thể tải các bài đăng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [topicId]);

  const handleHidePost = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn ẩn bài đăng này không?")) {
      try {
        await forumApi.hidePost(postId);
        toast.success("Đã ẩn bài đăng!");
        fetchPosts(); // Tải lại danh sách
      } catch (error) {
        console.error("Lỗi khi ẩn bài đăng:", error);
        toast.error("Ẩn bài đăng thất bại.");
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-red-600"/></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-5 border-b pb-3">
        <Link to="/admin/forum" className="mr-4 text-red-600 hover:text-red-800">
            <FaArrowLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Chi tiết Chủ đề</h2>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
            posts.map(post => (
                <div key={post.id} className="border p-4 rounded-lg bg-gray-50">
                    <p className="text-gray-800">{post.content}</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>Đăng bởi: Người dùng #{post.authorId}</span>
                        <button 
                          onClick={() => handleHidePost(post.id)}
                          className="text-yellow-600 hover:text-yellow-800 flex items-center"
                          title="Ẩn bài đăng"
                        >
                            <FaEyeSlash className="mr-1" /> Ẩn
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-gray-500 text-center py-8">Chưa có bài đăng nào trong chủ đề này.</p>
        )}
      </div>
    </div>
  );
};

export default ForumTopicDetailPage;