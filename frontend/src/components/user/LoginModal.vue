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
            <label class="block text-gray-600 text-sm mb-1">Số điện thoại/Email</label>
            <input type="text" placeholder="Nhập số điện thoại hoặc email" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
          </div>

          <div>
            <label class="block text-gray-600 text-sm mb-2">Chọn phương thức xác minh OTP</label>
            <div class="grid grid-cols-2 gap-3">
              <div 
                @click="otpMethod = 'sms'" 
                class="border rounded-lg p-2 flex items-center gap-2 cursor-pointer transition h-12"
                :class="otpMethod === 'sms' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span class="font-medium text-sm">Tin nhắn SMS</span>
              </div>
              <div 
                @click="otpMethod = 'zalo'" 
                class="border rounded-lg p-2 flex items-center gap-2 cursor-pointer transition h-12"
                :class="otpMethod === 'zalo' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-500'"
              >
                <span class="font-bold text-sm">Zalo ZNS</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-gray-600 text-sm mb-1">Mã xác nhận OTP</label>
            <input type="text" placeholder="6 ký tự" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" disabled />
          </div>

          <div>
            <label class="block text-gray-600 text-sm mb-1">Mật khẩu mới</label>
            <div class="relative">
              <input :type="showPassForgot ? 'text' : 'password'" placeholder="Nhập mật khẩu mới" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 outline-none pr-12 transition" />
              <button @click="showPassForgot = !showPassForgot" class="absolute right-3 top-[14px] text-sm text-blue-600 font-medium hover:underline">
                {{ showPassForgot ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3 mt-2">
            <button class="bg-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-400 transition">
              Xác nhận
            </button>
            <button @click="activeTab = 'login'" class="bg-white text-[#C92127] border border-[#C92127] font-bold py-3 rounded-lg hover:bg-red-50 transition">
              Trở về
            </button>
          </div>
        </div>

        <div v-else>
          <div class="flex border-b border-gray-200 mb-6">
            <button 
              @click="activeTab = 'login'" 
              class="w-1/2 pb-3 text-lg font-bold transition-all border-b-2"
              :class="activeTab === 'login' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'"
            >
              Đăng nhập
            </button>
            <button 
              @click="activeTab = 'register'" 
              class="w-1/2 pb-3 text-lg font-bold transition-all border-b-2"
              :class="activeTab === 'register' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'"
            >
              Đăng ký
            </button>
          </div>

          <div v-if="activeTab === 'login'" class="flex flex-col gap-4">
            <div>
              <label class="block text-gray-600 text-sm mb-1">Số điện thoại/Email</label>
              <input type="text" placeholder="Nhập số điện thoại hoặc email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
            </div>
            
            <div class="relative">
              <label class="block text-gray-600 text-sm mb-1">Mật khẩu</label>
              <input :type="showPass ? 'text' : 'password'" placeholder="Nhập mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none pr-12 transition" />
              <button @click="showPass = !showPass" class="absolute right-3 top-[34px] text-sm text-blue-600 font-medium hover:underline">
                {{ showPass ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
            
            <div class="text-right">
              <a href="#" @click.prevent="activeTab = 'forgot'" class="text-sm text-[#C92127] hover:underline font-medium">Quên mật khẩu?</a>
            </div>
            
            <button class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg mt-2">
              Đăng nhập
            </button>
          </div>

          <div v-else class="flex flex-col gap-4">
            <input type="text" placeholder="Nhập số điện thoại" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            
            <div class="grid grid-cols-2 gap-3">
              <div @click="otpMethod = 'sms'" class="border rounded-lg p-2 flex items-center justify-center gap-2 cursor-pointer transition h-12" :class="otpMethod === 'sms' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'">
                <span class="font-medium text-sm">Tin nhắn SMS</span>
              </div>
              <div @click="otpMethod = 'zalo'" class="border rounded-lg p-2 flex items-center justify-center gap-2 cursor-pointer transition h-12" :class="otpMethod === 'zalo' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'">
                <span class="font-bold text-sm">Zalo ZNS</span>
              </div>
            </div>

            <input type="text" placeholder="Mã xác nhận OTP" class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" disabled />
            <input type="password" placeholder="Mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none" />
            
            <button class="bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed mt-2">Đăng ký</button>
            
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
import { ref, watch } from 'vue';

const props = defineProps({ initialTab: { type: String, default: 'login' } });
defineEmits(['close']);

const activeTab = ref(props.initialTab); // Các giá trị: 'login', 'register', 'forgot'
const showPass = ref(false);
const showPassForgot = ref(false);
const otpMethod = ref('sms');

watch(() => props.initialTab, (val) => activeTab.value = val);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>