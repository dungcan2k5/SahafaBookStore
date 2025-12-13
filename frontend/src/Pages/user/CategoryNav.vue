<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div class="grid grid-cols-5 md:grid-cols-10 gap-4">
        
        <router-link 
          v-for="(item, index) in categories" 
          :key="index" 
          :to="item.path" 
          class="flex flex-col items-center justify-start cursor-pointer group hover:-translate-y-1 transition-transform duration-300 gap-2"
        >
          <div 
            class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl transition-colors p-3"
            :class="item.bgClass"
          >
            <component 
              :is="item.icon" 
              class="w-full h-full" 
              :class="item.iconClass" 
            />
          </div>
          
          <span class="text-[13px] text-center text-gray-600 font-medium group-hover:text-blue-600 transition-colors leading-tight px-1 h-8 flex items-start justify-center">
            {{ item.name }}
          </span>
        </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Calendar, Present, Ticket, CircleCheck, EditPen, 
  Lightning, Star, Shop, Compass, Notebook 
} from '@element-plus/icons-vue';

const categories = ref([
  { 
    name: '12.12', 
    icon: Calendar, 
    bgClass: 'bg-red-50 group-hover:bg-red-100', 
    iconClass: 'text-red-500',
    path: '/event-1212' // 👈 QUAN TRỌNG: Đường dẫn sang trang sự kiện
  },
  { 
    name: 'Gift Card', 
    icon: Present, 
    bgClass: 'bg-green-50 group-hover:bg-green-100',
    iconClass: 'text-green-600',
    path: '/gift-card' // 👈 Đường dẫn sang trang Gift Card
  },
  // Các mục khác tạm thời để dấu # (đứng yên)
  { name: 'Mã Giảm Giá', icon: Ticket, bgClass: 'bg-orange-50 group-hover:bg-orange-100', iconClass: 'text-orange-500', path: '#' },
  { name: 'Điểm Danh', icon: CircleCheck, bgClass: 'bg-blue-50 group-hover:bg-blue-100', iconClass: 'text-blue-500', path: '#' },
  { name: 'Deli', icon: EditPen, bgClass: 'bg-purple-50 group-hover:bg-purple-100', iconClass: 'text-purple-500', path: '#' },
  { name: 'Flash Sale', icon: Lightning, bgClass: 'bg-yellow-50 group-hover:bg-yellow-100', iconClass: 'text-yellow-500', path: '#' },
  { name: 'Sản Phẩm Mới', icon: Star, bgClass: 'bg-pink-50 group-hover:bg-pink-100', iconClass: 'text-pink-500', path: '#' },
  { name: 'Phiên Chợ Cũ', icon: Shop, bgClass: 'bg-teal-50 group-hover:bg-teal-100', iconClass: 'text-teal-600', path: '#' },
  { name: 'Ngoại Văn', icon: Compass, bgClass: 'bg-indigo-50 group-hover:bg-indigo-100', iconClass: 'text-indigo-500', path: '#' },
  { name: 'Manga', icon: Notebook, bgClass: 'bg-rose-50 group-hover:bg-rose-100', iconClass: 'text-rose-500', path: '#' },
]);
</script>