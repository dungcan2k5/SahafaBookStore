<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 text-xl mb-4">{{ error }}</div>
      <router-link to="/blog" class="text-blue-500 hover:underline">
        &larr; Quay lại trang tin tức
      </router-link>
    </div>

    <!-- Content -->
    <div v-else-if="post" class="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <div class="mb-6">
        <router-link to="/blog" class="text-gray-500 hover:text-blue-500 text-sm mb-4 inline-block">
          &larr; Quay lại
        </router-link>
        
        <div class="flex items-center gap-2 mb-4">
          <span 
            v-if="post.Category" 
            class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
          >
            {{ post.Category.category_name }}
          </span>
          <span class="text-gray-500 text-sm border-l pl-2 border-gray-300">
            {{ formatDate(post.created_at) }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {{ post.title }}
        </h1>

        <div v-if="post.thumbnail_url" class="mb-8 rounded-lg overflow-hidden shadow-sm">
          <img 
            :src="post.thumbnail_url" 
            :alt="post.title" 
            class="w-full h-auto object-cover max-h-[500px]"
          >
        </div>
      </div>

      <!-- Post Content -->
      <div class="prose prose-lg max-w-none text-gray-700 post-content" v-html="post.content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import postService from '@/services/postService';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchPost = async () => {
  const slug = route.params.slug;
  if (!slug) return;

  try {
    loading.value = true;
    error.value = null;
    const response = await postService.getPostBySlug(slug);
    if (response.data.success) {
      post.value = response.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch post:', err);
    error.value = 'Không tìm thấy bài viết hoặc đã xảy ra lỗi.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

onMounted(() => {
  fetchPost();
});

// Watch for route changes to re-fetch if navigating between posts
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchPost();
  }
});
</script>

<style>
/* Basic styling for HTML content injected via v-html */
.post-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a202c;
}
.post-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #2d3748;
}
.post-content p {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}
.post-content ul, .post-content ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
.post-content li {
  margin-bottom: 0.5rem;
}
.post-content ul {
  list-style-type: disc;
}
.post-content ol {
  list-style-type: decimal;
}
.post-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
.post-content blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  font-style: italic;
  color: #4a5568;
  margin: 1.5rem 0;
}
</style>
