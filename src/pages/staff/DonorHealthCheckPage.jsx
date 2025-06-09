import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Dùng lại dữ liệu giả ở đây để tìm thông tin người dùng
const mockDonors = [
  { id: 1, name: 'Nguyễn Văn A', bloodType: 'O+', dob: '12/01/1990', status: 'pending' },
  { id: 2, name: 'Trần Thị B', bloodType: 'A-', dob: '07/07/1985', status: 'pending' },
  { id: 3, name: 'Lê Văn Luyện', bloodType: 'B+', dob: '03/05/1995', status: 'completed' },
];


const DonorHealthCheckPage = () => {
  // Lấy ID từ URL, ví dụ: /staff/donors/1 -> donorId sẽ là "1"
  const { donorId } = useParams(); 
  // Dùng để điều hướng sau khi submit
  const navigate = useNavigate(); 
  
  const [donor, setDonor] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    bloodPressure: '',
    note: ''
  });

  // Giả lập việc fetch dữ liệu của một người dùng khi trang được tải
  useEffect(() => {
    const foundDonor = mockDonors.find(d => d.id === parseInt(donorId));
    if (foundDonor) {
      setDonor(foundDonor);
    } else {
      // Xử lý trường hợp không tìm thấy người dùng
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
    // Trong thực tế, bạn sẽ gửi `formData` đến API để lưu lại
    console.log(`Đang lưu thông tin sức khỏe cho ${donor.name}:`, formData);
    alert('Lưu thông tin thành công! Đang quay lại trang danh sách.');
    // Sau khi lưu, quay trở lại trang danh sách
    navigate('/staff/donors');
  };

  // Hiển thị loading nếu chưa tìm thấy thông tin
  if (!donor) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Khai báo thông tin sức khỏe</h1>
      <p className="text-lg text-gray-600 mb-6">Người hiến máu: <span className="font-semibold">{donor.name}</span></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Ví dụ: 65"
          />
        </div>
        <div>
          <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">Huyết áp (mmHg)</label>
          <input
            type="text"
            id="bloodPressure"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Ví dụ: 120/80"
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Các thông tin cần lưu ý..."
          ></textarea>
        </div>
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