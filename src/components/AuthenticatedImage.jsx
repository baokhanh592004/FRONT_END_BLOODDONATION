// src/components/AuthenticatedImage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthenticatedImage = ({ src, alt, style, ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      // Nếu không có src (post không có ảnh), thì không làm gì cả
      if (!src) {
        setError(true); // Đặt là lỗi để hiển thị ảnh placeholder
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            console.error("Lỗi: Biến VITE_API_URL chưa được thiết lập!");
            setError(true);
            return;
        }

        const serverUrl = new URL(apiUrl);

        // =================================================================
        // SỬA LỖI TẠI ĐÂY
        // Chúng ta thêm tường minh "/uploads/" vào giữa tên miền và tên file (src)
        // để tạo ra đường dẫn chính xác.
        const fullImageUrl = `${serverUrl.origin}/uploads/${src}`;
        // =================================================================

        const response = await axiosClient.get(fullImageUrl, {
          responseType: 'blob',
        });

        const objectUrl = URL.createObjectURL(response.data);

        if (isMounted) {
          setImageUrl(objectUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
        console.error("Không thể tải ảnh đã xác thực:", err, `(src: ${src})`);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [src]);

  // Nếu có lỗi hoặc đang tải, hiển thị placeholder
  if (error || !imageUrl) {
    // Nếu src không tồn tại, có thể hiển thị một placeholder khác hoặc không hiển thị gì
    if (!src) {
      return <div style={{ ...style, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>No Image</div>;
    }
    // Nếu có lỗi khi tải
    return <img src="https://placehold.co/300x180/ffcdd2/d32f2f?text=Error" alt="Lỗi tải ảnh" style={style} {...props} />;
  }
  
  // Khi đã có ảnh thì hiển thị
  return <img src={imageUrl} alt={alt} style={style} {...props} />;
};

export default AuthenticatedImage;