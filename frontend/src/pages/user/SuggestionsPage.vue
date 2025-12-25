<template>
  <!-- Trang hiển thị danh sách sách gợi ý cho người dùng -->
  <div class="bg-gray-50 min-h-screen py-6">
    <div class="container mx-auto px-4">

      <!-- Breadcrumb navigation -->
      <div class="text-sm text-gray-500 mb-4">
        <router-link to="/" class="hover:text-blue-600">Trang chủ</router-link> /
        <span class="text-gray-800 font-medium">Gợi Ý Cho Bạn</span>
      </div>

      <!-- Header section với icon và mô tả -->
      <div class="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg p-8 mb-8 flex items-center gap-6 border border-green-300 shadow-lg">
        <!-- Icon bóng đèn đại diện cho gợi ý với animation -->
        <div class="animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold uppercase">Gợi Ý Cho Bạn</h1>
          <p class="text-green-100 text-base mt-2">Những cuốn sách được gợi ý dựa trên sở thích của bạn tại Sahafa</p>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="n in 10" :key="n" class="bg-white rounded-lg p-4 h-[320px] animate-pulse border border-gray-200">
          <div class="bg-gray-200 h-[200px] w-full mb-3 rounded"></div>
          <div class="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
          <div class="bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
      </div>

      <!-- Grid hiển thị sách gợi ý -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <router-link
          v-for="book in books"
          :key="book.id"
          :to="`/books/${book.id}`"
          class="bg-white rounded-lg p-4 hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-200 cursor-pointer flex flex-col group relative"
        >
          <div class="relative pt-[100%] mb-3 overflow-hidden rounded-md">
            <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain group-hover:scale-105 transition duration-500" />
            <div v-if="book.discount" class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">-{{ book.discount }}%</div>
          </div>

          <h3 class="text-sm text-gray-700 font-medium line-clamp-2 mb-2 min-h-[40px] group-hover:text-blue-600 transition">
            {{ book.title }}
          </h3>

          <div class="mt-auto">
            <div class="text-red-600 font-bold text-lg">{{ formatPrice(book.price) }}đ</div>
            <div class="flex items-center gap-2 mt-1">
              <div v-if="book.oldPrice" class="text-gray-400 text-xs line-through">{{ formatPrice(book.oldPrice) }}đ</div>
              <div class="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Đã bán {{ book.sold }}</div>
            </div>
          </div>
        </router-link>
      </div>
      
      <div class="flex justify-center mt-10 mb-4">
        <router-link 
          v-if="isEmbedded" 
          to="/suggestions" 
          class="bg-white border-2 border-green-500 text-green-600 font-bold px-12 py-2.5 rounded-full hover:bg-green-500 hover:text-white transition shadow-md uppercase text-sm tracking-wide"
        >
          Xem tất cả sản phẩm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

// Dữ liệu sách gợi ý
const books = ref([]);
// Trạng thái loading
const loading = ref(true);

// Hàm format giá tiền
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v);

// Hàm tải dữ liệu sách gợi ý
const loadData = async () => {
  try {
    loading.value = true;
    // Gọi trực tiếp route gợi ý sách (ví dụ /books hoặc route riêng của bạn)
    // Nếu chưa có route riêng, có thể dùng tạm danh sách sách mới
    const data = await api.get('/books', { params: { limit: 10, sort: 'book_id' } });
    books.value = data || [];
  } catch (e) {
    console.error("Lỗi tải gợi ý:", e);
  } finally {
    loading.value = false;
  }
};
const props = defineProps({
  isEmbedded: {
    type: Boolean,
    default: false // Mặc định là false (tức là chạy như trang bình thường)
  }
});

// Tải dữ liệu khi component được mount
onMounted(() => {
  loadData();
});
</script>