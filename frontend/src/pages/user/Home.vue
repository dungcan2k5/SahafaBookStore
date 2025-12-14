<template>
  <div class="pb-10 bg-gray-50 min-h-screen">
    
    <div class="container mx-auto py-4 px-4">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-8 bg-white rounded-lg overflow-hidden shadow-sm relative group h-[320px]">
          <div class="w-full h-full relative">
             <img 
                :src="bannerImages[currentSlide]" 
                class="w-full h-full object-cover transition-all duration-500 ease-in-out" 
                alt="Banner Slide"
             />
          </div>

          <button @click="prevSlide" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button @click="nextSlide" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button 
              v-for="(img, index) in bannerImages" 
              :key="index"
              @click="currentSlide = index"
              :class="['w-3 h-3 rounded-full transition-all', currentSlide === index ? 'bg-red-600 w-6' : 'bg-white/70 hover:bg-white']"
            ></button>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4 flex flex-col gap-4 h-[320px]">
          <div class="h-1/2 rounded-lg overflow-hidden shadow-sm">
            <img 
              src="/banners/SAHAFA.COM.png" 
              class="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
            />
          </div>
          <div class="h-1/2 rounded-lg overflow-hidden shadow-sm">
            <img 
              src="/banners/GIAM_GIA.png" 
              class="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 mb-4">
      <div class="grid grid-cols-4 gap-4">
        <div class="col-span-2 md:col-span-1 h-[150px] bg-gray-300 rounded-lg flex items-center justify-center hover:shadow-md transition cursor-pointer group">
          <span class="text-2xl font-bold text-gray-500 group-hover:text-gray-700">IMG 1</span>
        </div>
        <div class="col-span-2 md:col-span-1 h-[150px] bg-gray-300 rounded-lg flex items-center justify-center hover:shadow-md transition cursor-pointer group">
           <span class="text-2xl font-bold text-gray-500 group-hover:text-gray-700">IMG 2</span>
        </div>
        <div class="col-span-2 md:col-span-1 h-[150px] bg-gray-300 rounded-lg flex items-center justify-center hover:shadow-md transition cursor-pointer group">
           <span class="text-2xl font-bold text-gray-500 group-hover:text-gray-700">IMG 3</span>
        </div>
        <div class="col-span-2 md:col-span-1 h-[150px] bg-gray-300 rounded-lg flex items-center justify-center hover:shadow-md transition cursor-pointer group">
           <span class="text-2xl font-bold text-gray-500 group-hover:text-gray-700">IMG 4</span>
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

    <BookListSection 
      title="Gợi Ý Cho Bạn" 
      headerClass="bg-green-50"
      iconBgClass="bg-green-100 text-purple-600"
      :books="suggestionsBooks"
      seeMoreLink="/suggestions"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </template>
    </BookListSection>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
import BookListSection from '@/components/user/BookListSection.vue';
import ProductCategory from '@/components/user/ProductCategory.vue';
import { bookService } from '@/services/bookService'; 

// --- Cấu hình cho Banner Slide ---
const currentSlide = ref(0);

const bannerImages = [
  '/banners/WELCOME_TO_SAHAFA.png',    
  '/banners/12.12_BIG_SALE.png',       
  '/banners/MERRY_CHRISTMAS.png'       
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
// Đã xóa ref skillBooks và literatureBooks để dọn dẹp code thừa

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