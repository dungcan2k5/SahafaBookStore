<template>
  <div class="sticky top-0 z-50">
    <header class="bg-blue-600 text-white py-4 shadow-md">
      <div class="container mx-auto flex items-center justify-between px-6 lg:px-12 gap-8">
        
        <div class="flex items-center gap-4 shrink-0">
          <router-link to="/" class="text-4xl font-extrabold tracking-tighter flex items-center italic">
            Sahafa<span class="text-yellow-400">.com</span>
          </router-link>

          <div class="relative group z-50">
            <div class="flex items-center justify-center cursor-pointer hover:bg-blue-700 w-12 h-12 rounded-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute bottom-2 right-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>

            <div class="absolute top-full left-0 pt-4 w-[800px] hidden group-hover:block animate-fade-in">
                <div class="bg-white text-gray-800 shadow-2xl rounded-lg border border-gray-200 overflow-hidden flex min-h-[400px]">
                  <div class="w-1/3 bg-gray-50 border-r border-gray-200 py-2">
                    <ul class="flex flex-col text-sm">
                      <li 
                        v-for="(item, index) in menuData" 
                        :key="index"
                        @mouseenter="activeCategory = item"
                        class="px-4 py-3 cursor-pointer flex justify-between items-center transition-all border-l-4"
                        :class="activeCategory.name === item.name 
                          ? 'bg-white text-[#C92127] font-bold border-[#C92127] shadow-sm' 
                          : 'text-gray-600 border-transparent hover:bg-white hover:text-[#C92127]'"
                      >
                        {{ item.name }}
                        <svg v-if="activeCategory.name === item.name" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                      </li>
                    </ul>
                  </div>

                  <div class="w-2/3 p-6 bg-white">
                    <router-link 
                      :to="activeCategory.path" 
                      class="font-bold text-[#C92127] mb-6 flex items-center gap-2 text-xl border-b pb-3 hover:underline"
                    >
                        <img :src="activeCategory.icon" class="w-8 h-8 object-contain" alt="">
                        {{ activeCategory.name }}
                    </router-link>

                    <div v-if="activeCategory.subItems && activeCategory.subItems.length > 0" class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600">
                      <div v-for="(sub, idx) in activeCategory.subItems" :key="idx" class="flex flex-col gap-1">
                          <strong class="text-gray-800 mb-1 uppercase text-xs font-bold">{{ sub.title }}</strong>
                          <a v-for="(link, lIdx) in sub.links" :key="lIdx" href="#" class="hover:text-[#C92127] hover:underline transition pl-1 border-l-2 border-transparent hover:border-gray-200">
                            {{ link }}
                          </a>
                      </div>
                    </div>
                    
                    <div v-else class="flex flex-col items-center justify-center h-[200px] text-center">
                        <p class="text-gray-500 mb-4">Khám phá hàng ngàn đầu sách hấp dẫn.</p>
                        <router-link 
                          :to="activeCategory.path" 
                          class="bg-[#C92127] text-white px-6 py-2 rounded-full font-bold shadow hover:bg-red-700 transition"
                        >
                          Xem Chi Tiết
                        </router-link>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center cursor-pointer hover:opacity-90 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span class="text-xs mt-1">Giỏ hàng</span>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-2 bg-yellow-400 text-red-600 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">{{ cartStore.totalItems }}</span>
        </div>

        <div class="flex items-center gap-10 text-sm font-medium shrink-0">
          
          <div class="relative group z-50 py-2">
            <div class="flex flex-col items-center cursor-pointer hover:opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span class="text-xs mt-1 font-semibold">Thông báo</span>
            </div>
            <div class="absolute top-full right-[-80px] pt-4 hidden group-hover:block w-[300px]">
               <div class="bg-white rounded-lg shadow-xl p-6 border border-gray-100 flex flex-col items-center gap-3 relative mt-1 text-center">
                <div class="absolute -top-2 right-[88px] w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100 z-10"></div>
                <div class="mb-2 bg-gray-100 p-4 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p class="text-sm text-gray-600 mb-2 font-medium">Vui lòng đăng nhập để xem thông báo</p>
                <button @click="openModal('login')" class="w-full bg-[#C92127] text-white font-bold py-2 rounded-md hover:bg-red-700 transition shadow-sm">Đăng nhập</button>
                <button @click="openModal('register')" class="w-full bg-white text-[#C92127] border border-[#C92127] font-bold py-2 rounded-md hover:bg-red-50 transition">Đăng ký</button>
              </div>
            </div>
          </div>

          <router-link to="/cart" class="flex flex-col items-center cursor-pointer hover:opacity-90 relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span class="text-xs mt-1 font-semibold">Giỏ hàng</span>
            <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-2 bg-yellow-400 text-red-600 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">{{ cartStore.totalItems }}</span>
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
    </header>

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
import LoginModal from '@/components/user/LoginModal.vue';

const cartStore = useCartStore();
const showLoginModal = ref(false);
const modalTab = ref('login');

const openModal = (tab) => {
  modalTab.value = tab;
  showLoginModal.value = true;
};

// DATA MEGA MENU
const menuData = [
    { name: 'Văn Học', path: '/category/van-hoc', icon: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png', subItems: [{ title: 'Thể Loại', links: ['Tiểu Thuyết', 'Truyện Ngắn'] }] },
    { name: 'Kinh Tế', path: '/category/kinh-te', icon: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png', subItems: [{ title: 'Quản Trị', links: ['Lãnh Đạo', 'Nhân Sự'] }] },
    { name: 'Tâm Lý Kỹ Năng', path: '/category/tam-ly', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079166.png', subItems: [{ title: 'Kỹ Năng', links: ['Giao Tiếp', 'Tư Duy'] }] },
    { name: 'Thiếu Nhi', path: '/category/thieu-nhi', icon: 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png', subItems: [{ title: 'Độ Tuổi', links: ['6-11 Tuổi', '11-15 Tuổi'] }] },
    { name: 'Giáo Khoa', path: '/category/giao-khoa', icon: 'https://cdn-icons-png.flaticon.com/512/167/167755.png', subItems: [{ title: 'Cấp Học', links: ['Tiểu Học', 'Trung Học'] }] },
    { name: 'Nuôi Dạy Con', path: '/category/nuoi-day-con', icon: 'https://cdn-icons-png.flaticon.com/512/2990/2990263.png', subItems: [{ title: 'Cha Mẹ', links: ['Thai Giáo', 'Dinh Dưỡng'] }] },
    { name: 'Sách Ngoại Văn', path: '/foreign-books', icon: 'https://cdn-icons-png.flaticon.com/512/2436/2436636.png', subItems: [] },
    { name: 'Truyện Tranh', path: '/manga', icon: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', subItems: [] }
];

const activeCategory = ref(menuData[0]);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>