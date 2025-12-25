<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-orange-500"><CollectionTag /></el-icon> Quản lý Thể loại
      </h2>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <el-input
          v-model="searchText"
          placeholder="Tìm theo tên thể loại..."
          clearable
          style="width: 320px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" @click="openDialog()">
          <el-icon class="mr-1"><Plus /></el-icon> Thêm Thể loại
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="filteredGenres" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="#" width="60" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>

        <el-table-column prop="genre_name" label="Tên Thể loại" />

        <el-table-column prop="genre_slug" label="Slug (Đường dẫn)" />

        <el-table-column label="Hành động" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
            <el-popconfirm title="Xóa thể loại này?" @confirm="handleDelete(scope.row.genre_id)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle size="small" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa Thể loại' : 'Thêm Thể loại'" width="400px">
      <el-form :model="form" class="mt-2">
        <el-form-item label="Tên thể loại">
          <el-input v-model="form.genre_name" placeholder="Nhập tên..." @input="generateSlug" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="form.genre_slug" disabled />
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
import { ref, reactive, onMounted, computed } from 'vue';
import { CollectionTag, Plus, Edit, Delete, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const genres = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);

const searchText = ref('');

const form = reactive({ genre_id: null, genre_name: '', genre_slug: '' });

const generateSlug = (val) => {
  if (!val) return;
  form.genre_slug = val
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

// ✅ lọc local theo tên thể loại
const filteredGenres = computed(() => {
  const q = (searchText.value || '').trim().toLowerCase();
  if (!q) return genres.value;

  return genres.value.filter((g) =>
    (g.genre_name || '').toLowerCase().includes(q)
  );
});

const fetchGenres = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/books/genres');
    const payload = (res && res.data !== undefined) ? res.data : res;
    genres.value = Array.isArray(payload) ? payload : (payload?.data || payload?.rows || []);
  } catch (error) {
    console.error(error);
    ElMessage.error('Lỗi tải dữ liệu');
  } finally {
    loading.value = false;
  }
};

const openDialog = (item = null) => {
  isEdit.value = !!item;
  dialogVisible.value = true;
  if (item) Object.assign(form, item);
  else {
    form.genre_id = null;
    form.genre_name = '';
    form.genre_slug = '';
  }
};

const handleSave = async () => {
  if (!form.genre_name) return ElMessage.warning('Chưa nhập tên!');
  submitting.value = true;
  try {
    if (isEdit.value) await api.put(`/api/books/genres/${form.genre_id}`, form);
    else await api.post('/api/books/genres', form);

    ElMessage.success('Thành công!');
    dialogVisible.value = false;
    await fetchGenres();
  } catch (error) {
    console.error(error);
    ElMessage.error(error.response?.data?.message || 'Lỗi lưu dữ liệu!');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id) => {
  try {
    await api.delete(`/api/books/genres/${id}`);
    ElMessage.success('Đã xóa!');
    await fetchGenres();
  } catch (error) {
    console.error(error);
    ElMessage.error(error.response?.data?.message || 'Không thể xóa!');
  }
};

onMounted(() => fetchGenres());
</script>
