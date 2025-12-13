<template>
  <div class="bg-blue-50 min-h-screen pb-10 font-sans">
    
    <div class="bg-blue-600 relative overflow-hidden text-white">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      
      <div class="container mx-auto px-4 py-8 md:py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="md:w-1/2 text-center md:text-left">
           <div class="inline-block bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-full text-sm mb-4 shadow-lg animate-pulse">
             📦 KHO SÁCH CŨ - GIÁ CỰC HỜI
           </div>
           <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-xl mb-4 leading-tight">
             HÀNG XEM MỚI <br/>
             <span class="text-yellow-300">GIÁ CHẤT CHƠI</span>
           </h1>
           <p class="text-blue-100 text-lg mb-6">
             Sách tuyển chọn, chất lượng 90-99%, giá giảm sâu tới 70%.
           </p>
           <button class="bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition shadow-lg transform hover:-translate-y-1">
             SĂN NGAY
           </button>
        </div>

        <div class="md:w-1/2 flex justify-center relative">
           <div class="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
           <div class="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-2xl transform rotate-2">
              <div class="grid grid-cols-2 gap-4 w-64">
                 <img src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg" class="rounded shadow-md"/>
                 <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="rounded shadow-md"/>
                 <img src="https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg" class="rounded shadow-md"/>
                 <img src="https://cdn0.fahasa.com/media/catalog/product/8/9/8934974176378.jpg" class="rounded shadow-md"/>
              </div>
              <div class="absolute -top-6 -right-6 bg-red-600 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center font-black shadow-lg border-4 border-white animate-bounce">
                 <span>GIẢM</span>
                 <span class="text-xl">50%</span>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div class="sticky top-[60px] z-30 bg-white shadow-md border-b border-blue-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between py-3 gap-4">
           
           <div class="flex items-center gap-2 text-blue-700 font-bold uppercase text-lg whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Phiên Chợ Cũ
           </div>

           <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="activeCat = cat.id"
                class="px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition border"
                :class="activeCat === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'"
              >
                {{ cat.name }}
              </button>
           </div>

           <div class="flex items-center gap-2 border-l pl-4 border-gray-300 ml-auto md:ml-0">
              <span class="text-xs text-gray-500 font-bold uppercase hidden lg:inline">Sắp xếp:</span>
              <select class="text-sm border border-gray-300 bg-white rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none text-gray-700">
                 <option>Bán Chạy Tuần</option>
                 <option>Mới Nhất</option>
                 <option>Giá Thấp Đến Cao</option>
              </select>
           </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
       
       <div class="flex items-center gap-2 mb-6 border-b-2 border-blue-100 pb-2">
          <h2 class="text-xl font-bold text-red-600 uppercase">Giá Cực Tốt</h2>
          <span class="text-sm text-gray-500 ml-auto cursor-pointer hover:text-blue-600">Xem tất cả ></span>
       </div>

       <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <div v-for="book in products" :key="book.id" class="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1 cursor-pointer">
             
             <div class="relative pt-[120%] bg-gray-50">
                <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"/>
                
                <div class="absolute top-2 right-2 bg-red-600 text-white font-bold text-xs px-2 py-1 rounded shadow-md">
                  -{{ book.discount }}%
                </div>

                <div class="absolute top-2 left-2 bg-yellow-400 text-blue-900 font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
                   USED
                </div>
             </div>

             <div class="p-3">
                <h3 class="text-sm text-gray-700 line-clamp-2 h-10 mb-2 font-medium group-hover:text-blue-600 transition">
                   <span class="text-gray-400 font-normal mr-1">[Sách Cũ]</span>
                   {{ book.title }}
                </h3>
                
                <div class="flex flex-col gap-1">
                   <div class="flex items-center gap-2">
                      <span class="text-red-600 font-bold text-lg">{{ Number(book.price).toLocaleString() }}đ</span>
                      <span class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</span>
                   </div>
                   <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: (Math.random() * 50 + 20) + '%' }"></div>
                   </div>
                   <div class="text-[10px] text-gray-500 mt-0.5">Đã bán {{ book.sold }}</div>
                </div>
             </div>
          </div>
       </div>

       <div class="flex justify-center mt-12">
          <button class="bg-white border-2 border-blue-600 text-blue-600 font-bold px-10 py-2 rounded-full hover:bg-blue-600 hover:text-white transition shadow-sm">
             Xem Thêm 200+ Sách Khác
          </button>
       </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const activeCat = ref('all');
const products = ref([]);

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'manga', name: 'Manga - Comic' },
  { id: 'lit', name: 'Văn học' },
  { id: 'skill', name: 'Tâm lý - Kỹ năng' },
  { id: 'eco', name: 'Kinh Tế' },
  { id: 'kid', name: 'Thiếu nhi' },
  { id: 'lang', name: 'Sách ngoại ngữ' },
];

// Mock Data Generator
const generateBooks = () => {
  const list = [];
  const titles = [
    'Romantica Clock - Tập 6', 'Văn Phòng Thám Tử Quái Vật', 'Tiệm Trừ Yêu Kì Ảo', 
    'Rinne - Cảnh Giới Luân Hồi', 'Người Thầy', 'Dragon Ball - 7 Viên Ngọc Rồng',
    'Skip Beat', 'Bài Tập Sinh Học 11', 'Vở Bài Tập Toán 2', 'Cambridge English Empower'
  ];
  
  for (let i = 0; i < 15; i++) {
    list.push({
      id: i,
      title: titles[i % titles.length],
      price: 15000 + Math.floor(Math.random() * 50000),
      oldPrice: 40000 + Math.floor(Math.random() * 50000),
      discount: 50,
      image: `https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg`, // Ảnh mẫu
      sold: 10 + Math.floor(Math.random() * 100)
    });
  }
  products.value = list;
};

onMounted(() => {
  generateBooks();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>