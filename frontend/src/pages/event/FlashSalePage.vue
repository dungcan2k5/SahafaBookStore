<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="mb-8 flex items-end justify-between border-b pb-4">
         <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span class="text-yellow-500 text-3xl">⚡</span>
                FLASH SALE 
                <span class="text-gray-400 text-lg font-normal ml-2">Kết thúc trong</span>
                <div class="flex gap-1 text-base font-mono text-white">
                   <span class="bg-black rounded px-2">{{ hours }}</span>:
                   <span class="bg-black rounded px-2">{{ minutes }}</span>:
                   <span class="bg-black rounded px-2">{{ seconds }}</span>
                </div>
            </h1>
         </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>

      <div v-else-if="flashSaleBooks.length === 0" class="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
        <p class="text-gray-500 text-lg mb-4">Hiện chưa có chương trình Flash Sale nào.</p>
        <router-link to="/" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Về trang chủ
        </router-link>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <div 
          v-for="book in flashSaleBooks" 
          :key="book.id" 
          class="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer hover:-translate-y-1"
          @click="goToDetail(book.slug || book.id)"
        >
        <div class="relative pt-[140%] bg-gray-100 overflow-hidden">
            <img 
              :src="book.image || 'https://placehold.co/400x600?text=No+Image'" 
              class="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              alt="Book cover"
            />
            <div 
              v-if="book.discount && book.discount > 0" 
              class="absolute top-0 right-0 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-sm"
            >
              -{{ book.discount }}%
            </div>
          </div>

          <div class="p-3 flex flex-col h-[140px]">
             <h3 class="text-sm md:text-base font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-[#C92127] transition-colors leading-tight">
               {{ book.title }}
             </h3>
             
             <div class="mt-auto pt-2 border-t border-gray-50">
                <div class="text-[#C92127] font-bold text-lg leading-none">
                    {{ formatPrice(book.price) }}đ
                </div>
                <div class="text-gray-400 text-xs line-through mb-1">{{ formatPrice(book.oldPrice) }}đ</div>

                <div class="relative w-full h-4 bg-pink-100 rounded-full overflow-hidden mt-1">
                    <div 
                        class="absolute top-0 left-0 h-full bg-[#C92127]" 
                        :style="{ width: (book.sold / book.totalStock) * 100 + '%' }"
                    ></div>
                    <div class="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold uppercase z-10">
                        Đã bán {{ book.total_sold || book.sold || 0 }}
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router = useRouter();

// --- Logic Đồng hồ (Giả lập) ---
const hours = ref('02');
const minutes = ref('45');
const seconds = ref('00');
let timerInterval = null;

const startTimer = () => {
  let timeInSecs = 3 * 60 * 60; 
  timerInterval = setInterval(() => {
    timeInSecs--;
    if (timeInSecs < 0) { clearInterval(timerInterval); return; }
    
    hours.value = Math.floor(timeInSecs / 3600).toString().padStart(2, '0');
    minutes.value = Math.floor((timeInSecs % 3600) / 60).toString().padStart(2, '0');
    seconds.value = Math.floor(timeInSecs % 60).toString().padStart(2, '0');
  }, 1000);
};

// --- Logic API ---
const flashSaleBooks = ref([]); 
const isLoading = ref(false);

const fetchFlashSaleBooks = async () => {
    isLoading.value = true;
    try {
        const res = await api.get('/api/books/flash-sale');
        const body = res.data || res;
        if (body.success) {
          flashSaleBooks.value = body.data;
        } else if (Array.isArray(res)) {
          flashSaleBooks.value = res;
        }
    } catch (error) {
        console.error("Lỗi Flash Sale:", error);
    } finally {
        isLoading.value = false;
    }
};

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

// Hàm chuyển hướng
const goToDetail = (slugOrId) => {
  // Nếu vì lý do gì đó mà slugOrId bị undefined, chặn lại
  if (!slugOrId) return;
  router.push(`/books/${slugOrId}`);
};

onMounted(() => {
  startTimer();
  fetchFlashSaleBooks();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>