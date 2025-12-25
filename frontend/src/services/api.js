import axios from 'axios';

const api = axios.create({
    // Sử dụng biến môi trường đã khai báo ở bước 1
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

// 👇 THÊM ĐOẠN NÀY: Tự động lấy mảng 'data' bên trong response
api.interceptors.response.use(
    (response) => {
        // Nếu Backend trả về { success: true, data: { ... } }
        if (response.data && response.data.success === true && response.data.data) {
            return response.data.data;
        }
        // Nếu không có success/data, trả về toàn bộ body để Store tự xử lý
        return response.data; 
    },
    (error) => Promise.reject(error)
);


export default api;