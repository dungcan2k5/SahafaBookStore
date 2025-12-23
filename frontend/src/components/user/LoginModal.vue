<template>
  <div class="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 animate-fade-in" @click.self="$emit('close')">
    
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden relative animate-slide-up">
      
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div class="p-6 md:p-8">
        
        <div v-if="activeTab === 'forgot'" class="flex flex-col gap-5">
          <h2 class="text-xl font-bold text-gray-800 text-center mb-2 uppercase">Khôi phục mật khẩu</h2>
          <div>
            <label class="block text-gray-600 text-sm mb-1">Email đăng ký</label>
            <input type="email" placeholder="Nhập địa chỉ email của bạn" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
            <p class="text-xs text-gray-500 mt-2 italic">*Link khôi phục mật khẩu sẽ được gửi vào email này.</p>
          </div>
          <div class="flex flex-col gap-3 mt-2">
            <button class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">Gửi yêu cầu</button>
            <button @click="activeTab = 'login'" class="bg-white text-[#C92127] border border-[#C92127] font-bold py-3 rounded-lg hover:bg-red-50 transition">Trở về</button>
          </div>
        </div>

        <div v-else>
          <div class="flex border-b border-gray-200 mb-6">
            <button @click="activeTab = 'login'" class="w-1/2 pb-3 text-lg font-bold transition-all border-b-2" :class="activeTab === 'login' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'">Đăng nhập</button>
            <button @click="activeTab = 'register'" class="w-1/2 pb-3 text-lg font-bold transition-all border-b-2" :class="activeTab === 'register' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'">Đăng ký</button>
          </div>

          <div v-if="authStore.error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span class="block sm:inline">{{ authStore.error }}</span>
          </div>

          <div v-if="activeTab === 'login'" class="flex flex-col gap-4">
            <div>
              <label class="block text-gray-600 text-sm mb-1">Email</label>
              <input v-model="loginForm.email" type="email" placeholder="Nhập địa chỉ email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
            </div>
            
            <div class="relative">
              <label class="block text-gray-600 text-sm mb-1">Mật khẩu</label>
              <input v-model="loginForm.password" :type="showPass ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none pr-12 transition" @keyup.enter="handleLogin" />
              <button @click="showPass = !showPass" class="absolute right-3 top-[34px] text-sm text-blue-600 font-medium hover:underline">
                {{ showPass ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
            
            <div class="text-right">
              <a href="#" @click.prevent="activeTab = 'forgot'" class="text-sm text-[#C92127] hover:underline font-medium">Quên mật khẩu?</a>
            </div>
            
            <button 
              @click="handleLogin" 
              :disabled="authStore.isLoading"
              class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg mt-2 flex justify-center items-center gap-2"
              :class="{'opacity-70 cursor-not-allowed': authStore.isLoading}"
            >
              <span v-if="authStore.isLoading" class="loader"></span>
              {{ authStore.isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div>
              <label class="block text-gray-600 text-sm mb-1">Họ và tên</label>
              <input v-model="registerForm.name" type="text" placeholder="Nhập họ tên của bạn" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
            </div>

            <div>
              <label class="block text-gray-600 text-sm mb-1">Email</label>
              <input v-model="registerForm.email" type="email" placeholder="Nhập địa chỉ email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
            </div>

            <div class="relative">
              <label class="block text-gray-600 text-sm mb-1">Mật khẩu</label>
              <input v-model="registerForm.password" :type="showPassRegister ? 'text' : 'password'" placeholder="Tạo mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none pr-12 transition" />
              <button @click="showPassRegister = !showPassRegister" class="absolute right-3 top-[34px] text-sm text-blue-600 font-medium hover:underline">
                {{ showPassRegister ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
            
            <button 
              @click="handleRegister"
              :disabled="authStore.isLoading"
              class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg mt-2 flex justify-center items-center gap-2"
              :class="{'opacity-70 cursor-not-allowed': authStore.isLoading}"
            >
              <span v-if="authStore.isLoading" class="loader"></span>
              {{ authStore.isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản' }}
            </button>
            
            <div class="text-center text-xs text-gray-500 mt-2">
              Bằng việc đăng ký, bạn đồng ý với <a href="#" class="text-blue-600 underline">Điều khoản & Chính sách</a> của Sahafa.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'; // Dùng để chuyển trang

const props = defineProps({ initialTab: { type: String, default: 'login' } });
const emit = defineEmits(['close']);
const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref(props.initialTab);
const showPass = ref(false);
const showPassRegister = ref(false);

// Dữ liệu Form
const loginForm = reactive({ email: '', password: '' });
const registerForm = reactive({ name: '', email: '', password: '' });

watch(() => props.initialTab, (val) => {
    activeTab.value = val;
    authStore.error = null; // Reset lỗi khi chuyển tab
});

// Xử lý Đăng nhập
const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
        authStore.error = "Vui lòng nhập đầy đủ thông tin";
        return;
    }

    const success = await authStore.login(loginForm.email, loginForm.password);
    
    if (success) {
        emit('close'); // Đóng modal
        
        // Logic chuyển hướng thông minh
        const userRole = authStore.user?.role;
        if (userRole === 'admin' || userRole === 'employee') {
             // Hỏi người dùng có muốn vào Admin luôn không (hoặc tự chuyển)
             // Ở đây tôi để tự chuyển nếu là admin để bạn test cho sướng
             router.push('/admin/dashboard'); 
        } else {
             // User thường -> Reload để cập nhật giỏ hàng/avatar
             window.location.reload();
        }
    }
};

// Xử lý Đăng ký
const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
        authStore.error = "Vui lòng điền đủ thông tin";
        return;
    }
    
    // Gọi hàm đăng ký (bạn cần bổ sung hàm này trong store nếu chưa có)
    // Giả sử đăng ký xong tự login luôn
    const success = await authStore.register(registerForm);
    if (success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        activeTab.value = 'login';
        loginForm.email = registerForm.email;
        loginForm.password = '';
    }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

/* CSS cho icon loading xoay vòng */
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>