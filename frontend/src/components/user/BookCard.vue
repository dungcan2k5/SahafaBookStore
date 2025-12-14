<template>
  <router-link 
    :to="`/books/${book.id}`" 
    class="bg-white rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3 border border-gray-100 hover:border-gray-200 cursor-pointer h-full flex flex-col group relative"
  >
    <div class="relative pt-[100%] mb-3 overflow-hidden rounded-md">
      <img 
        :src="book.image" 
        :alt="book.title" 
        class="absolute top-0 left-0 w-full h-full object-contain p-2 group-hover:scale-105 transition duration-500 ease-in-out" 
      />
      
      <div v-if="book.discount" class="absolute top-0 right-0 bg-[#C92127] text-white text-[11px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
        -{{ book.discount }}%
      </div>
    </div>
    
    <div class="flex flex-col flex-1 gap-1">
      <h3 class="text-[14px] leading-snug text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors font-medium">
        {{ book.title }}
      </h3>
      
      <div class="mt-auto flex flex-col gap-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[#C92127] font-bold text-lg">{{ formatPrice(book.price) }}đ</span>
          <span v-if="book.oldPrice" class="text-gray-400 text-xs line-through">{{ formatPrice(book.oldPrice) }}đ</span>
        </div>
        
        <div class="flex items-center justify-between">
           <div class="flex text-yellow-400 text-xs gap-[1px]">
             <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
           </div>
           
           <span class="text-gray-500 text-[11px] truncate">Đã bán {{ formatNumber(book.sold) }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  book: { type: Object, required: true }
});

// Format tiền (100.000)
const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

// Format số lượng (1.2k) - Giúp số không bị quá dài nếu bán nhiều
const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}
</script>