<template>
  <div 
    class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
    @mousedown.self="handleClose"
  >
    <div class="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden relative animate-fade-in">
      
      <button 
        @click="handleClose" 
        class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div v-if="activeTab !== 'forgot'" class="flex border-b">
        <button 
          @click="activeTab = 'login'" 
          class="flex-1 py-4 font-bold text-center transition relative"
          :class="activeTab === 'login' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Đăng nhập
          <div v-if="activeTab === 'login'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
        </button>
        <button 
          @click="activeTab = 'register'" 
          class="flex-1 py-4 font-bold text-center transition relative"
          :class="activeTab === 'register' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          Đăng ký
          <div v-if="activeTab === 'register'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
        </button>
      </div>

      <div v-else class="py-4 border-b text-center font-bold text-gray-800 text-lg relative bg-gray-50">
          <button v-if="!tempPasswordResult" @click="activeTab = 'login'" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 text-sm flex items-center gap-1 font-normal">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
             Quay lại
          </button>
          {{ tempPasswordResult ? 'Cấp Lại Thành Công' : 'Khôi Phục Mật Khẩu' }}
      </div>

      <div class="p-6">
        
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input v-model="loginForm.email" type="email" placeholder="Nhập địa chỉ email" class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Mật khẩu</label>
            <div class="relative">
              <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
              <span @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 cursor-pointer select-none">{{ showPassword ? 'Ẩn' : 'Hiện' }}</span>
            </div>
            <div class="text-right mt-1">
              <span @click="switchToForgot" class="text-xs text-red-500 hover:underline cursor-pointer">Quên mật khẩu?</span>
            </div>
          </div>
          <button type="submit" :disabled="loading" class="bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition shadow-md disabled:bg-blue-300 mt-2">
            {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
        </form>

        <form v-else-if="activeTab === 'register'" @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Họ và tên</label>
            <input v-model="registerForm.full_name" type="text" placeholder="Ví dụ: Nguyễn Văn A" class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input v-model="registerForm.email" type="email" placeholder="Nhập địa chỉ email" class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Mật khẩu</label>
            <div class="relative">
              <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="Tối thiểu 8 ký tự..." class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
              <span @click="showRegisterPassword = !showRegisterPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 cursor-pointer select-none">{{ showRegisterPassword ? 'Ẩn' : 'Hiện' }}</span>
            </div>
          </div>
          <button type="submit" :disabled="loading" class="bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition shadow-md disabled:bg-blue-300 mt-2">
            {{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
          </button>
        </form>

        <div v-else-if="activeTab === 'forgot'">
            
            <form v-if="!tempPasswordResult" @submit.prevent="handleForgotPassword" class="flex flex-col gap-4">
                <p class="text-sm text-gray-600 text-center mb-2">
                    Nhập email đã đăng ký để hệ thống cấp lại mật khẩu ngẫu nhiên mới cho bạn.
                </p>
                <div>
                   <label class="block text-gray-600 text-sm font-medium mb-1">Email của bạn</label>
                   <input v-model="forgotEmail" type="email" placeholder="email@example.com" class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition" required />
                </div>
                <button type="submit" :disabled="loading" class="bg-red-600 text-white font-bold py-2.5 rounded-md hover:bg-red-700 transition shadow-md disabled:bg-red-300 mt-2">
                   {{ loading ? 'Đang xử lý...' : 'Lấy Lại Mật Khẩu' }}
                </button>
            </form>

            <div v-else class="flex flex-col items-center gap-4 animate-fade-in text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                
                <div class="space-y-1">
                    <p class="text-gray-800 font-bold">Thành công!</p>
                    <p class="text-sm text-gray-600">Mật khẩu mới của bạn là:</p>
                </div>

                <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg py-3 px-6 text-xl font-mono font-bold text-red-600 tracking-wider select-all cursor-copy w-full break-all">
                    {{ tempPasswordResult }}
                </div>

                <p class="text-xs text-gray-500 italic">
                    Hãy sao chép mật khẩu này để đăng nhập và đổi lại mật khẩu của riêng bạn.
                </p>

                <button @click="autoLoginWithNewPassword" class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition shadow-md mt-2">
                    Đăng Nhập Ngay
                </button>
            </div>

        </div>

        <div v-if="activeTab !== 'forgot' || !tempPasswordResult" class="mt-6 text-center text-xs text-gray-500">
          Bằng việc tiếp tục, bạn đồng ý với <a href="#" class="underline hover:text-blue-600">Điều khoản sử dụng</a> và <a href="#" class="underline hover:text-blue-600">Chính sách bảo mật</a> của Sahafa.
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import api from '../../services/api';

const props = defineProps({ initialTab: { type: String, default: 'login' } });
const emit = defineEmits(['close']);

const authStore = useAuthStore();
const activeTab = ref(props.initialTab);
const showPassword = ref(false);
const showRegisterPassword = ref(false);
const loading = ref(false);

// State cho Forgot Password
const forgotEmail = ref('');
const tempPasswordResult = ref('');

// Watch prop change
watch(() => props.initialTab, (newVal) => { 
    activeTab.value = newVal;
    resetForgotState();
});

const loginForm = reactive({ email: '', password: '' });
const registerForm = reactive({ full_name: '', email: '', password: '' });

const handleClose = () => { emit('close'); };

const resetForgotState = () => {
    forgotEmail.value = '';
    tempPasswordResult.value = '';
}

const switchToForgot = () => {
    activeTab.value = 'forgot';
    resetForgotState();
}

// --- XỬ LÝ QUÊN MẬT KHẨU ---
const handleForgotPassword = async () => {
    if (!forgotEmail.value) {
        ElMessage.warning('Vui lòng nhập email');
        return;
    }
    loading.value = true;
    try {
          // Gọi API Backend via shared api
          const res = await api.post('/api/auth/forgot-password', {
            email: forgotEmail.value
          });

          if (res && res.success) {
             tempPasswordResult.value = res.newPassword || res.data?.newPassword;
          }
    } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Email không tồn tại hoặc lỗi hệ thống');
    } finally {
        loading.value = false;
    }
};

// Hàm tiện ích: Tự động chuyển về trang Login và điền mật khẩu mới
const autoLoginWithNewPassword = () => {
    loginForm.email = forgotEmail.value;
    loginForm.password = tempPasswordResult.value;
    activeTab.value = 'login';
    // Reset lại state forgot để lần sau mở lại
    setTimeout(() => { resetForgotState(); }, 500); 
};

// --- XỬ LÝ ĐĂNG NHẬP ---
const handleLogin = async () => {
  loading.value = true;
  try {
    const success = await authStore.login(loginForm.email, loginForm.password);
    if (success) {
      ElMessage.success('Đăng nhập thành công!');
      handleClose();
    } else {
      ElMessage.error(authStore.error || 'Đăng nhập thất bại');
    }
  } catch (err) {
    ElMessage.error('Lỗi kết nối server');
  } finally {
    loading.value = false;
  }
};

// --- XỬ LÝ ĐĂNG KÝ ---
const handleRegister = async () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
  
  if (registerForm.password.length < 8) {
    ElMessage.warning('Mật khẩu phải có ít nhất 8 ký tự');
    return;
  }
  if (!passwordRegex.test(registerForm.password)) {
    ElMessage.warning('Mật khẩu phải chứa chữ hoa, thường, số và ký tự đặc biệt');
    return;
  }

  loading.value = true;
  try {
    const success = await authStore.register(registerForm);
    if (success) {
      ElMessage.success('Đăng ký thành công! Vui lòng đăng nhập.');
      activeTab.value = 'login'; 
      loginForm.email = registerForm.email;
      loginForm.password = '';
    } else {
      ElMessage.error(authStore.error || 'Đăng ký thất bại');
    }
  } catch (err) {
    ElMessage.error('Lỗi kết nối server');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>