<template>
  <div class="bg-blue-50 min-h-screen pb-10 font-sans">
    
    <div class="bg-blue-600 relative overflow-hidden text-white">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      
      <div class="container mx-auto px-4 py-10 relative z-10 text-center">
        <div class="inline-block bg-yellow-400 text-blue-800 font-black px-4 py-1 rounded-full text-sm mb-4 animate-bounce shadow-lg">
          ⚡ 10 KHUNG GIỜ VÀNG
        </div>

        <h1 class="text-4xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-xl mb-2" style="-webkit-text-stroke: 1px #1e3a8a;">
          FLASH SALE <br/>
          <span class="text-yellow-300">HOÀNH TRÁNG</span>
        </h1>
        
        <div class="flex items-center justify-center gap-4 mt-6">
           <div class="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl px-8 py-2 shadow-lg">
              <span class="text-2xl font-bold">GIẢM ĐẾN 50%++</span>
           </div>
        </div>
      </div>

      <div class="container mx-auto px-4 pb-0 -mb-px">
         <div class="flex gap-1 overflow-x-auto justify-start md:justify-center scrollbar-hide">
            <button 
              v-for="(day, index) in days" 
              :key="index"
              @click="activeDay = index"
              class="min-w-[100px] md:min-w-[120px] rounded-t-xl border-t-2 border-x-2 transition-all duration-300 relative overflow-hidden group"
              :class="activeDay === index 
                ? 'bg-white text-blue-700 border-white h-24 -mt-2 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' 
                : 'bg-blue-800 text-blue-200 border-blue-700 h-20 hover:bg-blue-700 hover:text-white'"
            >
               <div class="flex flex-col items-center justify-center h-full p-2">
                  <span class="text-xs md:text-sm font-bold uppercase opacity-80">{{ day.label }}</span>
                  <span class="text-sm md:text-base font-black leading-tight text-center mt-1">{{ day.category }}</span>
               </div>
            </button>
         </div>
      </div>
    </div>

    <div class="sticky top-[60px] z-40 bg-white shadow-md border-b-4 border-blue-600">
       <div class="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
             <div class="text-gray-600 font-bold uppercase text-sm tracking-wide">Kết thúc trong:</div>
             <div class="flex gap-1 text-white font-bold font-mono">
                <span class="bg-gray-800 px-2 py-1 rounded shadow-sm">{{ countdown.h }}</span>
                <span class="text-gray-800 font-black">:</span>
                <span class="bg-gray-800 px-2 py-1 rounded shadow-sm">{{ countdown.m }}</span>
                <span class="text-gray-800 font-black">:</span>
                <span class="bg-yellow-400 text-red-600 px-2 py-1 rounded shadow-sm">{{ countdown.s }}</span>
             </div>
          </div>
          <div class="flex items-center gap-2 text-blue-600 font-black text-lg italic">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-pulse text-yellow-400 fill-yellow-400" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             ĐANG DIỄN RA
          </div>
       </div>
    </div>

    <div class="container mx-auto px-4 py-8">
       <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="book in products" :key="book.id" class="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1">
             
             <div class="relative pt-[100%] bg-gray-50">
                <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500"/>
                
                <div class="absolute top-0 right-0 bg-red-600 text-white font-bold text-xs px-2 py-1 rounded-bl-lg shadow-md">
                  -{{ book.discount }}%
                </div>
                
                <div class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/10 to-transparent"></div>
             </div>

             <div class="p-3">
                <h3 class="text-sm text-gray-700 line-clamp-2 h-10 mb-2 font-medium group-hover:text-blue-600 transition">{{ book.title }}</h3>
                
                <div class="flex items-end gap-2 mb-3">
                   <span class="text-blue-600 font-bold text-lg">{{ Number(book.price).toLocaleString() }}đ</span>
                   <span class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</span>
                </div>

                <div class="relative w-full h-4 bg-blue-100 rounded-full overflow-hidden">
                   <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400" :style="{ width: book.soldPercentage + '%' }"></div>
                   <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white font-bold uppercase drop-shadow-md z-10">
                      Đã bán {{ book.sold }}
                   </div>
                   <img src="https://cdn-icons-png.flaticon.com/512/785/785116.png" class="absolute top-0 left-1 h-3 w-3 mt-0.5 animate-pulse"/>
                </div>
             </div>
          </div>
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';
const days = [
  { label: 'Thứ 2', category: 'Văn Học' },
  { label: 'Thứ 3', category: 'Kinh Tế' },
  { label: 'Thứ 4', category: 'Tổng Hợp' },
  { label: 'Thứ 5', category: 'Tâm Lý' },
  { label: 'Thứ 6', category: 'Thiếu Nhi' },
  { label: 'Thứ 7', category: 'Manga' },
  { label: 'Chủ Nhật', category: 'Ngoại Văn' },
];

const activeDay = ref(0);
const products = ref([]);

const generateBooks = () => {
  const list = [];
  for (let i = 1; i <= 10; i++) {
    list.push({
      id: i,
      title: `Sách Flash Sale ${days[activeDay.value].category} - Quyển số ${i}`,
      price: 50000 + Math.floor(Math.random() * 200000),
      oldPrice: 300000,
      discount: 40 + Math.floor(Math.random() * 10),
      image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg',
      sold: 10 + Math.floor(Math.random() * 100),
      soldPercentage: 30 + Math.floor(Math.random() * 60)
    });
  }
  products.value = list;
};

watch(activeDay, () => {
  generateBooks();
});

const countdown = ref({ h: '02', m: '45', s: '12' });
let timer = null;

onMounted(() => {
  generateBooks();
  
  let totalSeconds = 9999;
  timer = setInterval(() => {
    totalSeconds--;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    countdown.value.h = h.toString().padStart(2, '0');
    countdown.value.m = m.toString().padStart(2, '0');
    countdown.value.s = s.toString().padStart(2, '0');
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>