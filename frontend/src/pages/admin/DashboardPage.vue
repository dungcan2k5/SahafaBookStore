<template>
  <div v-loading="loading" class="min-h-[80vh]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Tổng Doanh thu</span>
               <el-tag type="success" effect="dark" class="rounded-full">+0%</el-tag>
            </div>
         </template>
         <div class="flex items-baseline gap-2">
             <div class="text-3xl font-extrabold text-gray-800">{{ formatCurrency(stats.revenue) }}</div>
         </div>
         <div class="text-xs text-gray-400 mt-2">Tính trên các đơn đã thanh toán</div>
      </el-card>

      <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Tổng Đơn hàng</span>
               <el-tag type="warning" effect="dark" class="rounded-full">Mới</el-tag>
            </div>
         </template>
         <div class="text-3xl font-extrabold text-gray-800">{{ stats.totalOrders }} <span class="text-lg font-normal text-gray-500">Đơn</span></div>
         <div class="text-xs text-gray-400 mt-2">Đang chờ xử lý: {{ stats.pendingOrders }}</div>
      </el-card>

       <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Sách Tồn kho</span>
               <el-icon class="text-blue-500"><Box /></el-icon>
            </div>
         </template>
         <div class="text-3xl font-extrabold text-gray-800">{{ stats.inStock }} <span class="text-lg font-normal text-gray-500">Cuốn</span></div>
         <div class="text-xs text-gray-400 mt-2">Tổng đầu sách: {{ stats.totalBooks }}</div>
      </el-card>
    </div>

    <el-card shadow="never" class="rounded-xl border-dashed border-2 border-gray-300 h-[400px] flex flex-col items-center justify-center bg-gray-50">
        <el-icon :size="60" class="text-gray-300 mb-4"><DataLine /></el-icon>
        <h3 class="text-xl font-bold text-gray-400">Biểu đồ tăng trưởng</h3>
        <p class="text-gray-400 text-sm mt-2">Chưa có đủ dữ liệu để vẽ biểu đồ</p>
        <el-button type="primary" plain class="mt-6" @click="fetchData">Làm mới dữ liệu</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Box, DataLine } from '@element-plus/icons-vue';
import api from '@/services/api'; // Gọi api service

// State lưu dữ liệu
const loading = ref(false);
const stats = reactive({
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    inStock: 0,
    totalBooks: 0
});

// Hàm format tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm lấy dữ liệu từ API thật
const fetchData = async () => {
    loading.value = true;
    try {
        // 1. SỬA LẠI ĐOẠN LẤY SÁCH
        console.log("Đang gọi API Books...");
        const booksRes = await api.get('/api/books');
        
        // Log ra xem Backend trả về cái gì
        console.log("Dữ liệu Books nhận được:", booksRes.data); 

        // Xử lý linh hoạt: Nếu data là mảng thì dùng luôn, nếu bọc trong .data thì lấy .data
        // (Đây là chỗ hay bị sai nhất)
        const books = Array.isArray(booksRes.data) ? booksRes.data : (booksRes.data.data || []);
        
        stats.totalBooks = books.length;
        // Cộng dồn số lượng tồn kho
        stats.inStock = books.reduce((sum, book) => sum + (Number(book.stock_quantity) || 0), 0);

        // ... (Đoạn lấy đơn hàng giữ nguyên hoặc comment lại nếu chưa có API)

    } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>