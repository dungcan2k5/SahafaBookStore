<template>
  <div class="container mx-auto py-10 px-4 md:px-12">
    <div v-if="authStore.user" class="flex flex-col md:flex-row gap-8">
      
      <!-- Sidebar -->
      <div class="w-full md:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border">
                <img :src="user.avatar_url || 'https://ui-avatars.com/api/?name=User'" 
                     class="w-full h-full object-cover" 
                     @error="$event.target.src='https://ui-avatars.com/api/?name=Error'">
            </div>
            <div class="overflow-hidden">
              <p class="text-xs text-gray-500">Tài khoản của</p>
              <p class="font-bold text-gray-800 truncate">{{ user.full_name || 'Khách' }}</p>
            </div>
          </div>
          <ul class="flex flex-col gap-2 text-sm">
            <li 
              @click="currentTab = 'profile'"
              :class="['cursor-pointer p-2 rounded transition', currentTab === 'profile' ? 'font-bold text-[#C92127] bg-red-50' : 'text-gray-600 hover:text-[#C92127]']"
            >
              Hồ sơ cá nhân
            </li>
            <li 
              @click="currentTab = 'address'"
              :class="['cursor-pointer p-2 rounded transition', currentTab === 'address' ? 'font-bold text-[#C92127] bg-red-50' : 'text-gray-600 hover:text-[#C92127]']"
            >
              Sổ địa chỉ
            </li>
            <li 
              @click="currentTab = 'orders'"
              :class="['cursor-pointer p-2 rounded transition', currentTab === 'orders' ? 'font-bold text-[#C92127] bg-red-50' : 'text-gray-600 hover:text-[#C92127]']"
            >
              Đơn hàng của tôi
            </li>
          </ul>
        </div>
      </div>

      <!-- Main Content -->
      <div class="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-8 border border-gray-100 min-h-[500px]">
          
          <!-- TAB: PROFILE -->
          <div v-if="currentTab === 'profile'">
            <h1 class="text-2xl font-light text-gray-800 mb-6 border-b pb-4">Hồ Sơ Của Tôi</h1>
            <div class="flex flex-col gap-6 mb-10">
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="w-32 text-gray-600 md:text-right font-medium">Họ tên</label>
                <input v-model="user.full_name" type="text" class="border border-gray-300 px-4 py-2 rounded flex-1 focus:outline-none focus:border-blue-500">
              </div>

              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <label class="w-32 text-gray-600 md:text-right font-medium">Số điện thoại</label>
                <input v-model="user.phone" type="text" class="border border-gray-300 px-4 py-2 rounded flex-1 focus:outline-none focus:border-blue-500" placeholder="Nhập số điện thoại">
              </div>
              
              <div class="flex items-center gap-4 mt-4 md:ml-32">
                <button 
                  type="button" 
                  @click="handleUpdate" 
                  class="bg-[#C92127] text-white px-8 py-2 rounded hover:bg-red-700 transition shadow-md font-bold disabled:opacity-50"
                  :disabled="isLoading"
                >
                  {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
                </button>
                
                <button 
                  type="button" 
                  @click="showPasswordModal = true" 
                  class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition shadow-md font-bold"
                >
                  Đổi mật khẩu
                </button>
              </div>
              <p v-if="message" class="md:ml-32 text-sm font-bold" :class="isError ? 'text-red-600' : 'text-green-600'">
                  {{ message }}
              </p>
            </div>
          </div>

          <!-- TAB: ADDRESS -->
          <div v-if="currentTab === 'address'">
             <div class="flex justify-between items-center mb-6 border-b pb-4">
                <h2 class="text-xl font-light text-gray-800">Sổ Địa Chỉ</h2>
                <button @click="openAddressModal()" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                   Thêm địa chỉ mới
                </button>
             </div>

             <div v-if="addresses.length === 0" class="text-center text-gray-500 py-8 bg-gray-50 rounded border border-dashed">
                Bạn chưa lưu địa chỉ nào.
             </div>

             <div v-else class="space-y-4">
                <div v-for="addr in addresses" :key="addr.address_id" class="border p-4 rounded-lg relative group hover:border-blue-300 transition bg-gray-50">
                   <div class="flex justify-between items-start">
                      <div>
                         <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-gray-800">{{ addr.recipient_name }}</span>
                            <span class="text-gray-400">|</span>
                            <span class="text-gray-600">{{ addr.phone }}</span>
                            <span v-if="addr.is_default" class="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded border border-red-200">Mặc định</span>
                         </div>
                         <p class="text-gray-600 text-sm">{{ addr.address_detail }}</p>
                      </div>
                      <div class="flex gap-2">
                         <button @click="openAddressModal(addr)" class="text-blue-600 hover:underline text-sm">Sửa</button>
                         <button @click="deleteAddress(addr.address_id)" class="text-red-600 hover:underline text-sm">Xóa</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- TAB: ORDERS (NEW) -->
          <div v-if="currentTab === 'orders'">
             <h2 class="text-xl font-light text-gray-800 mb-6 border-b pb-4">Lịch Sử Đơn Hàng</h2>

             <div v-if="orderLoading" class="py-10 text-center text-gray-500">Đang tải đơn hàng...</div>
             <div v-else-if="orders.length === 0" class="py-10 text-center text-gray-500 border border-dashed rounded bg-gray-50">
                Bạn chưa có đơn hàng nào.
             </div>

             <div v-else class="space-y-6">
                <div v-for="order in orders" :key="order.order_id" class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                    <!-- Order Header -->
                    <div class="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
                        <div class="flex items-center gap-4">
                            <span class="font-bold text-gray-700">#{{ order.order_id }}</span>
                            <span class="text-sm text-gray-500">{{ new Date(order.created_at).toLocaleString('vi-VN') }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <span class="text-sm uppercase font-bold px-2 py-1 rounded" 
                                 :class="{
                                    'bg-yellow-100 text-yellow-700': order.order_status === 'pending',
                                    'bg-blue-100 text-blue-700': order.order_status === 'processing',
                                    'bg-indigo-100 text-indigo-700': order.order_status === 'shipped',
                                    'bg-green-100 text-green-700': order.order_status === 'delivered',
                                    'bg-red-100 text-red-700': order.order_status === 'cancelled'
                                 }">
                                {{ formatStatus(order.order_status) }}
                           </span>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="p-4">
                        <div v-for="item in order.OrderItems" :key="item.id" class="flex justify-between items-center py-2 border-b last:border-0">
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ item.Book?.book_title }}</div>
                                <div class="text-xs text-gray-500">x{{ item.quantity }}</div>
                            </div>
                            <div class="font-medium text-gray-900">{{ formatCurrency(item.unit_price) }}</div>
                        </div>
                    </div>

                    <!-- Order Footer -->
                    <div class="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
                        <div class="text-sm text-gray-500">
                           Thanh toán: <span class="font-bold uppercase">{{ order.payment_method || 'COD' }}</span>
                           <span v-if="order.payment_status === 'paid'" class="text-green-600 ml-1 font-bold">(Đã TT)</span>
                        </div>
                        <div class="text-lg font-bold text-[#C92127]">
                            Tổng tiền: {{ formatCurrency(order.final_amount) }}
                        </div>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div class="flex justify-center gap-2 mt-6">
                    <button 
                      @click="changePage(orderPage - 1)" 
                      :disabled="orderPage <= 1"
                      class="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                    >
                      &laquo; Trước
                    </button>
                    <span class="px-3 py-1 font-bold text-gray-700">Trang {{ orderPage }} / {{ Math.ceil(orderTotal / orderLimit) || 1 }}</span>
                    <button 
                      @click="changePage(orderPage + 1)" 
                      :disabled="orderPage >= Math.ceil(orderTotal / orderLimit)"
                      class="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                    >
                      Sau &raquo;
                    </button>
                </div>
             </div>
          </div>

      </div>
    </div>

    <div v-else class="text-center py-20">
        <p class="text-gray-500">Đang tải thông tin người dùng...</p>
        <router-link to="/login" class="text-blue-600 underline">Đăng nhập lại nếu đợi quá lâu</router-link>
    </div>

    <!-- MODAL ĐỊA CHỈ -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
       <div class="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl relative animate-fade-in-up">
          <h3 class="text-lg font-bold mb-4">{{ isEditMode ? 'Cập Nhật Địa Chỉ' : 'Thêm Địa Chỉ Mới' }}</h3>
          
          <div class="space-y-3">
             <div class="grid grid-cols-2 gap-3">
                <input v-model="addrForm.recipient_name" type="text" placeholder="Họ và tên" class="input-field">
                <input v-model="addrForm.phone" type="text" placeholder="Số điện thoại" class="input-field">
             </div>
             <input v-model="addrForm.address_detail" type="text" placeholder="Địa chỉ chi tiết (Số nhà, đường, phường, quận, tỉnh)" class="input-field w-full">
             
             <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="addrForm.is_default" class="w-4 h-4">
                <span class="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
             </label>
          </div>

          <div class="flex justify-end gap-3 mt-6">
             <button @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
             <button @click="saveAddress" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="modalLoading">
                {{ modalLoading ? 'Lưu...' : 'Hoàn Thành' }}
             </button>
          </div>
       </div>
    </div>

    <!-- MODAL ĐỔI MẬT KHẨU -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
       <div class="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative animate-fade-in-up">
          <h3 class="text-lg font-bold mb-4 border-b pb-2">Đổi Mật Khẩu</h3>
          <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                  <label class="block text-sm text-gray-600 mb-1">Mật khẩu hiện tại</label>
                  <input v-model="passForm.oldPassword" type="password" required class="input-field" placeholder="••••••">
              </div>
              <div>
                  <label class="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
                  <input v-model="passForm.newPassword" type="password" required class="input-field" placeholder="Tối thiểu 8 ký tự">
              </div>
              <div>
                  <label class="block text-sm text-gray-600 mb-1">Nhập lại mật khẩu mới</label>
                  <input v-model="passForm.confirmPassword" type="password" required class="input-field" placeholder="••••••">
              </div>
              <div class="flex justify-end gap-3 mt-4">
                 <button type="button" @click="showPasswordModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
                 <button type="submit" class="px-4 py-2 bg-[#C92127] text-white rounded hover:bg-red-700 font-bold" :disabled="passLoading">
                    {{ passLoading ? 'Đang xử lý...' : 'Xác nhận' }}
                 </button>
              </div>
          </form>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

const user = ref({ full_name: '', phone: '' });
const addresses = ref([]); // Danh sách địa chỉ

// Tabs: 'profile', 'address', 'orders'
const currentTab = ref('profile');

// Orders State
const orders = ref([]);
const orderLoading = ref(false);
const orderPage = ref(1);
const orderLimit = ref(5);
const orderTotal = ref(0);

// Modal State
const showModal = ref(false);
const isEditMode = ref(false);
const modalLoading = ref(false);
const addrForm = reactive({
   address_id: null,
   recipient_name: '',
   phone: '',
   address_detail: '',
   is_default: false
});

// Password Modal State
const showPasswordModal = ref(false);
const passLoading = ref(false);
const passForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

onMounted(() => {
    if (authStore.user) {
        user.value = { 
            ...authStore.user,
            full_name: authStore.user.full_name || authStore.user.name || ''
        };
        fetchAddresses();
    }
});

// Fetch orders when tab changes to 'orders'
watch(currentTab, (newTab) => {
    if (newTab === 'orders' && orders.value.length === 0) {
        fetchOrders();
    }
});

// --- ORDERS LOGIC ---
const fetchOrders = async () => {
    orderLoading.value = true;
    try {
        const res = await api.get('/api/api/orders/my-orders', {
            params: {
                page: orderPage.value,
                limit: orderLimit.value
            }
        });
        orders.value = res.data.data || [];
        if (res.data.meta) {
            orderTotal.value = res.data.meta.total;
        }
    } catch (e) {
        console.error("Lỗi tải đơn hàng:", e);
    } finally {
        orderLoading.value = false;
    }
};

const changePage = (page) => {
    if (page < 1 || page > Math.ceil(orderTotal.value / orderLimit.value)) return;
    orderPage.value = page;
    fetchOrders();
};

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

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

// --- CHANGE PASSWORD LOGIC ---
const handleChangePassword = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) {
        alert("Mật khẩu mới không khớp!");
        return;
    }
    
    // Validate complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (passForm.newPassword.length < 8) {
        alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
        return;
    }
    if (!passwordRegex.test(passForm.newPassword)) {
        alert("Mật khẩu mới phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)");
        return;
    }

    passLoading.value = true;
    try {
        const res = await api.post('/api/auth/change-password', {
            oldPassword: passForm.oldPassword,
            newPassword: passForm.newPassword
        });

        if (res.data.success) {
            alert("Đổi mật khẩu thành công!");
            showPasswordModal.value = false;
            // Reset form
            passForm.oldPassword = '';
            passForm.newPassword = '';
            passForm.confirmPassword = '';
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Lỗi đổi mật khẩu');
    } finally {
        passLoading.value = false;
    }
};

// --- USER INFO ---
const handleUpdate = async () => {
    message.value = ''; isError.value = false; isLoading.value = true;
    try {
        const res = await api.put('/api/auth/me', {
            full_name: user.value.full_name,
            phone: user.value.phone,
        });
        if (res.data.success) {
            message.value = 'Cập nhật thành công!';
            if (res.data.data) authStore.setUser(res.data.data);
        }
    } catch (error) {
        isError.value = true;
        message.value = error.response?.data?.message || 'Lỗi cập nhật';
    } finally { isLoading.value = false; }
};

// --- ADDRESS BOOK LOGIC ---
const fetchAddresses = async () => {
   try {
      const res = await api.get('/api/api/addresses');
      addresses.value = res.data.data || [];
   } catch (e) { console.error("Lỗi tải địa chỉ:", e); }
};

const openAddressModal = (addr = null) => {
   isEditMode.value = !!addr;
   if (addr) {
      Object.assign(addrForm, addr);
   } else {
      // Reset form
      addrForm.address_id = null;
      addrForm.recipient_name = user.value.full_name;
      addrForm.phone = user.value.phone;
      addrForm.address_detail = '';
      addrForm.is_default = false;
   }
   showModal.value = true;
};

const saveAddress = async () => {
   if (!addrForm.recipient_name || !addrForm.phone || !addrForm.address_detail) return alert("Vui lòng điền đủ thông tin!");
   
   modalLoading.value = true;
   try {
      if (isEditMode.value) {
         await api.put(`/api/addresses/${addrForm.address_id}`, addrForm);
      } else {
         await api.post('/api/addresses', addrForm);
      }
      fetchAddresses();
      showModal.value = false;
   } catch (e) {
      alert(e.response?.data?.message || 'Lỗi lưu địa chỉ');
   } finally { modalLoading.value = false; }
};

const deleteAddress = async (id) => {
   if (!confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
   try {
      await api.delete(`/api/addresses/${id}`);
      fetchAddresses();
   } catch (e) { alert("Lỗi khi xóa"); }
};
</script>

<style scoped>
.input-field {
   border: 1px solid #d1d5db; padding: 0.5rem 1rem; border-radius: 0.375rem; outline: none; width: 100%;
}
.input-field:focus { border-color: #2563EB; }
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>