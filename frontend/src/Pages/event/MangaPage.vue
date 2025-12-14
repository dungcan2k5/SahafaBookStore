<template>
  <div class="bg-[#F0F8FF] min-h-screen pb-10 font-sans">
    
    <div class="bg-blue-600 relative overflow-hidden text-white border-b-8 border-black">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#ffffff 20%, transparent 20%); background-size: 20px 20px;"></div>
      
      <div class="container mx-auto px-4 py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="md:w-1/2 text-center md:text-left">
           <div class="inline-block bg-yellow-400 text-black font-black px-6 py-2 transform -skew-x-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
             <span class="transform skew-x-12 inline-block text-lg">NHẬP HỘI MANGA</span>
           </div>
           
           <h1 class="text-6xl md:text-8xl font-black uppercase text-white drop-shadow-[4px_4px_0px_#000] leading-none mb-4" style="-webkit-text-stroke: 2px black;">
             MANGA <br/> <span class="text-yellow-300">WORLD</span>
           </h1>
           
           <p class="text-blue-100 text-xl font-bold bg-black/20 inline-block px-4 py-1 rounded-lg border-2 border-white/30 backdrop-blur-sm">
             Khám phá thế giới truyện tranh bản quyền
           </p>
        </div>
        
        <div class="md:w-1/2 flex justify-center relative">
           <div class="relative z-10 grid grid-cols-2 gap-4 transform rotate-3">
              <img src="https://cdn0.fahasa.com/media/catalog/product/c/h/chu-thuat-hoi-chien---tap-22.jpg" class="w-32 md:w-40 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] bg-white"/>
              <img src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg" class="w-32 md:w-40 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(255,235,59,1)] bg-white mt-10"/>
           </div>
           <div class="absolute -top-10 right-10 bg-white text-black font-black px-6 py-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] animate-bounce hidden md:block">
              MỚI RA LÒ!
              <div class="absolute bottom-0 left-4 w-4 h-4 bg-white border-r-4 border-b-4 border-black transform rotate-45 translate-y-2"></div>
           </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
       <div class="flex flex-wrap justify-center gap-6 md:gap-10">
          <div v-for="genre in genres" :key="genre.id" class="group cursor-pointer flex flex-col items-center">
             <div class="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-black overflow-hidden relative shadow-[4px_4px_0px_0px_#3B82F6] group-hover:-translate-y-2 transition-transform bg-white">
                <img :src="genre.img" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
             </div>
             <span class="mt-3 font-bold text-gray-800 uppercase text-sm bg-white border-2 border-black px-3 py-0.5 rounded-full shadow-sm">{{ genre.name }}</span>
          </div>
       </div>
    </div>

    <div class="container mx-auto px-4 mb-16">
       <div class="flex items-center gap-3 mb-8">
          <div class="w-4 h-10 bg-yellow-400 border-2 border-black skew-x-12"></div>
          <h2 class="text-3xl font-black text-blue-800 uppercase drop-shadow-sm">Mới Phát Hành Tuần Này</h2>
       </div>

       <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="book in newBooks" :key="book.id" class="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_#DBEAFE] hover:shadow-[6px_6px_0px_0px_#2563EB] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative">
             
             <div class="relative pt-[140%] overflow-hidden border-b-2 border-black">
                <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                
                <div class="absolute bottom-2 right-2 bg-black text-yellow-300 font-bold text-xs px-2 py-1 rounded border-2 border-white transform rotate-3">
                   TẬP {{ book.vol }}
                </div>
                
                <div class="absolute top-2 left-2 bg-red-600 text-white font-bold text-xs w-10 h-10 flex items-center justify-center rounded-full border-2 border-black shadow-sm">
                   -{{ book.discount }}%
                </div>
             </div>

             <div class="p-3 bg-white">
                <h3 class="text-sm font-bold text-gray-900 line-clamp-2 h-10 mb-1 group-hover:text-blue-600">{{ book.title }}</h3>
                <div class="flex justify-between items-end">
                   <div>
                      <div class="text-red-600 font-black text-lg">{{ Number(book.price).toLocaleString() }}đ</div>
                      <div class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</div>
                   </div>
                   <button class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>

    <div class="bg-indigo-600 py-12 border-y-8 border-black mb-16 relative overflow-hidden">
       <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
       <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
             <div class="text-white md:w-1/3">
                <h2 class="text-4xl md:text-5xl font-black uppercase mb-4 text-yellow-300 drop-shadow-[3px_3px_0px_#000]">Combo Tiết Kiệm</h2>
                <p class="text-lg mb-6 font-medium">Mua trọn bộ - Đọc thả ga - Không lo về giá. Giảm thêm tới 15% khi mua full set.</p>
                <button class="bg-white text-black font-black px-8 py-3 rounded-full border-4 border-black hover:bg-yellow-400 transition shadow-[4px_4px_0px_0px_#000]">XEM TẤT CẢ</button>
             </div>
             
             <div class="md:w-2/3 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div v-for="combo in combos" :key="combo.id" class="min-w-[200px] bg-white p-3 rounded-xl border-4 border-black shadow-lg transform hover:-rotate-2 transition cursor-pointer">
                   <img :src="combo.image" class="w-full rounded mb-3 border border-gray-200"/>
                   <h3 class="font-bold text-sm text-gray-900 line-clamp-2">{{ combo.title }}</h3>
                   <div class="mt-2 flex gap-2 items-center">
                      <span class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">Giảm {{ combo.discount }}%</span>
                      <span class="font-black text-indigo-700">{{ Number(combo.price).toLocaleString() }}đ</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <div class="container mx-auto px-4">
       <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
             <div class="w-4 h-10 bg-blue-600 border-2 border-black -skew-x-12"></div>
             <h2 class="text-3xl font-black text-gray-800 uppercase">Light Novel</h2>
          </div>
          <a href="#" class="text-blue-600 font-bold hover:underline">Xem thêm ></a>
       </div>

       <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="ln in lightNovels" :key="ln.id" class="bg-white p-2 rounded-lg hover:shadow-xl transition group cursor-pointer border border-transparent hover:border-blue-200">
             <div class="relative pt-[145%] mb-3 rounded overflow-hidden">
                <img :src="ln.image" class="absolute top-0 left-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"/>
             </div>
             <h3 class="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600">{{ ln.title }}</h3>
             <p class="text-xs text-gray-500 mb-2">Tác giả: {{ ln.author }}</p>
             <div class="font-bold text-blue-700">{{ Number(ln.price).toLocaleString() }}đ</div>
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
import { ref } from 'vue';
import SuggestionsPage from '@/Pages/user/SuggestionsPage.vue';
const genres = [
  { id: 1, name: 'Shonen', img: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
  { id: 2, name: 'Shojo', img: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg' },
  { id: 3, name: 'Seinen', img: 'https://cdn0.fahasa.com/media/catalog/product/c/h/chu-thuat-hoi-chien---tap-22.jpg' },
  { id: 4, name: 'Isekai', img: 'https://cdn0.fahasa.com/media/catalog/product/t/h/thanh-guom-diet-quy-tap-1.jpg' },
  { id: 5, name: 'BL / GL', img: 'https://cdn0.fahasa.com/media/catalog/product/h/o/ho-so-bi-mat-luc-gia-trang---tap-1.jpg' },
  { id: 6, name: 'Comedy', img: 'https://cdn0.fahasa.com/media/catalog/product/s/p/spy-x-family-tap-1.jpg' },
];

const newBooks = ref([
  { id: 1, title: 'Jujutsu Kaisen - Chú Thuật Hồi Chiến', vol: 24, price: 35000, oldPrice: 40000, discount: 12, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/chu-thuat-hoi-chien---tap-22.jpg' },
  { id: 2, title: 'Spy x Family', vol: 11, price: 45000, oldPrice: 50000, discount: 10, image: 'https://cdn0.fahasa.com/media/catalog/product/s/p/spy-x-family-tap-1.jpg' },
  { id: 3, title: 'Chainsaw Man', vol: 14, price: 40000, oldPrice: 45000, discount: 11, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/chainsaw-man-tap-1.jpg' },
  { id: 4, title: 'Thám Tử Lừng Danh Conan', vol: 102, price: 25000, oldPrice: 30000, discount: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg' },
  { id: 5, title: 'One Piece - Đảo Hải Tặc', vol: 106, price: 25000, oldPrice: 30000, discount: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/o/n/one-piece-tap-100.jpg' },
]);

const combos = ref([
  { id: 1, title: 'Combo Thanh Gươm Diệt Quỷ (Trọn bộ 23 tập)', price: 550000, discount: 20, image: 'https://cdn0.fahasa.com/media/catalog/product/t/h/thanh-guom-diet-quy-tap-1.jpg' },
  { id: 2, title: 'Combo Tokyo Revengers (5 tập mới nhất)', price: 180000, discount: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/t/o/tokyo-revengers-tap-1.jpg' },
  { id: 3, title: 'Boxset Naruto (Bản đặc biệt)', price: 1200000, discount: 10, image: 'https://cdn0.fahasa.com/media/catalog/product/n/a/naruto-tap-1.jpg' },
  { id: 4, title: 'Combo Slam Dunk (Deluxe)', price: 900000, discount: 12, image: 'https://cdn0.fahasa.com/media/catalog/product/s/l/slam-dunk-deluxe-1.jpg' },
]);

const lightNovels = ref([
  { id: 1, title: 'Thiên Sứ Nhà Bên - Tập 8', author: 'Saekisan', price: 110000, image: 'https://cdn0.fahasa.com/media/catalog/product/t/h/thien-su-nha-ben-tap-1.jpg' },
  { id: 2, title: 'Sword Art Online - Tập 25', author: 'Reki Kawahara', price: 98000, image: 'https://cdn0.fahasa.com/media/catalog/product/s/a/sao-tap-1.jpg' },
  { id: 3, title: 'Chuyện Tình Thanh Xuân Bi Hài - Tập 14', author: 'Wataru Watari', price: 85000, image: 'https://cdn0.fahasa.com/media/catalog/product/o/r/oregairu-1.jpg' },
  { id: 4, title: 'Classroom Of The Elite - Năm 2 Tập 4', author: 'Syougo Kinugasa', price: 120000, image: 'https://cdn0.fahasa.com/media/catalog/product/c/l/classroom-elite-1.jpg' },
  { id: 5, title: 'Re:Zero - Bắt Đầu Lại Ở Thế Giới Khác - Tập 18', author: 'Tappei Nagatsuki', price: 105000, image: 'https://cdn0.fahasa.com/media/catalog/product/r/e/re-zero-1.jpg' },
]);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>