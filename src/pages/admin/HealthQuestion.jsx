import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthQuestion = () => {
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // ✅ đang chỉnh sửa?
    const [editId, setEditId] = useState(null); // ✅ ID cần sửa

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ hoặc hết hạn.');
            return;
        }

        axios
            .get('/api/health/questions', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError('Không thể tải danh sách câu hỏi.');
            });
    };

    const handleCreateQuestion = () => {
        if (!questionText.trim()) {
            setError('Câu hỏi không thể để trống.');
            return;
        }
        if (correctAnswer === null) {
            setError('Vui lòng chọn đáp án đúng.');
            return;
        }

        const newQuestion = { questionText, correctAnswer, isActive };
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        axios
            .post('/api/health/questions', newQuestion, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                alert('Câu hỏi đã được tạo thành công!');
                resetForm();
                setQuestions([...questions, res.data]);
            })
            .catch((err) => {
                console.error(err);
                setError('Có lỗi xảy ra khi tạo câu hỏi.');
            });
    };

    const handleUpdateQuestion = () => {
        if (!questionText.trim()) {
            setError('Câu hỏi không thể để trống.');
            return;
        }

        const updatedQuestion = {
            id: editId, // ✅ cần có ID ở đây!
            questionText,
            correctAnswer,
            isActive
        };

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ hoặc hết hạn.');
            return;
        }

        axios
            .put('/api/health/questions', updatedQuestion, { // ✅ bỏ /${editId}, dùng đúng route backend
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                alert('Câu hỏi đã được cập nhật!');
                resetForm();
                setQuestions(
                    questions.map((q) => (q.id === editId ? res.data : q))
                );
            })
            .catch((err) => {
                console.error(err);
                setError('Có lỗi xảy ra khi cập nhật câu hỏi.');
            });
    };

    const resetForm = () => {
        setQuestionText('');
        setCorrectAnswer(null);
        setIsActive(true);
        setIsEditing(false);
        setEditId(null);
        setError('');
    };
    const handleDeleteQuestion = (id) => {
        const confirmed = window.confirm('Bạn có chắc muốn xóa câu hỏi này?');
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ hoặc hết hạn.');
            return;
        }

        axios.delete(`/api/health/questions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert('Đã xóa câu hỏi.');
                setQuestions(questions.filter((q) => q.id !== id));
                if (editId === id) resetForm(); // reset nếu đang sửa câu bị xóa
            })
            .catch((err) => {
                console.error(err);
                setError('Có lỗi khi xóa câu hỏi.');
            });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Quản lý câu hỏi</h1>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.formGroup}>
                <label style={styles.label}>Câu hỏi:</label>
                <input
                    type="text"
                    style={styles.inputText}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Nhập câu hỏi"
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Đáp án đúng:</label>
                <div style={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="correctAnswer"
                            value="true"
                            checked={correctAnswer === true}
                            onChange={() => setCorrectAnswer(true)}
                        />{' '}
                        Có
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="correctAnswer"
                            value="false"
                            checked={correctAnswer === false}
                            onChange={() => setCorrectAnswer(false)}
                        />{' '}
                        Không
                    </label>
                </div>
            </div>

            <div style={styles.formGroup}>
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
                    />{' '}
                    Kích hoạt
                </label>
            </div>

            {isEditing ? (
                <>
                    <button style={styles.button} onClick={handleUpdateQuestion}>
                        Cập nhật câu hỏi
                    </button>
                    <button style={styles.cancelButton} onClick={resetForm}>
                        Hủy chỉnh sửa
                    </button>
                </>
            ) : (
                <button style={styles.button} onClick={handleCreateQuestion}>
                    Tạo câu hỏi
                </button>
            )}

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>
                    Danh sách câu hỏi:
                </h2>
                {questions.length === 0 ? (
                    <p>Chưa có câu hỏi nào.</p>
                ) : (
                    <ul style={{ paddingLeft: 0 }}>
                        {questions.map((q) => (
                            <li
                                key={q.id}
                                style={{
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    marginBottom: '10px',
                                    listStyle: 'none',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <strong>{q.questionText}</strong>
                                <br />
                                Đáp án đúng: <b>{q.correctAnswer ? 'Có' : 'Không'}</b>
                                <br />
                                Trạng thái:{' '}
                                {q.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                <br />
                                <button
                                    onClick={() => {
                                        setQuestionText(q.questionText);
                                        setCorrectAnswer(q.correctAnswer);
                                        setIsActive(q.isActive);
                                        setIsEditing(true);
                                        setEditId(q.id);
                                    }}
                                    style={{
                                        marginTop: '8px',
                                        backgroundColor: '#ffc107',
                                        color: '#333',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    Sửa
                                </button>

                                <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    style={{
                                        marginTop: '8px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Xoá
                                </button>


                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    },
    title: {
        textAlign: 'center',
        fontSize: '26px',
        marginBottom: '24px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
    },
    inputText: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    radioGroup: {
        display: 'flex',
        gap: '20px',
        marginTop: '8px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    cancelButton: {
        width: '100%',
        marginTop: '10px',
        padding: '12px',
        backgroundColor: '#6c757d',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontWeight: '500',
        marginBottom: '15px',
        textAlign: 'center',
    },
};

export default HealthQuestion;
