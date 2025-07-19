// src/components/AuthenticatedImage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthenticatedImage = ({ src, alt, style, ...props }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!src) return;

      try {
        const response = await axiosClient.get(src, {
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
        console.error("Failed to load authenticated image:", err);
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

  if (error) {
    return <img src="https://via.placeholder.com/300x180?text=Error" alt="Error loading" style={style} {...props} />;
  }

  if (!imageUrl) {
    return <div style={{ ...style, backgroundColor: '#f0f0f0' }}></div>;
  }

  return <img src={imageUrl} alt={alt} style={style} {...props} />;
};

export default AuthenticatedImage;
