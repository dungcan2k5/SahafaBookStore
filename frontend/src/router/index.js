import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/user/Home.vue'
// import BookDetail from '../pages/user/BookDetail.vue'
import Login from '../pages/user/Login.vue'
import Event1212 from '../Pages/event/Event1212.vue' 
import CategoryNav from '../components/user/CategoryNav.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/event-1212',
    name: 'Event1212', 
    component: Event1212
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }// Luôn cuộn về đầu trang khi chuyển route
})

export default router