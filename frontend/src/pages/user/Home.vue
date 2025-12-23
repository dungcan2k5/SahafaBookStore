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
      <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-6 bg-red-600 rounded-full"></div>
          <h3 class="text-lg font-bold text-gray-800 uppercase tracking-wide">Top Bán Chạy Nhất</h3>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(book, index) in bestSellers" 
          :key="index" 
          class="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col"
        >
          <div class="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3">
             <img 
               :src="book.image" 
               class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
               alt="Book Cover"
             />
             <div class="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-yellow-400 text-white font-bold rounded-full shadow-md z-10 border-2 border-white">
                #{{ index + 1 }}
             </div>
          </div>

          <div class="flex-1 flex flex-col">
              <h4 class="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition">{{ book.title }}</h4>
              <div class="mt-auto flex items-end justify-between">
                  <div class="text-red-600 font-bold text-base">{{ formatCurrency(book.price) }}</div>
                  <div class="text-xs text-gray-400 line-through">{{ formatCurrency(book.originalPrice) }}</div>
              </div>
              <div class="mt-2 text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-md text-center">
                  Đã bán {{ book.sold }}k
              </div>
          </div>
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

// --- IMPORT ẢNH BANNER ---
import banner1 from '@/assets/banners/SAHAFA_BOOKSTORE.png';
import banner2 from '@/assets/banners/SAHAFA_SALE.png';
import banner3 from '@/assets/banners/MERRY_CHRISTMAS.png';
import sideBanner1 from '@/assets/banners/SAHAFA.COM.png';
import sideBanner2 from '@/assets/banners/promo1.jpg';

// (Đã xóa các import ảnh promo1...promo4 vì không dùng nữa)

// --- Helper Format Tiền ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

// Banner Slider Logic
const currentSlide = ref(0);
const bannerImages = [banner1, banner2, banner3];

// --- DỮ LIỆU GIẢ CHO BEST SELLER ---
// Placeholder để chờ có API thật thì thay vào
const bestSellers = ref([
    { 
        title: 'Cây Cam Ngọt Của Tôi', 
        price: 85000, 
        originalPrice: 108000, 
        sold: 5.2,
        image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' 
    },
    { 
        title: 'Nhà Giả Kim (Tái Bản)', 
        price: 63000, 
        originalPrice: 79000, 
        sold: 12.5,
        image: 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha_gia_kim_2020_bia_cung.jpg' 
    },
    { 
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', 
        price: 72000, 
        originalPrice: 90000, 
        sold: 8.9,
        image: 'https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tre-dang-gia-bao-nhieu-u.jpg' 
    },
    { 
        title: 'Đắc Nhân Tâm (Khổ Nhỏ)', 
        price: 55000, 
        originalPrice: 86000, 
        sold: 21.1,
        image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935086851928.jpg' 
    }
]);

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

// Data Fetching Logic
const flashSaleBooks = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);

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