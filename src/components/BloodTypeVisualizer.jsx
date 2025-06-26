// src/components/BloodTypeVisualizer/BloodTypeVisualizer.js
import React, { useState } from 'react';
import './BloodTypeVisualizer.css'; // Import file CSS để định dạng

// Dữ liệu về khả năng tương thích khi hiến máu
const compatibilityData = {
  O: {
    canDonateTo: ['O', 'A', 'B', 'AB'],
    description: 'Nhóm O là nhóm cho phổ thông, có thể hiến tế bào hồng cầu cho bất kỳ ai.',
  },
  A: {
    canDonateTo: ['A', 'AB'],
    description: 'Nhóm A có thể hiến tế bào hồng cầu cho nhóm A và AB.',
  },
  B: {
    canDonateTo: ['B', 'AB'],
    description: 'Nhóm B có thể hiến tế bào hồng cầu cho nhóm B và AB.',
  },
  AB: {
    canDonateTo: ['AB'],
    description: 'Nhóm AB chỉ có thể hiến tế bào hồng cầu cho những người cùng nhóm AB.',
  },
};

const bloodTypes = ['O', 'A', 'B', 'AB'];

const BloodTypeVisualizer = () => {
  // State để lưu trữ nhóm máu người cho đang được chọn
  const [selectedDonor, setSelectedDonor] = useState('A'); // Mặc định chọn nhóm A giống ảnh của bạn

  const handleDonorClick = (type) => {
    setSelectedDonor(type);
  };

  const compatibleRecipients = compatibilityData[selectedDonor]?.canDonateTo || [];

  return (
    <div className="visualizer-container">
      <h2 className="visualizer-title">Click vào một nhóm máu để tìm hiểu thêm.</h2>
      <div className="visualizer-main">
        {/* Cột người cho (DONOR) */}
        <div className="column">
          <h3 className="column-title">DONOR</h3>
          <div className="nodes-container">
            {bloodTypes.map((type) => (
              <div
                key={`donor-${type}`}
                className={`node blood-bag ${selectedDonor === type ? 'active' : ''}`}
                onClick={() => handleDonorClick(type)}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Lớp SVG để vẽ các đường nối */}
        <svg className="connector-svg" viewBox="0 0 100 400" preserveAspectRatio="none">
          <defs>
            {/* Tạo gradient để đường line có màu đỏ */}
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <g>
            {/* Vẽ tất cả các đường nối có thể */}
            {bloodTypes.map((donorType, donorIndex) =>
              compatibilityData[donorType].canDonateTo.map((recipientType) => {
                const recipientIndex = bloodTypes.indexOf(recipientType);
                const isActive = selectedDonor === donorType;

                // Tạo một đường cong Bezier mượt mà
                // M: Move to (điểm bắt đầu)
                // C: Curve to (control point 1, control point 2, end point)
                const pathData = `M 0 ${donorIndex * 100 + 50} C 50 ${donorIndex * 100 + 50}, 50 ${recipientIndex * 100 + 50}, 100 ${recipientIndex * 100 + 50}`;
                
                return (
                  <path
                    key={`${donorType}-${recipientType}`}
                    className={`connection-path ${isActive ? 'active' : ''}`}
                    d={pathData}
                    stroke="url(#line-gradient)"
                  />
                );
              })
            )}
          </g>
        </svg>

        {/* Cột người nhận (RECIPIENT) */}
        <div className="column">
          <h3 className="column-title">RECIPIENT</h3>
          <div className="nodes-container">
            {bloodTypes.map((type) => (
              <div
                key={`recipient-${type}`}
                className={`node recipient-circle ${
                  compatibleRecipients.includes(type) ? 'active' : ''
                }`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="description-text">
        {compatibilityData[selectedDonor]?.description}
      </p>
    </div>
  );
};

export default BloodTypeVisualizer;