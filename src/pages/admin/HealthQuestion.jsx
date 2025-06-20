import React, { useState } from 'react';
import axios from 'axios';

const HealthQuestion = () => {
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');

    // Hàm xử lý tạo câu hỏi
    const handleCreateQuestion = () => {
        // Kiểm tra tính hợp lệ của dữ liệu
        if (!questionText.trim()) {
            setError('Câu hỏi không thể để trống.');
            return;
        }
        if (correctAnswer === null) {
            setError('Vui lòng chọn đáp án đúng.');
            return;
        }

        const newQuestion = {
            questionText,
            correctAnswer,
            isActive
        };

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        // Gửi yêu cầu POST lên backend
        axios.post('/api/health/questions', newQuestion, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data); // Log dữ liệu từ response nếu cần
                alert('Câu hỏi đã được tạo thành công!');
                setQuestionText('');
                setCorrectAnswer(null);
                setIsActive(true);
                setError('');
            })
            .catch(error => {
                setError('Có lỗi xảy ra khi tạo câu hỏi.');
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Quản lý câu hỏi</h1>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label>Câu hỏi:</label>
                <input
                    type="text"
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    placeholder="Nhập câu hỏi"
                />
            </div>
            <div>
                <label>Đáp án đúng:</label>
                <input
                    type="radio"
                    name="correctAnswer"
                    value="true"
                    checked={correctAnswer === true}
                    onChange={() => setCorrectAnswer(true)}
                /> Có
                <input
                    type="radio"
                    name="correctAnswer"
                    value="false"
                    checked={correctAnswer === false}
                    onChange={() => setCorrectAnswer(false)}
                /> Không
            </div>
            <div>
                <label>Trạng thái:</label>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                /> Kích hoạt
            </div>
            <button onClick={handleCreateQuestion}>Tạo câu hỏi</button>
        </div>
    );
};

export default HealthQuestion;
