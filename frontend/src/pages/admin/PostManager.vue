<template>
  <div>
    <div class="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <el-icon class="text-indigo-600"><DocumentCopy /></el-icon> Quản lý Bài Viết (Posts)
      </h2>
      
      <div class="flex items-center gap-2">
        <el-input
          v-model="searchText"
          placeholder="Tìm theo tiêu đề, slug..."
          clearable
          style="width: 250px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button @click="fetchPosts" :loading="loading" icon="Refresh">
          Làm mới
        </el-button>

        <el-button type="primary" @click="openDialog()">
          <el-icon class="mr-1"><Plus /></el-icon> Viết bài mới
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="rounded-lg border-none">
      <el-table ref="tableRef" :data="filteredPosts" style="width: 100%" v-loading="loading" stripe border>
        
        <el-table-column label="Ảnh bìa" width="120" align="center">
            <template #default="scope">
                <el-image 
                    class="w-20 h-14 rounded object-cover border"
                    :src="scope.row.thumbnail_url || 'https://via.placeholder.com/150'" 
                    fit="cover"
                    :preview-src-list="[scope.row.thumbnail_url]"
                    preview-teleported
                />
            </template>
        </el-table-column>

        <el-table-column label="Thông tin bài viết" min-width="250">
            <template #default="scope">
                <div class="font-bold text-gray-800 text-base mb-1 hover:text-blue-600 cursor-pointer" @click="viewPost(scope.row)">
                    {{ scope.row.title }}
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                    <el-tag size="small" type="info">/{{ scope.row.post_slug }}</el-tag>
                    <el-tag v-if="scope.row.Category" size="small" effect="plain">{{ scope.row.Category.category_name }}</el-tag>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="120" align="center">
            <template #default="scope">
                <el-tag :type="scope.row.status === 'published' ? 'success' : 'warning'" effect="dark">
                    {{ scope.row.status === 'published' ? 'Đã đăng' : 'Bản nháp' }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column label="Hành động" width="160" align="center" fixed="right">
          <template #default="scope">
            <el-tooltip content="Xem bài viết trên web" placement="top">
                <el-button type="success" :icon="View" circle size="small" plain @click="viewPost(scope.row)" />
            </el-tooltip>
            
            <el-button type="primary" :icon="Edit" circle size="small" @click="openDialog(scope.row)" />
            
            <el-popconfirm title="Xóa bài viết này?" @confirm="handleDelete(scope.row.post_id)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle size="small" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Cập nhật bài viết' : 'Viết bài mới'" width="800px" destroy-on-close>
      <el-form :model="form" label-position="top" class="mt-2">
        
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form-item label="Tiêu đề bài viết" required>
                    <el-input v-model="form.title" placeholder="Nhập tiêu đề..." @input="generateSlug" />
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="Trạng thái">
                    <el-select v-model="form.status" class="w-full">
                        <el-option label="Công khai (Published)" value="published" />
                        <el-option label="Bản nháp (Draft)" value="draft" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="Đường dẫn (Slug)" required>
            <el-input v-model="form.post_slug" placeholder="tu-dong-tao-slug-khi-nhap-tieu-de">
                <template #prepend>sahafa.com/news/</template>
            </el-input>
        </el-form-item>

        <el-form-item label="Link ảnh bìa (Thumbnail URL)">
            <el-input v-model="form.thumbnail_url" placeholder="https://example.com/image.jpg" />
            <div v-if="form.thumbnail_url" class="mt-2 p-2 border rounded bg-gray-50 w-full h-40 flex items-center justify-center">
                <img :src="form.thumbnail_url" class="max-h-full object-contain" />
            </div>
        </el-form-item>

        <el-form-item label="Nội dung bài viết">
            <el-input 
                v-model="form.content" 
                type="textarea" 
                :rows="8" 
                placeholder="Nhập nội dung chi tiết..." 
            />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleSave" :loading="submitting">
            {{ isEdit ? 'Cập nhật' : 'Đăng bài' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'; // Import computed
import { DocumentCopy, Plus, Edit, Delete, Search, View, Refresh } from '@element-plus/icons-vue'; // Import icon Search, View
import { ElMessage } from 'element-plus';
import api from '@/services/api';
import { useRouter } from 'vue-router'; // Import router

const router = useRouter();
const posts = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const searchText = ref(''); // Biến tìm kiếm

const form = reactive({
    post_id: null,
    title: '',
    post_slug: '',      
    thumbnail_url: '',  
    content: '',
    category_id: null,
    status: 'published'
});

// --- TÌM KIẾM ---
const filteredPosts = computed(() => {
    const q = searchText.value.trim().toLowerCase();
    if (!q) return posts.value;
    
    return posts.value.filter(p => {
        const title = (p.title || '').toLowerCase();
        const slug = (p.post_slug || '').toLowerCase();
        return title.includes(q) || slug.includes(q);
    });
});

// --- HÀM XEM BÀI VIẾT ---
const viewPost = (post) => {
    // Giả sử đường dẫn public của bạn là /news/:slug
    // Dùng window.open để mở tab mới
    const url = `/news/${post.post_slug}`;
    window.open(url, '_blank');
};

const generateSlug = () => {
    if (isEdit.value) return; 
    let str = form.title.toLowerCase();
    str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a");
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e");
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/g, "i");
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o");
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u");
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\s+/g, "-"); 
    str = str.replace(/[^\w\-]+/g, ""); 
    form.post_slug = str;
};

// --- API ACTIONS ---
const fetchPosts = async () => {
    loading.value = true;
    try {
        const res = await api.get('/api/posts?status=all');
        const payload = (res && res.data !== undefined) ? res.data : res;
        posts.value = Array.isArray(payload) ? payload : (payload?.data || payload?.rows || []);
    } catch (error) {
        ElMessage.error('Lỗi tải danh sách bài viết');
    } finally { loading.value = false; }
};

const openDialog = (item = null) => {
    isEdit.value = !!item;
    dialogVisible.value = true;
    
    if (item) {
        Object.assign(form, item);
    } else {
        form.post_id = null;
        form.title = '';
        form.post_slug = '';
        form.thumbnail_url = '';
        form.content = '';
        form.status = 'published';
    }
};

const handleSave = async () => {
    if (!form.title || !form.post_slug) return ElMessage.warning('Vui lòng nhập tiêu đề và slug!');
    
    submitting.value = true;
    try {
        if (isEdit.value) {
            await api.put(`/api/posts/${form.post_id}`, form);
            ElMessage.success('Cập nhật thành công!');
        } else {
            await api.post('/api/posts', form);
            ElMessage.success('Tạo bài viết mới thành công!');
        }
        dialogVisible.value = false;
        fetchPosts(); 
    } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally { submitting.value = false; }
};

const handleDelete = async (id) => {
    try {
        await api.delete(`/api/posts/${id}`);
        ElMessage.success('Đã xóa bài viết');
        fetchPosts();
    } catch (error) {
        ElMessage.error('Lỗi khi xóa bài viết');
    }
};

onMounted(() => fetchPosts());

// Ensure table layout recalculates on resize
import { onUnmounted } from 'vue';
const tableRef = ref(null);
const handleResize = () => { if (tableRef.value && typeof tableRef.value.doLayout === 'function') { try { tableRef.value.doLayout(); } catch(e){} } };
onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>