import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api'; // Import cái file vừa tạo ở bước 1

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const isLoading = ref(false);
    const error = ref(null);

    // HÀM ĐĂNG NHẬP THẬT (GỌI API)
    const login = async (email, password) => {
        isLoading.value = true;
        error.value = null;
        try {
            // Gọi API theo đúng tài liệu Swagger: POST /api/auth/login
            const response = await api.post('/api/auth/login', {
                email: email,
                password: password
            });

            // Backend trả về: { token: "...", user: { role: "admin", ... } }
            // (Cấu trúc này tôi đoán dựa trên Swagger, nếu sai mình log ra xem lại)
            const data = response.data; 

            // Lưu vào Store
            token.value = data.token;
            user.value = data.user;

            // Lưu vào ổ cứng (để F5 không mất)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return true; // Đăng nhập thành công
        } catch (err) {
            console.error(err);
            error.value = err.response?.data?.message || 'Đăng nhập thất bại';
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // HÀM ĐĂNG KÝ (Tiện tay làm luôn)
    const register = async (userData) => {
        isLoading.value = true;
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

    // HÀM ĐĂNG XUẤT
    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/'; // Về trang chủ
    };

    return { user, token, isLoading, error, login, register, logout };
});