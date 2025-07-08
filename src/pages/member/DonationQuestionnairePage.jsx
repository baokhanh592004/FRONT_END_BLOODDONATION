import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DonationQuestionnairePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackHome, setShowBackHome] = useState(false); // ✅ Thêm dòng này

  const registrationData = (() => {
    const state = location.state;
    const stored = localStorage.getItem("registrationData");
    return state || (stored ? JSON.parse(stored) : null);
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (
      !registrationData?.userId ||
      !registrationData?.centerId ||
      !registrationData?.scheduledDate
    ) {
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
        const response = await axios.get("/api/health/questions", {
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
    setShowBackHome(false); // ✅ Reset khi bắt đầu gửi
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
      setShowBackHome(true); // ✅ Hiển thị nút trở về
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "/api/health/answers",
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        "/api/user/appointments/register",
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
        setShowBackHome(true); // ✅ Trường hợp lỗi từ backend
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Câu hỏi sàng lọc sức khỏe
      </h2>

      {error && (
        <>
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center font-medium">
            {error}
          </p>

          {showBackHome && (
            <div className="text-center mb-6">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-semibold"
              >
                Trở về trang chủ
              </button>
            </div>
          )}
        </>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="text-lg font-medium mb-2">{q.questionText}</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value="true"
                  checked={
                    answers.find(
                      (ans) =>
                        ans.questionId === q.id && ans.answerValue === true
                    ) !== undefined
                  }
                  onChange={() => handleAnswerChange(q.id, true)}
                />
                Có
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value="false"
                  checked={
                    answers.find(
                      (ans) =>
                        ans.questionId === q.id && ans.answerValue === false
                    ) !== undefined
                  }
                  onChange={() => handleAnswerChange(q.id, false)}
                />
                Không
              </label>
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận & Tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationQuestionnairePage;
