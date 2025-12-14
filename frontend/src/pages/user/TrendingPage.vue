<template>
  <div class="bg-gray-50 min-h-screen py-6">
    <div class="container mx-auto px-4">
      
      <div class="text-sm text-gray-500 mb-4">
        <router-link to="/" class="hover:text-blue-600">Trang chủ</router-link> / 
        <span class="text-gray-800 font-medium">Xu Hướng Mua Sắm</span>
      </div>

      <div class="bg-pink-100 rounded-lg p-6 mb-6 flex items-center gap-4 border border-pink-200">
        <div class="bg-red-500 p-3 rounded-full text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800 uppercase">Xu Hướng Mua Sắm</h1>
          <p class="text-gray-600 text-sm mt-1">Top những cuốn sách bán chạy nhất tuần qua tại Sahafa</p>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="n in 5" :key="n" class="bg-white rounded-lg p-4 h-[320px] animate-pulse border border-gray-200">
          <div class="bg-gray-200 h-[200px] w-full mb-3 rounded"></div>
          <div class="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
          <div class="bg-gray-200 h-4 w-1/2 rounded"></div>
        </div>
      </div>

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

      <!-- Section Gợi Ý Cho Bạn - hiển thị sách đề xuất bên dưới danh sách trending -->
      <div class="mt-8 bg-blue-50 pt-8 pb-0 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-10">
        <div class="container mx-auto px-4">
         <SuggestionsPage :is-embedded="true" />
      </div>
    </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { bookService } from '@/services/bookService';
import SuggestionsPage from '@/Pages/user/SuggestionsPage.vue';
import BookListSection from '@/components/user/BookListSection.vue';

const books = ref([]);
const loading = ref(true);
// Danh sách sách gợi ý hiển thị bên dưới danh sách trending
const suggestionsBooks = ref([]);

const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v);

const loadData = async () => {
  try {
    loading.value = true;
    // Gọi Service lấy dữ liệu trending và suggestions cùng lúc
    const [trending, suggestions] = await Promise.all([
      bookService.getTrending(),
      bookService.getSuggestions()
    ]);
    books.value = trending;
    suggestionsBooks.value = suggestions;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>