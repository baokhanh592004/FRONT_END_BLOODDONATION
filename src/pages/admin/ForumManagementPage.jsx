import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import forumApi from '../../api/forumApi';
import { toast } from 'react-toastify';
import CreateTopicModal from '../../components/CreateTopicModal';

const ForumManagementPage = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await forumApi.getAllTopics();
      
      // === SỬA LỖI TẠI ĐÂY ===
      // API đã trả về một mảng trực tiếp, nên chúng ta kiểm tra response.data
      if (response && Array.isArray(response.data)) {
        setTopics(response.data);
      } else {
        console.error("API for topics did not return an array:", response.data);
        setTopics([]);
      }

    } catch (error) {
      console.error("Lỗi khi tải danh sách chủ đề:", error);
      toast.error("Không thể tải danh sách chủ đề.");
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chủ đề này không? Tất cả các bài đăng bên trong cũng sẽ bị xóa.")) {
      try {
        await forumApi.deleteTopic(topicId);
        toast.success("Đã xóa chủ đề thành công!");
        fetchTopics(); // Tải lại danh sách
      } catch (error) {
        console.error("Lỗi khi xóa chủ đề:", error);
        toast.error("Xóa chủ đề thất bại.");
      }
    }
  };

  const handleTopicCreated = () => {
    fetchTopics(); // Tải lại danh sách sau khi tạo mới
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-red-600"/></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-5 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Diễn đàn</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Tạo Chủ đề mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Tiêu đề</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Mô tả</th>
              <th className="text-center py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 font-semibold">{topic.title}</td>
                <td className="py-3 px-4 text-gray-700">{topic.description}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center items-center gap-3">
                    <Link to={`/admin/forum/topics/${topic.id}`} className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                      <FaEye size={20} />
                    </Link>
                    <button onClick={() => handleDeleteTopic(topic.id)} className="text-red-600 hover:text-red-800" title="Xóa chủ đề">
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateTopicModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
};

export default ForumManagementPage;