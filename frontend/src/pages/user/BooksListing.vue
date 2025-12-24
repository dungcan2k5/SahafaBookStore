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
          class="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer hover:-translate-y-1"
          @click="goToDetail(book.book_id)"
        >
          <div class="relative pt-[140%] bg-gray-100 overflow-hidden">
            <img 
              :src="book.BookImages?.[0]?.book_image_url || 'https://via.placeholder.com/300x450?text=No+Image'" 
              class="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              alt="Book cover"
            />
            <div 
              v-if="book.discount && book.discount > 0" 
              class="absolute top-0 right-0 bg-[#C92127] text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-sm"
            >
              -{{ book.discount }}%
            </div>
          </div>

          <div class="p-3 flex flex-col h-[130px]">
             <h3 class="text-sm md:text-base font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-[#C92127] transition-colors leading-tight">
               {{ book.book_title }}
             </h3>
             
             <p class="text-xs text-gray-500 mb-2 truncate">
                <span class="font-semibold">TG:</span> {{ book.Author?.author_name || 'Đang cập nhật' }}
             </p>

             <div class="mt-auto pt-2 border-t border-gray-50">
                <div class="text-[#C92127] font-bold text-lg leading-none">
                    {{ formatPrice(book.price) }}đ
                </div>
                <div class="flex justify-between items-center mt-1">
                    <span class="text-[10px] text-gray-400">Đã bán {{ book.total_sold || 0 }}</span>
                    <span class="text-[10px] text-blue-600 font-bold uppercase group-hover:underline">Chi tiết ></span>
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
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const books = ref([]);
const isLoading = ref(false);
const currentKeyword = ref('');

// Format tiền tệ
const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val);

// Hàm chuyển hướng sang trang chi tiết
const goToDetail = (bookId) => {
    router.push(`/books/${bookId}`);
};

// Hàm gọi API tìm kiếm
const fetchSearchResults = async () => {
  const query = route.query.search;
  
  // Nếu không có từ khóa thì không làm gì (hoặc có thể load tất cả sách)
  if (!query) return;

  currentKeyword.value = query;
  isLoading.value = true;
  books.value = [];

  try {
    // Gọi API Backend đã sửa ở Bước 1
    const response = await axios.get('http://localhost:3000/api/books', {
      params: { search: query }
    });

    if (response.data.success) {
      books.value = response.data.data;
    }
  } catch (error) {
    console.error("Lỗi search:", error);
  } finally {
    isLoading.value = false;
  }
};

// Chạy khi vào trang
onMounted(() => {
  fetchSearchResults();
});

// Chạy lại khi URL thay đổi (Ví dụ đang tìm "Harry" mà gõ tiếp "Conan")
watch(() => route.query.search, () => {
  fetchSearchResults();
});
</script>