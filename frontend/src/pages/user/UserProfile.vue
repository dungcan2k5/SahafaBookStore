<template>
  <div class="container mx-auto py-10 px-4 md:px-12">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img v-if="user.avatar_url" :src="user.avatar_url" class="w-full h-full object-cover">
                <img v-else src="https://ui-avatars.com/api/?name=User" class="w-full h-full object-cover">
            </div>
            <div>
              <p class="text-sm text-gray-500">Tài khoản của</p>
              <p class="font-bold text-gray-800 truncate">{{ user.full_name || 'User' }}</p>
            </div>
          </div>
          <ul class="flex flex-col gap-2 text-sm">
            <li class="font-bold text-[#C92127] cursor-pointer">Hồ sơ cá nhân</li>
            <li class="text-gray-600 cursor-pointer hover:text-[#C92127]">Đơn hàng của tôi</li>
          </ul>
        </div>
      </div>

      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <h1 class="text-2xl font-light text-gray-800 mb-6 border-b pb-4">Hồ Sơ Của Tôi</h1>
          <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
              <label class="w-32 text-gray-600 text-right">Họ tên</label>
              <input v-model="user.full_name" type="text" class="border px-4 py-2 rounded flex-1">
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-gray-600 text-right">Số điện thoại</label>
              <input v-model="user.phone" type="text" class="border px-4 py-2 rounded flex-1">
            </div>
             <div class="flex items-center gap-4 mt-4">
              <label class="w-32"></label>
              <button @click="updateProfile" class="bg-[#C92127] text-white px-6 py-2 rounded">Lưu Thay Đổi</button>
            </div>
            <p v-if="message" class="text-green-600 text-center mt-2">{{ message }}</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Nhớ phải có file store/auth.js nhé
import { authService } from '@/services/authService';

const authStore = useAuthStore();
const user = ref({});
const message = ref('');

onMounted(() => {
    // Lấy data từ Store đổ vào form
    if (authStore.user) {
        user.value = { ...authStore.user };
    }
});

const updateProfile = async () => {
    try {
        const res = await authService.updateProfile(user.value);
        if (res.success) {
            message.value = 'Cập nhật thành công!';
            authStore.setUser(res.data); // Cập nhật ngược lại vào Store
        }
    } catch (e) {
        alert('Lỗi cập nhật');
    }
}
</script>