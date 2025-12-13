<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg p-5 shadow-sm">
      
      <div class="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h2 class="text-lg md:text-xl font-bold text-gray-800">
          Danh mục Sách
        </h2>
      </div>

      <div class="grid grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-6">
        
        <div 
          v-for="(cat, index) in categories" 
          :key="index"
          class="flex flex-col items-center group cursor-pointer"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 mb-3 overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
            <img 
              :src="cat.image" 
              :alt="cat.name"
              class="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          
          <span class="text-[13px] text-center text-gray-600 font-medium leading-tight px-1 group-hover:text-fahasa-blue transition-colors">
            {{ cat.name }}
          </span>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Danh sách CHỈ CÓ SÁCH với icon minh họa sát nghĩa
const categories = ref([
  { 
    name: 'Văn Học', 
    image: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' // Bút lông & sách
  },
  { 
    name: 'Kinh Tế', 
    image: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png' // Biểu đồ tăng trưởng
  },
  { 
    name: 'Tâm Lý Kỹ Năng', 
    image: 'https://cdn-icons-png.flaticon.com/512/3079/3079166.png' // Tư duy não bộ
  },
  { 
    name: 'Thiếu Nhi', 
    image: 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png' // Trẻ em đọc sách
  },
  { 
    name: 'Giáo Khoa 2025', 
    image: 'https://cdn-icons-png.flaticon.com/512/167/167755.png' // Sách Toán
  },
  { 
    name: 'Học Ngoại Ngữ', 
    image: 'https://cdn-icons-png.flaticon.com/512/2436/2436636.png' // Từ điển ABC
  },
  { 
    name: 'Truyện Tranh', 
    image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' // Nhân vật Anime
  },
  { 
    name: 'Lịch Sử - Địa Lý', 
    image: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png' // Di tích lịch sử
  },
  { 
    name: 'Tiểu Thuyết', 
    image: 'https://cdn-icons-png.flaticon.com/512/3145/3145765.png' // Sách dày
  },
  { 
    name: 'Nuôi Dạy Con', 
    image: 'https://cdn-icons-png.flaticon.com/512/2990/2990263.png' // Gia đình
  },
]);
</script>