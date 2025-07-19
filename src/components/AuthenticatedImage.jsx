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

      // FIX: Construct the full URL to the image, bypassing the '/api' prefix
      // from the default axiosClient baseURL.
      // 1. Get the base API URL from environment variables.
      const apiUrl = import.meta.env.VITE_API_URL;
      // 2. Derive the server root by removing the '/api' path.
      const serverRoot = apiUrl.replace('/api', '');
      // 3. Create the full, correct URL to the image resource.
      const fullImageUrl = `${serverRoot}${src}`;

      try {
        // 4. Make the request using the full URL. Axios won't prepend its baseURL
        //    when a full URL is provided, but our interceptor will still add the token.
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
    // FIX 2: Using a more reliable placeholder URL.
    return <img src="https://placehold.co/300x180/ffcdd2/d32f2f?text=Error" alt="Error loading" style={style} {...props} />;
  }

  if (!imageUrl) {
    // This is the placeholder while the image is loading.
    return <div style={{ ...style, backgroundColor: '#f0f0f0' }}></div>;
  }

  return <img src={imageUrl} alt={alt} style={style} {...props} />;
};

export default AuthenticatedImage;