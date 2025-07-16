// src/App.jsx
import React from "react";
import AppRouters from "./routers/AppRouter";
import { AuthProvider } from "./auth/AuthProvider"; // 1. Import AuthProvider từ file đúng

export default function App() {
  return (
    // 2. Bọc toàn bộ ứng dụng trong AuthProvider
    <AuthProvider>
      <AppRouters />
    </AuthProvider>
  );
}