import api from './api';

export const authService = {
    async login(email, password) {
        const res = await api.post('/api/auth/login', { email, password });
        const body = res.data || res;
        if (body.success) {
            if (body.token) localStorage.setItem('token', body.token);
            if (body.user) localStorage.setItem('user', JSON.stringify(body.user));
        }
        return body;
    },

    async register(data) {
        const res = await api.post('/api/auth/register', data);
        return res.data || res;
    },

    async getProfile() {
        const res = await api.get('/api/auth/me');
        return res.data || res;
    },

    async updateProfile(data) {
<<<<<<< HEAD
        const res = await axios.put(`${API_URL}/me`, data, { headers: getAuthHeader() });
        // Update lại user trong localStorage nếu cần
        return res.data;
    },
    async forgotPassword(email) {
        // Gọi route POST /forgot-password bên backend
        const res = await axios.post(`${API_URL}/forgot-password`, { email });
        return res.data;
    },

    async generatePassword(email) {
        // Gọi route POST /generate-password bên backend
        const res = await axios.post(`${API_URL}/generate-password`, { email });
        return res.data;
    },
=======
        const res = await api.put('/api/auth/me', data);
        return res.data || res;
    }
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8
};