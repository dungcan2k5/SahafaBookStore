<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-indigo-600"><List /></el-icon> Quản lý Đơn hàng
      </h2>

      <div class="flex items-center gap-3">
        <el-input
          v-model="searchText"
          placeholder="Tìm theo mã đơn, tên khách, SĐT..."
          clearable
          style="width: 360px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="warning" plain @click="createFakeOrder" :loading="creating">
          <el-icon class="mr-1"><MagicStick /></el-icon> Tạo Đơn Test
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="filteredOrders" style="width: 100%" v-loading="loading" stripe border height="500">
        <el-table-column prop="order_id" label="Mã Đơn" width="90" align="center">
          <template #default="scope">
            <span class="font-bold text-gray-600">#{{ scope.row.order_id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Khách hàng" min-width="200">
          <template #default="scope">
            <div class="flex flex-col">
              <span class="font-bold text-gray-800">
                {{ scope.row.User?.full_name || 'Khách vãng lai' }}
              </span>
              <span class="text-xs text-gray-400">
                {{ scope.row.User?.email }} - {{ scope.row.User?.phone || '...' }}
              </span>
              <div class="mt-1 text-xs text-gray-500 bg-gray-50 p-1 rounded border border-dashed">
                <el-icon><Location /></el-icon>
                {{ typeof scope.row.Address === 'object' ? scope.row.Address?.address_detail : scope.row.shipping_address }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Tổng tiền" width="130" align="right">
          <template #default="scope">
            <div class="text-red-600 font-bold text-base">
              {{ formatCurrency(scope.row.final_amount || scope.row.total_amount) }}
            </div>
            <div v-if="scope.row.voucher_id" class="text-xs text-green-600">Đã dùng Voucher</div>
          </template>
        </el-table-column>

        <el-table-column prop="order_status" label="Trạng thái" width="140" align="center">
          <template #default="scope">
            <el-tag :type="getStatusColor(scope.row.order_status)" effect="dark" class="uppercase font-bold">
              {{ formatStatus(scope.row.order_status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="payment_status" label="Thanh toán" width="160" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.payment_status === 'paid' ? 'success' : 'info'" effect="light" size="small">
              {{ scope.row.payment_status === 'paid' ? 'Đã TT' : 'Chưa TT' }}
            </el-tag>
            
            <div class="text-xs text-gray-400 mt-1 uppercase mb-1">
                {{ scope.row.payment_method || '...' }}
            </div>

            <div v-if="scope.row.Transactions && scope.row.Transactions.length > 0" class="border-t pt-1 mt-1">
                <div v-for="tx in scope.row.Transactions" :key="tx.transaction_id" class="text-xs">
                    <span class="text-gray-500">GD:</span> 
                    <span class="font-mono font-bold text-blue-600 cursor-pointer" title="Copy mã này để tìm bên Giao dịch">
                        #{{ tx.transaction_id }}
                    </span>
                    <span v-if="tx.status === 'success'" class="text-green-500 ml-1">✔</span>
                    <span v-else class="text-orange-500 ml-1">⏳</span>
                </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Xử lý" width="170" align="center" fixed="right">
          <template #default="scope">
            <div class="flex flex-col gap-2">
              <el-button
                v-if="scope.row.order_status === 'pending'"
                type="primary"
                size="small"
                @click="updateStatus(scope.row.order_id, 'processing')"
              >
                Duyệt đơn
              </el-button>

              <el-button
                v-if="scope.row.order_status === 'processing'"
                type="warning"
                size="small"
                @click="updateStatus(scope.row.order_id, 'shipped')"
              >
                Gửi hàng
              </el-button>

              <el-button
                v-if="scope.row.order_status === 'shipped'"
                type="success"
                size="small"
                @click="updateStatus(scope.row.order_id, 'delivered')"
              >
                Đã giao
              </el-button>

              <el-popconfirm
                v-if="['pending', 'processing'].includes(scope.row.order_status)"
                title="Hủy đơn hàng này?"
                confirm-button-text="Hủy"
                cancel-button-text="Không"
                @confirm="updateStatus(scope.row.order_id, 'cancelled')"
              >
                <template #reference>
                  <el-button type="danger" size="small" plain>Hủy bỏ</el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm
                title="Xóa đơn hàng này vĩnh viễn?"
                confirm-button-text="Xóa"
                cancel-button-text="Không"
                @confirm="handleDelete(scope.row.order_id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" plain>Xóa</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { List, MagicStick, Location, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const orders = ref([]);
const loading = ref(false);
const creating = ref(false);
const searchText = ref('');

// --- HELPERS ---
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatStatus = (status) => {
  const map = {
    pending: 'Chờ xử lý',
    processing: 'Đang chuẩn bị',
    shipped: 'Đang giao',
    delivered: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  return map[status] || status;
};

const getStatusColor = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'warning',
    delivered: 'success',
    cancelled: 'info',
  };
  return map[status] || 'info';
};

// FILTER: mã đơn / tên khách / sđt
const filteredOrders = computed(() => {
  const q = (searchText.value || '').trim().toLowerCase();
  if (!q) return orders.value;

  return orders.value.filter((o) => {
    const orderId = String(o.order_id ?? '').toLowerCase();
    const fullName = String(o.User?.full_name ?? '').toLowerCase();
    const phone = String(o.User?.phone ?? '').toLowerCase();
    return orderId.includes(q) || fullName.includes(q) || phone.includes(q);
  });
});

// --- API ---
const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/orders/admin');
    orders.value = res.data.data || [];
  } catch (e) {
    console.error(e);
    ElMessage.error('Lỗi tải danh sách đơn hàng!');
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, newStatus) => {
  try {
    await api.put(`/api/orders/admin/${id}`, { order_status: newStatus });
    ElMessage.success('Cập nhật thành công!');
    fetchOrders();
  } catch (e) {
    console.error(e);
    ElMessage.error('Lỗi cập nhật trạng thái!');
  }
};

const handleDelete = async (orderId) => {
  try {
    await api.delete(`/api/orders/admin/${orderId}`);
    ElMessage.success('Đã xóa đơn hàng vĩnh viễn!');
    fetchOrders();
  } catch (e) {
    console.error(e);
    ElMessage.error(e.response?.data?.message || 'Lỗi khi xóa đơn!');
  }
};

const createFakeOrder = async () => {
  creating.value = true;
  try {
    await api.post('/api/orders/admin/fake');
    ElMessage.success('Đã tạo đơn hàng giả!');
    fetchOrders();
  } catch (e) {
    console.error(e);
    ElMessage.error('Lỗi tạo đơn giả!');
  } finally {
    creating.value = false;
  }
};

onMounted(fetchOrders);
</script>
