<template>
  <div class="container mx-auto py-10 px-4 md:px-12">
    <div class="flex flex-col md:flex-row gap-8">
      
      <div class="w-full md:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img v-if="user.avatar_url" :src="user.avatar_url" alt="User Avatar" class="w-full h-full object-cover">
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-full w-full text-gray-400 p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tài khoản của</p>
              <p class="font-bold text-gray-800 truncate">{{ user.full_name || 'User' }}</p>
            </div>
          </div>
          
          <ul class="flex flex-col gap-2">
            <li class="font-medium text-[#C92127] cursor-pointer">Thông tin tài khoản</li>
            <li class="text-gray-600 hover:text-[#C92127] cursor-pointer transition">Đơn hàng của tôi</li>
            <li class="text-gray-600 hover:text-[#C92127] cursor-pointer transition">Sổ địa chỉ</li>
            <li @click="logout" class="text-gray-600 hover:text-[#C92127] cursor-pointer transition border-t pt-2 mt-2">Đăng xuất</li>
          </ul>
        </div>
      </div>

      <div class="w-full md:w-3/4">
        <div class="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <h1 class="text-2xl font-light text-gray-800 mb-6 border-b pb-4">Hồ Sơ Của Tôi</h1>
          
          <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label class="w-32 text-gray-600 text-right font-medium">Họ tên</label>
              <div class="flex-1">
                 <input v-model="form.full_name" type="text" class="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition" />
              </div>
            </div>

            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label class="w-32 text-gray-600 text-right font-medium">Email</label>
              <div class="flex-1">
                 <div class="flex items-center gap-2">
                    <span class="text-gray-800">{{ user.email }}</span>
                    <span class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Đã xác minh</span>
                 </div>
              </div>
            </div>

            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label class="w-32 text-gray-600 text-right font-medium">Số điện thoại</label>
              <div class="flex-1">
                 <input v-model="form.phone" type="text" class="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition" placeholder="Thêm số điện thoại" />
              </div>
            </div>

            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
              <label class="w-32 text-gray-600 text-right font-medium">Avatar URL</label>
              <div class="flex-1">
                 <input v-model="form.avatar_url" type="text" class="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 transition" placeholder="https://..." />
              </div>
            </div>

            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mt-4">
              <label class="w-32 hidden md:block"></label>
              <div class="flex-1">
                 <button @click="handleUpdate" class="bg-[#C92127] text-white px-8 py-2 rounded shadow hover:bg-red-700 transition font-medium">Lưu Thay Đổi</button>
                 <p v-if="message" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'" class="mt-2 text-sm">{{ message }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';

const router = useRouter();
const user = ref({});
const form = reactive({
  full_name: '',
  phone: '',
  avatar_url: ''
});
const message = ref('');
const messageType = ref('success');

const fetchProfile = async () => {
  try {
    const res = await authService.getProfile();
    if (res.success) {
      user.value = res.data;
      // Fill data vào form
      form.full_name = res.data.full_name;
      form.phone = res.data.phone;
      form.avatar_url = res.data.avatar_url;
    }
  } catch (error) {
    console.error(error);
    // Nếu lỗi auth (hết hạn token), đá về login
    if (error.response && error.response.status === 401) {
       router.push('/login');
    }
  }
};

const handleUpdate = async () => {
  message.value = '';
  try {
    const res = await authService.updateProfile(form);
    if (res.success) {
      message.value = 'Cập nhật thông tin thành công!';
      messageType.value = 'success';
      // Refresh lại data hiển thị
      fetchProfile();
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Có lỗi xảy ra.';
    messageType.value = 'error';
  }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
}

onMounted(() => {
  fetchProfile();
});
</script>