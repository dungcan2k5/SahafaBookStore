<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-blue-600 tracking-tighter">
          Sahafa<span class="text-yellow-400">.com</span>
        </h1>
      </div>

      <div class="flex border-b border-gray-200 mb-6">
        <button 
          @click="activeTab = 'login'"
          class="flex-1 pb-4 text-center font-bold text-sm transition relative"
          :class="activeTab === 'login' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
        >
          Đăng nhập
          <span v-if="activeTab === 'login'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        </button>
        <button 
          @click="activeTab = 'register'"
          class="flex-1 pb-4 text-center font-bold text-sm transition relative"
          :class="activeTab === 'register' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
        >
          Đăng ký
          <span v-if="activeTab === 'register'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
        </button>
      </div>

      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="loginForm.email" type="email" required class="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 focus:border-blue-500 focus:bg-white focus:outline-none transition text-sm" placeholder="khachhang@sahafa.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input v-model="loginForm.password" type="password" required class="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 focus:border-blue-500 focus:bg-white focus:outline-none transition text-sm" placeholder="••••••">
        </div>
        
        <div class="flex justify-end">
          <a href="#" class="text-sm text-red-500 hover:underline">Quên mật khẩu?</a>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>
      </form>

      <form v-else @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input v-model="registerForm.full_name" type="text" required class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="Nguyễn Văn A">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="registerForm.email" type="email" required class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="email@example.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input v-model="registerForm.password" type="password" required class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition text-sm" placeholder="Tối thiểu 6 ký tự">
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md flex justify-center items-center gap-2"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản' }}
        </button>
      </form>

      <div class="mt-8 text-center text-xs text-gray-400">
        &copy; 2025 Sahafa BookStore. All rights reserved.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();
const activeTab = ref('login'); // 'login' | 'register'
const isLoading = ref(false);

// State form đăng nhập
const loginForm = reactive({
  email: '',
  password: ''
});

// State form đăng ký
const registerForm = reactive({
  full_name: '',
  email: '',
  password: ''
});

// --- XỬ LÝ ĐĂNG NHẬP ---
const handleLogin = async () => {
  isLoading.value = true;
  try {
    // Gọi API Backend: /api/auth/login
    // Lưu ý: Đổi localhost:3000 nếu port backend bạn khác
    const res = await api.post('/api/auth/login', {
      email: loginForm.email,
      password: loginForm.password
    });

    const body = res.data || res;
    if (body.success) {
      // 1. Lưu token vào localStorage (Quan trọng nhất!)
      localStorage.setItem('token', body.token);
      
      // 2. Lưu thông tin user (Optional - để hiện tên trên Header)
      if (body.user) {
        localStorage.setItem('user', JSON.stringify(body.user));
      }

      // 3. Chuyển hướng về trang chủ
      alert('Đăng nhập thành công!');
      router.push('/');
    } else {
      alert(body.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Lỗi kết nối Server';
    alert('Lỗi: ' + msg);
  } finally {
    isLoading.value = false;
  }
};

// --- XỬ LÝ ĐĂNG KÝ ---
const handleRegister = async () => {
  isLoading.value = true;
  try {
    // Gọi API Backend: /api/auth/register
    const res = await api.post('/api/auth/register', {
      full_name: registerForm.full_name,
      email: registerForm.email,
      password: registerForm.password
    });
    const body = res.data || res;
    if (body.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      // Chuyển sang tab đăng nhập và điền sẵn email
      activeTab.value = 'login';
      loginForm.email = registerForm.email;
      loginForm.password = '';
    } else {
      alert(body.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Lỗi kết nối Server';
    alert('Lỗi: ' + msg);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Hiệu ứng focus input */
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>