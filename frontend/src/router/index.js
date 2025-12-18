import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/user/Home.vue' 
import Login from '@/pages/user/Login.vue'
import Event1212 from '@/pages/event/Event1212.vue'
import Cart from '@/pages/user/Cart.vue' 
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue' 
import CheckoutPage from '@/pages/user/CheckoutPage.vue' 
import TrendingPage from '@/pages/user/TrendingPage.vue' 
import BookDetail from '@/pages/user/BookDetail.vue' 
import GiftCardPage from '@/pages/event/GiftCardPage.vue'
import VoucherPage from '@/pages/event/VoucherPage.vue'
import AttendancePage from '@/pages/event/AttendancePage.vue'
import FlashSalePage from '@/pages/event/FlashSalePage.vue'
import NewArrivalsPage from '@/pages/event/NewArrivalsPage.vue'
import SecondHandPage from '@/pages/event/SecondHandPage.vue'
import ForeignBooksPage from '@/pages/event/ForeignBooksPage.vue'
import MangaPage from '@/pages/event/MangaPage.vue'
import Term from '@/pages/user/Term.vue'

// --- THÊM DÒNG NÀY ---
import CategoryDetail from '@/pages/user/CategoryDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/event-1212', name: 'Event1212', component: Event1212 },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage },
  { path: '/trending', name: 'Trending', component: TrendingPage },
  { path: '/suggestions', name: 'Suggestions', component: SuggestionsPage },
  { path: '/books/:id', name: 'BookDetail', component: BookDetail },
  { path: '/gift-card', name: 'GiftCard', component: GiftCardPage },
  { path: '/vouchers', name: 'VoucherPage', component: VoucherPage },
  { path: '/attendance', name: 'Attendance', component: AttendancePage },
  { path: '/flash-sale', name: 'FlashSale', component: FlashSalePage },
  { path: '/new-arrivals', name: 'NewArrivals', component: NewArrivalsPage },
  { path: '/second-hand', name: 'SecondHand', component: SecondHandPage },
  { path: '/foreign-books', name: 'ForeignBooks', component: ForeignBooksPage },
  { path: '/manga', name: 'Manga', component: MangaPage },
  { path: '/policy/:slug', name: 'policy', component: Term },
  
  { 
    path: '/category/:id', 
    name: 'CategoryDetail', 
    component: CategoryDetail 
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