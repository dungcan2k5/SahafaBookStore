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
            <button class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Gửi yêu cầu
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
              <label class="block text-gray-600 text-sm mb-1">Email</label>
              <input type="email" placeholder="Nhập địa chỉ email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
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
            <div>
              <label class="block text-gray-600 text-sm mb-1">Email</label>
              <input type="email" placeholder="Nhập địa chỉ email của bạn" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition" />
            </div>

            <div class="relative">
              <label class="block text-gray-600 text-sm mb-1">Mật khẩu</label>
              <input :type="showPassRegister ? 'text' : 'password'" placeholder="Tạo mật khẩu" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none pr-12 transition" />
              <button @click="showPassRegister = !showPassRegister" class="absolute right-3 top-[34px] text-sm text-blue-600 font-medium hover:underline">
                {{ showPassRegister ? 'Ẩn' : 'Hiện' }}
              </button>
            </div>
            
            <button class="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg mt-2">
              Đăng ký tài khoản
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
import { ref, watch } from 'vue';

const props = defineProps({ initialTab: { type: String, default: 'login' } });
defineEmits(['close']);

const activeTab = ref(props.initialTab); // Các giá trị: 'login', 'register', 'forgot'
const showPass = ref(false);
const showPassRegister = ref(false);

// Xóa logic otpMethod vì không còn dùng nữa
watch(() => props.initialTab, (val) => activeTab.value = val);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>