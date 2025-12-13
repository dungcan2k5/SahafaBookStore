<template>
  <div class="bg-gray-50 min-h-screen pb-10 font-sans">
    
    <div class="bg-gradient-to-r from-blue-700 to-blue-500 py-8">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-black text-white uppercase drop-shadow-md mb-2">
          KHO MÃ GIẢM GIÁ
        </h1>
        <p class="text-blue-100 text-lg">Săn deal hời - Mua sắm thả ga</p>
        
        <div class="max-w-xl mx-auto mt-6 relative">
          <input type="text" placeholder="Nhập mã voucher tại đây..." class="w-full pl-4 pr-32 py-3 rounded-full border-none shadow-lg focus:ring-2 focus:ring-yellow-400 outline-none text-gray-700">
          <button class="absolute right-1 top-1 bottom-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-6 rounded-full transition">
            ÁP DỤNG
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 -mt-6 relative z-10 mb-8">
      <div class="bg-white rounded-xl shadow-md p-4 flex flex-wrap justify-center gap-4 border border-gray-100">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg font-bold text-sm transition border"
          :class="activeTab === tab.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600'"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-6xl">
      
      <div class="mb-10">
        <h2 class="text-xl font-bold text-blue-800 uppercase mb-4 border-l-4 border-yellow-400 pl-3">
          🔥 Mã Hot Hôm Nay
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(voucher, idx) in hotVouchers" :key="idx" class="bg-white rounded-lg shadow-sm border border-gray-200 flex overflow-hidden h-32 relative group hover:shadow-md transition">
            <div class="w-32 bg-blue-600 flex flex-col items-center justify-center text-white p-2 text-center relative">
              <div class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full z-10"></div>
              <span class="text-xs font-medium opacity-80">SAHAFA</span>
              <span class="text-2xl font-black">{{ voucher.amount }}</span>
              <span class="text-[10px] uppercase">Giảm giá</span>
            </div>
            <div class="flex-1 p-3 flex flex-col justify-between border-l border-dashed border-gray-300">
              <div>
                <h3 class="font-bold text-gray-800 text-sm line-clamp-2">{{ voucher.title }}</h3>
                <p class="text-xs text-gray-500 mt-1">Đơn tối thiểu {{ voucher.min }}</p>
              </div>
              
              <div class="flex items-end justify-between mt-2">
                <div class="text-xs text-red-500 font-medium">HSD: {{ voucher.expiry }}</div>
                <button class="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded hover:bg-blue-700 transition shadow-sm">
                  Lưu
                </button>
              </div>
              
              <div class="w-full bg-gray-100 rounded-full h-1 mt-2">
                <div class="bg-yellow-400 h-1 rounded-full" :style="{ width: voucher.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h2 class="text-xl font-bold text-green-600 uppercase mb-4 border-l-4 border-green-500 pl-3">
          🚚 Mã Freeship
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(voucher, idx) in freeshipVouchers" :key="idx" class="bg-white rounded-lg shadow-sm border border-gray-200 flex overflow-hidden h-28 hover:shadow-md transition">
             <div class="w-28 bg-green-500 flex flex-col items-center justify-center text-white p-2 text-center relative border-r border-dashed border-white">
                <span class="text-2xl">🚛</span>
                <span class="text-sm font-bold mt-1">FREESHIP</span>
             </div>
             <div class="flex-1 p-3 flex flex-col justify-center">
                <h3 class="font-bold text-gray-800 text-sm">{{ voucher.title }}</h3>
                <p class="text-xs text-gray-500 mt-1 mb-2">{{ voucher.condition }}</p>
                <div class="flex justify-between items-center">
                   <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Sắp hết hạn</span>
                   <button class="text-green-600 border border-green-600 text-xs font-bold px-3 py-1 rounded hover:bg-green-50 transition">Lưu</button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h2 class="text-xl font-bold text-gray-700 uppercase mb-4 border-l-4 border-gray-500 pl-3">
          💳 Ưu Đãi Đối Tác
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="bg-blue-50 rounded-lg p-4 border border-blue-100 flex items-center gap-4">
              <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                 <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" class="w-12 h-12 object-contain"/>
              </div>
              <div class="flex-1">
                 <h3 class="font-bold text-gray-800">Giảm 20K qua ZaloPay</h3>
                 <p class="text-sm text-gray-500">Cho đơn từ 150K</p>
              </div>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Lưu</button>
           </div>
           
           <div class="bg-pink-50 rounded-lg p-4 border border-pink-100 flex items-center gap-4">
              <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                 <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" class="w-12 h-12 object-contain"/>
              </div>
              <div class="flex-1">
                 <h3 class="font-bold text-gray-800">Giảm 15K qua Momo</h3>
                 <p class="text-sm text-gray-500">Cho đơn từ 100K</p>
              </div>
              <button class="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Lưu</button>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('all');

const tabs = [
  { id: 'all', name: 'Tất Cả' },
  { id: 'sahafa', name: 'Mã Sahafa' },
  { id: 'freeship', name: 'Freeship' },
  { id: 'partner', name: 'Thanh Toán' },
];

const hotVouchers = ref([
  { amount: '15K', title: 'Giảm 15K cho mọi đơn hàng', min: '150K', expiry: '31/12', percent: 80 },
  { amount: '30K', title: 'Giảm 30K sách Văn Học', min: '300K', expiry: '31/12', percent: 45 },
  { amount: '50K', title: 'Giảm 50K sách Thiếu Nhi', min: '500K', expiry: '30/12', percent: 90 },
  { amount: '10%', title: 'Giảm 10% tối đa 50K', min: '200K', expiry: '31/12', percent: 60 },
  { amount: '100K', title: 'Voucher đặc biệt 12.12', min: '1 Triệu', expiry: '12/12', percent: 95 },
  { amount: '20K', title: 'Giảm 20K sách Kinh Tế', min: '250K', expiry: '31/12', percent: 30 },
]);

const freeshipVouchers = ref([
  { title: 'Freeship 15K', condition: 'Đơn từ 150K' },
  { title: 'Freeship 30K', condition: 'Đơn từ 300K' },
  { title: 'Freeship Extra', condition: 'Đơn từ 99K (Chỉ App)' },
]);
</script>