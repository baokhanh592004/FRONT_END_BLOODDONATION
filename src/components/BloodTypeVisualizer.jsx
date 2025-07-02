import React, { useState } from 'react';
import './BloodTypeVisualizer.css';

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
  const [selectedDonor, setSelectedDonor] = useState('A');

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
          <g>
            {bloodTypes.map((donorType, donorIndex) =>
              compatibilityData[donorType].canDonateTo.map((recipientType) => {
                const recipientIndex = bloodTypes.indexOf(recipientType);
                const isActive = selectedDonor === donorType;
                const pathKey = `${donorType}-${recipientType}`;
                const verticalGap = 100; // Khoảng cách giữa các nút
                const donorY = donorIndex * verticalGap + 35;
                const recipientY = recipientIndex * verticalGap + 35;

                const pathData = `M 0 ${donorY} C 50 ${donorY}, 50 ${recipientY}, 100 ${recipientY}`;
                return (
                  <path
                    key={pathKey}
                    className={`connection-path ${isActive ? 'active' : ''}`}
                    d={pathData}
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