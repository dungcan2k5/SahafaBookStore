<template>
  <div class="pb-10">
    <div class="container mx-auto py-4 px-4"><div class="grid grid-cols-12 gap-4"><div class="col-span-12 lg:col-span-8 bg-white rounded-lg overflow-hidden h-[320px]"><img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/t/r/trang_trong_tung_hop_banh_slide_840x320.jpg" class="w-full h-full object-cover" /></div><div class="col-span-12 lg:col-span-4 flex flex-col gap-4"><div class="h-[152px] rounded-lg overflow-hidden"><img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/z/a/zalo_pay_392x156.jpg" class="w-full h-full object-cover"/></div><div class="h-[152px] rounded-lg overflow-hidden"><img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/v/p/vpbank_392x156.jpg" class="w-full h-full object-cover"/></div></div></div></div>
    
    <CategoryNav />
    
    <BookListSection 
      v-if="flashSaleBooks.length"
      title="Flash Sale"
      headerClass="bg-orange-100" 
      iconBgClass="bg-orange-500 text-white"
      :books="flashSaleBooks"
      :showTimer="true"
      :showProgressBar="true"
    >
       <template #icon>
         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
       </template>
    </BookListSection>

    <GiftCardSection />
    
    <BookListSection 
      v-if="trendingBooks.length"
      title="Xu Hướng Mua Sắm" 
      headerClass="bg-pink-100"
      :books="trendingBooks"
      seemoreLink="/trending"
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
    <BookListSection 
      title="Gợi Ý Cho Bạn" 
      headerClass="bg-green-50"
      iconBgClass="bg-green-100 text-purple-600"
      :books="suggestionsBooks"
      seeMoreLink="/suggestions"
    >
      <!-- Icon bóng đèn cho section gợi ý -->
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </template>
    </BookListSection>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
// Không cần import FlashSale.vue nữa vì đã gộp
import BookListSection from '@/components/user/BookListSection.vue';
import { bookService } from '@/services/bookService'; 

// Data
const flashSaleBooks = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);
const skillBooks = ref([]);
const literatureBooks = ref([]);
const suggestionsBooks = ref([]);

const fetchAllData = async () => {
  try {
    // 1. Gọi API lấy dữ liệu thật
    const [flash, trend, news] = await Promise.all([
      bookService.getFlashSale(),
      bookService.getTrending(),
      bookService.getNewArrivals()
    ]);

    flashSaleBooks.value = flash;
    trendingBooks.value = trend;
    newBooks.value = news;

    // 2. Điền dữ liệu bổ sung (cho các phần chưa có API)
    skillBooks.value = [{ id: 4, title: 'Đắc Nhân Tâm', price: 76000, discount: 15, sold: 890, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' }];
    literatureBooks.value = [{ id: 5, title: 'Rừng Na Uy', price: 120000, discount: 15, sold: 300, image: 'https://cdn0.fahasa.com/media/catalog/product/r/u/rung-na-uy.jpg' }];
    suggestionsBooks.value = [
      { id: 6, title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', price: 95000, discount: 10, sold: 200, image: 'https://cdn0.fahasa.com/media/catalog/product/t/o/toi-thay-hoa-vang-tren-co-xanh.jpg' },
      { id: 7, title: 'Sapiens: Lược Sử Loài Người', price: 150000, discount: 20, sold: 150, image: 'https://cdn0.fahasa.com/media/catalog/product/s/a/sapiens.jpg' }
    ];
    
  } catch (error) {
    console.error("Lỗi:", error);
  }
};
  onMounted(() => {
  fetchAllData();
});
</script>