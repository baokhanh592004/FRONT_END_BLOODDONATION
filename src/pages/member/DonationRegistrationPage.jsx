// src/pages/member/DonationRegistrationPage.js

// --- PHẦN 1: IMPORT CÁC THƯ VIỆN CẦN THIẾT ---
import React, { useState, useEffect } from 'react'; // Import React và các hook cơ bản: useState để quản lý trạng thái, useEffect để xử lý side effect (như gọi API)
import { useNavigate } from 'react-router-dom';     // Hook từ react-router-dom để điều hướng giữa các trang
import Calendar from 'react-calendar';             // Component lịch từ thư viện react-calendar
import axios from 'axios';                         // Thư viện để thực hiện các cuộc gọi HTTP (API requests)

// --- PHẦN 2: CÁC COMPONENT CON (UI Components) ---

// Component StyledCalendar: Một component được tùy chỉnh giao diện dựa trên `react-calendar`
// Nó nhận vào props `onChange` và `value` để hoạt động như một calendar thông thường.
const StyledCalendar = ({ onChange, value }) => {
    return (
      <Calendar
        onChange={onChange} // Hàm sẽ được gọi khi người dùng chọn một ngày
        value={value}       // Ngày đang được chọn
        minDate={new Date()} // Ngăn người dùng chọn các ngày trong quá khứ
        className="border-0" // Bỏ viền mặc định của calendar
        
        // Tùy chỉnh class cho mỗi ô ngày (tile) bằng Tailwind CSS
        tileClassName={({ date, view }) => {
          const classes = 'h-12 w-12 flex items-center justify-center rounded-full transition-colors duration-200';
          if (view === 'month') { // Chỉ áp dụng style cho chế độ xem tháng
            // Nếu là ngày đang được chọn, tô màu xanh
            if (value && date.toDateString() === value.toDateString()) {
              return `${classes} bg-blue-500 text-white font-bold`;
            }
            // Nếu là ngày hôm nay, tô nền nhạt
            if (date.toDateString() === new Date().toDateString()) {
              return `${classes} bg-blue-100 text-blue-700`;
            }
            // Style khi hover chuột vào các ngày khác
            return `${classes} hover:bg-red-100`;
          }
          return classes;
        }}
        // Tùy chỉnh hiển thị tên tháng và năm theo tiếng Việt
        navigationLabel={({ date }) => (
          <span className="font-semibold text-lg text-gray-800">
            Tháng {date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })}
          </span>
        )}
        // Ẩn các nút điều hướng năm không cần thiết
        prev2Label={null}
        next2Label={null}
        // Tùy chỉnh icon cho nút qua lại giữa các tháng
        prevLabel={<span className="text-2xl p-2 rounded-full hover:bg-gray-100">‹</span>}
        nextLabel={<span className="text-2xl p-2 rounded-full hover:bg-gray-100">›</span>}
      />
    );
};

// Component InfoRow: Một dòng thông tin đơn giản, có thể tái sử dụng
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}:</span> 
        {/* Hiển thị 'Chưa cập nhật' nếu giá trị là null hoặc undefined */}
        <span className="font-medium text-gray-900">{value || 'Chưa cập nhật'}</span>
    </div>
);
  
// Component UserInfoDisplay: Khung hiển thị thông tin người dùng
const UserInfoDisplay = ({ user }) => {
    // Nếu dữ liệu user chưa được tải xong, hiển thị thông báo "Đang tải..."
    if (!user) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
          Đang tải thông tin...
        </div>
      );
    }
    // Khi đã có dữ liệu, hiển thị thông tin chi tiết
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin cá nhân</h3>
        <div className="space-y-3">
            <InfoRow label="Họ và tên" value={user.fullName} />
            <InfoRow label="Giới tính" value={user.gender} />
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 border-b pb-2">Thông tin liên hệ</h3>
        <div className="space-y-3">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Số điện thoại" value={user.phoneNumber} />
            <InfoRow label="Địa chỉ" value={user.address} />
        </div>
      </div>
    );
};

// --- PHẦN 3: COMPONENT CHÍNH CỦA TRANG ---
export default function DonationRegistrationPage() {
    // --- Khai báo các State để quản lý dữ liệu và trạng thái của component ---
    const [user, setUser] = useState(null); // Lưu thông tin người dùng, ban đầu là null
    const [selectedDate, setSelectedDate] = useState(null); // Lưu ngày được chọn trên lịch
    const [isDateSelected, setIsDateSelected] = useState(false); // Cờ để kiểm tra người dùng đã chọn ngày chưa
    const [donationCenters, setDonationCenters] = useState([]); // Mảng lưu danh sách các trung tâm hiến máu
    const [selectedCenter, setSelectedCenter] = useState(''); // Lưu ID của trung tâm được chọn trong dropdown
    const [error, setError] = useState(''); // Lưu thông báo lỗi để hiển thị cho người dùng
    
    const navigate = useNavigate(); // Hook để thực hiện điều hướng trang
  
    // --- useEffect: Thực hiện các tác vụ khi component được render lần đầu ---
    // Mục đích: Tải dữ liệu người dùng và danh sách trung tâm hiến máu từ API
    useEffect(() => {
        const fetchInitialData = async () => {
          // Lấy token và thông tin người dùng đã lưu trong localStorage khi đăng nhập
          const token = localStorage.getItem('token');
          const storedUserJSON = localStorage.getItem('user');

          // Nếu không có token hoặc user, tức là chưa đăng nhập, chuyển hướng về trang login
          if (!token || !storedUserJSON) {
            navigate('/login', { replace: true });
            return;
          }

          try {
            // Gọi API để lấy thông tin chi tiết của người dùng
            const storedUser = JSON.parse(storedUserJSON);
            const userResponse = await axios.get(`http://localhost:8080/api/user/${storedUser.userId}/info`, { headers: { 'Authorization': `Bearer ${token}` } });
            // Cập nhật state `user` với thông tin đầy đủ
            setUser({ ...storedUser, ...userResponse.data });
    
            // Gọi API để lấy danh sách TẤT CẢ các trung tâm hiến máu từ endpoint mới '/all'
            const centersResponse = await axios.get('http://localhost:8080/api/user/donation-center/names', { headers: { 'Authorization': `Bearer ${token}` } });
            // Cập nhật state `donationCenters` với danh sách nhận được
            setDonationCenters(centersResponse.data);
            
            // Tự động chọn trung tâm đầu tiên trong danh sách làm giá trị mặc định cho dropdown
            if (centersResponse.data?.length > 0) {
              setSelectedCenter(centersResponse.data[0].center_id);
            }
          } catch (err) {
            // Nếu có lỗi trong quá trình gọi API, hiển thị thông báo cho người dùng
            setError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
            console.error("Fetch data error:", err); // Log lỗi ra console để debug
          }
        };
        fetchInitialData();
    }, [navigate]); // Dependency array chỉ có `navigate` để đảm bảo useEffect chỉ chạy 1 lần khi component mount
  
    // --- Các hàm xử lý sự kiện (Event Handlers) ---

    // Hàm được gọi khi người dùng chọn một ngày trên lịch
    const handleDateChange = (date) => {
        setSelectedDate(date); // Cập nhật state ngày được chọn
        setIsDateSelected(true); // Đánh dấu là đã chọn ngày (để hiển thị nút "Tiếp tục")
        setError(''); // Xóa thông báo lỗi cũ nếu có
    };
  
    // Hàm được gọi khi người dùng nhấn nút "Tiếp tục"
    const handleProceedToQuestionnaire = () => {
        // Kiểm tra dữ liệu đầu vào
        if (!selectedCenter) {
            setError('Vui lòng chọn một địa điểm hiến máu.');
            return;
        }
        if (!selectedDate) {
            setError('Vui lòng chọn một ngày hiến máu.');
            return;
        }
        // Chuẩn bị dữ liệu để gửi sang trang tiếp theo
        const registrationData = {
            userId: user.userId,
            center_id: parseInt(selectedCenter, 10), // Chuyển ID trung tâm về dạng số nguyên
            scheduledDate: selectedDate.toISOString().split('T')[0], // Định dạng ngày thành 'YYYY-MM-DD'
        };
        // Điều hướng đến trang bảng câu hỏi, truyền dữ liệu qua `state`
        navigate('/member/donation-questionnaire', { state: registrationData });
    };

    // --- PHẦN 4: RENDER GIAO DIỆN (JSX) ---
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Đăng ký lịch hẹn hiến máu</h2>
          {/* Hiển thị thông báo lỗi nếu có */}
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-6 font-medium">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột bên trái: Hiển thị thông tin người dùng */}
              <div className="flex flex-col gap-8">
                  <UserInfoDisplay user={user} />
              </div>
              {/* Cột bên phải: Chọn địa điểm và ngày hẹn */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                {/* Dropdown chọn địa điểm */}
                <div className="mb-6">
                  <label htmlFor="donation-center" className="block text-lg font-semibold mb-2 text-gray-700">Chọn địa điểm hiến máu</label>
                  <select
                    id="donation-center"
                    value={selectedCenter} // Giá trị của dropdown được kiểm soát bởi state `selectedCenter`
                    onChange={(e) => setSelectedCenter(e.target.value)} // Cập nhật state khi người dùng chọn
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* Hiển thị "Đang tải..." nếu danh sách chưa có */}
                    {donationCenters.length === 0 ? (
                      <option value="" disabled>Đang tải...</option>
                    ) : (
                      // Render danh sách các lựa chọn từ state `donationCenters`
                      donationCenters.map((center) => (
                        <option key={center.center_id} value={center.center_id}>{center.name}</option>
                      ))
                    )}
                  </select>
                </div>
  
                {/* Lịch để chọn ngày */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Chọn ngày bạn có thể đến</h3>
                  <div className="flex justify-center">
                      <StyledCalendar onChange={handleDateChange} value={selectedDate} />
                  </div>
                </div>
  
                {/* Nút "Tiếp tục" chỉ hiển thị sau khi người dùng đã chọn ngày */}
                {isDateSelected && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleProceedToQuestionnaire}
                      // Vô hiệu hóa nút nếu thông tin user hoặc địa điểm chưa được chọn
                      disabled={!user || !selectedCenter}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Tiếp tục
                    </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    );
}