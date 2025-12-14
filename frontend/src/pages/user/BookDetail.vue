<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <router-link to="/" class="hover:text-[#C92127]">Trang chủ</router-link> 
        <span>/</span>
        <span class="text-gray-800 font-medium truncate">{{ book?.title || 'Đang tải...' }}</span>
      </div>

      <div v-if="book" class="bg-white rounded-xl shadow-sm overflow-hidden p-4 md:p-8 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div class="md:col-span-5 lg:col-span-4">
            <div class="border rounded-lg overflow-hidden relative group p-2 mb-4">
              <img :src="book.image" class="w-full h-auto object-contain max-h-[400px]" :alt="book.title" />
              <div v-if="book.discount > 0" class="absolute top-4 right-4 bg-[#C92127] text-white font-bold px-3 py-1 rounded-md">
                -{{ book.discount }}%
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2">
               <div v-for="i in 4" :key="i" class="border rounded p-1 cursor-pointer hover:border-[#C92127] transition">
                 <img :src="book.image" class="w-full h-full object-cover">
               </div>
            </div>
          </div>

          <div class="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            <h1 class="text-2xl md:text-3xl font-medium text-gray-800 leading-tight">
              {{ book.title }}
            </h1>

            <div class="flex items-center gap-4 text-sm">
              <div class="flex text-yellow-400">★★★★★</div>
              <span class="text-gray-400">|</span>
              <span class="text-gray-500">Đã bán {{ book.sold }}</span>
              <span class="text-gray-400">|</span>
              <span class="text-blue-600 font-medium">Tình trạng: Còn hàng</span>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg flex items-end gap-3 mt-2">
              <span class="text-3xl font-bold text-[#C92127]">{{ formatPrice(book.price) }} đ</span>
              <span v-if="book.discount > 0" class="text-gray-400 text-lg line-through mb-1">
                {{ formatPrice(book.price * 1.2) }} đ
              </span>
            </div>

            <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-4 max-w-md mt-2">
                <div>Mã hàng</div><div class="font-medium text-black">893523522{{ book.id }}</div>
                <div>Nhà cung cấp</div><div class="font-medium text-blue-600">Nhã Nam</div>
                <div>Nhà xuất bản</div><div class="font-medium text-black">NXB Hội Nhà Văn</div>
            </div>

            <div class="mt-2 border-t pt-6">
              <span class="font-bold text-gray-700 block mb-3">Số lượng:</span>
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex items-center border border-gray-300 w-max rounded-md h-[44px]">
                    <button @click="quantity > 1 ? quantity-- : null" class="px-4 hover:bg-gray-100 text-gray-600 h-full font-bold">-</button>
                    <input type="number" v-model="quantity" class="w-14 text-center outline-none font-bold text-gray-700 h-full border-l border-r border-gray-100" readonly />
                    <button @click="quantity++" class="px-4 hover:bg-gray-100 text-gray-600 h-full font-bold">+</button>
                </div>

                <button 
                    @click="handleAddToCart"
                    class="flex-1 h-[44px] border-2 border-[#C92127] text-[#C92127] font-bold rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2 px-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Thêm vào giỏ hàng
                </button>
                <button class="flex-1 h-[44px] bg-[#C92127] text-white font-bold rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition px-6">
                    Mua Ngay
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-if="book" class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-xl font-bold uppercase border-b pb-3 mb-4 text-gray-800">Mô tả sản phẩm</h3>
        <div class="text-gray-700 leading-relaxed space-y-3 text-justify">
          <p>
            Đây là cuốn sách <b>{{ book.title }}</b>, một trong những tác phẩm được yêu thích nhất hiện nay.
            Nội dung hấp dẫn, lôi cuốn người đọc từ những trang đầu tiên.
          </p>
          <p>
            Sách được in ấn chất lượng cao, bìa đẹp, thích hợp để sưu tầm hoặc làm quà tặng cho bạn bè và người thân.
            Đừng bỏ lỡ cơ hội sở hữu cuốn sách tuyệt vời này với mức giá ưu đãi tại Sahafa.com.
          </p>
          <p class="italic text-gray-500">(Nội dung mô tả chi tiết đang được cập nhật...)</p>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-500 mb-4">Đang tìm kiếm thông tin sách...</p>
        <router-link to="/" class="text-blue-600 hover:underline">Quay lại trang chủ</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const cartStore = useCartStore();

const quantity = ref(1);
const book = ref(null);

// Format tiền tệ
const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

// DỮ LIỆU MOCK (Giả lập Database - Phải khớp ID với bên CategoryDetail)
const mockDatabase = [
  { id: 1, category: 'van-hoc', title: 'Mắt Biếc - Nguyễn Nhật Ánh', price: 110000, discount: 20, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/m/a/mat-biec-bia-mem-2019.jpg' },
  { id: 2, category: 'van-hoc', title: 'Nhà Giả Kim', price: 79000, discount: 15, sold: 5000, image: 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha_gia_kim_2020_1.jpg' },
  { id: 3, category: 'van-hoc', title: 'Cây Cam Ngọt Của Tôi', price: 108000, discount: 30, sold: 3200, image: 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg' },
  { id: 4, category: 'kinh-te', title: 'Cha Giàu Cha Nghèo', price: 85000, discount: 30, sold: 3000, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/cha-giau-cha-ngheo-tap-1-_tai-ban-2021_.jpg' },
  { id: 5, category: 'kinh-te', title: 'Nhà Đầu Tư Thông Minh', price: 150000, discount: 10, sold: 500, image: 'https://cdn0.fahasa.com/media/catalog/product/n/h/nha_dau_tu_thong_minh_tai_ban_2020.jpg' },
  { id: 6, category: 'tam-ly', title: 'Đắc Nhân Tâm', price: 76000, discount: 25, sold: 9000, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg' },
  { id: 7, category: 'tam-ly', title: 'Tâm Lý Học Về Tiền', price: 189000, discount: 15, sold: 1200, image: 'https://cdn0.fahasa.com/media/catalog/product/t/a/tam-ly-hoc-ve-tien.jpg' },
  { id: 8, category: 'thieu-nhi', title: 'Dế Mèn Phiêu Lưu Ký', price: 35000, discount: 10, sold: 800, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8936037718029.jpg' },
  { id: 9, category: 'thieu-nhi', title: 'Chuyện Con Mèo Dạy Hải Âu Bay', price: 49000, discount: 20, sold: 2500, image: 'https://cdn0.fahasa.com/media/catalog/product/c/h/chuyen-con-meo-day-hai-au-bay-tai-ban-2019.jpg' },
  { id: 10, category: 'giao-khoa', title: 'Toán Lớp 1 - Cánh Diều', price: 20000, discount: 0, sold: 10000, image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_41989.jpg' },
  { id: 11, category: 'nuoi-day-con', title: 'Phương Pháp Ăn Dặm Bé Chỉ Huy', price: 120000, discount: 15, sold: 400, image: 'https://cdn0.fahasa.com/media/catalog/product/p/h/phuong-phap-an-dam-be-chi-huy.jpg' },
];

onMounted(() => {
  // 1. Lấy ID từ trên thanh địa chỉ (URL)
  const idFromUrl = parseInt(route.params.id);
  
  // 2. Tìm sách tương ứng trong Database giả
  const foundBook = mockDatabase.find(b => b.id === idFromUrl);
  
  // 3. Nếu thấy thì hiển thị, không thấy thì hiện sách mặc định (để tránh lỗi trắng trang)
  if (foundBook) {
    book.value = foundBook;
  } else {
    // Fallback nếu người dùng nhập ID linh tinh
    book.value = mockDatabase[0];
  }
});

// Xử lý Thêm vào giỏ hàng
const handleAddToCart = () => {
  if (book.value) {
    // Tạo object sản phẩm để gửi vào Store
    const productToAdd = {
      id: book.value.id,
      title: book.value.title,
      price: book.value.price,
      image: book.value.image,
    };
    
    // Gọi hàm từ Store (kèm số lượng)
    cartStore.addToCart(productToAdd, quantity.value);
    
    // Thông báo đơn giản
    alert(`Đã thêm ${quantity.value} cuốn "${book.value.title}" vào giỏ hàng!`);
  }
};
</script>