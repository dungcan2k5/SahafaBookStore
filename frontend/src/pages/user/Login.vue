<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
    
    <div class="mb-8 text-center">
      <router-link to="/" class="text-4xl font-extrabold tracking-tighter italic text-blue-600 flex items-center gap-1">
        Sahafa<span class="text-yellow-400">.com</span>
      </router-link>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-sm w-full max-w-[500px]">
      
      <div v-if="activeTab !== 'forgot'" class="flex border-b border-gray-200 mb-6">
        <button 
          @click="activeTab = 'login'"
          class="w-1/2 pb-3 text-lg font-medium transition-all relative"
          :class="activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'"
        >
          Đăng nhập
        </button>
        <button 
          @click="activeTab = 'register'"
          class="w-1/2 pb-3 text-lg font-medium transition-all relative"
          :class="activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'"
        >
          Đăng ký
        </button>
      </div>

      <div v-if="activeTab === 'login'" class="flex flex-col gap-4">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Số điện thoại/Email</label>
          <input type="text" placeholder="Nhập số điện thoại hoặc email" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition" />
        </div>
        <div class="relative">
          <label class="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
          <input :type="showPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition pr-12" />
          <button @click="showPassword = !showPassword" class="absolute right-3 top-[34px] text-sm text-blue-500 font-medium hover:underline">
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <div class="text-right">
          <a @click="activeTab = 'forgot'" class="text-sm text-blue-600 hover:underline cursor-pointer">Quên mật khẩu?</a>
        </div>
        <button class="bg-blue-600 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition duration-300 shadow-sm">
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
              <span class="text-gray-600 text-sm">Tin nhắn SMS</span>
            </div>
            <div @click="otpMethod = 'zalo'" class="border rounded p-2 flex items-center justify-center gap-2 cursor-pointer transition relative h-[42px]" :class="otpMethod === 'zalo' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'">
              <span class="text-blue-500 text-sm font-medium">Zalo ZNS</span>
            </div>
          </div>
        </div>
         <div>
          <label class="block text-gray-600 text-[15px] mb-1">Mã xác nhận OTP</label>
          <input type="text" placeholder="6 ký tự" class="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:border-blue-400 transition" disabled />
        </div>
        <div class="relative">
          <label class="block text-gray-600 text-[15px] mb-1">Mật khẩu</label>
          <input :type="showPasswordRegister ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition pr-12" />
          <button @click="showPasswordRegister = !showPasswordRegister" class="absolute right-3 top-[34px] text-sm text-blue-500 font-medium hover:underline">{{ showPasswordRegister ? 'Ẩn' : 'Hiện' }}</button>
        </div>
        <button class="bg-gray-300 text-gray-500 font-bold py-3 rounded mt-2 cursor-not-allowed hover:bg-gray-400 transition">Đăng ký</button>
      </div>

      <div v-else-if="activeTab === 'forgot'" class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-gray-700 text-center uppercase mb-2">Khôi Phục Mật Khẩu</h2>
        <div>
          <label class="block text-gray-600 text-[15px] mb-1">Số điện thoại/Email</label>
          <input type="text" placeholder="Nhập số điện thoại hoặc email" class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400 transition" />
        </div>
        <div class="flex flex-col gap-3 mt-2">
          <button class="bg-gray-300 text-gray-600 font-bold py-3 rounded cursor-not-allowed hover:bg-gray-400 transition shadow-sm">Xác nhận</button>
          <button @click="activeTab = 'login'" class="bg-white text-blue-600 border border-blue-600 font-bold py-3 rounded hover:bg-blue-50 transition">Trở về</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = ref('login');
const showPassword = ref(false);
const showPasswordRegister = ref(false);
const otpMethod = ref('sms');

// Logic: Lấy thông tin từ đường dẫn (URL) để chọn Tab
const checkTabFromUrl = () => {
  if (route.query.tab === 'register') {
    activeTab.value = 'register';
  } else {
    activeTab.value = 'login';
  }
}

onMounted(() => {
  checkTabFromUrl();
});

watch(() => route.query.tab, () => {
  checkTabFromUrl();
});
</script>