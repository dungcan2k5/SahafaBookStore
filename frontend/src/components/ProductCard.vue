<script setup>
import { Star } from 'lucide-vue-next';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});
const formatPrice = (price) => {
  if (!price) return '0 đ';
  return price.toLocaleString('vi-VN') + ' đ';
};
</script>

<template>
  <div class="bg-white p-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary cursor-pointer h-full flex flex-col group relative">
    
    <span class="absolute top-0 right-0 bg-yellow-400 text-red-600 text-[11px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg z-10 shadow-sm">
      -{{ product.discount }}%
    </span>

    <div class="w-full aspect-[3/4] mb-3 overflow-hidden flex items-center justify-center rounded-md bg-gray-50">
      <img 
        :src="product.image" 
        :alt="product.title" 
        class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
      />
    </div>

    <div class="flex flex-col flex-grow">
      <h3 class="text-[13px] leading-5 text-gray-700 line-clamp-2 mb-2 group-hover:text-primary transition-colors font-medium">
        {{ product.title }}
      </h3>
      
      <div class="mt-auto">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-primary font-bold text-base">{{ formatPrice(product.price) }}</span>
        </div>
        <div class="text-gray-400 text-xs line-through mb-2">{{ formatPrice(product.oldPrice) }}</div>
        
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center text-yellow-400">
             <Star 
                v-for="i in 5" 
                :key="i" 
                :size="12" 
                :fill="i <= Math.floor(product.rating) ? 'currentColor' : 'none'" 
                stroke="currentColor" 
             />
             <span class="ml-1 text-gray-400">({{ product.sold }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>