import api from './api';

export const authService = {
    async login(email, password) {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },

    async register(data) {
        const res = await api.post('/auth/register', data);
        return res.data;
    },

    async getProfile() {
        const res = await api.get('/auth/me');
        return res.data;
    },

    async updateProfile(data) {
        const res = await api.put('/auth/me', data);
        // Update lại user trong localStorage nếu cần
        return res.data;
    }
};