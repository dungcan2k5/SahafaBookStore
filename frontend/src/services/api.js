import axios from 'axios';

const api = axios.create({
    // Sử dụng biến môi trường đã khai báo ở bước 1
    // baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`,
    baseURL: "https://sahafa.dungcan.id.vn", // Tạm thời cố định URL Backend
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
        // Lấy cục data thô từ backend
        const res = response.data; 

        // Nếu cấu trúc chuẩn { success: true, data: [...], meta: {...} }
        if (res && res.success === true && res.data) {
            const output = res.data;
            
            // TRICK: Nếu output là mảng, ta lén gắn thêm meta vào nó luôn
            if (Array.isArray(output) && res.meta) {
                output.meta = res.meta;
            }
            
            return output; // Trả về mảng (nhưng đã có kèm meta ẩn)
        }

        // Các trường hợp khác (lỗi, hoặc trả về raw)
        return res; 
    },
    (error) => Promise.reject(error)
);


export default api;