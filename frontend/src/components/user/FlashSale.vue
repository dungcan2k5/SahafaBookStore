<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-red-600 rounded-xl p-4 shadow-lg">
      
      <div class="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div class="flex items-center gap-2 md:gap-6">
          <div class="flex items-center gap-1 italic font-black text-2xl md:text-3xl text-white">
            <span class="text-yellow-400 drop-shadow-md">FLA⚡H</span>
            <span class="drop-shadow-md">SALE</span>
          </div>
          
          <div class="flex items-center gap-1 text-white font-bold">
            <span class="text-sm md:text-base font-normal mr-2 hidden md:inline-block">Kết thúc trong</span>
            <div class="bg-black/80 text-white px-2 py-1 rounded-md min-w-[32px] text-center border border-white/20">{{ hours }}</div>
            <span class="font-black">:</span>
            <div class="bg-black/80 text-white px-2 py-1 rounded-md min-w-[32px] text-center border border-white/20">{{ minutes }}</div>
            <span class="font-black">:</span>
            <div class="bg-black/80 text-white px-2 py-1 rounded-md min-w-[32px] text-center border border-white/20">{{ seconds }}</div>
          </div>
        </div>

        <router-link to="/flash-sale" class="text-white text-sm font-medium hover:text-yellow-200 flex items-center group transition">
          Xem tất cả <span class="ml-1 group-hover:translate-x-1 transition-transform">></span>
        </router-link>
      </div>

      <div class="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
        
        <div v-if="isLoading" class="w-full text-center text-white py-10">
           <div class="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
           <p>Đang săn deal tốt...</p>
        </div>

        <div 
          v-else
          v-for="book in flashSaleBooks" 
          :key="book.id"
          @click="goToBookDetail(book.slug || book.id)"
          class="bg-white rounded-xl p-3 min-w-[170px] max-w-[170px] md:min-w-[210px] md:max-w-[210px] flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer snap-start"
        >
        <div class="relative pt-[140%] mb-3 rounded-lg overflow-hidden group">
            <img 
              :src="book.image && book.image.startsWith('http') ? book.image : `http://localhost:3000${book.image}`" 
              class="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              alt="Book cover"
            />
            <div class="absolute top-0 right-0 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
              -{{ book.discount }}%
            </div>
          </div>

          <h3 class="text-[14px] leading-tight text-gray-800 font-medium line-clamp-2 mb-2 min-h-[40px] group-hover:text-[#C92127] transition-colors">
            {{ book.title }}
          </h3>

          <div>
            <div class="flex items-center gap-2 mb-1">
               <div class="text-[#C92127] font-bold text-lg">{{ formatPrice(book.price) }}đ</div>
            </div>
            <div class="text-gray-400 text-xs line-through mb-2">{{ formatPrice(book.oldPrice) }}đ</div>
            
            <div class="relative w-full h-5 bg-pink-100 rounded-full overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-[#C92127]" 
                :style="{ width: (book.sold / book.totalStock) * 100 + '%' }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold uppercase z-10 drop-shadow-sm">
                <span v-if="book.sold > 0">Đã bán {{ book.sold }}</span>
                <span v-else>Vừa mở bán</span>
              </div>
              <div class="absolute left-1 top-1/2 -translate-y-1/2 text-[10px]" v-if="book.sold > 10">🔥</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'; // Cần thêm import này
import api from '../../services/api'; 

const router = useRouter(); // Khai báo router
const flashSaleBooks = ref([]);
const isLoading = ref(false);

// --- LOGIC ĐỒNG HỒ ---
const hours = ref('02');
const minutes = ref('59');
const seconds = ref('59');
let timerInterval = null;

const startTimer = () => {
  let timeInSecs = 3 * 60 * 60; // 3 tiếng
  timerInterval = setInterval(() => {
    timeInSecs--;
    if (timeInSecs < 0) {
      clearInterval(timerInterval);
      return;
    }
    hours.value = Math.floor(timeInSecs / 3600).toString().padStart(2, '0');
    minutes.value = Math.floor((timeInSecs % 3600) / 60).toString().padStart(2, '0');
    seconds.value = Math.floor(timeInSecs % 60).toString().padStart(2, '0');
  }, 1000);
};

// --- LOGIC API ---
const fetchFlashSaleBooks = async () => {
    isLoading.value = true;
    try {
        const data = await api.get('/books/flash-sale'); 
        if (data) {
            flashSaleBooks.value = data;
        }
    } catch (error) {
        console.error("Lỗi Flash Sale:", error);
    } finally {
        isLoading.value = false;
    }
};

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

const goToBookDetail = (slugOrId) => {
  if (!slugOrId) return;
  router.push(`/books/${slugOrId}`);
};

onMounted(() => {
  startTimer(); // Bây giờ hàm này đã tồn tại nên sẽ không lỗi
  fetchFlashSaleBooks();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.5); border-radius: 4px; cursor: pointer; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.9); }
</style>