import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/Pages/user/Home.vue'
import Login from '@/Pages/user/Login.vue'
import Event1212 from '@/Pages/event/Event1212.vue' 
import Cart from '@/Pages/user/Cart.vue' 
import SuggestionsPage from '@/Pages/user/SuggestionsPage.vue' 
import CheckoutPage from '@/Pages/user/CheckoutPage.vue' 
import TrendingPage from '@/Pages/user/TrendingPage.vue' 
import BookDetail from '@/Pages/user/BookDetail.vue' 
import GiftCardPage from '../Pages/event/GiftCardPage.vue'
import VoucherPage from '../Pages/event/VoucherPage.vue'
import AttendancePage from '../Pages/event/AttendancePage.vue'
import FlashSalePage from '../Pages/event/FlashSalePage.vue'
import NewArrivalsPage from '../Pages/event/NewArrivalsPage.vue'
import SecondHandPage from '../Pages/user/SecondHandPage.vue'
import ForeignBooksPage from '../Pages/event/ForeignBooksPage.vue'
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
  },
  { path: '/gift-card', name: 'GiftCard', component: GiftCardPage },
  { path: '/vouchers', name: 'VoucherPage', component: VoucherPage },
  { path: '/attendance', name: 'Attendance', component: AttendancePage },
  { path: '/flash-sale', name: 'FlashSale', component: FlashSalePage },
  { path: '/new-arrivals', name: 'NewArrivals', component: NewArrivalsPage },
  { path: '/second-hand', name: 'SecondHand', component: SecondHandPage },
  { path: '/foreign-books', name: 'ForeignBooks', component: ForeignBooksPage }
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