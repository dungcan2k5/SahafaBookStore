<template>
  <div class="min-h-[calc(100vh-150px)] bg-gray-50 flex items-center justify-center py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-sm w-full max-w-[500px]">
      
      <div v-if="activeTab !== 'forgot'" class="flex border-b border-gray-200 mb-6">
        <button 
          @click="activeTab = 'login'"
          class="w-1/2 pb-3 text-lg font-medium transition-all relative"
          :class="activeTab === 'login' ? 'text-[#2563EB] border-b-2 border-[#2563EB] font-bold' : 'text-gray-500 hover:text-[#2563EB]'"
        >
          Đăng nhập
        </button>
        <button 
          @click="activeTab = 'register'"
          class="w-1/2 pb-3 text-lg font-medium transition-all relative"
          :class="activeTab === 'register' ? 'text-[#2563EB] border-b-2 border-[#2563EB] font-bold' : 'text-gray-500 hover:text-[#2563EB]'"
        >
          Đăng ký
        </button>
      </div>

      <div v-if="activeTab === 'login'" class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Số điện thoại/Email</label>
          <input 
            type="text" 
            placeholder="Nhập số điện thoại hoặc email" 
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition"
          />
        </div>
        <div class="relative">
          <label class="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Nhập mật khẩu" 
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition pr-12"
          />
          <button 
            @click="showPassword = !showPassword"
            class="absolute right-3 top-[34px] text-sm text-blue-500 font-medium hover:underline"
          >
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <div class="text-right">
          <a @click="activeTab = 'forgot'" class="text-sm text-[#2563EB] hover:underline cursor-pointer">Quên mật khẩu?</a>
        </div>
        <button class="bg-[#2563EB] text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition duration-300 shadow-sm">
          Đăng nhập
        </button>
      </div>

      <div v-else-if="activeTab === 'register'" class="flex flex-col gap-5">
        <div>
          <label class="block text-gray-600 text-[15px] mb-1">Số điện thoại</label>
          <input type="text" placeholder="Nhập số điện thoại" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition" />
        </div>
        <div>
          <label class="block text-gray-600 text-[15px] mb-2">Chọn phương thức xác minh OTP</label>
          <div class="grid grid-cols-2 gap-4">
            <div @click="otpMethod = 'sms'" class="border rounded p-2 flex items-center justify-center gap-2 cursor-pointer transition relative h-[42px]" :class="otpMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span class="text-gray-600 text-sm">Tin nhắn SMS</span>
            </div>
            <div @click="otpMethod = 'zalo'" class="border rounded p-2 flex items-center justify-center gap-2 cursor-pointer transition relative h-[42px]" :class="otpMethod === 'zalo' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'">
              <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" class="w-5 h-5 object-contain" />
              <span class="text-blue-500 text-sm font-medium">Zalo ZNS</span>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-gray-600 text-[15px] mb-1">Mã xác nhận OTP</label>
          <div class="flex gap-2">
            <input type="text" placeholder="6 ký tự" class="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-blue-400 transition" disabled />
          </div>
        </div>
        <div class="relative">
          <label class="block text-gray-600 text-[15px] mb-1">Mật khẩu</label>
          <input :type="showPasswordRegister ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition pr-12 bg-gray-50" />
          <button @click="showPasswordRegister = !showPasswordRegister" class="absolute right-3 top-[34px] text-sm text-blue-500 font-medium hover:underline">{{ showPasswordRegister ? 'Ẩn' : 'Hiện' }}</button>
        </div>
        <button class="bg-gray-300 text-gray-500 font-bold py-3 rounded mt-2 cursor-not-allowed hover:bg-gray-400 transition">Đăng ký</button>
        <div class="text-center text-xs text-gray-500 mt-2 px-4">
          Bằng việc đăng ký, bạn đã đồng ý với Sahafa.com về <a href="#" class="text-blue-500 hover:underline">Điều khoản dịch vụ</a> & <a href="#" class="text-blue-500 hover:underline">Chính sách bảo mật</a>
        </div>
      </div>

      <div v-else-if="activeTab === 'forgot'" class="flex flex-col gap-5">
        
        <h2 class="text-xl font-bold text-gray-700 text-center uppercase mb-2">Khôi Phục Mật Khẩu</h2>

        <div>
          <label class="block text-gray-600 text-[15px] mb-1">Số điện thoại/Email</label>
          <input 
            type="text" 
            placeholder="Nhập số điện thoại hoặc email" 
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition"
          />
        </div>

        <div>
          <label class="block text-gray-600 text-[15px] mb-2">Chọn phương thức xác minh OTP</label>
          <div class="grid grid-cols-2 gap-4">
            <div 
              @click="forgotOtpMethod = 'sms'"
              class="border rounded p-2 flex items-center justify-center gap-2 cursor-pointer transition relative h-[42px]"
              :class="forgotOtpMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-gray-600 text-sm">Tin nhắn SMS</span>
            </div>
            
            <div 
              @click="forgotOtpMethod = 'zalo'"
              class="border rounded p-2 flex items-center justify-center gap-2 cursor-pointer transition relative h-[42px]"
              :class="forgotOtpMethod === 'zalo' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'"
            >
              <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" class="w-5 h-5 object-contain" />
              <span class="text-blue-500 text-sm font-medium">Zalo ZNS</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-gray-600 text-[15px] mb-1">Mã xác nhận OTP</label>
          <input 
            type="text" 
            placeholder="6 ký tự" 
            class="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-blue-400 transition"
            disabled
          />
        </div>

        <div class="relative">
          <label class="block text-gray-600 text-[15px] mb-1">Mật khẩu</label>
          <input 
            :type="showPasswordForgot ? 'text' : 'password'" 
            placeholder="Nhập mật khẩu" 
            class="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-blue-400 transition pr-12"
          />
          <button 
            @click="showPasswordForgot = !showPasswordForgot"
            class="absolute right-3 top-[34px] text-sm text-blue-500 font-medium hover:underline"
          >
            {{ showPasswordForgot ? 'Hien' : 'Hiện' }}
          </button>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <button class="bg-gray-300 text-gray-600 font-bold py-3 rounded cursor-not-allowed hover:bg-gray-400 transition shadow-sm">
            Xác nhận
          </button>
          
          <button 
            @click="activeTab = 'login'"
            class="bg-white text-[#2563EB] border border-[#2563EB] font-bold py-3 rounded hover:bg-blue-50 transition"
          >
            Trở về
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute để đọc link

const route = useRoute();
const activeTab = ref('login'); // Mặc định
const showPassword = ref(false);
const showPasswordRegister = ref(false);
const showPasswordForgot = ref(false);
const otpMethod = ref('sms'); 
const forgotOtpMethod = ref('sms'); 

// Hàm xử lý việc chuyển Tab dựa vào Link
const checkTabFromUrl = () => {
  if (route.query.tab === 'register') {
    activeTab.value = 'register';
  } else if (route.query.tab === 'login') {
    activeTab.value = 'login';
  }
}

// 1. Chạy ngay khi vào trang
onMounted(() => {
  checkTabFromUrl();
});

// 2. Chạy khi đường dẫn thay đổi (ví dụ đang ở trang Login mà bấm lại vào menu)
watch(() => route.query.tab, () => {
  checkTabFromUrl();
});
</script>

