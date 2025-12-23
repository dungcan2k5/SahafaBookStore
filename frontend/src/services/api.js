import axios from 'axios';

// 1. Tạo instance axios với đường dẫn gốc
// QUAN TRỌNG: Đổi về localhost:3000 để dùng được tài khoản Admin "demo" vừa tạo ở máy bạn
const api = axios.create({
    // Dùng biến môi trường thay vì gõ cứng
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Tự động gắn Token vào header mỗi khi gọi API (Interceptor)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;