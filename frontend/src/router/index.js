import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/Pages/user/Home.vue'
import Login from '@/Pages/user/Login.vue'
import Event1212 from '@/Pages/event/Event1212.vue' 
import Cart from '@/Pages/user/Cart.vue' 
import SuggestionsPage from '@/Pages/user/SuggestionsPage.vue' 
import CheckoutPage from '@/Pages/user/CheckoutPage.vue' 
import TrendingPage from '@/Pages/user/TrendingPage.vue' 
import BookDetail from '@/Pages/user/BookDetail.vue' 

const routes = [
  // Trang chủ
  { path: '/', name: 'Home', component: Home },
  
  // Đăng nhập
  { path: '/login', name: 'Login', component: Login },
  
  // Sự kiện 12.12
  { path: '/event-1212', name: 'Event1212', component: Event1212 },
  
  // Giỏ hàng
  { path: '/cart', name: 'Cart', component: Cart },
  
  // Thanh toán
  { path: '/checkout', name: 'Checkout', component: CheckoutPage },
  
  // Xu hướng
  { path: '/trending', name: 'Trending', component: TrendingPage },
  
  // Gợi ý
  { path: '/suggestions', name: 'Suggestions', component: SuggestionsPage },
  { 
    path: '/books/:id', 
    name: 'BookDetail', 
    component: BookDetail 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Luôn cuộn lên đầu trang khi chuyển route
    return { top: 0 };
  }
})

export default router