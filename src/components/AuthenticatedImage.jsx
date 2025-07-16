// src/components/AuthenticatedImage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// =======================================================
// THAY ĐỔI 1: Định nghĩa API_URL và tạo axios instance
// =======================================================
const API_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
});

const AuthenticatedImage = ({ src, alt, style, ...props }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (!src) return;

            const token = localStorage.getItem('token');
            if (!token) {
                setError(true);
                return;
            }

            try {
                // =======================================================
                // THAY ĐỔI 2: Sử dụng axios instance đã tạo và chỉ truyền đường dẫn tương đối
                // =======================================================
                const response = await api.get(src, { // `src` bây giờ chỉ là "/uploads/..."
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        return <div style={{...style, backgroundColor: '#f0f0f0'}}></div>;
    }

    return <img src={imageUrl} alt={alt} style={style} {...props} />;
};

export default AuthenticatedImage;