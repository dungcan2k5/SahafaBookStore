ypeError: Cannot read properties of undefined (reading 'data')
    at fetchOrders (OrderManager.vue:403:29)<template>
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
    <el-table ref="tableRef" :data="orders" style="width: 100%" v-loading="loading" stripe border>
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
              <el-button type="info" size="small" plain @click="viewOrderDetails(scope.row)">
                 <el-icon class="mr-1"><View /></el-icon> Chi tiết
              </el-button>

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

    <!-- Dialog Chi tiết đơn hàng -->
    <el-dialog v-model="detailsVisible" title="Chi tiết đơn hàng" width="800px" top="5vh">
      <div v-if="selectedOrder" class="space-y-4">
        <!-- Header Info -->
        <div class="flex justify-between border-b pb-2">
           <div>
              <div class="font-bold text-lg">Đơn hàng #{{ selectedOrder.order_id }}</div>
              <div class="text-sm text-gray-500">Ngày đặt: {{ new Date(selectedOrder.created_at).toLocaleString('vi-VN') }}</div>
           </div>
           <div class="text-right">
              <el-tag :type="getStatusColor(selectedOrder.order_status)" effect="dark" class="uppercase font-bold mb-1">
                 {{ formatStatus(selectedOrder.order_status) }}
              </el-tag>
              <div class="text-sm font-bold text-red-600">
                {{ formatCurrency(selectedOrder.final_amount) }}
              </div>
           </div>
        </div>

        <!-- Customer & Shipping -->
        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
            <div>
               <div class="font-bold text-gray-700 mb-1">Người đặt hàng</div>
               <div>{{ selectedOrder.User?.full_name }}</div>
               <div class="text-sm text-gray-500">{{ selectedOrder.User?.email }}</div>
               <div class="text-sm text-gray-500">{{ selectedOrder.User?.phone }}</div>
            </div>
            <div>
               <div class="font-bold text-gray-700 mb-1">Địa chỉ giao hàng</div>
               <div class="font-bold">{{ selectedOrder.Address?.recipient_name }}</div>
               <div class="text-sm">{{ selectedOrder.Address?.phone }}</div>
               <div class="text-sm text-gray-600">{{ selectedOrder.Address?.address_detail || selectedOrder.shipping_address }}</div>
            </div>
        </div>

        <!-- Payment Info -->
        <div class="border p-2 rounded border-dashed border-gray-300">
           <span class="font-bold text-gray-700">Thanh toán: </span>
           <span class="uppercase font-bold text-blue-600 mr-2">{{ selectedOrder.payment_method || 'COD' }}</span>
           <span class="text-sm">
             (Trạng thái: 
             <span :class="selectedOrder.payment_status === 'paid' ? 'text-green-600 font-bold' : 'text-orange-500'">
                {{ selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
             </span>)
           </span>
           <div v-if="selectedOrder.Transactions?.length" class="mt-1 text-xs text-gray-500">
               Mã GD: {{ selectedOrder.Transactions.map(t => '#' + t.transaction_id).join(', ') }}
           </div>
        </div>

        <!-- Order Items -->
        <div>
           <div class="font-bold mb-2">Sản phẩm</div>
           <el-table :data="selectedOrder.OrderItems" border size="small">
              <el-table-column label="Sách" prop="Book.book_title" min-width="200" />
              <el-table-column label="Đơn giá" width="120" align="right">
                 <template #default="s">
                    {{ formatCurrency(s.row.unit_price) }}
                 </template>
              </el-table-column>
              <el-table-column label="SL" prop="quantity" width="60" align="center" />
              <el-table-column label="Thành tiền" width="120" align="right">
                 <template #default="s">
                    {{ formatCurrency(s.row.subtotal) }}
                 </template>
              </el-table-column>
           </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsVisible = false">Đóng</el-button>
          <el-button type="primary" @click="printInvoice">
             <el-icon class="mr-1"><Printer /></el-icon> In Hóa Đơn
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { List, MagicStick, Location, Search, View, Printer } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '@/services/api';

const orders = ref([]);
const loading = ref(false);
const creating = ref(false);
const searchText = ref('');
let debounceTimer = null;

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// Details Dialog
const detailsVisible = ref(false);
const selectedOrder = ref(null);

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

// --- ACTIONS ---
const viewOrderDetails = (order) => {
    selectedOrder.value = order;
    detailsVisible.value = true;
};

const printInvoice = () => {
    if (!selectedOrder.value) return;
    const order = selectedOrder.value;
    
    const itemsHtml = order.OrderItems.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.Book?.book_title}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.unit_price)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.subtotal)}</td>
        </tr>
    `).join('');

    const invoiceHtml = `
        <html>
        <head>
            <title>Hóa đơn #${order.order_id}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .info-box { background: #f9f9f9; padding: 15px; border-radius: 4px; }
                .info-title { font-weight: bold; margin-bottom: 5px; text-transform: uppercase; font-size: 0.85em; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #eee; text-align: left; padding: 10px; font-weight: bold; }
                .totals { margin-top: 20px; text-align: right; }
                .totals div { margin-bottom: 5px; }
                .final-price { font-size: 1.2em; font-weight: bold; color: #d00; }
                .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Sahafa Bookstore - Hóa Đơn</h1>
                <p>Mã đơn hàng: #${order.order_id} - Ngày: ${new Date(order.created_at).toLocaleString('vi-VN')}</p>
            </div>
            
            <div class="info-grid">
                <div class="info-box">
                    <div class="info-title">Người đặt</div>
                    <div>${order.User?.full_name}</div>
                    <div>${order.User?.phone}</div>
                    <div>${order.User?.email}</div>
                </div>
                <div class="info-box">
                    <div class="info-title">Người nhận & Giao tới</div>
                    <div><strong>${order.Address?.recipient_name}</strong></div>
                    <div>${order.Address?.phone}</div>
                    <div>${order.Address?.address_detail || order.shipping_address}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th style="text-align: center; width: 50px;">SL</th>
                        <th style="text-align: right; width: 120px;">Đơn giá</th>
                        <th style="text-align: right; width: 120px;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="totals">
                <div>Tổng tiền hàng: <strong>${formatCurrency(order.total_amount)}</strong></div>
                <div>Phí vận chuyển: <strong>30.000 ₫</strong> (Đã bao gồm)</div>
                <div class="final-price">Thanh toán: ${formatCurrency(order.final_amount)}</div>
                <div><em>(${order.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán khi nhận hàng'})</em></div>
            </div>

            <div class="footer">
                <p>Cảm ơn quý khách đã mua hàng tại Sahafa Bookstore!</p>
                <p>Website: www.sahafa.com | Hotline: 1900 xxxx</p>
            </div>
            
            <script>
                window.onload = function() { window.print(); }
            <\/script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
};

// --- API ---
const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/api/orders/admin', {
        params: {
            page: currentPage.value,
            limit: pageSize.value,
            search: searchText.value?.trim() || undefined
        }
    });

    // Support multiple response shapes depending on interceptor behavior:
    // - interceptor may return the unwrapped data (array or object)
    // - or return the full Axios response-like object { data: ..., meta: ... }
    const payload = (res && res.data !== undefined) ? res.data : res;

    let list = [];
    let meta = null;

    if (Array.isArray(payload)) {
      list = payload;
    } else if (payload && Array.isArray(payload.data)) {
      list = payload.data;
      meta = payload.meta || null;
    } else if (payload && Array.isArray(payload.rows)) {
      // handle shape { rows, meta }
      list = payload.rows;
      meta = payload.meta || null;
    } else if (payload && payload.data && Array.isArray(payload.data.rows)) {
      list = payload.data.rows;
      meta = payload.data.meta || null;
    }

    orders.value = list || [];
    if (meta && meta.total !== undefined) {
      total.value = meta.total;
    }
  } catch (e) {
    console.error(e);
    ElMessage.error('Lỗi tải danh sách đơn hàng!');
  } finally {
    loading.value = false;
  }
};

const tableRef = ref(null);
const handleResize = () => { if (tableRef.value && typeof tableRef.value.doLayout === 'function') { try { tableRef.value.doLayout(); } catch(e){} } };
onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchOrders();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchOrders();
};

// Search Watcher
watch(searchText, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        currentPage.value = 1;
        fetchOrders();
    }, 400);
});

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
