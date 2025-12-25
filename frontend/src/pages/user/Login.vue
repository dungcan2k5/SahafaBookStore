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
          <div class="relative">
             <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" required class="w-full px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 focus:border-blue-500 focus:bg-white focus:outline-none transition text-sm" placeholder="••••••">
             <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                <span v-if="showPassword" class="text-xs">Ẩn</span>
                <span v-else class="text-xs">Hiện</span>
             </button>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="showForgotPasswordModal = true"
            class="text-sm text-red-500 hover:underline disabled:opacity-50"
            :disabled="isLoading"
          >
            Tạo mật khẩu mới
          </button>
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

    <!-- MODAL QUÊN MẬT KHẨU -->
    <div v-if="showForgotPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Tạo mật khẩu mới</h2>
          <button 
            @click="closeForgotPasswordModal"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <!-- Hiển thị lỗi -->
        <div v-if="forgotPasswordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-700">❌ {{ forgotPasswordError }}</p>
        </div>

        <!-- Hiển thị thành công -->
        <div v-if="forgotPasswordSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-700 mb-3">✅ Mật khẩu mới của bạn:</p>
          <div class="flex gap-2">
            <div class="flex-1 p-3 bg-gray-100 rounded border border-gray-300 font-mono text-sm break-all">
              {{ newPasswordDisplay }}
            </div>
            <button
              @click="copyToClipboard"
              class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
            >
              Sao chép
            </button>
          </div>
          <p class="text-xs text-gray-600 mt-2">💡 Vui lòng lưu lại mật khẩu này. Bạn có thể đăng nhập ngay bây giờ.</p>
        </div>

        <!-- Form nhập email (khi chưa submit) -->
        <div v-if="!forgotPasswordSuccess && !isForgotPasswordLoading">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nhập email của bạn</label>
            <input 
              v-model="forgotPasswordForm.email"
              type="email"
              placeholder="example@email.com"
              class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition text-sm"
            >
          </div>
          <button 
            @click="handleForgotPassword"
            class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            <span>Tạo mật khẩu mới</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isForgotPasswordLoading" class="flex justify-center items-center py-8">
          <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        <!-- Nút đóng khi thành công -->
        <div v-if="forgotPasswordSuccess" class="mt-4">
          <button 
            @click="closeForgotPasswordModal"
            class="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
<<<<<<< HEAD
import axios from 'axios';
import { authService } from '../../services/authService';
=======
import api from '../../services/api';
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8

const router = useRouter();
const activeTab = ref('login');
const isLoading = ref(false);
const showPassword = ref(false);

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

// State modal quên mật khẩu
const showForgotPasswordModal = ref(false);
const isForgotPasswordLoading = ref(false);
const forgotPasswordForm = reactive({
  email: ''
});
const forgotPasswordError = ref('');
const forgotPasswordSuccess = ref(false);
const newPasswordDisplay = ref('');

// --- XỬ LÝ ĐĂNG NHẬP ---
const handleLogin = async () => {
  isLoading.value = true;
  try {
<<<<<<< HEAD
    const res = await axios.post('http://localhost:3000/api/auth/login', {
=======
    // Gọi API Backend: /api/auth/login
    // Lưu ý: Đổi localhost:3000 nếu port backend bạn khác
    const res = await api.post('/api/auth/login', {
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8
      email: loginForm.email,
      password: loginForm.password
    });

<<<<<<< HEAD
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
=======
    const body = res.data || res;
    if (body.success) {
      // 1. Lưu token vào localStorage (Quan trọng nhất!)
      localStorage.setItem('token', body.token);
      
      // 2. Lưu thông tin user (Optional - để hiện tên trên Header)
      if (body.user) {
        localStorage.setItem('user', JSON.stringify(body.user));
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8
      }
      alert('✅ Đăng nhập thành công!');
      router.push('/');
    } else {
      alert(body.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Lỗi kết nối Server';
    alert('❌ Lỗi: ' + msg);
  } finally {
    isLoading.value = false;
  }
};

// --- XỬ LÝ ĐĂNG KÝ ---
const handleRegister = async () => {
  isLoading.value = true;
  try {
<<<<<<< HEAD
    const res = await axios.post('http://localhost:3000/api/auth/register', {
=======
    // Gọi API Backend: /api/auth/register
    const res = await api.post('/api/auth/register', {
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8
      full_name: registerForm.full_name,
      email: registerForm.email,
      password: registerForm.password
    });
<<<<<<< HEAD

    if (res.data.success) {
      alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
=======
    const body = res.data || res;
    if (body.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      // Chuyển sang tab đăng nhập và điền sẵn email
>>>>>>> f660b102a1337d598f9630ab820e88f449eedcf8
      activeTab.value = 'login';
      loginForm.email = registerForm.email;
      loginForm.password = '';
      registerForm.full_name = '';
      registerForm.email = '';
      registerForm.password = '';
    } else {
      alert(body.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || 'Lỗi kết nối Server';
    alert('❌ Lỗi: ' + msg);
  } finally {
    isLoading.value = false;
  }
};

// --- XỬ LÝ QUÊN MẬT KHẨU ---
const handleForgotPassword = async () => {
  forgotPasswordError.value = '';

  // Validation
  if (!forgotPasswordForm.email.trim()) {
    forgotPasswordError.value = 'Vui lòng nhập email';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordForm.email)) {
    forgotPasswordError.value = 'Email không hợp lệ';
    return;
  }

  isForgotPasswordLoading.value = true;
  try {
    console.log('📧 Tạo mật khẩu mới cho:', forgotPasswordForm.email);
    const res = await authService.generatePassword(forgotPasswordForm.email);
    console.log('📨 Response từ server:', res);

    if (res.success && res.newPassword) {
      newPasswordDisplay.value = res.newPassword;
      forgotPasswordSuccess.value = true;
      // Auto-fill vào form login
      loginForm.email = forgotPasswordForm.email;
      loginForm.password = res.newPassword;
    } else {
      forgotPasswordError.value = res.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
    }
  } catch (error) {
    console.error('❌ Lỗi tạo password:', error);
    let errorMsg = 'Lỗi kết nối Server';

    if (error.response?.status === 404) {
      errorMsg = 'Email này không tồn tại trong hệ thống';
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.message) {
      errorMsg = error.message;
    }

    forgotPasswordError.value = errorMsg;
  } finally {
    isForgotPasswordLoading.value = false;
  }
};

// Sao chép mật khẩu vào clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(newPasswordDisplay.value);
    alert('✅ Đã sao chép mật khẩu');
  } catch (err) {
    alert('❌ Không thể sao chép');
  }
};

// Đóng modal và reset
const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false;
  forgotPasswordForm.email = '';
  forgotPasswordError.value = '';
  forgotPasswordSuccess.value = false;
  newPasswordDisplay.value = '';
  isForgotPasswordLoading.value = false;
};
</script>

<style scoped>
/* Hiệu ứng focus input */
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>