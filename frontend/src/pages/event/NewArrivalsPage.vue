<template>
  <div class="bg-gray-50 min-h-screen pb-10 font-sans">
    
    <div class="bg-blue-600 relative overflow-hidden text-white py-12">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      
      <div class="container mx-auto px-4 relative z-10 flex items-center justify-between">
        <div class="max-w-2xl">
          <div class="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold mb-4 border border-white/30">
            ✨ CẬP NHẬT MỖI NGÀY
          </div>
          <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 drop-shadow-md">
            SÁCH MỚI <br/>
            <span class="text-yellow-300">TUYỂN CHỌN</span>
          </h1>
          <p class="text-blue-100 text-lg mb-8 max-w-lg">
            Khám phá những tựa sách mới nhất, hot nhất vừa cập bến Sahafa. Đừng bỏ lỡ cơ hội trở thành người đầu tiên sở hữu!
          </p>
        </div>
        
        <div class="hidden md:block">
           <img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" class="w-48 h-48 object-contain drop-shadow-2xl animate-pulse" />
        </div>
      </div>
    </div>

    <div class="sticky top-[60px] z-30 bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-3 overflow-x-auto gap-4 scrollbar-hide">
           
           <div class="flex gap-2">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="activeCat = cat.id"
                class="px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition border"
                :class="activeCat === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'"
              >
                {{ cat.name }}
              </button>
           </div>

           <div class="flex items-center gap-2 border-l pl-4 ml-auto">
              <span class="text-xs text-gray-500 font-bold uppercase hidden md:inline">Sắp xếp:</span>
              <select class="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 focus:ring-0 cursor-pointer text-gray-700 font-medium hover:bg-gray-100">
                 <option>Mới nhất</option>
                 <option>Bán chạy nhất</option>
                 <option>Giá thấp đến cao</option>
              </select>
           </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
       
       <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="i in 10" :key="i" class="bg-white rounded-xl h-80 animate-pulse"></div>
       </div>

       <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="book in books" :key="book.id" class="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer">
             <div class="relative pt-[100%] mb-3 bg-gray-50 rounded-xl overflow-hidden">
                <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500" />
                
                <div class="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                   MỚI
                </div>
                
                <div v-if="book.discount" class="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                   -{{ book.discount }}%
                </div>
             </div>

             <div>
                <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 h-10 mb-1 group-hover:text-blue-600 transition">{{ book.title }}</h3>
                <div class="flex items-center gap-2 mb-3">
                   <span class="text-blue-600 font-bold text-lg">{{ Number(book.price).toLocaleString() }}đ</span>
                   <span v-if="book.oldPrice" class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</span>
                </div>
                
                <button class="w-full bg-blue-50 text-blue-600 font-bold text-xs py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                   Thêm vào giỏ
                </button>
             </div>
          </div>
       </div>

       <div class="flex justify-center mt-12">
          <button class="px-6 py-2 border border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition">
             Xem thêm sản phẩm
          </button>
       </div>

    </div>
    <div class="mt-8 bg-blue-50 pt-8 pb-0 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-10">
      <div class="container mx-auto px-4">
        <SuggestionsPage :is-embedded="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';
const activeCat = ref('all');
const loading = ref(false);
const books = ref([]);

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'lit', name: 'Văn Học' },
  { id: 'eco', name: 'Kinh Tế' },
  { id: 'kids', name: 'Thiếu Nhi' },
  { id: 'skill', name: 'Kỹ Năng' },
  { id: 'foreign', name: 'Ngoại Văn' },
  { id: 'manga', name: 'Manga - Comic' },
];

// Mock Data Generator
const generateBooks = () => {
  loading.value = true;
  setTimeout(() => {
    const list = [];
    for (let i = 1; i <= 15; i++) {
      list.push({
        id: i,
        title: `Sách Mới Tuyển Chọn - Tập ${i} (Bản Đặc Biệt)`,
        price: 80000 + Math.floor(Math.random() * 200000),
        oldPrice: 300000,
        discount: 20 + Math.floor(Math.random() * 30),
        image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg', 
      });
    }
    books.value = list;
    loading.value = false;
  }, 500);
};

watch(activeCat, () => {
  generateBooks();
});

onMounted(() => {
  generateBooks();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>