import axios from 'axios';

// Cấu hình URL API (sau này đổi thành biến môi trường thì tốt hơn)
const API_URL = 'http://localhost:3000/api/auth';

// Helper để lấy token
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Giả sử mày lưu token ở localStorage khi login
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
    async login(email, password) {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },

    async register(data) {
        const res = await axios.post(`${API_URL}/register`, data);
        return res.data;
    },

    async getProfile() {
        const res = await axios.get(`${API_URL}/me`, { headers: getAuthHeader() });
        return res.data;
    },

    async updateProfile(data) {
        const res = await axios.put(`${API_URL}/me`, data, { headers: getAuthHeader() });
        // Update lại user trong localStorage nếu cần
        return res.data;
    }
};