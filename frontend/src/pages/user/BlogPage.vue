<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Sahafa Blog</h1>
      <p class="text-gray-600">Cập nhật tin tức, review sách và khuyến mãi mới nhất</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="post in posts" 
        :key="post.post_id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <router-link :to="{ name: 'PostDetail', params: { slug: post.post_slug } }">
          <div class="h-48 overflow-hidden">
            <img 
              :src="post.thumbnail_url || 'https://placehold.co/600x400?text=No+Image'" 
              :alt="post.title" 
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            >
          </div>
          <div class="p-4">
            <div class="flex items-center text-xs text-gray-500 mb-2">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2" v-if="post.Category">
                {{ post.Category.category_name }}
              </span>
              <span>{{ formatDate(post.created_at) }}</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
              {{ getExcerpt(post.content) }}
            </p>
            <div class="text-blue-500 font-medium text-sm hover:underline">
              Đọc tiếp &rarr;
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import postService from '@/services/postService';

const posts = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchPosts = async () => {
  try {
    loading.value = true;
    const response = await postService.getAllPosts();
    posts.value = response;
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    error.value = 'Không thể tải danh sách bài viết. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const getExcerpt = (content) => {
  if (!content) return '';
  // Remove HTML tags for excerpt
  const tmp = document.createElement('DIV');
  tmp.innerHTML = content;
  const text = tmp.textContent || tmp.innerText || '';
  return text.length > 150 ? text.substring(0, 150) + '...' : text;
};

onMounted(() => {
  fetchPosts();
});
</script>
