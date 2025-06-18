// src/pages/member/DonationQuestionnairePage.js

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DonationQuestionnairePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu đăng ký được truyền từ trang trước
  const registrationData = location.state;

  const [answers, setAnswers] = useState({
    hasInfectiousDisease: null,
    isFeelingWell: null,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Nếu không có dữ liệu (người dùng truy cập trực tiếp URL), điều hướng về trang đăng ký
  if (!registrationData) {
    navigate('/member/donation-registration');
    return null; 
  }

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
    setError(''); // Xóa lỗi khi người dùng thay đổi câu trả lời
  };

  const allQuestionsAnswered = Object.values(answers).every(answer => answer !== null);

  const handleSubmit = async () => {
    // Kiểm tra câu trả lời trước khi gửi API
    if (answers.hasInfectiousDisease === 'yes') {
      setError('Rất tiếc, bạn không đủ điều kiện hiến máu nếu mắc các bệnh truyền nhiễm qua đường máu.');
      return;
    }
    if (answers.isFeelingWell === 'no') {
      setError('Vui lòng đảm bảo bạn đang trong tình trạng sức khỏe tốt nhất trước khi hiến máu.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ.');

      // Gửi API đăng ký với dữ liệu đã có từ trang trước
      await axios.post(
        'http://localhost:8080/api/user/appointments/register',
        registrationData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );a

      alert('Bạn đã đăng ký lịch hẹn thành công! Trạng thái lịch hẹn là "PENDING" và đang chờ xác nhận.');
      navigate('/member/my-appointments');

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.');
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Bảng câu hỏi sàng lọc sức khỏe</h2>
        <p className="text-gray-600 mb-8 text-center">Vui lòng trả lời trung thực các câu hỏi sau để đảm bảo an toàn cho người nhận máu.</p>
        
        <div className="space-y-8">
          {/* Câu hỏi 1 */}
          <div>
            <p className="font-semibold text-lg text-gray-700">1. Bạn có mắc hoặc nghi ngờ mắc các bệnh lây qua đường máu (như HIV, Viêm gan B, C) không?</p>
            <div className="flex items-center space-x-6 mt-3">
              <label className="flex items-center text-lg"><input type="radio" name="q1" value="no" onChange={() => handleAnswerChange('hasInfectiousDisease', 'no')} className="mr-2 h-5 w-5" /> Không</label>
              <label className="flex items-center text-lg"><input type="radio" name="q1" value="yes" onChange={() => handleAnswerChange('hasInfectiousDisease', 'yes')} className="mr-2 h-5 w-5" /> Có</label>
            </div>
          </div>

          {/* Câu hỏi 2 */}
          <div>
            <p className="font-semibold text-lg text-gray-700">2. Hiện tại, bạn có cảm thấy hoàn toàn khỏe mạnh không (không sốt, ho, sổ mũi...)?</p>
            <div className="flex items-center space-x-6 mt-3">
              <label className="flex items-center text-lg"><input type="radio" name="q2" value="yes" onChange={() => handleAnswerChange('isFeelingWell', 'yes')} className="mr-2 h-5 w-5" /> Có</label>
              <label className="flex items-center text-lg"><input type="radio" name="q2" value="no" onChange={() => handleAnswerChange('isFeelingWell', 'no')} className="mr-2 h-5 w-5" /> Không</label>
            </div>
          </div>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mt-6 font-medium">{error}</p>}
        
        <div className="text-center mt-10">
          <button 
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isLoading}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang gửi...' : 'Hoàn tất đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
}