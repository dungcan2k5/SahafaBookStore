<template>
  <header class="bg-blue-600 text-white py-2 sticky top-0 z-50 shadow-md">
    <div class="container mx-auto flex items-center justify-between gap-4 px-4">
      
      <router-link to="/" class="text-3xl font-bold tracking-tighter flex items-center">Sahafa<span class="text-yellow-400">.com</span></router-link>
      <div class="flex-1 max-w-2xl bg-white rounded-lg flex items-center p-1 shadow-sm">
        <input type="text" placeholder="Tìm kiếm sách, văn phòng phẩm..." class="w-full px-4 py-1.5 text-gray-700 outline-none rounded-md text-sm" />
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md font-medium transition"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
      </div>

      <div class="flex items-center gap-6 text-sm font-medium">
        <div class="flex flex-col items-center cursor-pointer hover:opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span class="text-xs mt-1">Thông báo</span>
        </div>
        <div class="flex flex-col items-center cursor-pointer hover:opacity-90 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span class="text-xs mt-1">Giỏ hàng</span>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-2 bg-yellow-400 text-red-600 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">{{ cartStore.totalItems }}</span>
        </div>

        <div class="relative group z-50 py-2">
          
          <router-link to="/login" class="flex flex-col items-center cursor-pointer hover:opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span class="text-xs mt-1">Tài khoản</span>
          </router-link>

          <div class="absolute top-full right-[-20px] pt-2 hidden group-hover:block w-[240px]">
            <div class="absolute top-0 right-[35px] w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
            
            <div class="bg-white rounded-lg shadow-xl p-4 border border-gray-100 flex flex-col gap-3 relative mt-1">
              
              <button 
                @click="openModal('login')" 
                class="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                Đăng nhập
              </button>
              
              <button 
                @click="openModal('register')" 
                class="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-2 rounded-md hover:bg-blue-50 transition"
              >
                Đăng ký
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>

    <Teleport to="body">
      <LoginModal 
        v-if="showLoginModal" 
        :initialTab="modalTab" 
        @close="showLoginModal = false" 
      />
    </Teleport>

  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import CategoryNav from '@/components/user/CategoryNav.vue';
import LoginModal from '@/components/user/LoginModal.vue'; // Import Modal

const cartStore = useCartStore();
const showLoginModal = ref(false);
const modalTab = ref('login');

// Hàm mở Modal
const openModal = (tab) => {
  modalTab.value = tab;
  showLoginModal.value = true;
};
</script>