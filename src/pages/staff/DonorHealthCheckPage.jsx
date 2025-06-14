import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Dữ liệu giả
const mockDonors = [
  { id: 1, name: 'Nguyễn Văn A', bloodType: 'O+', dob: '12/01/1990', status: 'pending' },
  { id: 2, name: 'Trần Thị B', bloodType: 'A-', dob: '07/07/1985', status: 'pending' },
  { id: 3, name: 'Lê Văn Luyện', bloodType: 'B+', dob: '03/05/1995', status: 'completed' },
];

const DonorHealthCheckPage = () => {
  const { donorId } = useParams();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    bloodPressure: '',
    temperature: '',
    heartRate: '',
    currentHealth: '',
    medicalHistory: '',
    note: ''
  });

  useEffect(() => {
    const foundDonor = mockDonors.find(d => d.id === parseInt(donorId));
    if (foundDonor) {
      setDonor(foundDonor);
    } else {
      alert("Không tìm thấy người đăng ký!");
      navigate('/staff/donors');
    }
  }, [donorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Đang lưu thông tin sức khỏe cho ${donor.name}:`, formData);
    alert('Lưu thông tin thành công! Đang quay lại trang danh sách.');
    navigate('/staff/donors');
  };

  if (!donor) return <div>Đang tải thông tin...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Khai báo thông tin sức khỏe</h1>
      <p className="text-lg text-gray-600 mb-6">
        Người hiến máu: <span className="font-semibold">{donor.name}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cân nặng */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ví dụ: 65"
          />
        </div>

        {/* Huyết áp */}
        <div>
          <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">Huyết áp (mmHg)</label>
          <input
            type="text"
            id="bloodPressure"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ví dụ: 120/80"
          />
        </div>

        {/* Nhiệt độ */}
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Nhiệt độ cơ thể (°C)</label>
          <input
            type="number"
            step="0.1"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ví dụ: 36.6"
          />
        </div>

        {/* Nhịp tim */}
        <div>
          <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">Nhịp tim (lần/phút)</label>
          <input
            type="number"
            id="heartRate"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ví dụ: 75"
          />
        </div>

        {/* Tình trạng hiện tại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng hiện tại</label>
          <div className="space-y-2">
            {['Khỏe mạnh', 'Mệt mỏi nhẹ', 'Đau đầu/Buồn nôn'].map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="currentHealth"
                  value={option}
                  checked={formData.currentHealth === option}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Tiền sử bệnh */}
        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Tiền sử bệnh lý / Đang dùng thuốc?</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ghi rõ nếu có..."
          ></textarea>
        </div>

        {/* Ghi chú thêm */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            placeholder="Các thông tin cần lưu ý..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/staff/donors')}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Lưu và Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonorHealthCheckPage;
