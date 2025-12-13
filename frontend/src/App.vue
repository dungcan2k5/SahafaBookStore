
<template>
  <div class="flex flex-col min-h-screen bg-[#F0F0F0] font-sans text-gray-700">
    <Navbar />

    <main class="flex-grow">
      <router-view />
    </main>

    <!-- <Footer /> -->
  </div>
</template>

<script setup>
import Navbar from '@/components/user/Navbar.vue';
// import Footer from '@/components/user/Footer.vue';
</script>