// src/pages/member/DonationQuestionnairePage.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// --- THÊM MỚI: Import icons ---
import { FaCheckCircle, FaTimesCircle, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { BsPatchQuestionFill } from 'react-icons/bs';

// --- COMPONENT CON (MỚI) ---
// Component để hiển thị từng câu hỏi một cách trực quan
const QuestionCard = ({ question, answer, onAnswerChange }) => {
  const isAnswered = answer !== undefined;
  const selectedValue = answer?.answerValue;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-300 ${isAnswered ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <BsPatchQuestionFill className="text-red-500 text-2xl mt-1 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-lg font-medium text-gray-800 mb-3">{question.questionText}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Lựa chọn CÓ */}
            <label 
              className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedValue === true ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={selectedValue === true}
                onChange={() => onAnswerChange(question.id, true)}
                className="form-radio h-5 w-5 text-red-600 focus:ring-red-500" // Cần plugin @tailwindcss/forms
              />
              <span className={`font-semibold ${selectedValue === true ? 'text-red-700' : 'text-gray-700'}`}>Có</span>
            </label>
            {/* Lựa chọn KHÔNG */}
            <label 
              className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedValue === false ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={selectedValue === false}
                onChange={() => onAnswerChange(question.id, false)}
                className="form-radio h-5 w-5 text-red-600 focus:ring-red-500"
              />
              <span className={`font-semibold ${selectedValue === false ? 'text-red-700' : 'text-gray-700'}`}>Không</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component để hiển thị thông báo lỗi/thành công
const AlertMessage = ({ message, type, onActionClick, actionText }) => {
  const isError = type === 'error';
  return (
    <div className={`p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 ${isError ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
      <div className="flex items-center gap-3">
        {isError ? <FaTimesCircle size={20} /> : <FaCheckCircle size={20} />}
        <p className="font-medium text-center sm:text-left">{message}</p>
      </div>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 whitespace-nowrap ${isError ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}


// --- COMPONENT CHÍNH (ĐÃ CẬP NHẬT TOÀN BỘ) ---
const DonationQuestionnairePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackHome, setShowBackHome] = useState(false);

  // Logic lấy registrationData giữ nguyên
  const registrationData = (() => {
    const state = location.state;
    const stored = localStorage.getItem("registrationData");
    return state || (stored ? JSON.parse(stored) : null);
  })();

  // Logic useEffect giữ nguyên
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!registrationData?.userId || !registrationData?.centerId || !registrationData?.scheduledDate) {
      navigate('/member/donation-registration'); // Chuyển về trang đăng ký lịch
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/health/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
        // Khởi tạo answers state để mỗi câu hỏi có một mục, tránh lỗi khi check length
        setAnswers(response.data.map(q => ({ questionId: q.id, answerValue: undefined })));
      } catch (err) {
        console.error("Lỗi khi tải câu hỏi:", err);
        setError("Không thể tải câu hỏi sàng lọc. Vui lòng thử lại.");
      }
    };
    fetchQuestions();
  }, [registrationData, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.questionId === questionId ? { ...ans, answerValue: value } : ans
      )
    );
  };

  const handleSubmit = async () => {
    setError("");
    setShowBackHome(false);
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    // Kiểm tra xem tất cả câu hỏi đã được trả lời chưa
    const allAnswered = answers.every(ans => ans.answerValue !== undefined);
    if (!allAnswered) {
      setError("Vui lòng trả lời tất cả các câu hỏi để tiếp tục.");
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra câu trả lời
    const incorrect = answers.some((ans) => {
      const question = questions.find((q) => q.id === ans.questionId);
      // Giả sử correctAnswer là false (Không) cho tất cả các câu hỏi điều kiện
      return question && ans.answerValue !== false;
    });

    if (incorrect) {
      setError("Rất tiếc, bạn chưa đủ điều kiện hiến máu lần này. Cảm ơn bạn đã quan tâm. Mong sẽ gặp lại bạn trong lần tới!");
      setShowBackHome(true);
      setIsSubmitting(false);
      return;
    }

    // Gửi dữ liệu nếu đủ điều kiện
    try {
      // Đăng ký cuộc hẹn
      await axios.post(
        "http://localhost:8080/api/user/appointments/register",
        {
          userId: registrationData.userId,
          centerId: registrationData.centerId,
          scheduledDate: registrationData.scheduledDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Lưu câu trả lời (có thể gộp 2 API này lại ở backend để tối ưu)
      const answeredPayload = { 
        answers: answers.map(({ questionId, answerValue }) => ({ questionId, answerValue }))
      };
      await axios.post(
        "http://localhost:8080/api/health/answers",
        answeredPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.removeItem("registrationData");
      navigate("/member/success", { state: { ...registrationData } });
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      if (err.response?.data?.message) {
         setError(err.response.data.message);
      } else {
         setError("Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
      }
      if (err.response?.status >= 400 && err.response?.status < 500) {
        setShowBackHome(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const allQuestionsAnswered = answers.every(ans => ans.answerValue !== undefined);

  return (
    <div className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-800">Bảng câu hỏi Sức khỏe</h2>
            <p className="text-lg text-gray-600 mt-2">Vui lòng trả lời trung thực để đảm bảo an toàn cho chính bạn và người nhận máu.</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {error && (
            <AlertMessage
              message={error}
              type="error"
              onActionClick={showBackHome ? () => navigate("/") : null}
              actionText={showBackHome ? "Về trang chủ" : undefined}
            />
          )}

          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  answer={answers.find(a => a.questionId === q.id)}
                  onAnswerChange={handleAnswerChange}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Đang tải câu hỏi...</p>
            )}
          </div>
          
          {questions.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !allQuestionsAnswered}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất & Đăng ký"}
                {!isSubmitting && <FaRegArrowAltCircleRight />}
              </button>
               {!allQuestionsAnswered && (
                  <p className="text-sm text-gray-500 mt-2">Vui lòng trả lời hết các câu hỏi để tiếp tục.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationQuestionnairePage;