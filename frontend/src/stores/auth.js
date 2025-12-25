import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api'; 

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const isLoading = ref(false);
    const error = ref(null);

    // HÀM ĐĂNG NHẬP
    const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    try {
        const res = await api.post('/auth/login', { email, password });
        
        // Log để kiểm tra cấu trúc thật (Nếu vẫn undefined thì phải sửa api.js)
        console.log("Dữ liệu sau Interceptor:", res); 

        // SỬA TẠI ĐÂY: Kiểm tra linh hoạt các tầng dữ liệu
        let finalData = res;
        
        // Nếu res bị undefined hoặc không có token, thử lấy từ res.data (phòng hờ Interceptor lỗi)
        if (!finalData || !finalData.token) {
            finalData = res?.data;
        }

        if (finalData && finalData.token) {
            token.value = finalData.token;
            user.value = finalData.user;
            localStorage.setItem('token', finalData.token);
            localStorage.setItem('user', JSON.stringify(finalData.user));
            return true;
        } else {
            error.value = "Thông tin phản hồi từ Server không hợp lệ (Thiếu Token)";
            return false;
        }
    } catch (err) {
        console.error("Login Error:", err);
        error.value = err.response?.data?.message || 'Đăng nhập thất bại';
        return false;
    } finally {
        isLoading.value = false;
    }
};

    // HÀM ĐĂNG KÝ
    const register = async (userData) => {
        isLoading.value = true;
        error.value = null;
        try {
            // SỬA: Bỏ '/api' ở đầu đường dẫn
            await api.post('/auth/register', userData);
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || 'Đăng ký thất bại';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/'; 
    };

    const setUser = (userData) => {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return { user, token, isLoading, error, login, register, logout, setUser };
});