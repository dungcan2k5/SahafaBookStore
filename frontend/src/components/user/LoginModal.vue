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

      <div class="flex border-b">
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

      <div class="p-6">
        
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              placeholder="Nhập địa chỉ email" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Mật khẩu</label>
            <div class="relative">
              <input 
                v-model="loginForm.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Nhập mật khẩu" 
                class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <span 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 cursor-pointer select-none"
              >
                {{ showPassword ? 'Ẩn' : 'Hiện' }}
              </span>
            </div>
            <div class="text-right mt-1">
              <a href="#" class="text-xs text-red-500 hover:underline">Quên mật khẩu?</a>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition shadow-md disabled:bg-blue-300 mt-2"
          >
            {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
          </button>
        </form>

        <form v-else @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Họ và tên</label>
            <input 
              v-model="registerForm.full_name" 
              type="text" 
              placeholder="Ví dụ: Nguyễn Văn A" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input 
              v-model="registerForm.email" 
              type="email" 
              placeholder="Nhập địa chỉ email" 
              class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 text-sm font-medium mb-1">Mật khẩu</label>
            <div class="relative">
              <input 
                v-model="registerForm.password" 
                :type="showRegisterPassword ? 'text' : 'password'" 
                placeholder="Tối thiểu 6 ký tự, gồm chữ và số" 
                class="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <span 
                @click="showRegisterPassword = !showRegisterPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 cursor-pointer select-none"
              >
                {{ showRegisterPassword ? 'Ẩn' : 'Hiện' }}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 transition shadow-md disabled:bg-blue-300 mt-2"
          >
            {{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-gray-500">
          Bằng việc tiếp tục, bạn đồng ý với 
          <router-link 
            :to="{ name: 'policy', params: { slug: 'dieu-khoan-su-dung' }}" 
            class="underline hover:text-blue-600 cursor-pointer"
            @click="$emit('close')"
          >
            Điều khoản sử dụng
          </router-link> 
          và 
          <router-link 
            :to="{ name: 'policy', params: { slug: 'chinh-sach-bao-mat' }}" 
            class="underline hover:text-blue-600 cursor-pointer"
            @click="$emit('close')"
          >
            Chính sách bảo mật
          </router-link> 
          của Sahafa.
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// Props: Nhận tab ban đầu từ cha
const props = defineProps({
  initialTab: {
    type: String,
    default: 'login'
  }
});

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const activeTab = ref(props.initialTab);
const showPassword = ref(false);
const showRegisterPassword = ref(false);
const loading = ref(false);

// Theo dõi nếu prop thay đổi thì đổi tab theo
watch(() => props.initialTab, (newVal) => {
  activeTab.value = newVal;
});

// Form Data
const loginForm = reactive({
  email: '',
  password: ''
});

const registerForm = reactive({
  full_name: '',
  email: '',
  password: ''
});

const handleClose = () => {
  emit('close');
};

// Xử lý Đăng Nhập
const handleLogin = async () => {
  loading.value = true;
  try {
    const success = await authStore.login(loginForm);
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

// Xử lý Đăng Ký
const handleRegister = async () => {
  if (registerForm.password.length < 6) {
    ElMessage.warning('Mật khẩu phải có ít nhất 6 ký tự');
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
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>