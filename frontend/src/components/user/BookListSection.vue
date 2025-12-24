<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg shadow-sm overflow-hidden relative group border border-gray-100">
      
      <div class="p-4 flex items-center gap-3 border-b border-gray-100" :class="headerClass">
        <div class="p-1.5 rounded" :class="iconBgClass || 'bg-red-100 text-[#2563eb]'">
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
        <button @click="scroll('left')" class="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#2563eb] opacity-0 group-hover:opacity-100 transition border hidden md:flex hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div ref="scrollContainer" class="flex overflow-x-auto gap-3 pb-2 scroll-smooth scrollbar-hide p-1">
          
          <div 
            v-for="book in books" 
            :key="book.id"
            @click="goToBookDetail(book.id)" 
            class="min-w-[170px] md:min-w-[200px] h-auto flex flex-col cursor-pointer"
          >
             <BookCard :book="book" class="h-full pointer-events-none" /> 
             <div v-if="showProgressBar" class="mt-2 px-1">
                <div class="w-full bg-pink-100 rounded-full h-4 relative overflow-hidden">
                  <div class="bg-[#2563eb] h-full absolute left-0 top-0" :style="{ width: (book.sold / 1200) * 100 + '%' }"></div>
                  <span class="absolute w-full text-center text-[10px] text-white font-bold leading-4 z-10 uppercase">Đã bán {{ book.sold }}</span>
                </div>
             </div>
          </div>

        </div>

        <button @click="scroll('right')" class="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#2563eb] opacity-0 group-hover:opacity-100 transition border hidden md:flex hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div class="text-center pb-4 pt-2">
        <router-link 
          v-if="seeMoreLink" 
          :to="seeMoreLink" 
          class="border-2 border-[#2563eb] text-[#2563eb] px-12 py-2 rounded-lg font-bold text-sm hover:bg-[#2563eb] hover:text-white transition duration-300 inline-block"
        >
          Xem Thêm
        </router-link>
        
        <button 
          v-else 
          class="border-2 border-[#2563eb] text-[#2563eb] px-12 py-2 rounded-lg font-bold text-sm hover:bg-[#2563eb] hover:text-white transition duration-300"
        >
          Xem Thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // Import Router
import BookCard from '@/components/user/BookCard.vue';

const props = defineProps({
  title: String,
  books: Array,
  headerClass: { type: String, default: 'bg-white' },
  iconBgClass: String,
  showTimer: { type: Boolean, default: false },
  showProgressBar: { type: Boolean, default: false },
  seeMoreLink: String 
});

const router = useRouter(); // Khởi tạo router

// Hàm chuyển hướng
const goToBookDetail = (id) => {
  router.push(`/books/${id}`);
};

const scrollContainer = ref(null);
const scroll = (direction) => {
  if (scrollContainer.value) {
    const amount = 600;
    scrollContainer.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }
};

// Logic đồng hồ (giữ nguyên)
const hours = ref('02');
const minutes = ref('00');
const seconds = ref('00');
let timerInterval = null;

const startTimer = () => {
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
    hours.value = h.toString().padStart(2, '0');
    minutes.value = m.toString().padStart(2, '0');
    seconds.value = s.toString().padStart(2, '0');
  }, 1000);
};

onMounted(() => {
  if (props.showTimer) startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>