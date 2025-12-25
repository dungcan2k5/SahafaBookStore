<template>
  <div class="pb-10 bg-gray-50 min-h-screen">
    
    <div class="container mx-auto py-6 px-4">
      <div class="grid grid-cols-12 gap-6">
        
        <div class="col-span-12 lg:col-span-8 bg-white rounded-2xl overflow-hidden shadow-lg relative group h-[200px] md:h-[320px]">
          
          <div 
            class="flex h-full transition-transform duration-700 ease-in-out" 
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
             <div 
               v-for="(banner, index) in bannerImages" 
               :key="index" 
               class="min-w-full h-full"
             >
                <img :src="banner" class="w-full h-full object-cover" alt="Banner Slide" />
             </div>
          </div>

          <button 
            @click="prevSlide" 
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button 
            @click="nextSlide" 
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all z-10 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button 
              v-for="(banner, index) in bannerImages" 
              :key="index"
              @click="currentSlide = index"
              class="w-2.5 h-2.5 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white'"
            ></button>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 flex flex-col gap-4 h-auto lg:h-[320px]">
          <router-link to="/about" class="h-[150px] lg:h-1/2 rounded-2xl overflow-hidden shadow-md group block relative">
            <img :src="sideBanner1" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" alt="Gioi thieu" />
          </router-link>
          <router-link to="/blog" class="h-[150px] lg:h-1/2 rounded-2xl overflow-hidden shadow-md group block relative">
            <img :src="sideBanner2" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" alt="Blog" />
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 mb-8">
      <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 bg-red-600 rounded-full"></div>
          <h3 class="text-lg font-bold text-gray-800 uppercase tracking-wide">Top Bán Chạy Nhất</h3>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div 
    v-for="(book, index) in bestSellers" 
    :key="index" 
    @click="$router.push(`/books/${book.id}`)" 
    class="..."
  >
    <div class="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3">
      <img 
        :src="book.image" 
        class="..." 
        alt="Book Cover"
      />
    </div>

    <div class="flex-1 flex flex-col">
        <h4 class="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition">
          {{ book.title }}
        </h4>
        <div class="mt-auto flex items-end justify-between">
            <div class="text-red-600 font-bold">{{ formatCurrency(book.price) }}</div>
            <div v-if="book.oldPrice > book.price" class="text-xs text-gray-400 line-through">
                {{ formatCurrency(book.oldPrice) }}
            </div>
        </div>
        <div class="mt-2 text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-md text-center font-medium">
            Đã bán {{ book.sold }}
        </div>
    </div>
  </div>
</div>
    </div>

    <CategoryNav />
    <FlashSale /> 
    <ProductCategory />
    <GiftCardSection />
    
    <BookListSection v-if="trendingBooks.length" title="Xu Hướng Mua Sắm" headerClass="bg-pink-100" :books="trendingBooks" seeMoreLink="/trending" />
    <BookListSection v-if="newBooks.length" title="Sách Mới Tuyển Chọn" :books="newBooks" seeMoreLink="/new-arrivals" />

    <div class="mt-8 bg-blue-50 pt-8 pb-0 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-10">
      <div class="container mx-auto px-4">
         <SuggestionsPage :is-embedded="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
// Xóa các dòng import axios dư thừa, chỉ dùng bookService
import api from '@/services/api';

// Import Components
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
import BookListSection from '@/components/user/BookListSection.vue';
import ProductCategory from '@/components/user/ProductCategory.vue';
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';
import FlashSale from '@/components/user/FlashSale.vue';

// Import Assets (Banner)
import banner1 from '@/assets/banners/SAHAFA_BOOKSTORE.png';
import banner2 from '@/assets/banners/SAHAFA_SALE.png';
import banner3 from '@/assets/banners/MERRY_CHRISTMAS.png';
import sideBanner1 from '@/assets/banners/SAHAFA.COM.png';
import sideBanner2 from '@/assets/banners/promo1.jpg'; 

// --- Helper Format Tiền ---
const formatCurrency = (val) => {
  if (!val || isNaN(val)) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

// Slider Logic
const currentSlide = ref(0);
const bannerImages = [banner1, banner2, banner3];
let slideInterval;

const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % bannerImages.length; };
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + bannerImages.length) % bannerImages.length; };

// --- Data Fetching Logic ---
const bestSellers = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);

const fetchAllHomeData = async () => {
  try {
    // Gọi trực tiếp qua api.get và truyền params
    const [best, trend, news] = await Promise.all([
      api.get('/books', { params: { sort: 'total_sold', order: 'DESC', limit: 4 } }),
      api.get('/books', { params: { sort: 'total_sold', order: 'DESC', limit: 10 } }),
      api.get('/books', { params: { sort: 'book_id', order: 'DESC', limit: 10 } })
    ]);

    // Gán dữ liệu trực tiếp vì api.js đã bóc tách data
    bestSellers.value = best || [];
    trendingBooks.value = trend || [];
    newBooks.value = news || [];
  } catch (error) {
    console.error("Lỗi khi gọi API trực tiếp:", error);
  }
};

onMounted(() => {
  fetchAllHomeData();
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>