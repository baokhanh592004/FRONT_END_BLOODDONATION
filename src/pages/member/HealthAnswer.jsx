import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HealthAnswer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  const { userId, center_id, scheduledDate } = location.state || {};

  useEffect(() => {
    if (!userId || !center_id || !scheduledDate) {
      navigate('/member/donation-registration');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để tiếp tục.');
      navigate('/login');
      return;
    }

    axios
      .get('/api/health/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setQuestions(response.data))
      .catch((error) => {
        setError('Không thể tải câu hỏi. Vui lòng thử lại.');
        console.error('Error fetching questions:', error);
      });
  }, [userId, center_id, scheduledDate, navigate]);

  const handleAnswerChange = (questionId, answerValue) => {
    setAnswers((prevAnswers) => {
      const existing = prevAnswers.find((a) => a.questionId === questionId);
      if (existing) {
        existing.answerValue = answerValue;
      } else {
        prevAnswers.push({ questionId, answerValue });
      }
      return [...prevAnswers];
    });
  };

  const handleSubmit = () => {
    if (answers.length !== questions.length) {
      setError('Vui lòng trả lời tất cả câu hỏi.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để gửi câu trả lời.');
      navigate('/login');
      return;
    }

    axios
      .post('/api/health/answers', { answers }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert('Bạn đủ điều kiện hiến máu!');
        return axios.post('/api/user/appointments/register', {
          userId,
          center_id,
          appointmentTime: scheduledDate + "T08:00:00",
          location: "Địa điểm placeholder",
          bloodType: "A+"
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(() => {
        alert('Đăng ký lịch hẹn thành công!');
        navigate('/member/success');
      })
      .catch((err) => {
        console.error(err);
        setError('Bạn không đủ điều kiện hiến máu hoặc đăng ký lịch hẹn thất bại.');
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-red-600">Sàng lọc trước khi hiến máu</h1>

      {error && <p className="text-red-500 font-medium mb-4 text-center">{error}</p>}

      {questions.map((question) => (
        <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <p className="text-lg font-medium text-gray-800">{question.questionText}</p>
          <div className="mt-3 flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answers.find((a) => a.questionId === question.id && a.answerValue === true)}
                onChange={() => handleAnswerChange(question.id, true)}
              />
              <span>Có</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={answers.find((a) => a.questionId === question.id && a.answerValue === false)}
                onChange={() => handleAnswerChange(question.id, false)}
              />
              <span>Không</span>
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full py-3 mt-6 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300"
      >
        Gửi câu trả lời
      </button>
    </div>
  );
};

export default HealthAnswer;
