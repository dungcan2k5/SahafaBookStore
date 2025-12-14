import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/user/Home.vue'
import Login from '@/pages/user/Login.vue'
import Cart from '@/pages/user/Cart.vue' // Code của bạn
import SuggestionsPage from '@/pages/user/SuggestionsPage.vue' // Code của Khai
import CheckoutPage from '@/pages/user/CheckoutPage.vue' // Code của Khai
import TrendingPage from '@/pages/user/TrendingPage.vue' // Code của Khai
import Term from '../pages/user/Term.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/cart', name: 'Cart', component: Cart }, // Route Cart của bạn
  { 
    path: '/trending', 
    name: 'Trending', 
    component: TrendingPage 
  },
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
  {
    path: '/policy/:slug',
      name: 'policy',
      component: Term,
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