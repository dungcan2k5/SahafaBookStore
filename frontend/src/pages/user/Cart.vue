<template>
  <div class="min-h-[60vh] bg-gray-50 py-8 px-4">
    <div class="container mx-auto">
      
      <div class="flex justify-between items-end mb-6">
        <h1 class="text-xl font-bold text-gray-800 uppercase flex items-center gap-2">
          Giỏ hàng <span class="text-base font-normal text-gray-500 normal-case">({{ cartStore.totalItems }} sản phẩm)</span>
        </h1>
        
        <button 
          v-if="cartStore.items.length > 0"
          @click="cartStore.clearCartAPI()"
          class="text-red-500 hover:text-red-700 font-medium text-sm underline cursor-pointer"
        >
          Xóa tất cả
        </button>
      </div>

      <div v-if="cartStore.totalItems === 0 && !cartStore.isLoading" class="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-center h-[400px]">
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

      <div v-else class="flex flex-col lg:flex-row gap-6">
        
        <div class="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative">
          
          <div v-if="cartStore.isLoading" class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
             <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>

          <div class="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-100 font-bold text-gray-700 text-sm border-b">
             <div class="col-span-6">Sản phẩm</div>
             <div class="col-span-2 text-center">Đơn giá</div>
             <div class="col-span-2 text-center">Số lượng</div>
             <div class="col-span-2 text-center">Thành tiền</div>
          </div>

          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center hover:bg-gray-50 transition"
          >
            <div class="col-span-12 md:col-span-6 flex items-center gap-4">
               <img 
                 :src="item.image" 
                 class="w-20 h-24 object-cover border rounded bg-white" 
                 alt="Product Image" 
                 @error="$event.target.src='https://placehold.co/400x600?text=Error'"
               />
               <div>
                  <router-link 
                    :to="`/book/${item.book_id}`" 
                    class="font-medium text-gray-800 line-clamp-2 mb-1 text-sm md:text-base hover:text-blue-600 cursor-pointer"
                  >
                    {{ item.title }}
                  </router-link>
                  
                  <button 
                    @click="cartStore.removeFromCart(item.id)"
                    class="text-sm text-red-500 hover:underline flex items-center gap-1 mt-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Xóa
                  </button>
               </div>
            </div>

            <div class="col-span-6 md:col-span-2 text-left md:text-center font-medium text-gray-800">
               <span class="md:hidden text-gray-500 text-xs">Giá: </span>
               {{ formatPrice(item.price) }}đ
            </div>

            <div class="col-span-6 md:col-span-2 flex justify-end md:justify-center">
               <div class="flex items-center border border-gray-300 rounded h-8 bg-white">
                  <button 
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)" 
                    :disabled="item.quantity <= 1"
                    :class="{'opacity-50 cursor-not-allowed': item.quantity <= 1}"
                    class="w-8 h-full hover:bg-gray-100 text-gray-600 font-bold"
                  >-</button>
                  
                  <input type="text" :value="item.quantity" class="w-10 text-center outline-none h-full font-bold text-gray-700 text-sm" readonly />
                  
                  <button 
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)" 
                    class="w-8 h-full hover:bg-gray-100 text-gray-600 font-bold"
                  >+</button>
               </div>
            </div>

            <div class="col-span-12 md:col-span-2 text-right md:text-center font-bold text-[#C92127]">
               <div class="flex justify-between md:block">
                 <span class="md:hidden text-gray-500 font-normal">Tổng: </span>
                 {{ formatPrice(item.price * item.quantity) }}đ
               </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-[350px] shrink-0">
           <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24 border border-gray-100">
              <h3 class="font-bold text-gray-800 mb-4 pb-2 border-b">Thanh toán</h3>
              
              <div class="flex justify-between mb-3 text-gray-600 text-sm">
                 <span>Tạm tính:</span>
                 <span class="font-bold">{{ formatPrice(cartStore.totalPrice) }}đ</span>
              </div>
              
              <div class="border-t border-dashed my-4"></div>
              
              <div class="flex justify-between mb-6 items-end">
                 <span class="font-bold text-gray-800">Tổng cộng:</span>
                 <div class="text-right">
                   <span class="block font-bold text-[#C92127] text-xl">{{ formatPrice(cartStore.totalPrice) }}đ</span>
                   <span class="text-xs text-gray-500">(Đã bao gồm VAT)</span>
                 </div>
              </div>

              <button 
                @click="handleCheckout"
                class="block w-full bg-[#C92127] text-white text-center font-bold py-3 rounded-lg hover:bg-red-700 shadow-lg hover:shadow-xl transition uppercase transform active:scale-95"
              >
                Tiến hành thanh toán
              </button>

              <router-link to="/" class="block text-center text-blue-600 hover:underline mt-4 text-sm font-medium">
                 ← Tiếp tục mua sắm
              </router-link>
           </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Gọi API lấy giỏ hàng mỗi khi vào trang Cart để đảm bảo dữ liệu mới nhất
onMounted(() => {
    cartStore.fetchCart();
});

const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Vui lòng đăng nhập để thanh toán!");
        router.push('/login');
        return;
    }
    // Nếu giỏ hàng trống thì không cho thanh toán
    if (cartStore.items.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    router.push('/checkout');
};
</script>