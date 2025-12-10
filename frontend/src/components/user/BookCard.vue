<template>
  <router-link :to="`/books/${book.id}`" class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-3 border border-transparent hover:border-gray-200 cursor-pointer h-full flex flex-col group block">
    <div class="relative pt-[100%] mb-3 overflow-hidden rounded-md">
      <img :src="book.image" :alt="book.title" class="absolute top-0 left-0 w-full h-full object-contain group-hover:scale-105 transition duration-300" />
      <div v-if="book.discount" class="absolute top-2 right-2 bg-sahafa-blue text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
        -{{ book.discount }}%
      </div>
    </div>
    
    <div class="flex flex-col flex-1">
      <h3 class="text-[13px] leading-5 text-gray-800 line-clamp-2 mb-2 min-h-[40px] group-hover:text-sahafa-blue transition-colors">
        {{ book.title }}
      </h3>
      
      <div class="mt-auto">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-sahafa-blue font-bold text-base">{{ formatPrice(book.price) }}đ</span>
          <span v-if="book.oldPrice" class="text-gray-400 text-xs line-through">{{ formatPrice(book.oldPrice) }}</span>
        </div>
        
        <div class="flex items-center justify-between mt-1">
           <div class="flex text-yellow-400 text-xs">
             <span v-for="i in 5" :key="i">★</span>
           </div>
           <span class="text-gray-400 text-[11px]">{{ book.sold }} đã bán</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  book: { type: Object, required: true }
});

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);
</script>