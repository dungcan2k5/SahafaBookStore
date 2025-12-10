<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden relative group">
      
      <div class="p-4 flex items-center gap-3 border-b border-gray-100" :class="headerClass">
        <div class="p-1.5 rounded" :class="iconBgClass || 'bg-red-100 text-[#C92127]'">
           <slot name="icon">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </slot>
        </div>
        <h2 class="text-lg md:text-xl font-bold uppercase text-gray-800">{{ title }}</h2>
        
        <div v-if="showTimer" class="hidden md:flex items-center gap-2 ml-auto text-white">
           <span class="bg-black px-2 py-1 rounded font-bold text-sm w-8 text-center">{{ hours }}</span>:
           <span class="bg-black px-2 py-1 rounded font-bold text-sm w-8 text-center">{{ minutes }}</span>:
           <span class="bg-black px-2 py-1 rounded font-bold text-sm w-8 text-center">{{ seconds }}</span>
        </div>
      </div>

      <div class="relative p-2">
        <button @click="scroll('left')" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#C92127] opacity-0 group-hover:opacity-100 transition border hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div ref="scrollContainer" class="flex overflow-x-auto gap-3 pb-2 scroll-smooth scrollbar-hide">
          <div 
            v-for="book in books" 
            :key="book.id"
            class="min-w-[170px] md:min-w-[200px] bg-white border border-transparent hover:border-gray-200 hover:shadow-md rounded-lg p-3 cursor-pointer transition flex flex-col group/item relative"
          >
             <div class="relative pt-[100%] mb-3">
               <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain hover:scale-105 transition duration-300" />
               <div v-if="book.discount" class="absolute top-0 right-0 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded">-{{ book.discount }}%</div>
             </div>
             
             <h3 class="text-sm text-gray-700 font-medium line-clamp-2 mb-2 h-10 leading-5 group-hover/item:text-blue-600 transition-colors">{{ book.title }}</h3>
             
             <div class="mt-auto">
               <div class="text-[#C92127] font-bold text-lg">{{ formatPrice(book.price) }}đ</div>
               <div class="flex items-center gap-2 mt-1">
                 <div v-if="book.oldPrice" class="text-gray-400 text-xs line-through">{{ formatPrice(book.oldPrice) }}đ</div>
                 <div v-if="book.sold" class="text-xs text-gray-500">Đã bán {{ book.sold }}</div>
               </div>
               
               <div v-if="showProgressBar" class="mt-2 w-full bg-pink-100 rounded-full h-4 relative overflow-hidden">
                  <div class="bg-[#C92127] h-full absolute left-0 top-0" :style="{ width: (book.sold / 100) * 100 + '%' }"></div>
                  <span class="absolute w-full text-center text-[10px] text-white font-bold leading-4 z-10">Đã bán {{ book.sold }}</span>
               </div>
             </div>
          </div>
        </div>

        <button @click="scroll('right')" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#C92127] opacity-0 group-hover:opacity-100 transition border hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="text-center pb-4 pt-2">
         <button class="border-2 border-[#C92127] text-[#C92127] px-10 py-1.5 rounded-lg font-bold text-sm hover:bg-red-50 transition">Xem Thêm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: String,
  books: Array,
  headerClass: { type: String, default: 'bg-white' },
  iconBgClass: String,
  showTimer: { type: Boolean, default: false },
  showProgressBar: { type: Boolean, default: false }
});

const scrollContainer = ref(null);
const scroll = (direction) => {
  if (scrollContainer.value) {
    const amount = 600;
    scrollContainer.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }
};
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v);

// --- LOGIC ĐỒNG HỒ ĐẾM NGƯỢC ---
const hours = ref('02');
const minutes = ref('00');
const seconds = ref('00');
let timerInterval = null;

const startTimer = () => {
  // Set thời gian đếm ngược (Ví dụ: 2 tiếng nữa)
  let timeInSeconds = 2 * 60 * 60; 

  timerInterval = setInterval(() => {
    if (timeInSeconds <= 0) {
      clearInterval(timerInterval);
      return;
    }
    
    timeInSeconds--;
    
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;

    // Format số '0' ở đầu (ví dụ: 5 -> 05)
    hours.value = h.toString().padStart(2, '0');
    minutes.value = m.toString().padStart(2, '0');
    seconds.value = s.toString().padStart(2, '0');
  }, 1000);
};

onMounted(() => {
  if (props.showTimer) {
    startTimer();
  }
});

// Dọn dẹp timer khi thoát khỏi trang để tránh tốn RAM
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>