import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function LoginGoogle() {
  const [user, setUser] = useState(null);

//   const handleLoginSuccess = (credentialResponse) => {
//     const decoded = jwtDecode(credentialResponse.credential);
//     console.log('Decoded user info:', decoded);
//     setUser(decoded);
//   };
//=============================================== MỚI sửa=====================

const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    const decoded = jwtDecode(idToken);
    console.log('Decoded user info:', decoded);
    setUser(decoded);
  
    try {
      const res = await fetch('http://localhost:8080/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
  
      const result = await res.json();
      console.log('Back-end response:', result);
    } catch (error) {
      console.error('Error sending token to back-end:', error);
    }
  };
//=============================================== MỚI sửa=====================  
  return (
    <div>
      {user ? (
        <div>
          <h2>Xin chào, {user.name}</h2>
          <img src={user.picture} alt="Avatar" style={{ borderRadius: '50%' }} />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      )}
    </div>
  );
}
    