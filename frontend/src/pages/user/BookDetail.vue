<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <router-link to="/" class="hover:text-[#C92127]">Trang chủ</router-link> 
        <span>/</span>
        <span class="text-gray-800 font-medium truncate">{{ book?.book_title || 'Đang tải...' }}</span>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20 bg-white rounded-xl shadow-sm">
         <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>

      <div v-else-if="book" class="bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-8 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div class="md:col-span-5 lg:col-span-4">
            <div class="border rounded-lg overflow-hidden relative group p-2 mb-4">
              <img 
                :src="currentImage || 'https://placehold.co/400x600?text=No+Image'" 
                class="w-full h-auto object-contain max-h-[400px]" 
                :alt="book.book_title" 
              />
            </div>
          </div>

          <div class="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            <h1 class="text-2xl md:text-3xl font-medium text-gray-800 leading-tight">
              {{ book.book_title }}
            </h1>

            <div class="flex items-center gap-4 text-sm">
              <div class="flex text-yellow-400">★★★★★</div>
              <span class="text-gray-400">|</span>
              <span class="text-gray-500">Đã bán {{ book.total_sold || 0 }}</span>
              <span class="text-gray-400">|</span>
              <span class="text-blue-600 font-medium">
                  {{ book.stock_quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}
              </span>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg flex items-end gap-3 mt-2">
              <span class="text-3xl font-bold text-[#C92127]">{{ formatPrice(book.price) }} đ</span>
            </div>

            <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4 max-w-md mt-2">
                <div>Mã hàng</div><div class="font-medium text-black">SP{{ book.book_id }}</div>
                <div>Tác giả</div><div class="font-medium text-blue-600">{{ book.Author?.author_name || 'Đang cập nhật' }}</div>
                <div>Nhà xuất bản</div><div class="font-medium text-black">{{ book.Publisher?.publisher_name || 'Đang cập nhật' }}</div>
            </div>

            <div class="mt-2 border-t pt-6">
              <span class="font-bold text-gray-700 block mb-3">Số lượng:</span>
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex items-center border border-gray-300 w-max rounded-md h-[44px]">
                    <button @click="quantity > 1 ? quantity-- : null" class="px-4 hover:bg-gray-100 text-gray-600 h-full font-bold">-</button>
                    <input type="number" v-model="quantity" class="w-14 text-center outline-none font-bold text-gray-700 h-full border-l border-r border-gray-100" readonly />
                    <button @click="quantity++" class="px-4 hover:bg-gray-100 text-gray-600 h-full font-bold">+</button>
                </div>

                <button 
                    @click="handleAddToCart"
                    :disabled="book.stock_quantity <= 0"
                    class="flex-1 h-[44px] border-2 border-[#C92127] text-[#C92127] font-bold rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="book" class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 class="text-xl font-bold uppercase border-b pb-3 mb-4 text-gray-800">Mô tả sản phẩm</h3>
        <div class="text-gray-700 leading-relaxed space-y-3 text-justify">
           <p>{{ book.description || 'Đang cập nhật mô tả...' }}</p>
        </div>
      </div>

      <div v-else-if="!isLoading" class="text-center py-20 bg-white rounded-lg">
        <p class="text-gray-500 mb-4 text-lg">Không tìm thấy sách này.</p>
        <router-link to="/" class="text-blue-600 hover:underline font-medium">Quay lại trang chủ</router-link>
      </div>

    </div>

    <div class="bg-white border-t border-gray-100 pt-8 pb-4">
        <div class="container mx-auto px-4">
             <SuggestionsPage :is-embedded="true" />
        </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import axios from 'axios';
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';

const route = useRoute();
const cartStore = useCartStore();

const quantity = ref(1);
const book = ref(null);
const isLoading = ref(false);

// Format tiền tệ
const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

// Lấy ảnh hiển thị
const currentImage = computed(() => {
    if (book.value?.BookImages?.length > 0) {
        return book.value.BookImages[0].book_image_url;
    }
    return null;
});

// Hàm gọi API lấy chi tiết sách
const fetchBookDetail = async (id) => {
  if (!id) return;
  isLoading.value = true;
  book.value = null; // Reset trước khi load mới

  try {
    // Gọi API Backend: GET /api/books/:id
    const response = await axios.get(`http://localhost:3000/api/books/${id}`);
    
    if (response.data.success) {
       book.value = response.data.data;
    } else {
       console.error("API trả về lỗi:", response.data.message);
    }
  } catch (error) {
    console.error("Lỗi tải sách:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const idFromUrl = route.params.id;
  fetchBookDetail(idFromUrl);
});

// Watch route thay đổi để reload trang khi bấm vào sách gợi ý
watch(() => route.params.id, (newId) => {
    quantity.value = 1; // Reset số lượng về 1
    fetchBookDetail(newId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const handleAddToCart = async () => {
  if (book.value) {
    // Chuẩn bị object để gửi sang Store
    const productToAdd = {
      id: book.value.book_id, // Quan trọng: Phải là ID thật từ DB
      title: book.value.book_title,
      price: book.value.price
    };
    
    // Gọi action của Store (Hàm này đã có logic gọi API POST)
    const success = await cartStore.addToCart(productToAdd, quantity.value);
    
    if (success) {
       // Có thể thêm toast notification ở đây
       console.log("Thêm thành công");
    }
  }
};
</script>