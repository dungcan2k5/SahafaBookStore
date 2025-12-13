import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/user/Home.vue'
import Login from '@/pages/user/Login.vue'
import Cart from '@/pages/user/Cart.vue' // <--- 1. Thêm dòng này

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cart', name: 'Cart', component: Cart } // <--- 2. Thêm dòng này
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router