<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="mb-8 flex items-end justify-between border-b pb-4">
         <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Kết quả tìm kiếm: "<span class="text-[#C92127]">{{ currentKeyword }}</span>"
            </h1>
            <p class="text-gray-500 mt-1 ml-9">Tìm thấy <b>{{ books.length }}</b> cuốn sách phù hợp</p>
         </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>

      <div v-else-if="books.length === 0" class="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
        <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" class="w-32 h-32 mx-auto mb-4 opacity-50" />
        <p class="text-gray-500 text-lg mb-4">Không tìm thấy sách hoặc tác giả nào phù hợp.</p>
        <router-link to="/" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Về trang chủ
        </router-link>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <div 
          v-for="book in books" 
          :key="book.book_id" 
          class="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer hover:-translate-y-1 flex flex-col"
          @click="goToDetail(book.book_slug)" 
        >
          <div class="relative w-full h-56 md:h-64 bg-gray-100 overflow-hidden">
            <img
              :src="book.BookImages?.[0]?.book_image_url || 'https://placehold.co/400x600?text=No+Image'"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              alt="Book cover"
              @error="(e) => e.target.src = 'https://placehold.co/400x600?text=No+Image'"
            />
            <div v-if="book.discount && book.discount > 0" class="absolute top-2 right-2 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
              -{{ book.discount }}%
            </div>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#C92127] transition-colors">
              {{ book.book_title }}
            </h3>

            <div class="text-sm text-gray-600 mb-2">
              <div><span class="font-medium">TG: </span>{{ book.Author?.author_name || 'Đang cập nhật' }}</div>
              <div><span class="font-medium">Thể loại: </span>{{ book.Genre?.genre_name || 'Đang cập nhật' }}</div>
            </div>

            <div class="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
              <div class="text-[#C92127] font-extrabold text-lg">
                {{ formatPrice(book.price) }}
              </div>
              <div class="text-right">
                <div v-if="book.oldPrice > book.price" class="text-sm text-gray-400 line-through">{{ formatPrice(book.oldPrice) }}</div>
                <div class="text-xs text-gray-500">Đã bán {{ book.total_sold || book.sold || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();

const books = ref([]);
const isLoading = ref(false);
const currentKeyword = ref('');

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val);

// Hàm chuyển hướng nhận slug
const goToDetail = (slug) => {
    // Fallback: nếu không có slug thì dùng ID hoặc báo lỗi
    if (!slug) {
        console.warn("Sách này chưa có Slug, vui lòng kiểm tra DB");
        return;
    }
    router.push(`/books/${slug}`);
};

const fetchSearchResults = async () => {
  const query = route.query.search;
  
  if (!query) return;

  currentKeyword.value = query;
  isLoading.value = true;
  books.value = [];

    try {
      const response = await api.get('/api/books', { params: { search: query } });
      // api interceptor unwraps success->data and returns the array
      if (Array.isArray(response)) {
        books.value = response;
      } else if (response && response.data) {
        books.value = response.data;
      }
    } catch (error) {
    console.error("Lỗi search:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSearchResults();
});

watch(() => route.query.search, () => {
  fetchSearchResults();
});
</script>