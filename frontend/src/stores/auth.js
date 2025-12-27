import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api'; 

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const isLoading = ref(false);
    const error = ref(null);

    // HÀNH ĐỘNG ĐĂNG NHẬP
    const login = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    try {
        const res = await api.post('api/auth/login', { email, password });
        
        let finalData = res;
        
        // Dự phòng nếu interceptor không trả về dữ liệu đã giải nén
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
            error.value = "Phản hồi từ máy chủ không hợp lệ (Thiếu Token)";
            return false;
        }
    } catch (err) {
        console.error("Lỗi Đăng Nhập:", err);
        error.value = err.response?.data?.message || 'Đăng nhập thất bại';
        return false;
    } finally {
        isLoading.value = false;
    }
};

    // HÀNH ĐỘNG ĐĂNG KÝ
    const register = async (userData) => {
        isLoading.value = true;
        error.value = null;
        try {
            await api.post('/api/auth/register', userData);
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