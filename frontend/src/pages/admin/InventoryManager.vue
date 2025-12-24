<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-purple-600"><Box /></el-icon> Quản lý Nhập Kho
      </h2>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <el-input
          v-model="searchText"
          placeholder="Tìm theo tên sách..."
          clearable
          style="width: 320px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" @click="fetchData">
          <el-icon class="mr-1"><Refresh /></el-icon> Làm mới
        </el-button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <el-card shadow="hover" class="border-l-4 border-red-500">
        <div class="text-gray-500 text-xs uppercase font-bold">Sắp hết hàng (&lt; 10)</div>
        <div class="text-2xl font-bold text-red-600 mt-1">
          {{ lowStockCount }} <span class="text-sm text-gray-400">cuốn</span>
        </div>
      </el-card>

      <el-card shadow="hover" class="border-l-4 border-green-500">
        <div class="text-gray-500 text-xs uppercase font-bold">Tồn kho an toàn</div>
        <div class="text-2xl font-bold text-green-600 mt-1">
          {{ safeStockCount }} <span class="text-sm text-gray-400">cuốn</span>
        </div>
      </el-card>

      <el-card shadow="hover" class="border-l-4 border-blue-500">
        <div class="text-gray-500 text-xs uppercase font-bold">Tổng giá trị kho</div>
        <div class="text-2xl font-bold text-blue-600 mt-1">{{ formatCurrency(totalValue) }}</div>
      </el-card>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table :data="filteredBooks" style="width: 100%" v-loading="loading" stripe border height="500">
        <el-table-column label="#" width="60" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>

        <el-table-column label="Thông tin sách" min-width="250">
          <template #default="scope">
            <div class="flex items-center gap-3">
              <img :src="getImageUrl(scope.row)" class="w-10 h-14 object-cover rounded border" />
              <div>
                <div class="font-bold text-gray-700">{{ scope.row.book_title }}</div>
                <div class="text-xs text-gray-400">ISBN: {{ scope.row.isbn || 'N/A' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="stock_quantity" label="Tồn kho hiện tại" width="150" align="center" sortable>
          <template #default="scope">
            <el-tag :type="scope.row.stock_quantity < 10 ? 'danger' : 'success'" effect="dark" size="large">
              {{ scope.row.stock_quantity }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Hành động" width="150" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="openImportDialog(scope.row)">
              <el-icon class="mr-1"><Plus /></el-icon> Nhập hàng
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="Phiếu Nhập Hàng" width="400px">
      <div v-if="selectedBook" class="text-center mb-4">
        <div class="font-bold text-lg text-gray-800">{{ selectedBook.book_title }}</div>
        <div class="text-gray-500">
          Tồn kho hiện tại: <span class="font-bold text-black">{{ selectedBook.stock_quantity }}</span>
        </div>
      </div>

      <el-form class="mt-4">
        <el-form-item label="Số lượng nhập thêm">
          <el-input-number v-model="importQuantity" :min="1" :step="10" size="large" style="width: 100%" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleImport" :loading="submitting">Xác nhận nhập</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Box, Refresh, Plus, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const books = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);

const selectedBook = ref(null);
const importQuantity = ref(10);

const searchText = ref('');

// ✅ Lọc theo tên sách
const filteredBooks = computed(() => {
  const q = (searchText.value || '').trim().toLowerCase();
  if (!q) return books.value;
  return books.value.filter((b) => (b.book_title || '').toLowerCase().includes(q));
});

// --- TÍNH TOÁN THỐNG KÊ (tính theo danh sách đã lọc để khớp UI) ---
const lowStockCount = computed(() => filteredBooks.value.filter((b) => b.stock_quantity < 10).length);
const safeStockCount = computed(() => filteredBooks.value.filter((b) => b.stock_quantity >= 10).length);
const totalValue = computed(() =>
  filteredBooks.value.reduce((sum, b) => sum + (Number(b.price || 0) * Number(b.stock_quantity || 0)), 0)
);

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const getImageUrl = (book) =>
  book.BookImages && book.BookImages.length > 0 ? book.BookImages[0].book_image_url : 'https://placehold.co/100x150';

// --- API ---
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/books');
    books.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
  } catch (error) {
    console.error(error);
    ElMessage.error('Lỗi tải dữ liệu kho');
  } finally {
    loading.value = false;
  }
};

const openImportDialog = (book) => {
  selectedBook.value = book;
  importQuantity.value = 10;
  dialogVisible.value = true;
};

const handleImport = async () => {
  if (!selectedBook.value) return;

  submitting.value = true;
  try {
    await api.post('/api/books/import', {
      book_id: selectedBook.value.book_id,
      quantity: importQuantity.value,
    });

    ElMessage.success(`Đã nhập thêm ${importQuantity.value} cuốn!`);
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error(error);
    ElMessage.error('Lỗi khi nhập hàng!');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => fetchData());
</script>
