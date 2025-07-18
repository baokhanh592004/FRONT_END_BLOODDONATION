import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient"; // ✅ Đã đổi axios -> axiosClient

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const DonationQuestionnairePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackHome, setShowBackHome] = useState(false);

  const registrationData = (() => {
    const state = location.state;
    const stored = localStorage.getItem("registrationData");
    return state || (stored ? JSON.parse(stored) : null);
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!registrationData?.userId || !registrationData?.centerId || !registrationData?.scheduledDate) {
      navigate("/register-donation");
      return;
    }
    if (!token) {
      setError("Vui lòng đăng nhập để tiếp tục.");
      navigate("/login");
      return;
    }
    const fetchQuestions = async () => {
      try {
        const response = await axiosClient.get("health/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (err) {
        console.error("Lỗi khi tải câu hỏi:", err);
        setError("Không thể tải câu hỏi sàng lọc. Vui lòng thử lại.");
      }
    };
    fetchQuestions();
  }, [registrationData, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const existing = prev.find((ans) => ans.questionId === questionId);
      if (existing) {
        return prev.map((ans) =>
          ans.questionId === questionId ? { ...ans, answerValue: value } : ans
        );
      } else {
        return [...prev, { questionId, answerValue: value }];
      }
    });
  };

  const handleSubmit = async () => {
    setError("");
    setShowBackHome(false);
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (answers.length !== questions.length) {
      setError("Vui lòng trả lời tất cả câu hỏi.");
      setIsSubmitting(false);
      return;
    }

    const incorrect = answers.some((ans) => {
      const question = questions.find((q) => q.id === ans.questionId);
      return question && ans.answerValue !== question.correctAnswer;
    });

    if (incorrect) {
      setError("Bạn không đủ điều kiện hiến máu. Hy vọng sẽ nhận được sự giúp đỡ của bạn lần sau!");
      setShowBackHome(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosClient.post(
        "health/answers",
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axiosClient.post(
        "user/appointments/register",
        {
          userId: registrationData.userId,
          centerId: registrationData.centerId,
          scheduledDate: registrationData.scheduledDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("registrationData");
      navigate("/member/success", {
        state: {
          userId: registrationData.userId,
          centerId: registrationData.centerId,
          scheduledDate: registrationData.scheduledDate,
          answers,
          questions,
        },
      });
    } catch (err) {
      console.error("Lỗi khi gửi:", err);
      if (err.response?.status === 400) {
        setError("Bạn không đủ điều kiện hiến máu.");
        setShowBackHome(true);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="flex justify-center">
              <ClipboardIcon />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Bảng câu hỏi sàng lọc sức khỏe
            </h1>
            <p className="text-gray-600 text-lg">
              Vui lòng trả lời trung thực để đảm bảo an toàn cho sức khỏe của bạn.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8 flex items-start" role="alert">
              <AlertIcon />
              <div>
                <p className="font-bold text-red-800">Thông báo quan trọng</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {showBackHome && (
            <div className="text-center mb-8">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
              >
                Trở về trang chủ
              </button>
            </div>
          )}

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  <span className="text-red-600 font-bold mr-2">{index + 1}.</span>
                  {q.questionText}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {[{ label: "Có", value: true }, { label: "Không", value: false }].map((option) => (
                    <label key={option.label}
                      className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        answers.find(ans => ans.questionId === q.id)?.answerValue === option.value
                          ? 'border-red-500 bg-red-50 shadow-md'
                          : 'border-gray-300 bg-white hover:border-red-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        checked={answers.find(ans => ans.questionId === q.id)?.answerValue === option.value}
                        onChange={() => handleAnswerChange(q.id, option.value)}
                        className="sr-only peer"
                      />
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                        answers.find(ans => ans.questionId === q.id)?.answerValue === option.value
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-400'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      </span>
                      <span className={`font-semibold ${
                        answers.find(ans => ans.questionId === q.id)?.answerValue === option.value
                          ? 'text-red-800'
                          : 'text-gray-700'
                      }`}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || questions.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Xác nhận & Tiếp tục</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationQuestionnairePage;
