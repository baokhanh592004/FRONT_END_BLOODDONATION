import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const PAGE_SIZE = 10;

const HealthQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Token không hợp lệ.');

    axiosClient
      .get('/api/health/questions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setQuestions(res.data))
      .catch(() => setError('Không thể tải danh sách câu hỏi.'));
  };

  const handleSubmit = () => {
    if (!questionText.trim() || correctAnswer === null) {
      setError('Điền đầy đủ thông tin.');
      return;
    }

    const token = localStorage.getItem('token');
    const data = { questionText, correctAnswer, isActive };
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (isEditing) {
      axiosClient
        .put('/api/health/questions', { ...data, id: editId }, config)
        .then((res) => {
          setQuestions((prev) => prev.map((q) => (q.id === editId ? res.data : q)));
          resetForm();
        })
        .catch(() => setError('Lỗi cập nhật.'));
    } else {
      axiosClient
        .post('/api/health/questions', data, config)
        .then((res) => {
          setQuestions((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch(() => setError('Lỗi tạo câu hỏi.'));
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setCorrectAnswer(null);
    setIsActive(true);
    setIsEditing(false);
    setEditId(null);
    setError('');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    const token = localStorage.getItem('token');
    axiosClient
      .delete(`/api/health/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        if (editId === id) resetForm();
      });
  };

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const currentQuestions = questions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Câu hỏi sức khỏe</h2>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Tạo câu hỏi
        </button>
      )}

      {showForm && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <input
            type="text"
            placeholder="Câu hỏi"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <div className="flex gap-4 mb-3">
            <label>
              <input
                type="radio"
                checked={correctAnswer === true}
                onChange={() => setCorrectAnswer(true)}
              />{' '}
              Có
            </label>
            <label>
              <input
                type="radio"
                checked={correctAnswer === false}
                onChange={() => setCorrectAnswer(false)}
              />{' '}
              Không
            </label>
          </div>

          <label className="mb-3 block">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive((prev) => !prev)}
            />{' '}
            Kích hoạt
          </label>

          <div className="flex gap-4">
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
              {isEditing ? 'Cập nhật' : 'Tạo'}
            </button>
            <button onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Hủy
            </button>
          </div>
        </div>
      )}

      <ul>
        {currentQuestions.map((q) => (
          <li key={q.id} className="border p-4 mb-3 rounded shadow-sm">
            <p className="font-semibold">{q.questionText}</p>
            <p>Đáp án đúng: {q.correctAnswer ? 'Có' : 'Không'}</p>
            <p>Trạng thái: {q.isActive ? 'Đang hoạt động' : 'Không hoạt động'}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setQuestionText(q.questionText);
                  setCorrectAnswer(q.correctAnswer);
                  setIsActive(q.isActive);
                  setIsEditing(true);
                  setEditId(q.id);
                  setShowForm(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default HealthQuestion;
