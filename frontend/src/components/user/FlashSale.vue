<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-red-500 rounded-lg p-4 shadow-md">
      
      <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 bg-white/10 p-3 rounded-lg md:bg-transparent md:p-0">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 italic font-black text-2xl md:text-3xl text-white">
            <span class="text-yellow-300">FLA⚡H</span>
            <span>SALE</span>
          </div>
          
          <div class="flex items-center gap-1 text-white font-bold">
            <span class="text-sm md:text-base font-normal mr-2">Kết thúc trong</span>
            <div class="bg-black text-white px-2 py-1 rounded text-sm md:text-base min-w-[32px] text-center">{{ hours }}</div>
            <span>:</span>
            <div class="bg-black text-white px-2 py-1 rounded text-sm md:text-base min-w-[32px] text-center">{{ minutes }}</div>
            <span>:</span>
            <div class="bg-black text-white px-2 py-1 rounded text-sm md:text-base min-w-[32px] text-center">{{ seconds }}</div>
          </div>
        </div>

        <a href="#" class="text-white text-sm font-medium hover:text-yellow-200 flex items-center">
          Xem tất cả <span class="ml-1">></span>
        </a>
      </div>

      <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        <div 
          v-for="book in flashSaleBooks" 
          :key="book.id"
          class="bg-white rounded-lg p-3 min-w-[160px] md:min-w-[200px] max-w-[200px] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <div class="relative pt-[100%] mb-3">
            <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain hover:scale-105 transition duration-300" />
            <div class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
              -{{ book.discount }}%
            </div>
          </div>

          <h3 class="text-[13px] leading-tight text-gray-700 font-medium line-clamp-2 mb-2 min-h-[34px]">
            {{ book.title }}
          </h3>

          <div>
            <div class="text-red-600 font-bold text-lg leading-none mb-1">{{ formatPrice(book.price) }}đ</div>
            <div class="text-gray-400 text-xs line-through mb-2">{{ formatPrice(book.oldPrice) }}đ</div>
            
            <div class="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-red-600" 
                :style="{ width: (book.sold / book.totalStock) * 100 + '%' }"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold uppercase drop-shadow-md z-10">
                <span v-if="book.sold > 0">Đã bán {{ book.sold }}</span>
                <span v-else>Vừa mở bán</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 1. Logic Đồng Hồ Đếm Ngược
const hours = ref('02');
const minutes = ref('45');
const seconds = ref('00');
let timerInterval = null;

const startTimer = () => {
  // Set thời gian kết thúc giả định (ví dụ 3 tiếng nữa)
  let timeInSecs = 3 * 60 * 60; 

  timerInterval = setInterval(() => {
    timeInSecs--;
    const h = Math.floor(timeInSecs / 3600);
    const m = Math.floor((timeInSecs % 3600) / 60);
    const s = Math.floor(timeInSecs % 60);

    // Format số 0 ở đầu (01, 02...)
    hours.value = h < 10 ? `0${h}` : h;
    minutes.value = m < 10 ? `0${m}` : m;
    seconds.value = s < 10 ? `0${s}` : s;
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

// 2. Mock Data (Giống ảnh mẫu)
// totalStock dùng để tính % thanh progress bar
const flashSaleBooks = ref([
  { 
    id: 1, 
    title: '33 Nhân Hiệu Chủ Spa Thành Công', 
    price: 209400, 
    oldPrice: 349000, 
    discount: 40, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/3/3/33-nhan-hieu-chu-spa-thanh-cong.jpg', 
    sold: 6,
    totalStock: 20 
  },
  { 
    id: 2, 
    title: 'Một Phút Với Jack Welch', 
    price: 49000, 
    oldPrice: 75000, 
    discount: 34, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_180164.jpg', 
    sold: 2,
    totalStock: 50 
  },
  { 
    id: 3, 
    title: 'Lời Thú Tội Của Một Sát Thủ Kinh Tế', 
    price: 159000, 
    oldPrice: 245000, 
    discount: 35, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935251419733.jpg', 
    sold: 13,
    totalStock: 15 
  },
  { 
    id: 4, 
    title: 'Luận Lý Học Hành Vi Trong Kinh Doanh', 
    price: 88000, 
    oldPrice: 110000, 
    discount: 20, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_244715.jpg', 
    sold: 12,
    totalStock: 20 
  },
  { 
    id: 5, 
    title: 'Đầu Tư Chất Lượng', 
    price: 62000, 
    oldPrice: 89000, 
    discount: 30, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_197607.jpg', 
    sold: 13,
    totalStock: 30 
  },
  { 
    id: 6, 
    title: 'Tâm Lý Học Về Tiền', 
    price: 150000, 
    oldPrice: 200000, 
    discount: 25, 
    image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935280908352.jpg', 
    sold: 5,
    totalStock: 100 
  }
]);

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};
</script>

<style scoped>
/* Ẩn thanh scrollbar mặc định nhưng vẫn cho phép cuộn */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>