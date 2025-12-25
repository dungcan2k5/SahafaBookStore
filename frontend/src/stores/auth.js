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
            // SỬA: Xóa '/api' ở đầu vì baseURL đã có sẵn '/api'
            // Nếu viết '/api/auth/login' sẽ bị thành '/api/api/auth/login' gây lỗi 404
            const data = await api.post('/auth/login', {
                email: email,
                password: password
            });

            // QUAN TRỌNG: Nếu api.js của bạn có Interceptor:
            // return response.data.data -> 'data' lúc này chính là object {token, user}
            // Không được dùng 'const data = response.data' nữa vì sẽ bị undefined.
            
            if (data && data.token) {
                token.value = data.token;
                user.value = data.user;

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                return true; 
            }
            return false;
        } catch (err) {
            console.error("Login Error:", err);
            // Lấy thông báo lỗi từ backend trả về
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