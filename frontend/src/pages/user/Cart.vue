<template>
  <div class="min-h-[60vh] bg-gray-50 py-8 px-4">
    <div class="container mx-auto">
      
      <h1 class="text-xl font-bold text-gray-800 mb-4 uppercase">Giỏ hàng ({{ cartStore.totalItems }} sản phẩm)</h1>

      <div v-if="cartStore.totalItems === 0" class="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center h-[400px]">
        
        <div class="mb-6 opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>

        <p class="text-gray-600 mb-6">Chưa có sản phẩm trong giỏ hàng của bạn.</p>

        <router-link to="/" class="bg-[#C92127] text-white font-bold py-3 px-10 rounded-lg hover:bg-red-700 transition shadow-md uppercase">
          Mua sắm ngay
        </router-link>

      </div>

      <div v-else>
         <p>Danh sách sản phẩm sẽ hiện ở đây...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
const cartStore = useCartStore();
</script>