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
    />

    <BookListSection 
      v-if="newBooks.length"
      title="Sách Mới Tuyển Chọn" 
      :books="newBooks"
    />

    <BookListSection 
      v-if="skillBooks.length"
      title="Tâm Lý - Kỹ Năng Sống"
      headerClass="bg-blue-50"
      iconBgClass="bg-blue-100 text-blue-600"
      :books="skillBooks"
    />

    <BookListSection 
      v-if="literatureBooks.length"
      title="Văn Học Kinh Điển"
      headerClass="bg-yellow-50"
      iconBgClass="bg-yellow-100 text-yellow-600"
      :books="literatureBooks"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
import BookListSection from '@/components/user/BookListSection.vue'; 
import ProductCategory from '@/components/user/ProductCategory.vue';

// --- Cấu hình cho Banner Slide ---
const currentSlide = ref(0);

// Danh sách ảnh Slide (Đã đúng theo file bạn gửi)
const bannerImages = [
  '/banners/WELCOME_TO_SAHAFA.png',    // Ảnh 1
  '/banners/12.12_BIG_SALE.png',       // Ảnh 2
  '/banners/MERRY_CHRISTMAS.png'       // Ảnh 3
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

// --- Dữ liệu Sách (Mock Data) ---
const flashSaleBooks = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);
const skillBooks = ref([]);
const literatureBooks = ref([]);

onMounted(async () => {
  startAutoSlide(); 

  await new Promise(r => setTimeout(r, 500)); 
  
  // Sửa lại đoạn dữ liệu Flash Sale trong onMounted
  flashSaleBooks.value = [
     { id: 99, title: 'Harry Potter Boxset', price: 1200000, oldPrice: 2000000, discount: 40, sold: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/h/a/harry-potter-full.jpg' },
     { id: 98, title: 'Sherlock Holmes', price: 150000, oldPrice: 300000, discount: 50, sold: 45, image: 'https://cdn0.fahasa.com/media/catalog/product/s/h/sherlock-holmes.jpg' },
     { id: 97, title: 'Thám Tử Conan 100', price: 25000, oldPrice: 50000, discount: 50, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_235737.jpg' },
     { id: 96, title: 'Doraemon Truyện Dài', price: 18000, oldPrice: 30000, discount: 40, sold: 850, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' }, // Ảnh minh họa tạm
     { id: 95, title: 'One Piece Tập 99', price: 22000, oldPrice: 45000, discount: 51, sold: 3000, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_244716.jpg' }, // Ảnh minh họa tạm
  ];

  // Sửa lại đoạn Trending Books (Xu hướng) cho đầy đặn
  trendingBooks.value = [
    { id: 1, title: 'Nhà Giả Kim', price: 63000, discount: 20, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' }, 
    { id: 2, title: 'Cây Cam Ngọt Của Tôi', price: 86000, discount: 20, sold: 540, image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg' },
    { id: 3, title: 'Hoàng Tử Bé', price: 75000, discount: 15, sold: 2300, image: 'https://cdn0.fahasa.com/media/catalog/product/h/o/hoang-tu-be-tai-ban-2019_1.jpg' },
    { id: 4, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', price: 80000, discount: 10, sold: 4100, image: 'https://cdn0.fahasa.com/media/catalog/product/t/u/tuoi-tre-dang-gia-bao-nhieu-u.jpg' },
    { id: 5, title: 'Đời Thay Đổi Khi Ta Thay Đổi', price: 90000, discount: 25, sold: 890, image: 'https://cdn0.fahasa.com/media/catalog/product/d/o/doi-thay-doi-khi-chung-ta-thay-doi-tap-1.jpg' }
  ];
  
  newBooks.value = [{ id: 3, title: 'Muôn Kiếp Nhân Sinh', price: 180000, discount: 10, sold: 50, image: 'https://cdn0.fahasa.com/media/catalog/product/m/u/muon-kiep-nhan-sinh-2.jpg' }];
  skillBooks.value = [{ id: 4, title: 'Đắc Nhân Tâm', price: 76000, discount: 15, sold: 890, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' }];
  literatureBooks.value = [{ id: 5, title: 'Rừng Na Uy', price: 120000, discount: 15, sold: 300, image: 'https://cdn0.fahasa.com/media/catalog/product/r/u/rung-na-uy.jpg' }];
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>