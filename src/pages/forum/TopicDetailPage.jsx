import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import forumApi from '../../api/forumApi';
import { useAuth } from '../../auth/useAuth';
import { toast } from 'react-toastify';
import { FaSpinner, FaPaperPlane, FaUserCircle, FaArrowLeft } from 'react-icons/fa';

const TopicDetailPage = () => {
  const { topicId } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [topicTitle, setTopicTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  const fetchTopicDetails = async () => {
    setIsLoading(true);
    try {
      const postResponse = await forumApi.getPostsByTopic(topicId);
      setPosts(postResponse.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))); // Sắp xếp bình luận

      const topicsResponse = await forumApi.getAllTopics();
      const currentTopic = topicsResponse.data.find(t => t.id === Number(topicId));
      if (currentTopic) {
        setTopicTitle(currentTopic.title);
      }
    } catch (error) {
      toast.error("Không thể tải nội dung chủ đề.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
  }, [topicId]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.warn("Vui lòng nhập nội dung bình luận.");
      return;
    }
    setIsSubmitting(true);
    try {
      await forumApi.createPost({
        topicId: Number(topicId),
        content: newPostContent,
        authorId: user.userId,
      });
      setNewPostContent('');
      await fetchTopicDetails();
    } catch (error) {
      toast.error("Gửi bình luận thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-4xl text-red-600"/></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/forum" className="text-red-600 hover:text-red-800 mr-4">
          <FaArrowLeft size={22} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{topicTitle}</h1>
      </div>
      
      <div className="space-y-5 mb-8">
        {posts.length > 0 ? posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-start">
              <FaUserCircle className="text-gray-400 mr-4 flex-shrink-0" size={40} />
              <div className="w-full">
                <p className="text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Đăng bởi Người dùng #{post.authorId} • {new Date(post.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        )) : (
            <p className="text-center text-gray-500 py-10">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        )}
        <div ref={commentsEndRef} />
      </div>

      {user ? (
        <div className="bg-white p-5 rounded-lg shadow-lg sticky bottom-4 border-t-4 border-red-500">
          <form onSubmit={handleCreatePost}>
            <h3 className="font-semibold text-lg mb-2">Tham gia thảo luận</h3>
            <textarea
              rows="4"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Nhập nội dung bình luận của bạn..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-300 transition"
            />
            <div className="text-right mt-3">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition flex items-center justify-center min-w-[120px] disabled:bg-gray-400"
              >
                {isSubmitting ? <FaSpinner className="animate-spin"/> : <><FaPaperPlane className="mr-2"/> Gửi bình luận</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center bg-gray-100 p-6 rounded-lg">
          <p>Vui lòng <Link to="/login" className="text-red-600 font-semibold hover:underline">đăng nhập</Link> để tham gia thảo luận.</p>
        </div>
      )}
    </div>
  );
};

export default TopicDetailPage;