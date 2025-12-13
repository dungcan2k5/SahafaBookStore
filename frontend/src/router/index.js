import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/user/Home.vue'
import Event1212 from '../Pages/event/Event1212.vue'
//import BookDetail from '../Pages/user/BookDetail.vue'
import Login from '../Pages/user/Login.vue'
import SuggestionsPage from '../Pages/user/SuggestionsPage.vue'
import CheckoutPage from '../Pages/user/CheckoutPage.vue'
import TrendingPage from '../Pages/user/TrendingPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  // { path: '/books/:id', name: 'BookDetail', component: BookDetail },
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
  },
  { path: '/event-1212', 
    name: 'Event1212', 
    component: Event1212 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }// Luôn cuộn về đầu trang khi chuyển route
})

export default router