// src/components/AuthenticatedImage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthenticatedImage = ({ src, alt, style, ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!src) {
        setError(true);
        return;
      }

      try {
        // THÊM LẠI DÒNG KHAI BÁO BỊ THIẾU TẠI ĐÂY
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          console.error("Lỗi: Biến VITE_API_URL chưa được thiết lập!");
          setError(true);
          return;
        }

        const cleanedSrc = src.startsWith('/') ? src.substring(1) : src;
        const fullImageUrl = `${apiUrl}/${cleanedSrc}`;

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
        // In ra console để gỡ lỗi tốt hơn
        const apiUrlForError = import.meta.env.VITE_API_URL || "NOT_SET";
        console.error("Không thể tải ảnh:", err, `(URL attempted: ${apiUrlForError}/${src})`);
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

  if (error || !imageUrl) {
    if (!src) {
      return <div style={{ ...style, backgroundColor: '#e0e0e0' }}></div>;
    }
    return <img src="https://placehold.co/300x200/ffebee/d32f2f?text=Error" alt="Lỗi tải ảnh" style={style} {...props} />;
  }
  
  return <img src={imageUrl} alt={alt} style={style} {...props} />;
};

export default AuthenticatedImage;