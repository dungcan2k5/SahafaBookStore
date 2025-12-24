<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="flex flex-col lg:flex-row gap-6">
        
        <div class="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm">Địa chỉ giao hàng</h2>
            <div class="flex flex-col gap-4">
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Họ và tên <span class="text-red-500">*</span></label>
                    <input v-model="form.name" type="text" class="input-field" placeholder="Nguyễn Văn A" :class="{'error': errors.name}" />
                    <span v-if="errors.name" class="text-xs text-red-500">Vui lòng nhập họ tên</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Số điện thoại <span class="text-red-500">*</span></label>
                    <input v-model="form.phone" type="text" class="input-field" placeholder="09xx..." :class="{'error': errors.phone}" />
                    <span v-if="errors.phone" class="text-xs text-red-500">Vui lòng nhập SĐT</span>
                  </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Tỉnh/Thành <span class="text-red-500">*</span></label>
                    <select v-model="form.city" @change="onCityChange" class="input-field" :class="{'error': errors.city}">
                      <option value="" disabled>Chọn Tỉnh/Thành</option>
                      <option v-for="c in locations.cities" :key="c.code" :value="c.code">{{ c.name }}</option>
                    </select>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Quận/Huyện <span class="text-red-500">*</span></label>
                    <select v-model="form.district" @change="onDistrictChange" class="input-field" :class="{'error': errors.district}" :disabled="!form.city">
                      <option value="" disabled>Chọn Quận/Huyện</option>
                      <option v-for="d in locations.districts" :key="d.code" :value="d.code">{{ d.name }}</option>
                    </select>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Phường/Xã <span class="text-red-500">*</span></label>
                    <select v-model="form.ward" class="input-field" :class="{'error': errors.ward}" :disabled="!form.district">
                      <option value="" disabled>Chọn Phường/Xã</option>
                      <option v-for="w in locations.wards" :key="w.code" :value="w.code">{{ w.name }}</option>
                    </select>
                  </div>
               </div>

               <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-600">Địa chỉ cụ thể <span class="text-red-500">*</span></label>
                  <input v-model="form.address" type="text" class="input-field" placeholder="Số nhà, tên đường..." :class="{'error': errors.address}" />
                  <span v-if="errors.address" class="text-xs text-red-500">Vui lòng nhập địa chỉ</span>
               </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm">Phương thức vận chuyển</h2>
            <div class="border rounded p-4 flex justify-between items-center bg-blue-50 border-blue-200">
              <div>
                <p class="font-bold text-gray-800">Giao hàng tiêu chuẩn</p>
                <p class="text-sm text-gray-500">Dự kiến giao: 3 - 5 ngày</p>
              </div>
              <span class="font-bold text-blue-600">30.000đ</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm">Phương thức thanh toán</h2>
            <div class="flex flex-col gap-3">
              <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{'border-blue-500 bg-blue-50': form.payment === 'sepay'}">
                <input type="radio" value="sepay" v-model="form.payment" class="w-5 h-5 text-blue-600 accent-blue-600">
                <div class="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/714/714390.png" class="w-8 h-8 object-contain" alt="QR">
                  <span class="text-gray-700 font-medium">Chuyển khoản ngân hàng (Quét QR Code)</span>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{'border-blue-500 bg-blue-50': form.payment === 'cod'}">
                <input type="radio" value="cod" v-model="form.payment" class="w-5 h-5 text-blue-600 accent-blue-600">
                <div class="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png" class="w-8 h-8 object-contain" alt="COD">
                  <span class="text-gray-700 font-medium">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3">
          <div class="bg-white p-6 rounded-lg shadow-sm sticky top-20 border border-gray-100">
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">
              Đơn hàng ({{ cartStore.totalItems }} sản phẩm)
            </h2>
            
            <div class="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 relative">
                <div class="relative">
                   <img :src="item.image || 'https://via.placeholder.com/60'" class="w-16 h-20 object-cover border rounded shrink-0">
                   <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">{{ item.quantity }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-700 line-clamp-2">{{ item.title }}</h3>
                  <p class="font-bold text-[#2563EB] mt-1">{{ formatPrice(item.price * item.quantity) }}đ</p>
                </div>
              </div>
            </div>

            <div class="border-t border-dashed my-4"></div>

            <div class="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600 border border-gray-100">
              <div class="flex justify-between"><span>Tạm tính</span><span class="font-medium">{{ formatPrice(cartStore.totalPrice) }}đ</span></div>
              <div class="flex justify-between"><span>Phí vận chuyển</span><span class="font-medium">30.000đ</span></div>
            </div>
            
            <div class="flex justify-between items-end text-xl font-bold text-[#C92127] pt-4 mt-2 border-t">
              <span class="text-base text-gray-800">Tổng thanh toán</span>
              <span>{{ formatPrice(cartStore.totalPrice + 30000) }}đ</span>
            </div>

            <button 
              @click="submitOrder" 
              :disabled="isLoading"
              class="w-full bg-[#C92127] text-white font-bold py-3.5 rounded-lg mt-6 hover:bg-red-700 transition shadow-lg uppercase transform active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isLoading ? 'Đang xử lý...' : 'Đặt hàng ngay' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showQRModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        
        <div class="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            Quét mã để thanh toán
          </h3>
          <button @click="finishPayment" class="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div class="p-6 text-center space-y-4">
          <p class="text-gray-600 text-sm">
            Sử dụng <strong>App Ngân hàng</strong> hoặc <strong>Ví điện tử</strong> để quét mã.
          </p>
          
          <div class="bg-white p-2 border-2 border-blue-100 rounded-lg inline-block shadow-inner relative">
             <img 
               :src="`https://qr.sepay.vn/img?bank=MBBank&acc=VQRQAGBEX7670&template=qronly&amount=${paymentInfo.amount}&des=${paymentInfo.content}`" 
               class="w-64 h-64 object-contain"
               alt="QR Code Payment"
             >
             <div class="absolute bottom-3 right-3 bg-white rounded-full p-1 shadow-md border">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png" class="w-6 h-6 object-contain">
             </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-3 border border-gray-200">
             <div class="flex justify-between items-center border-b border-gray-200 pb-2">
               <span class="text-gray-500">Ngân hàng:</span>
               <span class="font-bold text-gray-800">MB Bank</span>
             </div>
             <div class="flex justify-between items-center border-b border-gray-200 pb-2">
               <span class="text-gray-500">Tài khoản:</span>
               <span class="font-bold text-gray-800 tracking-wider">VQRQAGBEX7670</span>
             </div>
             <div class="flex justify-between items-center border-b border-gray-200 pb-2">
               <span class="text-gray-500">Số tiền:</span>
               <span class="font-bold text-blue-600 text-lg">{{ formatPrice(paymentInfo.amount) }}đ</span>
             </div>
             <div class="flex justify-between items-center">
               <span class="text-gray-500">Nội dung CK:</span>
               <div class="flex items-center gap-2">
                 <span class="font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">{{ paymentInfo.content }}</span>
                 <button @click="copyContent" class="text-gray-400 hover:text-blue-600" title="Sao chép">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                 </button>
               </div>
             </div>
          </div>

          <button @click="finishPayment" class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition shadow-lg transform active:scale-95">
            Tôi đã chuyển khoản xong
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import axios from 'axios';

const router = useRouter();
const cartStore = useCartStore();

const isLoading = ref(false);
const showQRModal = ref(false);
const paymentInfo = ref({}); // Lưu thông tin API trả về (amount, content)

// Form data (Thêm các trường địa chỉ)
const form = reactive({
  name: '',
  phone: '',
  city: '',
  district: '',
  ward: '',
  address: '',
  payment: 'sepay'
});

// State cho API Địa chỉ
const locations = reactive({ cities: [], districts: [], wards: [] });
// State cho Validate lỗi
const errors = reactive({ name: false, phone: false, city: false, district: false, ward: false, address: false });

// Format tiền tệ
const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

// --- 1. LOGIC API ĐỊA CHỈ (Provinces Open API) ---
const fetchCities = async () => {
  try {
    const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');
    locations.cities = res.data;
  } catch (e) { console.error("Lỗi API Tỉnh:", e); }
};

const onCityChange = async () => {
  form.district = ''; form.ward = ''; locations.districts = []; locations.wards = [];
  if (form.city) {
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${form.city}?depth=2`);
    locations.districts = res.data.districts;
  }
};

const onDistrictChange = async () => {
  form.ward = ''; locations.wards = [];
  if (form.district) {
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`);
    locations.wards = res.data.wards;
  }
};

onMounted(() => {
  fetchCities(); // Load danh sách tỉnh ngay khi vào trang
});

// --- 2. LOGIC TẠO ĐƠN & THANH TOÁN ---
const submitOrder = async () => {
  // 1. Validate Form (Giữ nguyên)
  Object.keys(errors).forEach(k => errors[k] = false);
  let hasError = false;
  ['name', 'phone', 'city', 'district', 'ward', 'address'].forEach(field => {
    if (!form[field]) { errors[field] = true; hasError = true; }
  });
  
  if (hasError) return alert("Vui lòng điền đầy đủ thông tin giao hàng!");
  if(cartStore.items.length === 0) return alert('Giỏ hàng trống!');
  
  // 2. Kiểm tra Token
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
    return router.push('/login');
  }
  
  // 3. Chuẩn bị dữ liệu
  const cityName = locations.cities.find(c => c.code == form.city)?.name;
  const distName = locations.districts.find(d => d.code == form.district)?.name;
  const wardName = locations.wards.find(w => w.code == form.ward)?.name;
  const fullAddress = `${form.address}, ${wardName}, ${distName}, ${cityName}`;

  isLoading.value = true;
  
  try {
    console.log("Đang gửi đơn hàng lên Server..."); // Log để check
    
    const response = await axios.post('http://localhost:3000/api/orders', {
      address_id: null, // Để null để backend tự tạo địa chỉ mới
      recipient_name: form.name,
      phone: form.phone,
      address_detail: fullAddress,
      payment_method: form.payment, 
      voucher_code: null
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Nếu thành công
    const data = response.data;
    if (data.success) {
      if (form.payment === 'sepay' || form.payment === 'bank_transfer') {
        paymentInfo.value = data.payment_info || {
            amount: data.final_amount,
            content: `SAHAFA${data.order_id}`
        }; 
        showQRModal.value = true;
      } else {
        alert('Đặt hàng thành công! Mã đơn: ' + data.order_id);
        cartStore.clearCart();
        router.push('/');
      }
    } else {
      alert('Backend trả về lỗi: ' + data.message);
    }

  } catch (error) {
    console.error("CHI TIẾT LỖI:", error);
    
    // --- PHẦN QUAN TRỌNG: HIỆN LỖI CỤ THỂ ---
    if (error.response) {
       // Server có phản hồi nhưng là lỗi (4xx, 5xx)
       const status = error.response.status;
       const msg = error.response.data ? error.response.data.message : 'Không rõ';
       
       if (status === 401 || status === 403) {
          alert(`Lỗi xác thực (${status}): ${msg}. Vui lòng đăng nhập lại.`);
          router.push('/login');
       } else {
          alert(`Lỗi từ Server (${status}): ${msg}`);
       }
    } else if (error.request) {
       // Không nhận được phản hồi (Server tắt hoặc mạng lỗi)
       alert('Không thể kết nối tới Server (http://localhost:3000). Hãy kiểm tra xem cửa sổ Terminal Backend có đang chạy không?');
    } else {
       // Lỗi code Frontend
       alert('Lỗi Frontend: ' + error.message);
    }
  } finally {
    isLoading.value = false;
  }
};

const copyContent = () => {
  if (paymentInfo.value.content) {
      navigator.clipboard.writeText(paymentInfo.value.content);
      alert('Đã sao chép nội dung: ' + paymentInfo.value.content);
  }
};

const finishPayment = () => {
  showQRModal.value = false;
  cartStore.clearCart();
  alert('Đơn hàng đang chờ xử lý. Cảm ơn quý khách!');
  router.push('/');
};
</script>

<style scoped>
.input-field {
  width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: border-color 0.2s;
}
.input-field:focus { border-color: #2563EB; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
.input-field.error { border-color: #ef4444; background: #fef2f2; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

/* Animation Modal */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
</style>