<!-- <template>
  <div class="pb-10">
    <div class="container mx-auto py-4 px-4">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-8 bg-white rounded-lg overflow-hidden h-[320px]">
          <img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/t/r/trang_trong_tung_hop_banh_slide_840x320.jpg" class="w-full h-full object-cover" />
        </div>
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div class="h-[152px] rounded-lg overflow-hidden"><img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/z/a/zalo_pay_392x156.jpg" class="w-full h-full object-cover"/></div>
          <div class="h-[152px] rounded-lg overflow-hidden"><img src="https://cdn0.fahasa.com/media/magentotheme/banner/banner760/v/p/vpbank_392x156.jpg" class="w-full h-full object-cover"/></div>
        </div>
      </div>
    </div>

    <CategoryNav />
    <FlashSale /> 
    <GiftCardSection />
    <ProductCategory />

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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import FlashSale from '@/components/user/FlashSale.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
import ProductCategory from '@/components/user/ProductCategory.vue';
import BookListSection from '@/components/user/BookListSection.vue';

const trendingBooks = ref([]);
const newBooks = ref([]);
const skillBooks = ref([]);

const fetchHomeData = async () => {
  // Giả lập dữ liệu
  await new Promise(r => setTimeout(r, 500));
  
  trendingBooks.value = [
    { id: 1, title: 'Nhà Giả Kim', price: 63000, discount: 20, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
    { id: 2, title: 'Cây Cam Ngọt Của Tôi', price: 86000, discount: 20, sold: 540, image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg' }
  ];
  newBooks.value = [
    { id: 3, title: 'Muôn Kiếp Nhân Sinh', price: 180000, discount: 10, sold: 50, image: 'https://cdn0.fahasa.com/media/catalog/product/m/u/muon-kiep-nhan-sinh-2.jpg' }
  ];
  skillBooks.value = [
    { id: 4, title: 'Đắc Nhân Tâm', price: 76000, discount: 15, sold: 890, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' }
  ];
};

onMounted(() => {
  fetchHomeData();
});
</script> -->
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
import { ref, onMounted } from 'vue';
import CategoryNav from '@/components/user/CategoryNav.vue';
import GiftCardSection from '@/components/user/GiftCardSection.vue';
// Không cần import FlashSale.vue nữa vì đã gộp
import BookListSection from '@/components/user/BookListSection.vue'; 

// Data
const flashSaleBooks = ref([]);
const trendingBooks = ref([]);
const newBooks = ref([]);
const skillBooks = ref([]);
const literatureBooks = ref([]);

onMounted(async () => {
  await new Promise(r => setTimeout(r, 500)); // Mock API
  
  flashSaleBooks.value = [
     { id: 99, title: 'Harry Potter Boxset', price: 1200000, oldPrice: 2000000, discount: 40, sold: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/h/a/harry-potter-full.jpg' },
     { id: 98, title: 'Sherlock Holmes', price: 150000, oldPrice: 300000, discount: 50, sold: 45, image: 'https://cdn0.fahasa.com/media/catalog/product/s/h/sherlock-holmes.jpg' },
  ];

  trendingBooks.value = [{ id: 1, title: 'Nhà Giả Kim', price: 63000, discount: 20, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' }, { id: 2, title: 'Cây Cam Ngọt Của Tôi', price: 86000, discount: 20, sold: 540, image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg' }];
  newBooks.value = [{ id: 3, title: 'Muôn Kiếp Nhân Sinh', price: 180000, discount: 10, sold: 50, image: 'https://cdn0.fahasa.com/media/catalog/product/m/u/muon-kiep-nhan-sinh-2.jpg' }];
  skillBooks.value = [{ id: 4, title: 'Đắc Nhân Tâm', price: 76000, discount: 15, sold: 890, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' }];
  literatureBooks.value = [{ id: 5, title: 'Rừng Na Uy', price: 120000, discount: 15, sold: 300, image: 'https://cdn0.fahasa.com/media/catalog/product/r/u/rung-na-uy.jpg' }];
});
</script>