<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-blue-600"><User /></el-icon>
        Quản lý Người dùng
      </h2>

      <!-- Search + Add -->
      <div class="flex items-center gap-3">
        <el-input
          v-model="searchText"
          placeholder="Tìm theo tên, email, sđt..."
          clearable
          style="width: 320px"
          @keyup.enter="fetchData"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button v-if="isAdmin" type="primary" size="large" @click="openDialog()">
          <el-icon class="mr-1"><Plus /></el-icon> Thêm User
        </el-button>
      </div>
    </div>

    <!-- Filter Role -->
    <div class="mb-4">
        <el-radio-group v-model="filterRole" @change="fetchData">
            <el-radio-button label="">Tất cả</el-radio-button>
            <el-radio-button v-if="isAdmin" label="admin">Admin</el-radio-button>
            <el-radio-button v-if="isAdmin" label="employee">Nhân viên</el-radio-button>
            <el-radio-button label="customer">Khách hàng</el-radio-button>
        </el-radio-group>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="users" style="width: 100%" v-loading="loading" stripe>
        <el-table-column label="#" width="60" align="center">
          <template #default="scope">
            {{ (pagination.page - 1) * pagination.limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="Họ tên" min-width="180">
            <template #default="scope">
                <div class="font-bold">{{ scope.row.full_name }}</div>
                <div class="text-xs text-gray-400">{{ scope.row.email }}</div>
            </template>
        </el-table-column>

        <el-table-column prop="phone" label="Số điện thoại" width="150" />

        <el-table-column prop="role" label="Vai trò" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getRoleTag(scope.row.role)">
              {{ getRoleName(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Ngày tạo" width="150" align="center">
            <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
            </template>
        </el-table-column>

        <el-table-column label="Hành động" width="140" align="center" fixed="right" v-if="isAdmin">
          <template #default="scope">
            <div class="flex justify-center gap-2">
              <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
              
              <!-- Không cho xóa chính mình và không xóa Admin khác nếu không phải Super Admin (logic FE hỗ trợ) -->
              <el-popconfirm 
                v-if="scope.row.user_id !== currentUser?.user_id"
                title="Xóa người dùng này?" 
                @confirm="handleDelete(scope.row.user_id)" 
                width="220"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle size="small" :disabled="scope.row.role === 'admin'" />
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagination.total"
          :page-size="pagination.limit"
          :current-page="pagination.page"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Cập nhật User' : 'Thêm User Mới'"
      width="500px"
      destroy-on-close
    >
      <el-form :model="form" label-width="120px" label-position="top">
        <el-form-item label="Họ tên" required>
            <el-input v-model="form.full_name" placeholder="Nhập họ tên" />
        </el-form-item>

        <el-form-item label="Email" required>
            <el-input v-model="form.email" placeholder="email@example.com" :disabled="isEdit" />
        </el-form-item>
        
        <el-form-item label="Mật khẩu" :required="!isEdit">
            <el-input v-model="form.password" type="password" show-password placeholder="Để trống nếu không đổi" />
        </el-form-item>

        <el-form-item label="Số điện thoại">
            <el-input v-model="form.phone" placeholder="09xxxx" />
        </el-form-item>

        <el-form-item label="Vai trò" required>
            <el-select v-model="form.role" placeholder="Chọn vai trò">
                <el-option label="Khách hàng" value="customer" />
                <el-option label="Nhân viên" value="employee" />
                <el-option label="Admin" value="admin" />
            </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy bỏ</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting">
            {{ isEdit ? 'Lưu thay đổi' : 'Tạo mới' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { User, Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const isAdmin = computed(() => authStore.user?.role === 'admin');

const users = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);

const searchText = ref('');
const filterRole = ref(''); // '' = All

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0
});

const form = reactive({
    user_id: null,
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
});

const fetchData = async () => {
    loading.value = true;
    try {
        const res = await api.get('/api/api/users', {
            params: {
                page: pagination.page,
                limit: pagination.limit,
                search: searchText.value || undefined,
                role: filterRole.value || undefined
            }
        });
        users.value = res.data.data;
        pagination.total = res.data.pagination.total;
    } catch (error) {
        ElMessage.error('Lỗi tải danh sách users');
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (page) => {
    pagination.page = page;
    fetchData();
};

const getRoleName = (role) => {
    switch(role) {
        case 'admin': return 'Admin';
        case 'employee': return 'Nhân viên';
        default: return 'Khách hàng';
    }
};

const getRoleTag = (role) => {
    switch(role) {
        case 'admin': return 'danger';
        case 'employee': return 'warning';
        default: return 'info';
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
};

const openDialog = (user = null) => {
    isEdit.value = !!user;
    dialogVisible.value = true;
    if (user) {
        form.user_id = user.user_id;
        form.full_name = user.full_name;
        form.email = user.email;
        form.phone = user.phone;
        form.role = user.role;
        form.password = ''; 
    } else {
        form.user_id = null;
        form.full_name = '';
        form.email = '';
        form.password = '';
        form.phone = '';
        form.role = 'customer';
    }
};

const handleSave = async () => {
    if (!form.full_name || !form.email || (!isEdit.value && !form.password)) {
        return ElMessage.warning('Vui lòng điền đủ thông tin');
    }

    submitting.value = true;
    try {
        if (isEdit.value) {
            await api.put(`/api/users/${form.user_id}`, form);
            ElMessage.success('Cập nhật thành công');
        } else {
            await api.post('/api/users', form);
            ElMessage.success('Tạo user thành công');
        }
        dialogVisible.value = false;
        fetchData();
    } catch (error) {
        console.error(error);
        ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (id) => {
    try {
        await api.delete(`/api/users/${id}`);
        ElMessage.success('Xóa user thành công');
        fetchData();
    } catch (error) {
         ElMessage.error(error.response?.data?.message || 'Không thể xóa');
    }
};

onMounted(() => {
    // Mặc định Employee chỉ xem Customer
    if (!isAdmin.value) {
        filterRole.value = 'customer';
    }
    fetchData();
});
</script>
