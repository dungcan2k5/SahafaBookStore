<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
    
    <div class="mb-8 text-center">
      <router-link to="/" class="text-4xl font-extrabold tracking-tighter italic text-blue-600 flex items-center gap-1">
        Sahafa<span class="text-yellow-400">.com</span>
      </router-link>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-[500px]">
      
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
          <label class="block text-gray-700 text-sm font-medium mb-1">Email</label>
          <input type="email" placeholder="Nhập địa chỉ email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
        </div>
        <div class="relative">
          <label class="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
          <input :type="showPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-12" />
          <button @click="showPassword = !showPassword" class="absolute right-3 top-[38px] text-sm text-blue-600 font-medium hover:underline">
            {{ showPassword ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>
        <div class="text-right">
          <a @click="activeTab = 'forgot'" class="text-sm text-[#C92127] hover:underline cursor-pointer font-medium">Quên mật khẩu?</a>
        </div>
        <button class="bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-700 transition duration-300 shadow-lg">
          Đăng nhập
        </button>
      </div>

      <div v-else-if="activeTab === 'register'" class="flex flex-col gap-5">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Email</label>
          <input type="email" placeholder="Nhập địa chỉ email của bạn" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
        </div>
        
        <div class="relative">
          <label class="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label>
          <input :type="showPasswordRegister ? 'text' : 'password'" placeholder="Tạo mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-12" />
          <button @click="showPasswordRegister = !showPasswordRegister" class="absolute right-3 top-[38px] text-sm text-blue-600 font-medium hover:underline">
            {{ showPasswordRegister ? 'Ẩn' : 'Hiện' }}
          </button>
        </div>

        <button class="bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-700 transition duration-300 shadow-lg">
          Đăng ký tài khoản
        </button>

        <div class="text-center text-xs text-gray-500 mt-1">
          Bằng việc đăng ký, bạn đồng ý với <a href="#" class="text-blue-600 underline">Điều khoản & Chính sách</a> của Sahafa.
        </div>
      </div>

      <div v-else-if="activeTab === 'forgot'" class="flex flex-col gap-5">
        <h2 class="text-xl font-bold text-gray-800 text-center uppercase mb-2">Khôi Phục Mật Khẩu</h2>
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">Email đăng ký</label>
          <input type="email" placeholder="Nhập địa chỉ email của bạn" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          <p class="text-xs text-gray-500 mt-2 italic">*Link khôi phục mật khẩu sẽ được gửi vào email này.</p>
        </div>
        
        <div class="flex flex-col gap-3 mt-2">
          <button class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
            Gửi yêu cầu
          </button>
          <button @click="activeTab = 'login'" class="bg-white text-[#C92127] border border-[#C92127] font-bold py-3 rounded-lg hover:bg-red-50 transition">
            Trở về
          </button>
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