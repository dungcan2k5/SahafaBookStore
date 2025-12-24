<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
    <div class="max-w-md">
      <h1 class="text-9xl font-bold text-[#C92127]">404</h1>
      <h2 class="text-2xl font-bold text-gray-800 mt-4 mb-2">Trang không tìm thấy</h2>
      <p class="text-gray-600 mb-8">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      
      <router-link 
        to="/" 
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Về trang chủ
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Có thể thêm logic tracking hoặc logging ở đây nếu cần
</script>