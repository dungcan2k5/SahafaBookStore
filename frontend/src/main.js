import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // CSS của Element Plus
import './style.css' // CSS của Tailwind
import App from './App.vue'
// import router from './router' // Tạm thời comment lại vì chưa tạo file router, tí mở sau

const app = createApp(App)

app.use(createPinia())
// app.use(router) // Tạm thời comment
app.use(ElementPlus)

app.mount('#app')