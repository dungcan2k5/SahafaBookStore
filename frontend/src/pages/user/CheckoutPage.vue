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
                  <label class="text-sm text-gray-600">Họ và tên người nhận</label>
                  <input v-model="form.name" type="text" placeholder="Nhập họ tên" class="input-field" :class="{ 'error': errors.name }" />
                  <span v-if="errors.name" class="error-text">Vui lòng nhập họ tên</span>
                </div>
                
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-600">Số điện thoại</label>
                  <input v-model="form.phone" type="text" placeholder="Ví dụ: 09xx..." class="input-field" :class="{ 'error': errors.phone }" />
                  <span v-if="errors.phone" class="error-text">Vui lòng nhập số điện thoại</span>
                </div>
              </div>

              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600">Quốc gia</label>
                <select class="input-field bg-gray-100 text-gray-500 cursor-not-allowed" disabled>
                  <option>Việt Nam</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-600">Tỉnh/Thành Phố</label>
                  <select v-model="form.city" @change="onCityChange" class="input-field" :class="{ 'error': errors.city }">
                    <option value="" disabled>Chọn Tỉnh/Thành</option>
                    <option v-for="city in locations.cities" :key="city.code" :value="city.code">
                      {{ city.name }}
                    </option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-600">Quận/Huyện</label>
                  <select v-model="form.district" @change="onDistrictChange" class="input-field" :class="{ 'error': errors.district }" :disabled="!form.city">
                    <option value="" disabled>Chọn Quận/Huyện</option>
                    <option v-for="dist in locations.districts" :key="dist.code" :value="dist.code">
                      {{ dist.name }}
                    </option>
                  </select>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-600">Phường/Xã</label>
                  <select v-model="form.ward" class="input-field" :class="{ 'error': errors.ward }" :disabled="!form.district">
                    <option value="" disabled>Chọn Phường/Xã</option>
                    <option v-for="ward in locations.wards" :key="ward.code" :value="ward.code">
                      {{ ward.name }}
                    </option>
                  </select>
                </div>

              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600">Địa chỉ cụ thể</label>
                <input v-model="form.address" type="text" placeholder="Số nhà, tên đường..." class="input-field" :class="{ 'error': errors.address }" />
                <span v-if="errors.address" class="error-text">Vui lòng nhập địa chỉ cụ thể</span>
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
              
              <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{'border-blue-500 bg-blue-50': form.payment === 'qr'}">
                <input type="radio" value="qr" v-model="form.payment" class="w-5 h-5 text-blue-600 accent-blue-600">
                <div class="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/714/714390.png" class="w-8 h-8 object-contain" alt="QR">
                  <span class="text-gray-700 font-medium">Chuyển khoản qua QR Code</span>
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
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm border-b pb-2">Đơn hàng (1 sản phẩm)</h2>
            
            <div class="flex gap-3 mb-4">
              <img src="https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg" class="w-16 h-20 object-cover border rounded">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-700 line-clamp-2">Nhà Giả Kim (Tái Bản 2024)</h3>
                <p class="text-sm text-gray-500">x1</p>
                <p class="font-bold text-[#2563EB]">63.000đ</p>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2 text-sm text-gray-600">
              <div class="flex justify-between"><span>Tạm tính</span><span>63.000đ</span></div>
              <div class="flex justify-between"><span>Phí vận chuyển</span><span>30.000đ</span></div>
              <div class="flex justify-between text-xl font-bold text-[#2563EB] pt-2 border-t mt-2">
                <span>Tổng cộng</span><span>93.000đ</span>
              </div>
            </div>

            <button @click="submitOrder" class="w-full bg-[#2563EB] text-white font-bold py-3 rounded-lg mt-6 hover:bg-red-700 transition shadow-md uppercase">
              Xác nhận thanh toán
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Dùng để chuyển trang
import axios from 'axios'; // Thư viện gọi API

const router = useRouter();

// 1. Khai báo State (Biến lưu dữ liệu form)
const form = reactive({
  name: '',
  phone: '',
  city: '',      // Mã tỉnh
  district: '',  // Mã huyện
  ward: '',      // Mã xã
  address: '',
  payment: 'cod' // Mặc định chọn COD
});

// 2. Khai báo State lưu danh sách địa chỉ tải từ API
const locations = reactive({
  cities: [],    // Danh sách tất cả tỉnh
  districts: [], // Danh sách huyện của tỉnh đang chọn
  wards: []      // Danh sách xã của huyện đang chọn
});

// 3. Khai báo State lỗi (để hiện viền đỏ)
const errors = reactive({
  name: false, phone: false, city: false, district: false, ward: false, address: false
});

// --- HÀM 1: Lấy danh sách Tỉnh/Thành khi mới vào trang ---
const fetchCities = async () => {
  try {
    // Gọi API lấy toàn bộ tỉnh (depth=1)
    const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');
    locations.cities = res.data;
  } catch (e) {
    console.error("Lỗi API:", e);
  }
};

// --- HÀM 2: Khi người dùng thay đổi Tỉnh (city) ---
const onCityChange = async () => {
  // Reset dữ liệu cấp dưới (Huyện/Xã) để tránh lỗi logic
  form.district = '';
  form.ward = '';
  locations.districts = [];
  locations.wards = [];
  
  if (form.city) {
    try {
      // Gọi API lấy danh sách Huyện của Tỉnh vừa chọn
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${form.city}?depth=2`);
      locations.districts = res.data.districts;
    } catch (e) { console.error(e); }
  }
};

// --- HÀM 3: Khi người dùng thay đổi Huyện (district) ---
const onDistrictChange = async () => {
  // Reset dữ liệu cấp dưới (Xã)
  form.ward = '';
  locations.wards = [];

  if (form.district) {
    try {
      // Gọi API lấy danh sách Xã của Huyện vừa chọn
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`);
      locations.wards = res.data.wards;
    } catch (e) { console.error(e); }
  }
};

// --- VÒNG ĐỜI: onMounted (Chạy ngay khi trang web hiện ra) ---
onMounted(() => {
  fetchCities(); // Tải danh sách tỉnh ngay lập tức
});

// --- HÀM 4: Xử lý khi bấm nút "Xác nhận thanh toán" ---
const submitOrder = () => {
  // 1. Reset lại tất cả lỗi cũ
  Object.keys(errors).forEach(k => errors[k] = false);
  let hasError = false;

  // 2. Kiểm tra từng trường, nếu rỗng thì báo lỗi
  if (!form.name) { errors.name = true; hasError = true; }
  if (!form.phone) { errors.phone = true; hasError = true; }
  if (!form.city) { errors.city = true; hasError = true; }
  if (!form.district) { errors.district = true; hasError = true; }
  if (!form.ward) { errors.ward = true; hasError = true; }
  if (!form.address) { errors.address = true; hasError = true; }

  // 3. Nếu có lỗi thì dừng lại, hiện thông báo
  if (hasError) {
    alert("Vui lòng điền đầy đủ thông tin giao hàng!");
    return;
  }

  // 4. Lấy tên địa chỉ từ mã code (để hiển thị cho đẹp)
  const cityName = locations.cities.find(c => c.code == form.city)?.name;
  const distName = locations.districts.find(d => d.code == form.district)?.name;
  const wardName = locations.wards.find(w => w.code == form.ward)?.name;
  
  const fullAddress = `${form.address}, ${wardName}, ${distName}, ${cityName}`;
  
  // 5. Xử lý thành công
  if (form.payment === 'qr') {
    alert(`Chuyển đến trang quét mã QR...\nĐịa chỉ: ${fullAddress}`);
  } else {
    alert(`Đặt hàng thành công!\nĐơn hàng sẽ giao đến: ${fullAddress}`);
    router.push('/'); // Quay về trang chủ
  }
};
</script>

<style scoped>
/* CSS cho ô nhập liệu */
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-size: 0.875rem;
  background-color: white;
}
.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
/* CSS khi có lỗi (viền đỏ) */
.input-field.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}
.input-field.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #fca5a5;
}
/* CSS dòng chữ báo lỗi */
.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 0.25rem;
  display: block;
}
</style>