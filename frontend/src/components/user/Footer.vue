<template>
  <footer class="bg-white border-t border-gray-200 mt-10 pt-10 pb-6">
    <div class="container mx-auto px-4">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        
        <div>
          <div class="text-3xl font-bold text-blue-600 mb-4 tracking-tighter flex items-center">
            Sahafa<span class="text-yellow-400">.com</span>
          </div>
          
          <div class="space-y-3">
            <p class="font-bold text-gray-800 uppercase">Công Ty Cổ Phần Phát Hành Sách Sahafa</p>
            <p>Địa chỉ: (Đang cập nhật...)</p> 
            
            <p class="leading-relaxed">
              Sahafa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng.
            </p>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-gray-800 uppercase mb-4 text-base">DỊCH VỤ</h3>
          <ul class="space-y-2">
            <li>
              <router-link :to="{ name: 'policy', params: { slug: 'dieu-khoan-su-dung' }}" class="hover:text-blue-600 transition">
                Điều khoản sử dụng
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'policy', params: { slug: 'chinh-sach-bao-mat' }}" class="hover:text-blue-600 transition">
                Chính sách bảo mật thông tin cá nhân
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'policy', params: { slug: 'bao-mat-thanh-toan' }}" class="hover:text-blue-600 transition">
                Chính sách bảo mật thanh toán
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-blue-600 transition">
                Giới thiệu Sahafa
              </router-link>
            </li>
            <li>
              <router-link to="/store-system" class="hover:text-blue-600 transition">
                Hệ thống nhà sách
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-gray-800 uppercase mb-4 text-base">TÀI KHOẢN CỦA TÔI</h3>
          <ul class="space-y-2 mb-6">
            <li><router-link to="/login" class="hover:text-blue-600 transition">Đăng nhập / Tạo mới tài khoản</router-link></li>
            <li><a href="#" class="hover:text-blue-600 transition">Thay đổi địa chỉ khách hàng</a></li>
            <li><a href="#" class="hover:text-blue-600 transition">Chi tiết tài khoản</a></li>
            <li><a href="#" class="hover:text-blue-600 transition">Lịch sử mua hàng</a></li>
          </ul>

          <h3 class="font-bold text-gray-800 uppercase mb-3 text-base">LIÊN HỆ</h3>
          <div class="space-y-2">
            <p class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              cskh@sahafa.dungcan.id.vn
            </p>
            <p class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              1900 636469
            </p>
          </div>
        </div>

      </div>

      <div class="border-t mt-8 pt-6 text-center">
        <p class="text-gray-400 text-xs mb-1">
          Giấy chứng nhận Đăng ký Kinh doanh số 0123456789 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 20/12/2025
        </p>
        <p class="text-gray-500 text-xs font-medium">
          &copy; 2025 Sahafa.com - All Rights Reserved
        </p>
      </div>

    </div>
  </footer>
</template>