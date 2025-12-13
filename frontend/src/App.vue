<template>
  <div class="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">
    
    <Navbar />

    <main class="flex-grow">
      <router-view />
    </main>

    <Footer />

  </div>
</template>

<script setup>
// Import 2 thành phần cố định của trang web
import Navbar from '@/components/user/Navbar.vue';
import Footer from '@/components/user/Footer.vue';
</script>

<style>
/* CSS Reset cơ bản nếu cần */
body {
  margin: 0;
  padding: 0;
}
</style>