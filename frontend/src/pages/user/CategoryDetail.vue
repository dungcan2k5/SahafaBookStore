<template>
  <div class="bg-gray-50 min-h-screen pb-10">
    <div class="bg-white shadow-sm mb-6 border-t">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center gap-4">
          <div class="p-4 bg-red-50 rounded-full border border-red-100">
             <img :src="categoryInfo.icon" class="w-12 h-12 object-contain" />
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium mb-1">Danh mục sản phẩm</p>
            <h1 class="text-3xl font-bold text-gray-800 uppercase tracking-wide">{{ categoryInfo.name }}</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div v-if="filteredBooks.length === 0" class="text-center py-20 bg-white rounded-lg shadow-sm">
        <p class="text-gray-500 text-lg">Chưa có sản phẩm nào.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        <router-link 
          v-for="book in filteredBooks" 
          :key="book.id"
          :to="{ name: 'BookDetail', params: { id: book.id } }"
          class="bg-white rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3 border border-gray-100 flex flex-col group cursor-pointer"
        >
          <div class="aspect-[2/3] overflow-hidden rounded-md mb-3 relative">
            <img :src="book.image" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            <div v-if="book.discount > 0" class="absolute top-2 right-2 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              -{{ book.discount }}%
            </div>
          </div>
          
          <h3 class="font-medium text-gray-800 text-sm line-clamp-2 mb-2 flex-1 group-hover:text-[#C92127] transition-colors">
            {{ book.title }}
          </h3>
          
          <div class="mt-auto pt-2 border-t border-gray-50">
             <div class="flex items-end gap-2 mb-1">
               <span class="text-[#C92127] font-bold text-lg">{{ formatPrice(book.price) }}đ</span>
             </div>
             <div class="flex items-center justify-between">
                <div class="flex text-yellow-400 text-xs">★★★★★</div>
                <span class="text-gray-400 text-xs">Đã bán {{ book.sold }}</span>
             </div>
          </div>
        </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

const categoryMap = {
  'van-hoc': { name: 'Văn Học', icon: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' },
  'kinh-te': { name: 'Kinh Tế', icon: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png' },
  'tam-ly': { name: 'Tâm Lý - Kỹ Năng', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079166.png' },
  'thieu-nhi': { name: 'Thiếu Nhi', icon: 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png' },
  'giao-khoa': { name: 'Sách Giáo Khoa', icon: 'https://cdn-icons-png.flaticon.com/512/167/167755.png' },
  'nuoi-day-con': { name: 'Nuôi Dạy Con', icon: 'https://cdn-icons-png.flaticon.com/512/2990/2990263.png' },
  'default': { name: 'Danh Mục Sách', icon: 'https://cdn-icons-png.flaticon.com/512/207/207114.png' }
};

const categoryInfo = computed(() => categoryMap[route.params.id] || categoryMap['default']);

// DỮ LIỆU MOCK (Dùng chung ID với bên BookDetail để khớp dữ liệu)
const allBooks = [
  { id: 1, category: 'van-hoc', title: 'Mắt Biếc - Nguyễn Nhật Ánh', price: 110000, discount: 20, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/m/a/mat-biec-bia-mem-2019.jpg' },
  { id: 2, category: 'van-hoc', title: 'Nhà Giả Kim', price: 79000, discount: 15, sold: 5000, image: 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha_gia_kim_2020_1.jpg' },
  { id: 3, category: 'van-hoc', title: 'Cây Cam Ngọt Của Tôi', price: 108000, discount: 30, sold: 3200, image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg' },
  { id: 4, category: 'kinh-te', title: 'Cha Giàu Cha Nghèo', price: 85000, discount: 30, sold: 3000, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/cha-giau-cha-ngheo-tap-1-_tai-ban-2021_.jpg' },
  { id: 5, category: 'kinh-te', title: 'Nhà Đầu Tư Thông Minh', price: 150000, discount: 10, sold: 500, image: 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha_dau_tu_thong_minh_tai_ban_2020.jpg' },
  { id: 6, category: 'tam-ly', title: 'Đắc Nhân Tâm', price: 76000, discount: 25, sold: 9000, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' },
  { id: 7, category: 'tam-ly', title: 'Tâm Lý Học Về Tiền', price: 189000, discount: 15, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/t/a/tam-ly-hoc-ve-tien.jpg' },
  { id: 8, category: 'thieu-nhi', title: 'Dế Mèn Phiêu Lưu Ký', price: 35000, discount: 10, sold: 800, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8936037718029.jpg' },
  { id: 9, category: 'thieu-nhi', title: 'Chuyện Con Mèo Dạy Hải Âu Bay', price: 49000, discount: 20, sold: 2500, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/chuyen-con-meo-day-hai-au-bay-tai-ban-2019.jpg' },
  { id: 10, category: 'giao-khoa', title: 'Toán Lớp 1 - Cánh Diều', price: 20000, discount: 0, sold: 10000, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_41989.jpg' },
  { id: 11, category: 'nuoi-day-con', title: 'Phương Pháp Ăn Dặm Bé Chỉ Huy', price: 120000, discount: 15, sold: 400, image: 'https://cdn0.fahasa.com/media/catalog/product/p/h/phuong-phap-an-dam-be-chi-huy.jpg' },
];

const filteredBooks = computed(() => allBooks.filter(book => book.category === route.params.id));
</script>