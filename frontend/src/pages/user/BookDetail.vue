<template>
  <div class="bg-sahafa-gray min-h-screen py-4">
    <div class="container mx-auto">
      <div class="text-sm text-gray-500 mb-4 px-4 lg:px-0">
        Trang chủ / Sách Văn Học / <span class="text-black">Nhà Giả Kim</span>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-4 grid grid-cols-1 md:grid-cols-12 gap-8 mb-4">
        
        <div class="md:col-span-5 lg:col-span-4">
          <div class="border rounded-lg p-2 mb-4">
            <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="w-full h-auto object-contain" alt="Book Cover">
          </div>
          <div class="grid grid-cols-4 gap-2">
             <div v-for="i in 4" :key="i" class="border rounded p-1 cursor-pointer hover:border-sahafa-blue">
               <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="w-full h-full object-cover">
             </div>
          </div>
        </div>

        <div class="md:col-span-7 lg:col-span-8">
          <h1 class="text-2xl font-medium text-gray-800 mb-2">Nhà Giả Kim (Tái Bản 2024)</h1>
          
          <div class="flex items-center gap-4 text-sm mb-4">
            <div>Nhà cung cấp: <span class="text-blue-600 font-medium cursor-pointer">Nhã Nam</span></div>
            <div>Tác giả: <span class="text-blue-600 font-medium cursor-pointer">Paulo Coelho</span></div>
          </div>

          <div class="flex items-center gap-2 mb-6">
            <div class="flex text-yellow-400 text-sm">★★★★★</div>
            <span class="text-gray-400 text-sm">(200 đánh giá)</span>
            <span class="text-gray-300">|</span>
            <span class="text-gray-500 text-sm">Đã bán 1.2k</span>
          </div>

          <div class="flex items-end gap-3 mb-6">
            <span class="text-3xl font-bold text-sahafa-blue">63.000 đ</span>
            <span class="text-gray-400 line-through mb-1">79.000 đ</span>
            <span class="bg-sahafa-blue text-white text-xs font-bold px-2 py-1 rounded mb-1">-20%</span>
          </div>

          <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-6 max-w-md">
            <div>Mã hàng</div><div>8935235226227</div>
            <div>Nhà xuất bản</div><div>NXB Hội Nhà Văn</div>
            <div>Trọng lượng</div><div>300g</div>
            <div>Kích thước</div><div>13 x 20.5 cm</div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <div class="flex items-center border border-gray-300 rounded h-[44px] w-max">
              <button @click="quantity > 1 ? quantity-- : null" class="px-3 text-gray-500 hover:bg-gray-100 h-full">-</button>
              <input type="text" v-model="quantity" class="w-12 text-center outline-none font-medium h-full" readonly>
              <button @click="quantity++" class="px-3 text-gray-500 hover:bg-gray-100 h-full">+</button>
            </div>

            <button 
              @click="cartStore.addToCart(book, quantity)"
              class="flex-1 h-[44px] border-2 border-sahafa-blue text-sahafa-blue font-bold rounded hover:bg-blue-50 transition flex items-center justify-center gap-2 px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Thêm vào giỏ hàng
            </button>
            <button class="flex-1 h-[44px] bg-sahafa-blue text-white font-bold rounded hover:bg-blue-700 transition px-6 shadow-md hover:shadow-lg">
              Mua Ngay
            </button>
          </div>
        </div>
      </div> 
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-lg font-bold uppercase border-b pb-2 mb-4 text-gray-800">Mô tả sản phẩm</h3>
        <!-- <div class="text-gray-700 leading-relaxed text-sm space-y-3">
          <p>Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người.</p>
          <p>Tiểu thuyết <b>Nhà Giả Kim</b> của Paulo Coelho như một câu chuyện cổ tích giản dị, nhân ái, giàu chất thơ, thấm đẫm những minh triết huyền bí của phương Đông.</p>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRoute } from 'vue-router';

const route = useRoute();
const cartStore = useCartStore();
const quantity = ref(1);

const book = {
  id: route.params.id || 1,
  title: 'Nhà Giả Kim (Tái Bản 2024)',
  price: 63000,
  image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg'
};
</script>