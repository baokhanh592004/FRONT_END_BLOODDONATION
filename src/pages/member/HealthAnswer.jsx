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

        // Gửi câu trả lời sức khỏe nếu có
        axios.post('/api/health/answers', { answers }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        })

        
        // Lấy câu hỏi từ backend
        axios.get('/api/health/questions', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => setQuestions(response.data))
        .catch(error => {
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
            console.error('Error fetching questions:', error);
        });

    }, [userId, center_id, scheduledDate, navigate]);

    const handleAnswerChange = (questionId, answerValue) => {
        setAnswers(prevAnswers => {
            // Kiểm tra xem câu trả lời đã tồn tại chưa, nếu có thì cập nhật
            const existingAnswer = prevAnswers.find(answer => answer.questionId === questionId);
            if (existingAnswer) {
                existingAnswer.answerValue = answerValue;
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
      
        // Gửi câu trả lời sức khỏe
        axios.post('/api/health/answers', { answers }, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => {
          alert('Bạn đủ điều kiện hiến máu!');
      
          // Gửi đăng ký lịch hẹn
          axios.post('/api/user/appointments/register', {
            userId,
            center_id,
            appointmentTime: scheduledDate + "T08:00:00",
            location: "Địa điểm placeholder",
            bloodType: "A+"  // bạn có thể lấy từ `user` nếu cần
          }, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          .then(res => {
            alert("Đăng ký lịch hẹn thành công!");
            navigate('/member/success');
          })
          .catch(err => {
            console.error("Lỗi khi đăng ký lịch hẹn:", err);
            setError("Đã vượt qua sàng lọc nhưng đăng ký lịch hẹn thất bại.");
          });
        })
        .catch(error => {
          setError('Bạn không đủ điều kiện hiến máu.');
          console.error(error);
        });
      };
      

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Đăng ký hiến máu</h1>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {questions.map(question => (
                <div key={question.id} className="mb-4">
                    <p className="text-lg">{question.questionText}</p>
                    <div className="mt-2">
                        <label>
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value="true"
                                checked={answers.find(answer => answer.questionId === question.id && answer.answerValue === true)}
                                onChange={() => handleAnswerChange(question.id, true)}
                            /> Có
                        </label>
                        <label className="ml-4">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value="false"
                                checked={answers.find(answer => answer.questionId === question.id && answer.answerValue === false)}
                                onChange={() => handleAnswerChange(question.id, false)}
                            /> Không
                        </label>
                    </div>
                </div>
            ))}

            <button onClick={handleSubmit} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                Gửi câu trả lời
            </button>
        </div>
    );
};

export default HealthAnswer;
