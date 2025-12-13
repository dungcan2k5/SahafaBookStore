<script setup>
import Navbar from '@/components/user/Navbar.vue';
import Footer from '@/components/user/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#F0F0F0] font-sans text-gray-700">
    <Navbar />

    <main class="flex-1">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style>
#app {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  font-weight: normal;
}
body {
  margin: 0;
  padding: 0;
  background-color: #1F5EFF;
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>