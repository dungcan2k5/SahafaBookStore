<template>
  <div class="container mx-auto py-10 px-4 md:px-12">
    <div v-if="authStore.user" class="flex flex-col md:flex-row gap-8">
      
      <div class="w-full md:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border">
                <img :src="user.avatar_url || 'https://ui-avatars.com/api/?name=User'" 
                     class="w-full h-full object-cover" 
                     @error="$event.target.src='https://ui-avatars.com/api/?name=Error'">
            </div>
            <div class="overflow-hidden">
              <p class="text-xs text-gray-500">Tài khoản của</p>
              <p class="font-bold text-gray-800 truncate">{{ user.full_name || 'Khách' }}</p>
            </div>
          </div>
          <ul class="flex flex-col gap-2 text-sm">
            <li class="font-bold text-[#C92127] cursor-pointer bg-red-50 p-2 rounded">Hồ sơ cá nhân</li>
            <li class="text-gray-600 cursor-pointer hover:text-[#C92127] p-2">Đơn hàng của tôi</li>
          </ul>
        </div>
      </div>

      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <h1 class="text-2xl font-light text-gray-800 mb-6 border-b pb-4">Hồ Sơ Của Tôi</h1>
          
          <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label class="w-32 text-gray-600 md:text-right font-medium">Họ tên</label>
              <input v-model="user.full_name" type="text" class="border border-gray-300 px-4 py-2 rounded flex-1 focus:outline-none focus:border-blue-500">
            </div>

            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <label class="w-32 text-gray-600 md:text-right font-medium">Số điện thoại</label>
              <input v-model="user.phone" type="text" class="border border-gray-300 px-4 py-2 rounded flex-1 focus:outline-none focus:border-blue-500" placeholder="Nhập số điện thoại">
            </div>
            
            <div class="flex items-center gap-4 mt-4 md:ml-32">
              <button 
                type="button" 
                @click="handleUpdate" 
                class="bg-[#C92127] text-white px-8 py-2 rounded hover:bg-red-700 transition shadow-md font-bold disabled:opacity-50"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
              </button>
            </div>
            
            <p v-if="message" class="md:ml-32 text-sm font-bold" :class="isError ? 'text-red-600' : 'text-green-600'">
                {{ message }}
            </p>
          </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
        <p class="text-gray-500">Đang tải thông tin người dùng...</p>
        <router-link to="/login" class="text-blue-600 underline">Đăng nhập lại nếu đợi quá lâu</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api'; // Dùng trực tiếp API, bỏ qua authService

const authStore = useAuthStore();
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

// Khởi tạo user với giá trị mặc định để không bị lỗi null
const user = ref({
    full_name: '',
    phone: '',
});

onMounted(() => {
    // Chỉ copy dữ liệu nếu authStore đã có user
    if (authStore.user) {
        user.value = { 
            ...authStore.user,
            // Ưu tiên full_name, phòng hờ null
            full_name: authStore.user.full_name || authStore.user.name || ''
        };
    } else {
        // Nếu không có user trong store, thử load lại trang hoặc đẩy về login
        console.warn("Chưa tìm thấy user trong Store");
    }
});

const handleUpdate = async () => {
    // Reset thông báo
    message.value = '';
    isError.value = false;
    isLoading.value = true;

    try {
        // Gọi trực tiếp API
        const res = await api.put('/api/auth/me', {
            full_name: user.value.full_name,
            phone: user.value.phone,
        });

        // Kiểm tra kết quả
        if (res.data.success) {
            message.value = 'Cập nhật thành công!';
            // Cập nhật ngược lại vào Store (quan trọng để Navbar đổi tên theo)
            if (res.data.data) {
                 authStore.setUser(res.data.data);
            }
            alert("✅ Đã lưu thông tin thành công!");
        } else {
            throw new Error(res.data.message || 'Lỗi không xác định');
        }

    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        isError.value = true;
        
        // Lấy thông báo lỗi chuẩn từ Backend
        const serverMessage = error.response?.data?.message || error.message || 'Lỗi kết nối server';
        message.value = serverMessage;
        
        // Hiện popup báo lỗi
        alert("❌ " + serverMessage);
    } finally {
        isLoading.value = false;
    }
};
</script>