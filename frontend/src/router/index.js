import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 

// --- TRANG NGƯỜI DÙNG ---
import Home from '@/pages/user/Home.vue' 
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
import CategoryDetail from '@/pages/user/CategoryDetail.vue'
import BooksListing from '@/pages/user/BooksListing.vue';

// --- LAYOUT QUẢN TRỊ ---
import AdminLayout from '@/layouts/AdminLayout.vue' 

const routes = [
  // ================== TUYẾN ĐƯỜNG NGƯỜI DÙNG (CÔNG KHAI) ==================
  { path: '/', name: 'Home', component: Home },
  { path: '/event-1212', name: 'Event1212', component: Event1212 },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage },
  { path: '/trending', name: 'Trending', component: TrendingPage },
  { path: '/suggestions', name: 'Suggestions', component: SuggestionsPage },
   
  { path: '/books', name: 'BooksListing', component: BooksListing },
  
  // Tuyến đường động cho Chi tiết Sách
  { path: '/books/:slug', name: 'BookDetail', component: BookDetail },
  
  { path: '/gift-card', name: 'GiftCard', component: GiftCardPage },
  { path: '/vouchers', name: 'VoucherPage', component: VoucherPage },
  { path: '/attendance', name: 'Attendance', component: AttendancePage },
  { path: '/flash-sale', name: 'FlashSale', component: FlashSalePage },
  { path: '/new-arrivals', name: 'NewArrivals', component: NewArrivalsPage },
  { path: '/second-hand', name: 'SecondHand', component: SecondHandPage },
  { path: '/foreign-books', name: 'ForeignBooks', component: ForeignBooksPage },
  { path: '/manga', name: 'Manga', component: MangaPage },
  
  { path: '/policy/:slug', name: 'policy', component: Term },
  { path: '/category/:id', name: 'CategoryDetail', component: CategoryDetail },
  
  { path: '/about', name: 'About', component: () => import('@/pages/user/About.vue') },
  { path: '/store-system', name: 'StoreSystem', component: () => import('@/pages/user/StoreSystem.vue') },
  { path: '/user/profile', name: 'UserProfile', component: () => import('@/pages/user/UserProfile.vue')},

  // --- TUYẾN ĐƯỜNG BLOG & TIN TỨC ---
  { path: '/blog', name: 'Blog', component: () => import('@/pages/user/BlogPage.vue') },
  { path: '/blog/:slug', name: 'PostDetail', component: () => import('@/pages/user/PostDetail.vue') },
  { 
    path: '/news/:slug', 
    name: 'news-detail', 
    component: () => import('@/pages/user/PostDetail.vue') 
  },

  // ================== TUYẾN ĐƯỜNG QUẢN TRỊ (RIÊNG TƯ) ==================
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: ['admin', 'employee'] },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/pages/admin/DashboardPage.vue') },
      { path: 'authors', name: 'AdminAuthors', component: () => import('@/pages/admin/AuthorManager.vue') },
      { path: 'books', name: 'AdminBooks', component: () => import('@/pages/admin/BookManager.vue') },
      { path: 'categories', name: 'AdminCategories', component: () => import('@/pages/admin/CategoryManager.vue') },
      { path: 'inventory', name: 'AdminInventory', component: () => import('@/pages/admin/InventoryManager.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('@/pages/admin/OrderManager.vue') },
      { path: 'vouchers', name: 'AdminVouchers', component: () => import('@/pages/admin/VoucherManager.vue') },
      { path: 'payments', name: 'admin-payments', component: () => import('@/pages/admin/TransactionManager.vue'), meta: { title: 'Quản lý Thanh toán' } },
      { path: 'posts', name: 'AdminPosts', component: () => import('@/pages/admin/PostManager.vue'), meta: { title: 'Quản lý Bài viết' } },
      { path: 'users', name: 'AdminUsers', component: () => import('@/pages/admin/UserManager.vue'), meta: { title: 'Quản lý Người dùng' } }
    ]
  },

  // ================== 404 KHÔNG TÌM THẤY ==================
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: () => import('@/pages/NotFound.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
})

// ================== BẢO VỆ ĐƯỜNG DẪN ==================
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (to.meta.requiresAuth) {
    if (!user) return next({ path: '/' }); 
    if (to.meta.role && !to.meta.role.includes(user.role)) {
      alert('Bạn không có quyền truy cập trang này!');
      return next({ path: '/' });
    }
  }
  next();
});

export default router