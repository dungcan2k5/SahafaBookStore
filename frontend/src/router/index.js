import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/user/Home.vue'
// import BookDetail from '../pages/user/BookDetail.vue'
import Login from '../pages/user/Login.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  // { path: '/books/:id', name: 'BookDetail', component: BookDetail },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/suggestions', 
    name: 'Suggestions', 
    component: SuggestionsPage 
  } // New route for SuggestionsPage
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router