<template>
  <div class="pb-10 bg-gray-50 min-h-screen">
    
    <div class="container mx-auto py-6 px-4">
      <div class="grid grid-cols-12 gap-6">
        
        <div class="col-span-12 lg:col-span-8 bg-white rounded-2xl overflow-hidden shadow-lg relative group h-[200px] md:h-[320px]">
          <div class="w-full h-full relative">
             <img 
                :src="bannerImages[currentSlide]" 
                class="w-full h-full object-cover transition-all duration-500 ease-in-out" 
                alt="Banner Slide"
             />
          </div>

          <button @click="prevSlide" class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button @click="nextSlide" class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button 
              v-for="(img, index) in bannerImages" 
              :key="index"
              @click="currentSlide = index"
              :class="['h-2 rounded-full transition-all duration-300 shadow-sm', currentSlide === index ? 'bg-red-600 w-8' : 'bg-white/70 w-2 hover:bg-white']"
            ></button>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 flex flex-col gap-4 h-auto lg:h-[320px]">
          <div class="h-[150px] lg:h-1/2 rounded-2xl overflow-hidden shadow-md group">
            <img 
              :src="sideBanner1" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
            />
          </div>
          <div class="h-[150px] lg:h-1/2 rounded-2xl overflow-hidden shadow-md group">
            <img 
              :src="sideBanner2" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 mb-8">
      <div class="grid grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" 
             class="col-span-2 md:col-span-1 h-[120px] bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
          <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100 transition">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span class="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition">IMG {{ n }}</span>
        </div>
      </div>
    </div>

    <CategoryNav />
    
    <BookListSection 
      v-if="flashSaleBooks.length"
      title="FLASH SALE"
      headerClass="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md rounded-t-lg border-none" 
      iconBgClass="bg-white text-red-600"
      :books="flashSaleBooks"
      :showTimer="true"
      :showProgressBar="true"
      seeMoreLink="/flash-sale"
    >
       <template #icon>
         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
       </template>
    </BookListSection>

    <ProductCategory />

    <GiftCardSection />
    
    <BookListSection 
      v-if="trendingBooks.length"
      title="Xu Hướng Mua Sắm" 
      headerClass="bg-pink-100"
      :books="trendingBooks"
      seeMoreLink="/trending"
    />

    <BookListSection 
      v-if="newBooks.length"
      title="Sách Mới Tuyển Chọn" 
      :books="newBooks"
      seeMoreLink="/new-arrivals"
    />

    <div class="mt-8 bg-blue-50 pt-8 pb-0 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-10">
      <div class="container mx-auto px-4">
         <SuggestionsPage :is-embedded="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
import BookListSection from '@/components/user/BookListSection.vue';
import ProductCategory from '@/components/user/ProductCategory.vue';
import { bookService } from '@/services/bookService'; 
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';

// --- IMPORT ẢNH TỪ ASSETS ---
import banner1 from '@/assets/banners/WELCOME_TO_SAHAFA.png';
import banner2 from '@/assets/banners/12.12_BIG_SALE.png';
import banner3 from '@/assets/banners/MERRY_CHRISTMAS.png';
import sideBanner1 from '@/assets/banners/SAHAFA.COM.png';
import sideBanner2 from '@/assets/banners/GIAM_GIA.png';

// --- Cấu hình cho Banner Slide ---
const currentSlide = ref(0);

// Gán biến import vào mảng thay vì chuỗi string
const bannerImages = [
  banner1,    
  banner2,       
  banner3       
];

let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerImages.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + bannerImages.length) % bannerImages.length;
};

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 3000);
};

// --- Dữ liệu Sách ---
const flashSaleBooks = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);
const suggestionsBooks = ref([]);

const fetchAllData = async () => {
  try {
    const [flash, trend, news] = await Promise.all([
      bookService.getFlashSale(),
      bookService.getTrending(),
      bookService.getNewArrivals()
    ]);

    flashSaleBooks.value = flash;
    trendingBooks.value = trend;
    newBooks.value = news;

    // Dữ liệu mock cho Suggestion
    suggestionsBooks.value = [
      { id: 6, title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', price: 95000, discount: 10, sold: 200, image: 'https://cdn0.fahasa.com/media/catalog/product/t/o/toi-thay-hoa-vang-tren-co-xanh.jpg' },
      { id: 7, title: 'Sapiens: Lược Sử Loài Người', price: 150000, discount: 20, sold: 150, image: 'https://cdn0.fahasa.com/media/catalog/product/s/a/sapiens.jpg' }
    ];
    
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
};

onMounted(() => {
  startAutoSlide();
  fetchAllData();
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>