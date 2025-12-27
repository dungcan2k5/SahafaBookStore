<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <!-- Chat Window -->
    <transition name="fade-slide">
      <div v-if="isOpen" class="bg-white shadow-2xl rounded-lg w-80 h-96 flex flex-col mb-4 overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="bg-blue-600 p-3 flex justify-between items-center text-white">
          <div class="flex items-center gap-2">
            <el-icon><ChatDotRound /></el-icon>
            <span class="font-bold">Trợ lý ảo Sahafa</span>
          </div>
          <el-icon class="cursor-pointer hover:text-gray-200 transition-colors" @click="isOpen = false"><Close /></el-icon>
        </div>
        
        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
          <div 
            v-for="(msg, index) in messages" 
            :key="index" 
            :class="['max-w-[85%] p-2 rounded-lg text-sm leading-relaxed shadow-sm', msg.isUser ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-white text-gray-800 self-start border border-gray-200 rounded-bl-none']"
          >
            <span v-html="formatMessage(msg.text)"></span>
          </div>
          <div v-if="loading" class="self-start bg-gray-100 text-gray-500 text-xs rounded-lg p-2 flex items-center gap-1">
            <span class="animate-bounce">●</span>
            <span class="animate-bounce delay-100">●</span>
            <span class="animate-bounce delay-200">●</span>
          </div>
        </div>

        <!-- Input -->
        <div class="p-2 border-t border-gray-100 bg-white flex gap-2 items-center">
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            placeholder="Nhập tin nhắn..." 
            class="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button 
            @click="sendMessage" 
            class="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md"
            :disabled="!userInput.trim() || loading"
          >
            <el-icon><Promotion /></el-icon>
          </button>
        </div>
      </div>
    </transition>

    <!-- Toggle Button -->
    <button 
      @click="isOpen = !isOpen" 
      class="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none ring-4 ring-blue-100"
    >
      <el-icon size="24" v-if="!isOpen"><ChatDotRound /></el-icon>
      <el-icon size="24" v-else><Close /></el-icon>
    </button>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<script setup>
import { ref, nextTick, watch } from 'vue';
import api from '@/services/api'; 
import { ChatDotRound, Close, Promotion } from '@element-plus/icons-vue';

const isOpen = ref(false);
const messages = ref([{ text: "Chào bạn! Cần tìm sách gì cứ hỏi mình nha 👇", isUser: false }]);
const userInput = ref("");
const loading = ref(false);
const messagesContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages.value, () => {
  scrollToBottom();
});

watch(isOpen, (newVal) => {
  if (newVal) scrollToBottom();
});

const formatMessage = (text) => {
  if (!text) return '';
  // Basic HTML escaping to prevent XSS (simplified)
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Bullet points: - item at start of line
  formatted = formatted.replace(/^\s*-\s+(.*)$/gm, '• $1');

  // Newlines
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;
  
  const text = userInput.value;
  messages.value.push({ text, isUser: true });
  userInput.value = "";
  loading.value = true;
  scrollToBottom();

  try {
    // Gọi API xuống backend
    const res = await api.post('/api/chat', { message: text });
    // Assuming backend returns { reply: "..." } and api.js interceptor returns response.data
    messages.value.push({ text: res.reply || res.data?.reply || "Không có phản hồi.", isUser: false });
  } catch (err) {
    console.error(err);
    messages.value.push({ text: "Lỗi kết nối rồi huhu.", isUser: false });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};
</script>