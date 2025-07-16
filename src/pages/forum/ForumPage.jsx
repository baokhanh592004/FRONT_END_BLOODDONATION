import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import forumApi from '../../api/forumApi';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ForumPage = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await forumApi.getAllTopics();
        
        // === SỬA LỖI TẠI ĐÂY: Lấy dữ liệu từ response.data.content ===
        if (response && response.data && Array.isArray(response.data.content)) {
          setTopics(response.data.content);
        } else {
          // Nếu API trả về mảng trực tiếp (để phòng trường hợp backend thay đổi)
          if (Array.isArray(response.data)) {
            setTopics(response.data);
          } else {
            console.error("API for topics did not return a valid format:", response.data);
            setTopics([]);
          }
        }
      } catch (error) {
        toast.error("Không thể tải các chủ đề diễn đàn.");
        console.error("Lỗi tải chủ đề:", error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><FaSpinner className="animate-spin text-4xl text-red-600"/></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center border-b-2 border-red-200 pb-4">Diễn Đàn Cộng Đồng</h1>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <ul className="space-y-4">
          {topics.length > 0 ? topics.map(topic => (
            <li key={topic.id} className="border-b last:border-b-0 py-5 transition duration-300 hover:bg-gray-50 rounded-md">
              <Link to={`/forum/topic/${topic.id}`} className="block p-4">
                <h2 className="text-xl font-semibold text-gray-800 hover:text-red-500">{topic.title}</h2>
                <p className="text-gray-600 mt-1">{topic.description}</p>
                <p className="text-xs text-gray-400 mt-2">Tạo lúc: {new Date(topic.createdAt).toLocaleDateString('vi-VN')}</p>
              </Link>
            </li>
          )) : (
            <p className="text-center text-gray-500 py-10">Hiện chưa có chủ đề nào được tạo.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ForumPage;