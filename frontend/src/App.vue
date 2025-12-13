<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->
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