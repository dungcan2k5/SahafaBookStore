<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-pink-600"><Ticket /></el-icon> Quản lý Mã Giảm Giá
      </h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon> Tạo Voucher Mới
      </el-button>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="vouchers" style="width: 100%" v-loading="loading" stripe border>
        
        <el-table-column label="Mã Voucher" width="180">
            <template #default="scope">
                <div class="font-bold text-red-600 tracking-wider text-base">{{ scope.row.code }}</div>
                <div class="text-xs text-gray-400">GIẢM TIỀN MẶT</div>
            </template>
        </el-table-column>

        <el-table-column label="Giá trị giảm" width="180">
           <template #default="scope">
              <div class="font-bold text-green-600 text-lg">
                  -{{ formatCurrency(scope.row.value) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                  Đơn tối thiểu: {{ formatCurrency(scope.row.min_order_value) }}
              </div>
           </template>
        </el-table-column>

        <el-table-column label="Thời gian hiệu lực" min-width="220">
          <template #default="scope">
            <div class="text-sm">
                <div class="flex items-center gap-1"><el-icon><Calendar /></el-icon> {{ formatDate(scope.row.start_at) }}</div>
                <div class="flex items-center gap-1 text-gray-500"><el-icon><Right /></el-icon> {{ formatDate(scope.row.end_at) }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Trạng thái" width="140" align="center">
           <template #default="scope">
              <el-tag :type="getStatusInfo(scope.row).type" effect="light">
                {{ getStatusInfo(scope.row).text }}
              </el-tag>
           </template>
        </el-table-column>

        <el-table-column label="Lượt dùng" width="100" align="center">
           <template #default="scope">
              <span class="font-bold">{{ scope.row.usage_limit }}</span>
           </template>
        </el-table-column>

        <el-table-column label="Hành động" width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
            <el-popconfirm title="Xóa voucher này?" @confirm="handleDelete(scope.row.voucher_id)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle size="small" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa Voucher' : 'Tạo Voucher Mới'" width="550px" destroy-on-close>
      <el-form :model="form" label-width="140px" label-position="left" class="mt-2">
        
        <el-form-item label="Mã Code" required>
            <el-input 
                v-model="form.code" 
                placeholder="VD: SALE50K" 
                :disabled="isEdit"
                @input="val => form.code = val.toUpperCase().replace(/\s/g, '')" 
            />
            <div v-if="isEdit" class="text-xs text-gray-400">Không thể sửa mã code</div>
        </el-form-item>

        <el-form-item label="Số tiền giảm (VNĐ)" required>
            <el-input-number v-model="form.value" :min="1000" :step="5000" style="width: 100%" />
            <div class="text-xs text-gray-400 mt-1">Ví dụ: Nhập 50000 để giảm 50.000đ</div>
        </el-form-item>

        <el-form-item label="Đơn tối thiểu (VNĐ)">
            <el-input-number v-model="form.min_order_value" :min="0" :step="10000" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Số lượng phát hành">
            <el-input-number v-model="form.usage_limit" :min="1" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Thời gian áp dụng">
            <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="Đến"
                start-placeholder="Bắt đầu"
                end-placeholder="Kết thúc"
                style="width: 100%"
                format="DD/MM/YYYY HH:mm"
            />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting">Lưu lại</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Ticket, Plus, Edit, Delete, Calendar, Right } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const vouchers = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const dateRange = ref([]); 

const form = reactive({
    voucher_id: null,
    code: '',
    discount_type: 'fixed', // MẶC ĐỊNH LÀ FIXED (GIẢM TIỀN MẶT)
    value: 0,
    min_order_value: 0,
    usage_limit: 100,
    start_at: null,
    end_at: null
});

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Logic trạng thái
const getStatusInfo = (voucher) => {
    const now = new Date();
    const start = new Date(voucher.start_at);
    const end = new Date(voucher.end_at);

    if (now < start) return { text: 'Chưa bắt đầu', type: 'warning' };
    if (now > end) return { text: 'Đã kết thúc', type: 'info' };
    if (voucher.usage_limit <= 0) return { text: 'Hết lượt', type: 'danger' };
    return { text: 'Đang diễn ra', type: 'success' };
};

// --- API ACTIONS ---
const fetchVouchers = async () => {
  loading.value = true;
  try {
    // Gọi API Admin (Phải đảm bảo backend đã có route này)
    const res = await api.get('/api/vouchers/admin');
    vouchers.value = res.data.data || [];
  } catch (error) { 
      console.error(error);
      ElMessage.error('Lỗi tải danh sách voucher (Kiểm tra lại Backend Route /admin)!'); 
  } finally { loading.value = false; }
};

const openDialog = (item = null) => {
  isEdit.value = !!item;
  dialogVisible.value = true;
  
  if (item) {
    Object.assign(form, item);
    if(item.start_at && item.end_at) {
        dateRange.value = [new Date(item.start_at), new Date(item.end_at)];
    }
  } else {
    // Reset form
    form.voucher_id = null;
    form.code = '';
    form.discount_type = 'fixed'; // Luôn là fixed
    form.value = 10000;
    form.min_order_value = 50000;
    form.usage_limit = 100;
    // Mặc định 7 ngày tới
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    dateRange.value = [now, nextWeek];
  }
};

const handleSave = async () => {
  if (!form.code) return ElMessage.warning('Chưa nhập mã code!');
  if (!dateRange.value || dateRange.value.length < 2) return ElMessage.warning('Chưa chọn thời gian!');

  submitting.value = true;
  
  form.start_at = dateRange.value[0];
  form.end_at = dateRange.value[1];
  form.discount_type = 'fixed'; // Đảm bảo luôn gửi lên là fixed

  try {
    if (isEdit.value) {
      await api.put(`/api/vouchers/${form.voucher_id}`, form);
      ElMessage.success('Cập nhật thành công!');
    } else {
      await api.post('/api/vouchers', form);
      ElMessage.success('Tạo voucher thành công!');
    }
    dialogVisible.value = false;
    fetchVouchers();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra!');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id) => {
  try {
    await api.delete(`/api/vouchers/${id}`);
    ElMessage.success('Đã xóa voucher!');
    fetchVouchers();
  } catch (error) {
    ElMessage.error('Lỗi khi xóa!');
  }
};

onMounted(() => fetchVouchers());
</script>