<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-green-600"><User /></el-icon> Quản lý Tác giả
      </h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon> Thêm Tác giả
      </el-button>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="authors" style="width: 100%" v-loading="loading" stripe border>
        <el-table-column label="#" width="60" align="center">
           <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        
        <el-table-column prop="author_name" label="Tên Tác giả" />
        
        <el-table-column prop="author_slug" label="Slug (Đường dẫn)" />

        <el-table-column label="Hành động" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
            <el-popconfirm title="Xóa tác giả này?" @confirm="handleDelete(scope.row.author_id)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle size="small" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Sửa Tác giả' : 'Thêm Tác giả'" width="400px">
      <el-form :model="form" class="mt-2">
        <el-form-item label="Tên tác giả">
          <el-input v-model="form.author_name" placeholder="Nhập tên..." @input="generateSlug" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="form.author_slug" disabled />
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
import { User, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const authors = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const form = reactive({ author_id: null, author_name: '', author_slug: '' });

const generateSlug = (val) => {
    if (!val) return;
    form.author_slug = val.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

const fetchAuthors = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/books/authors');
    authors.value = res.data.data || [];
  } catch (error) { ElMessage.error('Lỗi tải dữ liệu'); } 
  finally { loading.value = false; }
};

const openDialog = (item = null) => {
  isEdit.value = !!item;
  dialogVisible.value = true;
  if (item) Object.assign(form, item);
  else { form.author_id = null; form.author_name = ''; form.author_slug = ''; }
};

const handleSave = async () => {
  if (!form.author_name) return ElMessage.warning('Chưa nhập tên!');
  submitting.value = true;
  try {
    if (isEdit.value) await api.put(`/api/books/authors/${form.author_id}`, form);
    else await api.post('/api/books/authors', form);
    
    ElMessage.success('Thành công!');
    dialogVisible.value = false;
    fetchAuthors();
  } catch (error) { ElMessage.error('Lỗi lưu dữ liệu!'); } 
  finally { submitting.value = false; }
};

const handleDelete = async (id) => {
  try {
    await api.delete(`/api/books/authors/${id}`);
    ElMessage.success('Đã xóa!');
    fetchAuthors();
  } catch (error) { 
      // API backend mình đã code chặn xóa nếu tác giả đang có sách
      // nên lỗi này sẽ hiện ra message của backend
      ElMessage.error(error.response?.data?.message || 'Không thể xóa!'); 
  }
};

onMounted(() => fetchAuthors());
</script>