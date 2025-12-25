<template>
  <div v-loading="loading" class="min-h-[80vh]">
    <!-- Top Stats Cards (Theo thời gian) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      
      <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Doanh thu {{ periodLabel }}</span>
               <el-tag type="success" effect="dark" class="rounded-full">Paid</el-tag>
            </div>
         </template>
         <div class="flex items-baseline gap-2">
             <div class="text-2xl font-extrabold text-gray-800">{{ formatCurrency(stats.periodRevenue) }}</div>
         </div>
      </el-card>

      <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Đơn hàng {{ periodLabel }}</span>
               <el-icon class="text-orange-500"><List /></el-icon>
            </div>
         </template>
         <div class="text-3xl font-extrabold text-gray-800">{{ stats.periodOrders }}</div>
         <div class="text-xs text-gray-400 mt-2">Đơn thành công</div>
      </el-card>

      <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Khách hàng</span>
               <el-icon class="text-blue-500"><User /></el-icon>
            </div>
         </template>
         <div class="text-3xl font-extrabold text-gray-800">{{ stats.totalUsers }}</div>
         <div class="text-xs text-gray-400 mt-2">Tổng tài khoản</div>
      </el-card>

       <el-card shadow="hover" class="rounded-xl border-none shadow-md hover:-translate-y-1 transition-all duration-300">
         <template #header>
            <div class="flex justify-between items-center">
               <span class="text-gray-500 font-medium uppercase text-xs tracking-wider">Kho sách</span>
               <el-icon class="text-purple-500"><Box /></el-icon>
            </div>
         </template>
         <div class="text-3xl font-extrabold text-gray-800">{{ stats.totalBooks }} <span class="text-sm font-normal text-gray-500">cuốn</span></div>
         <div class="text-xs text-gray-400 mt-2">{{ stats.totalTitles }} đầu sách</div>
      </el-card>
    </div>

    <!-- Chart Section -->
    <el-card shadow="never" class="rounded-xl border-none shadow-sm p-4 mb-8">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <el-icon><DataLine /></el-icon> Biểu đồ doanh thu
            </h3>
            
            <el-radio-group v-model="filterPeriod" size="small" @change="fetchData">
                <el-radio-button label="week">Tuần này</el-radio-button>
                <el-radio-button label="month">Tháng này</el-radio-button>
                <el-radio-button label="year">Năm nay</el-radio-button>
            </el-radio-group>
        </div>

        <div class="h-[400px] w-full">
            <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Không có dữ liệu hiển thị</p>
            </div>
        </div>
    </el-card>

    <!-- Detailed Stats Row -->
    <h3 class="text-lg font-bold text-gray-700 mb-4 px-2 border-l-4 border-blue-500">Thông tin hệ thống</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
            <div>
                <div class="text-gray-500 text-xs uppercase font-bold">Tác giả</div>
                <div class="text-xl font-bold text-gray-800">{{ stats.totalAuthors }}</div>
            </div>
            <el-icon class="text-gray-300 text-2xl"><UserFilled /></el-icon>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
            <div>
                <div class="text-gray-500 text-xs uppercase font-bold">Nhà xuất bản</div>
                <div class="text-xl font-bold text-gray-800">{{ stats.totalPublishers }}</div>
            </div>
            <el-icon class="text-gray-300 text-2xl"><OfficeBuilding /></el-icon>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
            <div>
                <div class="text-gray-500 text-xs uppercase font-bold">Bài viết</div>
                <div class="text-xl font-bold text-gray-800">{{ stats.totalPosts }}</div>
            </div>
            <el-icon class="text-gray-300 text-2xl"><Document /></el-icon>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
            <div>
                <div class="text-gray-500 text-xs uppercase font-bold">Đầu sách</div>
                <div class="text-xl font-bold text-gray-800">{{ stats.totalTitles }}</div>
            </div>
            <el-icon class="text-gray-300 text-2xl"><Reading /></el-icon>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Box, DataLine, User, List, UserFilled, OfficeBuilding, Document, Reading } from '@element-plus/icons-vue';
import api from '@/services/api';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// State
const loading = ref(false);
const filterPeriod = ref('month');
const stats = reactive({
    periodRevenue: 0,
    periodOrders: 0,
    totalUsers: 0,
    totalBooks: 0,
    totalTitles: 0,
    totalAuthors: 0,
    totalPublishers: 0,
    totalPosts: 0
});

const periodLabel = computed(() => {
    if (filterPeriod.value === 'week') return '(Tuần này)';
    if (filterPeriod.value === 'year') return '(Năm nay)';
    return '(Tháng này)';
});

// Chart Configuration
const chartData = ref({
    labels: [],
    datasets: []
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        }
    }
};

// Helpers
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// API Fetch
const fetchData = async () => {
    loading.value = true;
    try {
        const res = await api.get('/api/api/stats/dashboard', {
            params: { period: filterPeriod.value }
        });

        const payload = (res && res.data !== undefined) ? res.data : res;
        const data = payload && payload.data !== undefined ? payload.data : payload;

        if (data) {
            Object.assign(stats, data);

            const chartArr = (data && data.chartData) || [];
            const labels = chartArr.map(item => item.label);
            const values = chartArr.map(item => item.value);

            chartData.value = {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu (VNĐ)',
                        backgroundColor: '#409EFF',
                        data: values
                    }
                ]
            };
        }
    } catch (error) {
        console.error("Lỗi tải dashboard:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>