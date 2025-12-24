<template>
  <div class="container mx-auto mt-8 px-4">
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      
      <div class="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#C92127]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 uppercase">Danh mục Sách</h2>
      </div>

      <div class="grid grid-cols-4 md:grid-cols-8 gap-x-4 gap-y-8">
        <router-link 
          v-for="(cat, index) in categories" 
          :key="index"
          :to="cat.link"
          class="flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <div 
            class="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm"
            :class="cat.bgClass"
          >
            <img :src="cat.image" :alt="cat.name" class="w-9 h-9 md:w-11 md:h-11 object-contain" />
          </div>
          <span class="text-sm md:text-base text-center text-gray-700 font-bold leading-tight px-1 group-hover:text-[#C92127] transition-colors">
            {{ cat.name }}
          </span>
        </router-link>
      </div>

    </div>
  </div>
</template>

  <script setup>
import { ref } from 'vue';

const categories = ref([
  { name: 'Văn Học', image: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png', bgClass: 'bg-blue-50 group-hover:bg-blue-100', link: '/category/van-hoc' },
  { name: 'Kinh Tế', image: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png', bgClass: 'bg-yellow-50 group-hover:bg-yellow-100', link: '/category/kinh-te' },  
  { name: 'Tâm Lý Kỹ Năng', image: 'https://cdn-icons-png.flaticon.com/512/3079/3079166.png', bgClass: 'bg-green-50 group-hover:bg-green-100', link: '/category/tam-ly' },
  { name: 'Thiếu Nhi', image: 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png', bgClass: 'bg-pink-50 group-hover:bg-pink-100', link: '/category/thieu-nhi' },
  { name: 'Giáo Khoa', image: 'https://cdn-icons-png.flaticon.com/512/167/167755.png', bgClass: 'bg-teal-50 group-hover:bg-teal-100', link: '/category/giao-khoa' },
  { name: 'Nuôi Dạy Con', image: 'https://cdn-icons-png.flaticon.com/512/2990/2990263.png', bgClass: 'bg-purple-50 group-hover:bg-purple-100', link: '/category/nuoi-day-con' },
  { name: 'Sách Ngoại Văn', image: 'https://cdn-icons-png.flaticon.com/512/2436/2436636.png', bgClass: 'bg-indigo-50 group-hover:bg-indigo-100', link: '/foreign-books' },
  { name: 'Truyện Tranh', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', bgClass: 'bg-orange-50 group-hover:bg-orange-100', link: '/manga' }
]);
</script>