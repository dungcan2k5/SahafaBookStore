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
import SecondHandPage from '../Pages/event/SecondHandPage.vue'
import ForeignBooksPage from '../Pages/event/ForeignBooksPage.vue'
import MangaPage from '../Pages/event/MangaPage.vue'

// --- THÊM DÒNG NÀY ---
import CategoryDetail from '@/Pages/user/CategoryDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/trending', 
    name: 'Trending', 
    component: TrendingPage 
  },// New route for Trending page
  // Route cho trang gợi ý sách
  { 
    path: '/suggestions', 
    name: 'Suggestions', 
    component: SuggestionsPage 
  },
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: CheckoutPage 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
})

export default router