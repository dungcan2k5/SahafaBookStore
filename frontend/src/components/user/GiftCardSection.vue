<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      
      <div class="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3595/3595827.png" 
            class="w-6 h-6" 
            alt="Gift Card Icon"
          />
          <h2 class="text-lg md:text-xl font-bold text-gray-800 uppercase">
            Phiếu quà tặng - Gift Card
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(card, index) in giftCards" 
          :key="index"
          class="rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
        >
          <div class="relative aspect-[16/10] overflow-hidden">
             <img 
              :src="card.image" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              :alt="card.title"
             />
             <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <router-link 
          to="/gift-card" 
          class="inline-block bg-[#C92127] text-white px-12 py-2.5 rounded-lg font-bold shadow-md hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Xem Thêm
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Mock Data
const giftCards = ref([
  { 
    id: 1, 
    title: 'Christmas Gift Card 200K', 
    image: 'https://placehold.co/600x375/166534/FFF?text=Christmas+Gift+Card\n200.000+VND&font=playfair-display' 
  },
  { 
    id: 2, 
    title: 'Gift Card 200K - Rạp Xiếc', 
    image: 'https://placehold.co/600x375/991b1b/FFF?text=Fahasa+Gift+Card\n200K&font=roboto' 
  },
  { 
    id: 3, 
    title: 'Gift Card 200K - Nutcracker', 
    image: 'https://placehold.co/600x375/0f172a/FFF?text=Gift+Card+Premium\n200K&font=montserrat' 
  },
  { 
    id: 4, 
    title: 'Gift Card 100K - Winter', 
    image: 'https://placehold.co/600x375/475569/FFF?text=Winter+Collection\n100.000+VND&font=lato' 
  },
]);
</script>