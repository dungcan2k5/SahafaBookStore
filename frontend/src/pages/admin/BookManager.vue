<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-blue-600"><Reading /></el-icon>
        Quản lý Sách
      </h2>
      <el-button type="primary" size="large" @click="openDialog()">
        <el-icon class="mr-1"><Plus /></el-icon> Thêm Sách Mới
      </el-button>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="books" style="width: 100%" v-loading="loading" stripe>
        <el-table-column label="#" width="60" align="center">
            <template #default="scope">
                {{ scope.$index + 1 }}
            </template>
        </el-table-column>  
        
        <el-table-column label="Hình ảnh" width="100" align="center">
          <template #default="scope">
            <el-image 
              style="width: 50px; height: 70px; border-radius: 4px;"
              :src="getImageUrl(scope.row)"
              :preview-src-list="[getImageUrl(scope.row)]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column label="Thông tin sách" min-width="250">
           <template #default="scope">
              <div class="font-bold text-gray-700 text-base">{{ scope.row.book_title }}</div>
              <div class="flex gap-2 mt-1">
                  <el-tag size="small" type="info">{{ scope.row.Author?.author_name || 'Tác giả?' }}</el-tag>
                  <el-tag size="small" type="warning">{{ scope.row.Genre?.genre_name || 'Thể loại?' }}</el-tag>
              </div>
              <div class="text-xs text-gray-400 mt-1">ISBN: {{ scope.row.isbn || '---' }}</div>
           </template>
        </el-table-column>

        <el-table-column label="Giá bán" width="120" sortable prop="price">
          <template #default="scope">
            <div class="text-red-600 font-bold">{{ formatCurrency(scope.row.price) }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="stock_quantity" label="Tồn kho" width="100" align="center">
           <template #default="scope">
              <el-tag :type="scope.row.stock_quantity > 0 ? 'success' : 'danger'" effect="light">
                {{ scope.row.stock_quantity }}
              </el-tag>
           </template>
        </el-table-column>

        <el-table-column label="Hành động" width="120" align="center" fixed="right">
          <template #default="scope">
            <div class="flex justify-center gap-2">
                <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
                <el-popconfirm title="Xóa sách này?" @confirm="handleDelete(scope.row.book_id)" width="200">
                <template #reference>
                    <el-button type="danger" :icon="Delete" circle size="small" />
                </template>
                </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Cập nhật Sách' : 'Thêm Sách Mới'"
      width="700px"
      destroy-on-close
      top="5vh"
    >
      <el-form :model="form" label-width="120px" class="mt-2" label-position="top">
        
        <div class="grid grid-cols-2 gap-4">
             <el-form-item label="Tên sách" required>
                <el-input v-model="form.book_title" placeholder="Nhập tên sách..." @input="generateSlug" />
            </el-form-item>
             <el-form-item label="Mã ISBN" required>
                <el-input v-model="form.isbn" placeholder="VD: 978-604-..." />
            </el-form-item>
        </div>

        <el-form-item label="Slug URL (Tự động)">
          <el-input v-model="form.book_slug" placeholder="tu-dong-tao-slug" disabled />
        </el-form-item>

        <div class="grid grid-cols-3 gap-4">
            <el-form-item label="Tác giả">
              <el-select v-model="form.author_id" placeholder="Chọn tác giả" filterable>
                 <el-option 
                    v-for="item in authors" 
                    :key="item.author_id" 
                    :label="item.author_name" 
                    :value="item.author_id" 
                 />
              </el-select>
           </el-form-item>

           <el-form-item label="Thể loại">
              <el-select v-model="form.genre_id" placeholder="Chọn thể loại" filterable>
                 <el-option 
                    v-for="item in genres" 
                    :key="item.genre_id" 
                    :label="item.genre_name" 
                    :value="item.genre_id" 
                 />
              </el-select>
           </el-form-item>

           <el-form-item label="Nhà xuất bản">
              <el-select v-model="form.publisher_id" placeholder="Chọn NXB" filterable>
                 <el-option 
                    v-for="item in publishers" 
                    :key="item.publisher_id" 
                    :label="item.publisher_name" 
                    :value="item.publisher_id" 
                 />
              </el-select>
           </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <el-form-item label="Giá bán (VNĐ)">
                <el-input-number v-model="form.price" :min="0" :step="1000" style="width: 100%" controls-position="right" />
            </el-form-item>
            <el-form-item label="Số lượng tồn kho">
                <el-input-number v-model="form.stock_quantity" :min="0" style="width: 100%" controls-position="right" />
            </el-form-item>
        </div>
        
        <el-form-item label="Link Ảnh Bìa">
           <el-input v-model="form.image_url" placeholder="https://..." clearable>
              <template #prepend>Http://</template>
           </el-input>
           <div v-if="form.image_url" class="mt-2">
              <img :src="form.image_url" class="h-20 rounded border object-cover" onerror="this.style.display='none'"/>
           </div>
        </el-form-item>

      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy bỏ</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting">
            {{ isEdit ? 'Lưu thay đổi' : 'Tạo sách mới' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Reading, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const books = ref([]);
const authors = ref([]);     // Danh sách tác giả
const genres = ref([]);      // Danh sách thể loại
const publishers = ref([]);  // Danh sách NXB

const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);

const form = reactive({
  book_id: null,
  book_title: '',
  book_slug: '',
  isbn: '',
  price: 0,
  stock_quantity: 10,
  image_url: '', 
  author_id: null, 
  genre_id: null,
  publisher_id: null
});

// --- HELPER: Tạo Slug ---
const generateSlug = (val) => {
    if (!val) return;
    form.book_slug = val.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

// --- API: Tải dữ liệu ---
const fetchData = async () => {
  loading.value = true;
  try {
    // Gọi song song 4 API để tiết kiệm thời gian
    const [resBooks, resAuthors, resGenres, resPub] = await Promise.all([
        api.get('/api/books'),
        api.get('/api/books/authors'),
        api.get('/api/books/genres'),
        api.get('/api/books/publishers')
    ]);

    books.value = Array.isArray(resBooks.data) ? resBooks.data : (resBooks.data.data || []);
    
    // Gán dữ liệu cho các menu Select
    authors.value = resAuthors.data.data || [];
    genres.value = resGenres.data.data || [];
    publishers.value = resPub.data.data || [];

  } catch (error) {
    ElMessage.error('Lỗi kết nối Server!');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// --- ACTIONS ---
const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getImageUrl = (book) => {
  if (book.BookImages && book.BookImages.length > 0) return book.BookImages[0].book_image_url;
  return 'https://placehold.co/100x150?text=No+Image';
};

const openDialog = (book = null) => {
  isEdit.value = !!book;
  dialogVisible.value = true;
  
  if (book) {
    Object.assign(form, book);
    if(book.BookImages && book.BookImages.length > 0) form.image_url = book.BookImages[0].book_image_url;
  } else {
    // Reset form
    form.book_id = null;
    form.book_title = '';
    form.book_slug = '';
    form.isbn = '';
    form.price = 0;
    form.stock_quantity = 10;
    form.image_url = '';
    // Mặc định chọn cái đầu tiên nếu có, để đỡ phải bấm
    form.author_id = authors.value.length > 0 ? authors.value[0].author_id : null;
    form.genre_id = genres.value.length > 0 ? genres.value[0].genre_id : null;
    form.publisher_id = publishers.value.length > 0 ? publishers.value[0].publisher_id : null;
  }
};

const handleSave = async () => {
  if(!form.book_title) return ElMessage.warning('Chưa nhập tên sách!');

  submitting.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/api/books/${form.book_id}`, form);
      ElMessage.success('Cập nhật thành công!');
    } else {
      await api.post('/api/books', form);
      ElMessage.success('Thêm mới thành công!');
    }
    dialogVisible.value = false;
    fetchData(); // Load lại data
  } catch (error) {
    ElMessage.error('Có lỗi xảy ra!');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id) => {
  try {
    await api.delete(`/api/books/${id}`);
    ElMessage.success('Đã xóa sách!');
    fetchData();
  } catch (error) {
    ElMessage.error('Không xóa được!');
  }
};

onMounted(() => {
  fetchData();
});
</script>