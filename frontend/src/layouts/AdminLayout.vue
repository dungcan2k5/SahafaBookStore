<template>
  <div class="common-layout min-h-screen w-full flex">
    <el-aside width="220px" class="bg-[#001529] text-white flex flex-col transition-all shadow-xl z-20 sticky top-0 h-screen">
      <div class="h-16 flex items-center justify-center border-b border-gray-700 bg-[#002140] shrink-0">
           <span class="text-xl font-bold tracking-wider text-white">
             SAHAFA <span class="text-yellow-400">ADMIN</span>
           </span>
      </div>

      <el-menu
        active-text-color="#ffd04b"
        background-color="#001529"
        class="el-menu-vertical-demo border-none flex-1"
        :default-active="activePath"
        text-color="#fff"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>Tổng quan & Doanh thu</span>
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><Reading /></el-icon>
            <span>Quản lý Sản phẩm</span>
          </template>
          <el-menu-item index="/admin/books">Sách</el-menu-item>
          <el-menu-item index="/admin/categories">Danh mục & Thể loại</el-menu-item>
          <el-menu-item index="/admin/authors">Tác giả</el-menu-item>
          <el-menu-item index="/admin/inventory">Xuất / Nhập kho</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>Bán hàng</span>
          </template>
          <el-menu-item index="/admin/orders">Đơn hàng</el-menu-item>
          
          <el-menu-item index="/admin/payments">
            <el-icon><Money /></el-icon>
            <span>Quản lý Thanh toán</span>
          </el-menu-item>

          <el-menu-item index="/admin/vouchers">Mã giảm giá (Voucher)</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/posts"> 
          <el-icon><Document /></el-icon>
          <span>Quản lý Bài viết (Posts)</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/users"> 
          <el-icon><User /></el-icon>
          <span>Quản lý Người dùng</span>
        </el-menu-item>
        
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>Về trang bán hàng</span>
        </el-menu-item>

      </el-menu>
    </el-aside>

    <div class="flex-1 flex flex-col bg-gray-100">
      <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
          <div class="text-gray-500 font-medium flex items-center gap-2">
             <el-icon class="text-lg"><Fold /></el-icon>
             Trang quản trị hệ thống Sahafa Bookstore
          </div>
          <div class="flex items-center gap-4">
              <el-tag type="success" effect="dark">Admin</el-tag>
              <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                  <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                  <span class="text-sm font-bold text-gray-700">Demo User</span>
              </div>
          </div>
      </header>
      
      <main class="flex-1 p-6">
         <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear" mode="out-in">
              <component :is="Component" />
            </transition>
         </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
//Import thêm icon Money
import { 
  DataLine, Reading, ShoppingCart, Document, HomeFilled, Fold, Money, User 
} from '@element-plus/icons-vue';

const route = useRoute();
const activePath = computed(() => route.path);
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
}
</style>