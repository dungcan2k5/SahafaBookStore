<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="flex flex-col lg:flex-row gap-6">
        
        <div class="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h2 class="font-bold text-gray-800 uppercase text-sm">Địa chỉ giao hàng</h2>
                
                <div v-if="myAddresses.length > 0" class="relative">
                    <select v-model="selectedAddressId" @change="onSelectAddress" class="text-sm border border-blue-300 text-blue-600 rounded px-2 py-1 outline-none bg-blue-50 cursor-pointer">
                        <option :value="null">-- Nhập địa chỉ mới --</option>
                        <option v-for="addr in myAddresses" :key="addr.address_id" :value="addr.address_id">
                            {{ addr.recipient_name }} - {{ addr.phone }} {{ addr.is_default ? '(Mặc định)' : '' }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col gap-4">
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Họ và tên <span class="text-red-500">*</span></label>
                    <input v-model="form.name" type="text" class="input-field" :disabled="!!selectedAddressId" :class="{'error': errors.name}" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Số điện thoại <span class="text-red-500">*</span></label>
                    <input v-model="form.phone" type="text" class="input-field" :disabled="!!selectedAddressId" :class="{'error': errors.phone}" />
                  </div>
               </div>

               <div v-if="!selectedAddressId" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Tỉnh/Thành phố <span class="text-red-500">*</span></label>
                    <select v-model="form.city" @change="onCityChange" class="input-field" :class="{'error': errors.city}">
                      <option value="" disabled>Chọn Tỉnh/Thành phố</option>
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
                  <label class="text-sm text-gray-600">Địa chỉ chi tiết <span class="text-red-500">*</span></label>
                  <input v-model="form.address" type="text" class="input-field" :disabled="!!selectedAddressId" :class="{'error': errors.address}" />
               </div>

               <div v-if="!selectedAddressId" class="flex items-center gap-2 mt-2">
                   <input type="checkbox" v-model="saveToAddressBook" id="saveAddr" class="w-4 h-4 text-blue-600 rounded">
                   <label for="saveAddr" class="text-sm text-gray-600 cursor-pointer select-none">Lưu vào sổ địa chỉ cho lần sau</label>
               </div>

            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="font-bold text-gray-800 mb-4 uppercase text-sm">Phương thức vận chuyển</h2>
            <div class="border rounded p-4 flex justify-between items-center bg-blue-50 border-blue-200">
              <div>
                <p class="font-bold text-gray-800">Giao hàng tiêu chuẩn</p>
                <p class="text-sm text-gray-500">Dự kiến giao hàng: 3 - 5 ngày</p>
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
                  <span class="text-gray-700 font-medium">Chuyển khoản ngân hàng (Mã QR)</span>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{'border-blue-500 bg-blue-50': form.payment === 'cod'}">
                <input type="radio" value="cod" v-model="form.payment" class="w-5 h-5 text-blue-600 accent-blue-600">
                <div class="flex items-center gap-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png" class="w-8 h-8 object-contain" alt="COD">
                  <span class="text-gray-700 font-medium">Thanh toán khi nhận hàng (COD)</span>
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

                    

                    <!-- PHẦN MÃ GIẢM GIÁ -->

                    <div class="space-y-2 mb-4">

                      <div class="flex gap-2">

                        <input v-model.trim="voucherCode" type="text" placeholder="Nhập mã giảm giá" class="input-field flex-grow text-sm" :disabled="!!appliedVoucher">

                        <button @click="applyVoucher" :disabled="!voucherCode || !!appliedVoucher || isApplyingVoucher" class="bg-blue-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">

                          <span v-if="isApplyingVoucher" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>

                          <span v-else>Áp dụng</span>

                        </button>

                      </div>

                      <p v-if="voucherError" class="text-red-500 text-xs mt-1">{{ voucherError }}</p>

                      <p v-if="voucherSuccess" class="text-green-600 text-xs mt-1">{{ voucherSuccess }}</p>

                    </div>

                    <!-- KẾT THÚC PHẦN MÃ GIẢM GIÁ -->

        

        

                    <div class="bg-gray-50 p-3 rounded space-y-2 text-sm text-gray-600 border border-gray-100">

                      <div class="flex justify-between"><span>Tạm tính</span><span class="font-medium">{{ formatPrice(cartStore.totalPrice) }}đ</span></div>

                      <div class="flex justify-between"><span>Phí vận chuyển</span><span class="font-medium">{{ formatPrice(shippingFee) }}đ</span></div>

                      <div v-if="voucherDiscount > 0" class="flex justify-between text-green-600">

                        <span>Giảm giá</span>

                        <span class="font-medium">-{{ formatPrice(voucherDiscount) }}đ</span>

                      </div>

                    </div>

                    

                    <div class="flex justify-between items-end text-xl font-bold text-[#C92127] pt-4 mt-2 border-t">

                      <span class="text-base text-gray-800">Tổng thanh toán</span>

                      <span>{{ formatPrice(finalTotal) }}đ</span>

                    </div>

        

                    <button 

                      @click="submitOrder" 

                      :disabled="isLoading"

                      class="w-full bg-[#C92127] text-white font-bold py-3.5 rounded-lg mt-6 hover:bg-red-700 transition shadow-lg uppercase transform active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"

                    >

                      <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                      {{ isLoading ? 'Đang xử lý...' : 'Đặt hàng' }}

                    </button>

                  </div>

                </div>

        

              </div>

            </div>

        

            <div v-if="showQRModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">

                <div class="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">

                    <div class="bg-blue-600 p-4 text-white flex justify-between items-center">

                    <h3 class="font-bold text-lg flex items-center gap-2">Quét mã để thanh toán</h3>

                    <button @click="finishPayment" class="text-white/80 hover:text-white text-2xl leading-none">&times;</button>

                    </div>

                    <div class="p-6 text-center space-y-4">

                        <img :src="`https://qr.sepay.vn/img?bank=MBBank&acc=VQRQAGBEX7670&template=qronly&amount=${paymentInfo.amount}&des=${paymentInfo.content}`" class="w-64 h-64 object-contain mx-auto border-2 border-blue-100 rounded-lg">

                        <div class="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-3 border border-gray-200">

                            <div class="flex justify-between"><span>Số tiền:</span><span class="font-bold text-blue-600">{{ formatPrice(paymentInfo.amount) }}đ</span></div>

                            <div class="flex justify-between"><span>Nội dung:</span><span class="font-bold text-red-600">{{ paymentInfo.content }}</span></div>

                        </div>

                        <button @click="finishPayment" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Tôi đã thanh toán xong</button>

                    </div>

                </div>

            </div>

        

          </div>

        </template>

        

        <script setup>

        import { ref, reactive, onMounted, computed } from 'vue';

        import { useRouter } from 'vue-router';

        import { useCartStore } from '@/stores/cart';

        import api from '@/services/api';

        import axios from 'axios';

        

        const router = useRouter();

        const cartStore = useCartStore();

        

        const isLoading = ref(false);

        const showQRModal = ref(false);

        const paymentInfo = ref({});

        const saveToAddressBook = ref(false);

        

        const myAddresses = ref([]);

        const selectedAddressId = ref(null);

        

        const form = reactive({

          name: '',

          phone: '',

          city: '',

          district: '',

          ward: '',

          address: '',

          payment: 'sepay'

        });

        

        const locations = reactive({ cities: [], districts: [], wards: [] });

        const errors = reactive({ name: false, phone: false, city: false, district: false, ward: false, address: false });

        

        const shippingFee = 30000;

        

        // --- TRẠNG THÁI MÃ GIẢM GIÁ ---

        const voucherCode = ref('');

        const appliedVoucher = ref(null);

        const voucherError = ref('');

        const voucherSuccess = ref('');

        const isApplyingVoucher = ref(false);

        

        const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

        

        const voucherDiscount = computed(() => {

          if (!appliedVoucher.value) return 0;

          const { discount_type, value } = appliedVoucher.value;

          const orderValue = cartStore.totalPrice;

        

          if (discount_type === 'fixed') {

            return Math.min(Number(value), orderValue);

          }

          if (discount_type === 'percentage') {

            return (orderValue * Number(value)) / 100;

          }

          return 0;

        });

        

        const finalTotal = computed(() => {

          const total = cartStore.totalPrice + shippingFee - voucherDiscount.value;

          return total > 0 ? total : 0; // Đảm bảo tổng không âm

        });

        

        // --- LẤY DỮ LIỆU ---

        const fetchMyAddresses = async () => {

            try {

                const res = await api.get('/api/addresses');

                myAddresses.value = res || [];

                const defaultAddr = myAddresses.value.find(a => a.is_default);

                if (defaultAddr) {

                    selectedAddressId.value = defaultAddr.address_id;

                    onSelectAddress();

                }

            } catch (e) { console.error("Lỗi lấy địa chỉ", e); }

        };

        

        const fetchCities = async () => {

          try {

            const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');

            locations.cities = res.data;

          } catch (e) { console.error(e); }

        };

        

        onMounted(() => {

          fetchCities();

          fetchMyAddresses();

        });

        

        // --- LOGIC MÃ GIẢM GIÁ ---

        const applyVoucher = async () => {

          if (!voucherCode.value) return;

          isApplyingVoucher.value = true;

          voucherError.value = '';

          voucherSuccess.value = '';

          try {

            const res = await api.post('/api/vouchers/check', {

              code: voucherCode.value,

              orderValue: cartStore.totalPrice

            });

            // Interceptor trả về data trực tiếp

            appliedVoucher.value = res;

            voucherSuccess.value = `Áp dụng mã thành công! Bạn tiết kiệm được ${formatPrice(voucherDiscount.value)}đ.`;

          } catch (error) {

            appliedVoucher.value = null;

            voucherError.value = error.response?.data?.message || 'Lỗi khi áp dụng mã.';

          } finally {

            isApplyingVoucher.value = false;

          }

        };

        

        

        // --- LOGIC CHỌN ĐỊA CHỈ ---

        const onSelectAddress = () => {

            if (selectedAddressId.value) {

                const addr = myAddresses.value.find(a => a.address_id === selectedAddressId.value);

                if (addr) {

                    form.name = addr.recipient_name;

                    form.phone = addr.phone;

                    form.address = addr.address_detail;

                    form.city = ''; form.district = ''; form.ward = '';

                }

            } else {

                form.name = ''; form.phone = ''; form.address = '';

            }

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

        

        // --- GỬI ĐƠN HÀNG ---

        const submitOrder = async () => {

          if (!selectedAddressId.value) {

            if (!form.name || !form.phone || !form.city || !form.address) {

              return alert("Vui lòng điền đầy đủ thông tin địa chỉ!");

            }

          } else {

            if (!form.name || !form.phone) {

              return alert("Thông tin người nhận bị thiếu!");

            }

          }

        

          let finalAddress = form.address;

          if (!selectedAddressId.value) {

            const c = locations.cities.find(x => x.code == form.city)?.name || '';

            const d = locations.districts.find(x => x.code == form.district)?.name || '';

            const w = locations.wards.find(x => x.code == form.ward)?.name || '';

            finalAddress = `${form.address}, ${w}, ${d}, ${c}`;

          }

        

          isLoading.value = true;

        

          try {

            if (saveToAddressBook.value && !selectedAddressId.value) {

              try {

                await api.post('/api/addresses', {

                  recipient_name: form.name,

                  phone: form.phone,

                  address_detail: finalAddress,

                  is_default: myAddresses.value.length === 0

                });

              } catch (e) { console.error("Lỗi lưu địa chỉ:", e); }

            }

        

            const res = await api.post('/api/orders', {

              address_id: selectedAddressId.value || null,

              recipient_name: form.name,

              phone: form.phone,

              address_detail: finalAddress,

              payment_method: form.payment,

              voucher_code: appliedVoucher.value?.code || null 

            });

        

            if (res) {

              if (['sepay', 'bank_transfer'].includes(form.payment)) {

                paymentInfo.value = res.payment_info || { 

                  amount: res.final_amount, 

                  content: `SAHAFA${res.order_id}` 

                };

                showQRModal.value = true;

              } else {

                alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');

                cartStore.clearCart();

                router.push('/');

              }

            }

          } catch (error) {

            console.error("Lỗi Đặt Hàng:", error);

            const errorMsg = error.response?.data?.message || 'Lỗi hệ thống. Vui lòng thử lại!';

            alert(errorMsg);

          } finally {

            isLoading.value = false;

          }

        };

        const finishPayment = () => {

          showQRModal.value = false;

          cartStore.clearCart();

          alert('Đơn hàng đang chờ xử lý. Cảm ơn bạn!');

          router.push('/');

        };

        </script>

        

        <style scoped>

        .input-field {

          width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none;

        }

        .input-field:disabled { background-color: #f3f4f6; cursor: not-allowed; }

        </style>
