import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/user/Home.vue'
// import BookDetail from '../pages/user/BookDetail.vue'
import Login from '../pages/user/Login.vue'
import SuggestionsPage from '../pages/user/SuggestionsPage.vue'
import CheckoutPage from '../pages/user/CheckoutPage.vue'
import TrendingPage from '../pages/user/TrendingPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router