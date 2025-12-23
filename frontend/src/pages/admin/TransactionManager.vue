<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-green-600"><Money /></el-icon> Quản lý Giao Dịch
      </h2>
      <el-button @click="fetchTransactions" :loading="loading" icon="Refresh">Làm mới</el-button>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="transactions" style="width: 100%" v-loading="loading" stripe border>
        
        <el-table-column label="Mã GD" width="100" align="center">
            <template #default="scope">
                <span class="font-mono text-gray-500">#{{ scope.row.payment_id }}</span>
            </template>
        </el-table-column>

        <el-table-column label="Khách hàng" min-width="180">
            <template #default="scope">
                <div class="font-bold">{{ scope.row.User?.full_name || 'Khách vãng lai' }}</div>
                <div class="text-xs text-gray-400">{{ scope.row.User?.email }}</div>
            </template>
        </el-table-column>

        <el-table-column label="Liên quan đến" min-width="150">
            <template #default="scope">
                <el-tag size="small" effect="plain">Đơn hàng #{{ scope.row.order_id }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column label="Số tiền" width="150" align="right">
            <template #default="scope">
                <div class="font-bold text-green-600">
                    {{ formatCurrency(scope.row.amount) }}
                </div>
            </template>
        </el-table-column>

        <el-table-column label="Phương thức" width="140" align="center">
            <template #default="scope">
                <el-tag v-if="scope.row.payment_method === 'bank_transfer'" type="primary">Chuyển khoản</el-tag>
                <el-tag v-else-if="scope.row.payment_method === 'cod'" type="warning">COD</el-tag>
                <el-tag v-else type="info">{{ scope.row.payment_method }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column label="Thời gian" width="160">
            <template #default="scope">
                <div class="text-sm">{{ formatDate(scope.row.created_at) }}</div>
            </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="140" align="center">
            <template #default="scope">
                <el-tag v-if="scope.row.status === 'success'" type="success" effect="dark">Thành công</el-tag>
                <el-tag v-else-if="scope.row.status === 'pending'" type="warning" effect="dark">Chờ duyệt</el-tag>
                <el-tag v-else type="danger" effect="dark">Thất bại</el-tag>
            </template>
        </el-table-column>

        <el-table-column label="Hành động" width="120" align="center" fixed="right">
            <template #default="scope">
                <div v-if="scope.row.status === 'pending'">
                    <el-popconfirm 
                        title="Xác nhận đã nhận được tiền?" 
                        confirm-button-text="Duyệt ngay"
                        cancel-button-text="Hủy"
                        @confirm="handleApprove(scope.row.payment_id)"
                    >
                        <template #reference>
                            <el-button type="success" size="small" :icon="Check">Duyệt</el-button>
                        </template>
                    </el-popconfirm>
                </div>
                <div v-else class="text-gray-400 text-xs italic">Đã xử lý</div>
            </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Money, Refresh, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api'; // Đảm bảo bạn đã có axios instance

const transactions = ref([]);
const loading = ref(false);

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

const fetchTransactions = async () => {
    loading.value = true;
    try {
        const res = await api.get('/api/payment/transactions');
        transactions.value = res.data.data;
    } catch (error) {
        ElMessage.error('Không thể tải lịch sử giao dịch');
    } finally {
        loading.value = false;
    }
};

const handleApprove = async (id) => {
    try {
        await api.put(`/api/payment/transactions/${id}/approve`);
        ElMessage.success('Đã xác nhận thanh toán thành công!');
        fetchTransactions(); // Load lại danh sách
    } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Lỗi khi duyệt');
    }
};

onMounted(() => fetchTransactions());
</script>