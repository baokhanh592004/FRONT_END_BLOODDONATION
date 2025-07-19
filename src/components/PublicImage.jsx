// src/components/PublicImage.jsx
import React, { useState } from 'react';

const PublicImage = ({ src, alt, style, ...props }) => {
  const [error, setError] = useState(false);

  // Nếu không có src, hiển thị một placeholder rỗng
  if (!src) {
    return <div style={{ ...style, backgroundColor: '#e0e0e0' }}></div>;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  let fullImageUrl = '';

  try {
    // Lấy phần gốc của URL (ví dụ: "http://localhost:8080")
    // từ "http://localhost:8080/api"
    const serverRoot = new URL(apiUrl).origin;
    
    // Đảm bảo đường dẫn `src` từ DB luôn bắt đầu bằng "/"
    const imagePath = src.startsWith('/') ? src : `/${src}`;

    // Ghép phần gốc với đường dẫn để có URL hoàn chỉnh
    // Kết quả: "http://localhost:8080" + "/api/uploads/my-image.jpg"
    fullImageUrl = `${serverRoot}${imagePath}`;
    
  } catch (e) {
    console.error("Lỗi tạo URL ảnh, kiểm tra biến VITE_API_URL:", e);
    // Nếu có lỗi, chúng ta sẽ để fullImageUrl trống để render ảnh lỗi bên dưới
  }

  // Nếu có lỗi khi tải ảnh hoặc tạo URL, hiển thị một ảnh placeholder báo lỗi
  if (error || !fullImageUrl) {
    return <img src="https://placehold.co/300x200/ffebee/d32f2f?text=Error" alt="Lỗi tải ảnh" style={style} {...props} />;
  }

  return (
    <img 
      src={fullImageUrl} 
      alt={alt} 
      style={style} 
      // Bắt sự kiện lỗi của chính thẻ <img>
      onError={() => setError(true)}
      {...props} 
    />
  );
};

export default PublicImage;