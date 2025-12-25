<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-blue-600"><Reading /></el-icon>
        Quản lý Sách
      </h2>

      <!-- Search + Add -->
      <div class="flex items-center gap-3">
        <el-input
          v-model="searchText"
          placeholder="Tìm theo tên sách..."
          clearable
          style="width: 320px"
          @keyup.enter="fetchData"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" size="large" @click="openDialog()">
          <el-icon class="mr-1"><Plus /></el-icon> Thêm Sách Mới
        </el-button>
      </div>
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

        <el-table-column label="Giá bán" width="140" sortable prop="price">
          <template #default="scope">
            <div class="text-red-600 font-bold">{{ formatCurrency(scope.row.price) }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="stock_quantity" label="Tồn kho" width="120" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.stock_quantity > 0 ? 'success' : 'danger'" effect="light">
              {{ scope.row.stock_quantity }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Hành động" width="140" align="center" fixed="right">
          <template #default="scope">
            <div class="flex justify-center gap-2">
              <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
              <el-popconfirm title="Xóa sách này?" @confirm="handleDelete(scope.row.book_id)" width="220">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle size="small" />
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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Dialog -->
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

        <el-form-item label="Ảnh bìa sách">
          <div class="w-full">
            <el-radio-group v-model="imageSourceType" class="mb-3">
              <el-radio-button label="url">
                <el-icon class="mr-1"><Link /></el-icon> Link URL
              </el-radio-button>
              <el-radio-button label="upload">
                <el-icon class="mr-1"><Upload /></el-icon> Tải ảnh lên
              </el-radio-button>
              <el-radio-button label="server" @click="fetchServerImages">
                <el-icon class="mr-1"><Picture /></el-icon> Chọn từ Server
              </el-radio-button>
            </el-radio-group>

            <!-- 1. Nhập URL -->
            <div v-if="imageSourceType === 'url'">
              <div v-for="(url, index) in form.images" :key="index" class="flex gap-2 mb-2">
                <el-input v-model="form.images[index]" placeholder="https://..." clearable />
                <el-button type="danger" :icon="Delete" circle @click="removeImage(index)" />
              </div>
              <el-button size="small" @click="form.images.push('')">+ Thêm Link</el-button>
              
              <div class="flex gap-2 mt-2 flex-wrap">
                 <img v-for="url in form.images" :key="url" :src="url" class="h-20 rounded border object-cover" onerror="this.style.display='none'" />
              </div>
            </div>

            <!-- 2. Upload Ảnh -->
            <div v-if="imageSourceType === 'upload'">
              <el-upload
                class="upload-demo"
                drag
                action="#"
                :auto-upload="false"
                :multiple="true" 
                :show-file-list="false"
                :on-change="handleFileChange"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Kéo thả nhiều ảnh vào đây hoặc <em>nhấn để tải lên</em>
                </div>
              </el-upload>
              <div v-if="previewImages.length > 0" class="mt-2 flex gap-2 flex-wrap">
                <div v-for="(img, idx) in previewImages" :key="idx" class="relative">
                   <img :src="img" class="h-24 rounded border object-cover" />
                </div>
              </div>
            </div>

            <!-- 3. Chọn từ Server -->
            <div v-if="imageSourceType === 'server'">
              <div v-if="loadingImages" class="text-center py-4">Đang tải ảnh...</div>
              <div v-else>
                <!-- Filter Folder -->
                <div class="mb-2 flex gap-2 overflow-x-auto pb-2">
                  <el-tag 
                    effect="dark" 
                    :type="!currentServerFolder ? 'primary' : 'info'" 
                    class="cursor-pointer"
                    @click="currentServerFolder = null"
                  >
                    Tất cả
                  </el-tag>
                  <el-tag 
                    v-for="folder in serverFolders" 
                    :key="folder"
                    effect="plain" 
                    :type="currentServerFolder === folder ? 'primary' : 'info'" 
                    class="cursor-pointer"
                    @click="currentServerFolder = folder"
                  >
                    <el-icon class="mr-1"><Folder /></el-icon> {{ folder }}
                  </el-tag>
                </div>

                <div class="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto border p-2 rounded">
                  <div 
                    v-for="img in filteredServerImages" 
                    :key="img.name"
                    class="cursor-pointer border-2 rounded hover:border-blue-500 relative group"
                    :class="{'border-blue-600': form.images.includes(img.url), 'border-transparent': !form.images.includes(img.url)}"
                    @click="toggleServerImage(img.url)"
                  >
                    <img :src="img.url" class="w-full h-24 object-cover" />
                    <!-- Checkmark if selected -->
                    <div v-if="form.images.includes(img.url)" class="absolute top-0 right-0 bg-blue-600 text-white text-xs px-1">
                      ✓
                    </div>
                    <!-- Tooltip name -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition">
                       {{ img.name }}
                    </div>
                  </div>
                </div>
                
                <div v-if="form.images.length > 0" class="mt-2 text-sm text-gray-600">
                   Đã chọn: <span class="font-bold">{{ form.images.length }} ảnh</span>
                </div>
              </div>
            </div>
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
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Reading, Plus, Edit, Delete, Search, Upload, Picture, Link, UploadFilled, Folder } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const books = ref([]);
const authors = ref([]);
const genres = ref([]);
const publishers = ref([]);

const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Image handling
const imageSourceType = ref('url'); // 'url', 'upload', 'server'
const selectedFiles = ref([]); // Changed to array
const serverImages = ref([]);
const loadingImages = ref(false);
const previewImages = ref([]); // Changed to array
const currentServerFolder = ref(null); // Filter by folder

// ✅ Search
const searchText = ref('');
let debounceTimer = null;

const form = reactive({
  book_id: null,
  book_title: '',
  book_slug: '',
  isbn: '',
  price: 0,
  stock_quantity: 10,
  images: [], // Changed from image_url to images array
  author_id: null,
  genre_id: null,
  publisher_id: null
});

// Computed properties for Server Images
const serverFolders = computed(() => {
  const folders = new Set(serverImages.value.map(img => img.folder));
  return Array.from(folders);
});

const filteredServerImages = computed(() => {
  if (!currentServerFolder.value) return serverImages.value;
  return serverImages.value.filter(img => img.folder === currentServerFolder.value);
});

// --- HELPER: Tạo Slug ---
const generateSlug = (val) => {
  if (!val) return;
  form.book_slug = val
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// --- API: Tải dữ liệu ---
const fetchData = async () => {
  loading.value = true;
  try {
    const [resBooks, resAuthors, resGenres, resPub] = await Promise.all([
      api.get('/api/api/books', {
        params: {
          search: searchText.value?.trim() || undefined,
          page: currentPage.value,
          limit: pageSize.value
        }
      }),
      api.get('/api/books/authors'),
      api.get('/api/books/genres'),
      api.get('/api/books/publishers')
    ]);

    books.value = resBooks.data?.data || [];
    // Update pagination meta
    if (resBooks.data?.meta) {
        total.value = resBooks.data.meta.total;
    }

    authors.value = resAuthors.data?.data || [];
    genres.value = resGenres.data?.data || [];
    publishers.value = resPub.data?.data || [];
  } catch (error) {
    console.error(error);
    ElMessage.error('Lỗi kết nối Server!');
  } finally {
    loading.value = false;
  }
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // Reset to page 1
  fetchData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

const fetchServerImages = async () => {
  if (serverImages.value.length > 0) return;
  loadingImages.value = true;
  try {
    const res = await api.get('/api/api/uploads/images');
    serverImages.value = res.data?.data || [];
  } catch (error) {
    console.error("Lỗi tải ảnh server:", error);
    ElMessage.error('Không tải được danh sách ảnh!');
  } finally {
    loadingImages.value = false;
  }
};

// ✅ Debounce search khi gõ
watch(searchText, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1; // Reset page when searching
    fetchData();
  }, 400);
});

// --- ACTIONS ---
const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getImageUrl = (book) => {
  if (book.BookImages && book.BookImages.length > 0) return book.BookImages[0].book_image_url;
  return 'https://placehold.co/100x150?text=No+Image';
};

const openDialog = (book = null) => {
  isEdit.value = !!book;
  dialogVisible.value = true;
  
  // Reset image state
  imageSourceType.value = 'url';
  selectedFiles.value = [];
  previewImages.value = [];
  currentServerFolder.value = null;

  if (book) {
    Object.assign(form, book);
    // Convert BookImages array to simple URL array
    form.images = book.BookImages ? book.BookImages.map(img => img.book_image_url) : [];
  } else {
    form.book_id = null;
    form.book_title = '';
    form.book_slug = '';
    form.isbn = '';
    form.price = 0;
    form.stock_quantity = 10;
    form.images = [];

    form.author_id = authors.value.length > 0 ? authors.value[0].author_id : null;
    form.genre_id = genres.value.length > 0 ? genres.value[0].genre_id : null;
    form.publisher_id = publishers.value.length > 0 ? publishers.value[0].publisher_id : null;
  }
};

const handleFileChange = (uploadFile, uploadFiles) => {
  // Element Plus trả về list file
  selectedFiles.value = uploadFiles.map(f => f.raw);
  previewImages.value = uploadFiles.map(f => URL.createObjectURL(f.raw));
};

const toggleServerImage = (url) => {
  const index = form.images.indexOf(url);
  if (index > -1) {
    form.images.splice(index, 1);
  } else {
    form.images.push(url);
  }
};

const removeImage = (index) => {
  form.images.splice(index, 1);
};

const handleSave = async () => {
  if (!form.book_title) return ElMessage.warning('Chưa nhập tên sách!');
  if (!form.isbn) return ElMessage.warning('Chưa nhập ISBN!');

  submitting.value = true;
  try {
    let payload = { ...form };
    let isMultipart = false;

    // Xử lý logic upload
    if (imageSourceType.value === 'upload' && selectedFiles.value.length > 0) {
      isMultipart = true;
      const formData = new FormData();
      
      // Append các trường text
      Object.keys(form).forEach(key => {
        if (key === 'images') return; // Skip images array for now
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      
      // Append files
      selectedFiles.value.forEach(file => {
        formData.append('images', file);
      });
      
      // Append existing images (if any) to keep them?
      // Backend expects 'images' field for URLs as well?
      // Note: multer handles 'images' files. Body parser handles 'images' text.
      // If we mix, we need to be careful.
      // My backend logic checks req.files AND req.body.images separately.
      if (form.images.length > 0) {
          form.images.forEach(url => formData.append('images', url));
      }

      payload = formData;
    } 
    
    const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

    if (isEdit.value) {
      await api.put(`/api/books/${form.book_id}`, payload, config);
      ElMessage.success('Cập nhật thành công!');
    } else {
      await api.post('/api/books', payload, config);
      ElMessage.success('Thêm mới thành công!');
    }
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error(error);
    ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra!');
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
    console.error(error);
    ElMessage.error(error.response?.data?.message || 'Không xóa được!');
  }
};

onMounted(() => {
  fetchData();
});
</script>
