import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/user/Home.vue'
// import BookDetail from '../pages/user/BookDetail.vue'
import Login from '../pages/user/Login.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  // { path: '/books/:id', name: 'BookDetail', component: BookDetail },
  { path: '/login', name: 'Login', component: Login } // <--- Thêm dòng này
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }// Luôn cuộn về đầu trang khi chuyển route
})

export default router