<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-green-600"><Money /></el-icon> Quản lý Giao Dịch
      </h2>

      <div class="flex items-center gap-3">
        <el-input
          v-model="searchText"
          placeholder="Tìm theo mã GD, mã đơn, tên, email..."
          clearable
          style="width: 360px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button @click="fetchTransactions" :loading="loading">
          <el-icon class="mr-1"><Refresh /></el-icon> Làm mới
        </el-button>

        <el-button type="warning" plain @click="createFakeTransaction" :loading="creating">
          <el-icon class="mr-1"><MagicStick /></el-icon> Tạo GD Test
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="transactions" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="Mã GD" width="110" align="center">
          <template #default="scope">
            <span class="font-mono text-gray-600">#{{ getTxId(scope.row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Khách hàng" min-width="200">
          <template #default="scope">
            <div class="font-bold">{{ scope.row.User?.full_name || 'Khách vãng lai' }}</div>
            <div class="text-xs text-gray-400">{{ scope.row.User?.email || '...' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="Liên quan đến" min-width="170">
          <template #default="scope">
            <el-tag size="small" effect="plain">Đơn hàng #{{ scope.row.order_id }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Số tiền" width="160" align="right">
          <template #default="scope">
            <div class="font-bold text-green-600">
              {{ formatCurrency(scope.row.amount || scope.row.Order?.final_amount || 0) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Phương thức" width="140" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.payment_method === 'bank_transfer'" type="primary">Chuyển khoản</el-tag>
            <el-tag v-else-if="scope.row.payment_method === 'COD' || scope.row.payment_method === 'cod'" type="warning">COD</el-tag>
            <el-tag v-else type="info">{{ scope.row.payment_method }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thời gian" width="170">
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

        <el-table-column label="Hành động" width="220" align="center" fixed="right">
          <template #default="scope">
            <div class="flex items-center justify-center gap-2">
              <el-popconfirm
                v-if="scope.row.status === 'pending'"
                title="Xác nhận đã nhận được tiền?"
                confirm-button-text="Duyệt"
                cancel-button-text="Không"
                @confirm="handleApprove(scope.row)"
              >
                <template #reference>
                  <el-button type="success" size="small">
                    <el-icon class="mr-1"><Check /></el-icon> Duyệt
                  </el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm
                title="Xóa giao dịch này? (Chỉ xóa được nếu chưa thành công)"
                confirm-button-text="Xóa"
                cancel-button-text="Không"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button type="danger" size="small" plain>
                    <el-icon class="mr-1"><Delete /></el-icon> Xóa
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Money, Refresh, Check, Search, MagicStick, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const transactions = ref([]);
const loading = ref(false);
const creating = ref(false);
const searchText = ref('');
let debounceTimer = null;

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// helpers
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString('vi-VN') : '...');

// robust transaction id getter
const getTxId = (tx) => tx.transaction_id ?? tx.payment_id ?? tx.id ?? '...';

// api
const fetchTransactions = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/payment/transactions', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchText.value?.trim() || undefined
      }
    });
    transactions.value = res.data.data || [];
    if (res.data.meta) {
      total.value = res.data.meta.total;
    }
  } catch (e) {
    console.error(e);
    ElMessage.error('Không thể tải lịch sử giao dịch');
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchTransactions();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchTransactions();
};

// Search Watcher
watch(searchText, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchTransactions();
  }, 400);
});

const handleApprove = async (row) => {
  const id = getTxId(row);
  if (!id || id === '...') {
    ElMessage.error('Không tìm thấy mã giao dịch để duyệt!');
    return;
  }
  try {
    await api.put(`/api/payment/transactions/${id}/approve`);
    ElMessage.success('Đã duyệt thanh toán thành công!');
    fetchTransactions();
  } catch (e) {
    console.error(e);
    ElMessage.error(e.response?.data?.message || 'Lỗi khi duyệt');
  }
};

const handleDelete = async (row) => {
  const id = getTxId(row);
  if (!id || id === '...') {
    ElMessage.error('Không tìm thấy mã giao dịch để xóa!');
    return;
  }
  try {
    await api.delete(`/api/payment/transactions/${id}`);
    ElMessage.success('Đã xóa giao dịch!');
    fetchTransactions();
  } catch (e) {
    console.error(e);
    ElMessage.error(e.response?.data?.message || 'Lỗi khi xóa giao dịch');
  }
};

const createFakeTransaction = async () => {
  creating.value = true;
  try {
    await api.post('/api/payment/transactions/fake');
    ElMessage.success('Đã tạo giao dịch test! Bấm "Làm mới" để xem.');
    fetchTransactions(); // Auto refresh after create
  } catch (e) {
    console.error(e);
    ElMessage.error(e.response?.data?.message || 'Lỗi tạo GD test!');
  } finally {
    creating.value = false;
  }
};

onMounted(fetchTransactions);
</script>
