<template>
  <div class="bg-blue-50 min-h-screen pb-10 font-sans">
    
    <div class="bg-blue-700 relative overflow-hidden text-white">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div class="container mx-auto px-4 py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="md:w-1/2">
           <div class="inline-block bg-yellow-400 text-blue-900 font-black px-4 py-1 rounded-full text-sm mb-4 animate-pulse">
             🌍 WORLD OF BOOKS
           </div>
           <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-xl mb-4 leading-tight">
             TOP BOOKS SELECTED <br/>
             <span class="text-yellow-300">BY SAHAFA</span>
           </h1>
           <div class="flex gap-4 mt-6">
              <div class="border-2 border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl">
                 <div class="text-xs uppercase opacity-80">Sale Up To</div>
                 <div class="text-3xl font-black text-yellow-300">50%</div>
              </div>
              <div class="border-2 border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl">
                 <div class="text-xs uppercase opacity-80">Freeship</div>
                 <div class="text-3xl font-black text-yellow-300">10K</div>
              </div>
           </div>
        </div>
        
        <div class="md:w-1/2 flex justify-center relative">
           <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="w-40 rounded shadow-lg transform -rotate-12 absolute left-10 z-10 border-4 border-white"/>
           <img src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg" class="w-48 rounded shadow-2xl relative z-20 border-4 border-yellow-400"/>
           <img src="https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg" class="w-40 rounded shadow-lg transform rotate-12 absolute right-10 z-10 border-4 border-white"/>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 -mt-8 relative z-20 mb-16">
       <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="bg-blue-800 rounded-2xl p-6 flex items-center gap-6 shadow-xl border-4 border-blue-600 relative overflow-hidden group">
             <div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-80"></div>
             <div class="relative z-10 w-1/3">
                <div class="bg-white/20 rounded-full p-4 backdrop-blur-sm border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-105 transition duration-500">
                   <img src="https://cdn0.fahasa.com/media/catalog/product/k/a/katabasis.jpg" class="w-full rounded shadow-md" />
                </div>
             </div>
             <div class="relative z-10 w-2/3 text-white">
                <h3 class="text-3xl font-black uppercase text-yellow-300 mb-1">KATABASIS</h3>
                <p class="text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded mb-2">DELUXE LIMITED EDITION</p>
                <p class="text-sm opacity-90 line-clamp-3">Phiên bản đặc biệt bìa cứng, quà tặng kèm độc quyền chỉ có tại Sahafa.</p>
             </div>
          </div>

          <div class="bg-blue-800 rounded-2xl p-6 flex items-center gap-6 shadow-xl border-4 border-blue-600 relative overflow-hidden group">
             <div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent opacity-80"></div>
             <div class="relative z-10 w-1/3">
                <div class="bg-white/20 rounded-full p-4 backdrop-blur-sm border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-105 transition duration-500">
                   <img src="https://cdn0.fahasa.com/media/catalog/product/t/w/twilight.jpg" class="w-full rounded shadow-md" />
                </div>
             </div>
             <div class="relative z-10 w-2/3 text-white">
                <h3 class="text-3xl font-black uppercase text-yellow-300 mb-1">TWILIGHT</h3>
                <p class="text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded mb-2">COLLECTOR'S EDITION</p>
                <p class="text-sm opacity-90 line-clamp-3">Kỷ niệm 20 năm, phiên bản bìa mạ kim loại cực đẹp.</p>
             </div>
          </div>

       </div>
    </div>

    <div class="container mx-auto px-4 mb-12">
       <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="flex flex-col md:flex-row">
             
             <div class="md:w-1/4 bg-blue-100 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <h2 class="text-2xl font-black text-blue-800 uppercase mb-2 relative z-10">MUST HAVE FOR <br/> ENGLISH</h2>
                <div class="w-16 h-1 bg-yellow-400 mb-4 rounded-full"></div>
                <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="w-32 shadow-lg transform rotate-6 hover:rotate-0 transition duration-500"/>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
             </div>

             <div class="md:w-3/4 p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div v-for="book in englishBooks" :key="book.id" class="group cursor-pointer">
                      <div class="relative pt-[120%] mb-2 bg-gray-50 rounded-lg overflow-hidden">
                         <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-3 group-hover:scale-110 transition duration-300"/>
                         <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{{book.discount}}%</div>
                      </div>
                      <h3 class="text-sm font-bold text-gray-800 line-clamp-2 h-10 group-hover:text-blue-600 transition">{{ book.title }}</h3>
                      <div class="text-red-600 font-bold mt-1">{{ Number(book.price).toLocaleString() }}đ</div>
                      <div class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</div>
                   </div>
                </div>
                <div class="text-center mt-6">
                   <button class="border border-blue-600 text-blue-600 px-8 py-2 rounded-full font-bold text-sm hover:bg-blue-600 hover:text-white transition">Xem Thêm</button>
                </div>
             </div>

          </div>
       </div>
    </div>

    <div class="container mx-auto px-4 mb-12">
       <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="flex flex-col md:flex-row">
             
             <div class="md:w-1/4 bg-indigo-100 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                <h2 class="text-2xl font-black text-indigo-800 uppercase mb-2 relative z-10">OTHER <br/> LANGUAGES</h2>
                <div class="w-16 h-1 bg-yellow-400 mb-4 rounded-full"></div>
                <div class="grid grid-cols-2 gap-2 transform rotate-3 hover:rotate-0 transition duration-500">
                   <img src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg" class="w-20 shadow-md rounded border border-white"/>
                   <img src="https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg" class="w-20 shadow-md rounded border border-white"/>
                </div>
             </div>

             <div class="md:w-3/4 p-4">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div v-for="book in mangaBooks" :key="book.id" class="group cursor-pointer">
                      <div class="relative pt-[120%] mb-2 bg-gray-50 rounded-lg overflow-hidden">
                         <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-3 group-hover:scale-110 transition duration-300"/>
                         <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">Tập {{ book.vol }}</div>
                      </div>
                      <h3 class="text-sm font-bold text-gray-800 line-clamp-2 h-10 group-hover:text-indigo-600 transition">{{ book.title }}</h3>
                      <div class="text-red-600 font-bold mt-1">{{ Number(book.price).toLocaleString() }}đ</div>
                      <div class="text-gray-400 text-xs line-through">{{ Number(book.oldPrice).toLocaleString() }}đ</div>
                   </div>
                </div>
                <div class="text-center mt-6">
                   <button class="border border-indigo-600 text-indigo-600 px-8 py-2 rounded-full font-bold text-sm hover:bg-indigo-600 hover:text-white transition">Xem Thêm</button>
                </div>
             </div>

          </div>
       </div>
    </div>

    <div class="container mx-auto px-4">
       <div class="flex items-center gap-2 mb-6">
          <div class="w-1.5 h-8 bg-blue-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-800 uppercase">HotReads Ngoại Văn</h2>
       </div>
       
       <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div v-for="book in bestSellers" :key="book.id" class="bg-white p-3 rounded-xl hover:shadow-xl transition border border-transparent hover:border-blue-100 group cursor-pointer">
             <div class="relative pt-[130%] mb-3">
                <img :src="book.image" class="absolute top-0 left-0 w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"/>
             </div>
             <h3 class="text-sm font-semibold text-gray-700 line-clamp-2 mb-2 group-hover:text-blue-600">{{ book.title }}</h3>
             <div class="flex items-center gap-2">
                <span class="text-red-600 font-bold">{{ Number(book.price).toLocaleString() }}đ</span>
                <span class="text-gray-400 text-xs line-through">-{{ book.discount }}%</span>
             </div>
             <div class="text-[10px] text-gray-500 mt-1">Đã bán {{ book.total_sold || book.sold || 0 }}</div>
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
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue';

const englishBooks = ref([
  { id: 1, title: 'Mindset For IELTS - Level 1 Student Book', price: 437000, oldPrice: 461000, discount: 5, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
  { id: 2, title: 'English Grammar in Use - 4th Edition', price: 188000, oldPrice: 198000, discount: 5, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg' },
  { id: 3, title: 'Oxford Picture Dictionary', price: 247000, oldPrice: 260000, discount: 5, image: 'https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg' },
  { id: 4, title: 'A2 Key For Schools Trainer 1', price: 190000, oldPrice: 200000, discount: 5, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8934974176378.jpg' },
]);

const mangaBooks = ref([
  { id: 5, title: 'Boruto - Two Blue Vortex - Vol 6', price: 140000, oldPrice: 156000, vol: 6, discount: 10, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
  { id: 6, title: 'Jujutsu Kaisen - Vol 28', price: 130000, oldPrice: 163000, vol: 28, discount: 20, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg' },
  { id: 7, title: 'Kaoru Hana Wa Rinto Saku - Vol 20', price: 145000, oldPrice: 162000, vol: 20, discount: 10, image: 'https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg' },
  { id: 8, title: 'Blue Archive Game Development', price: 162000, oldPrice: 202000, vol: 2, discount: 19, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8934974176378.jpg' },
]);

const bestSellers = ref([
  { id: 9, title: 'A Little Life - Hanya Yanagihara', price: 306900, discount: 13, sold: 519, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
  { id: 10, title: 'Atomic Habits - James Clear', price: 437000, discount: 23, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8935244878332.jpg' },
  { id: 11, title: 'Think and Grow Rich', price: 239000, discount: 18, sold: 118, image: 'https://cdn0.fahasa.com/media/catalog/product/n/x/nxbtre_full_24562023_035624.jpg' },
  { id: 12, title: 'Educated: A Memoir', price: 279000, discount: 13, sold: 419, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8934974176378.jpg' },
  { id: 13, title: 'Never Split the Difference', price: 217000, discount: 19, sold: 129, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' },
]);
</script>

<style scoped>
</style>