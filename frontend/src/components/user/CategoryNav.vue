<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div class="grid grid-cols-5 md:grid-cols-10 gap-4">
        
        <div 
          v-for="(item, index) in categories" 
          :key="index" 
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
              stroke-width="1.5"
            />
          </div>
          
          <span class="text-[13px] text-center text-gray-600 font-medium group-hover:text-fahasa-blue transition-colors leading-tight px-1 h-8 flex items-start justify-center">
            {{ item.name }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Import các icon từ thư viện lucide-vue-next
import { 
  CalendarDays, 
  Gift, 
  TicketPercent, 
  CheckCircle2, 
  PenTool, 
  Zap, 
  Sparkles, 
  Store, 
  Globe2, 
  BookOpen 
} from 'lucide-vue-next';

const categories = ref([
  { 
    name: '12.12', 
    icon: CalendarDays, 
    bgClass: 'bg-red-50 group-hover:bg-red-100', // Nền đỏ nhạt
    iconClass: 'text-red-500' // Icon đỏ
  },
  { 
    name: 'Gift Card', 
    icon: Gift, 
    bgClass: 'bg-green-50 group-hover:bg-green-100',
    iconClass: 'text-green-600'
  },
  { 
    name: 'Mã Giảm Giá', 
    icon: TicketPercent, 
    bgClass: 'bg-orange-50 group-hover:bg-orange-100',
    iconClass: 'text-orange-500'
  },
  { 
    name: 'Điểm Danh', 
    icon: CheckCircle2, 
    bgClass: 'bg-blue-50 group-hover:bg-blue-100',
    iconClass: 'text-blue-500'
  },
  { 
    name: 'Deli', 
    icon: PenTool, 
    bgClass: 'bg-purple-50 group-hover:bg-purple-100',
    iconClass: 'text-purple-500'
  },
  { 
    name: 'Flash Sale', 
    icon: Zap, 
    bgClass: 'bg-yellow-50 group-hover:bg-yellow-100',
    iconClass: 'text-yellow-500 fill-current' // fill-current để tô màu đặc bên trong
  },
  { 
    name: 'Sản Phẩm Mới', 
    icon: Sparkles, 
    bgClass: 'bg-pink-50 group-hover:bg-pink-100',
    iconClass: 'text-pink-500'
  },
  { 
    name: 'Phiên Chợ Cũ', 
    icon: Store, 
    bgClass: 'bg-teal-50 group-hover:bg-teal-100',
    iconClass: 'text-teal-600'
  },
  { 
    name: 'Ngoại Văn', 
    icon: Globe2, 
    bgClass: 'bg-indigo-50 group-hover:bg-indigo-100',
    iconClass: 'text-indigo-500'
  },
  { 
    name: 'Manga', 
    icon: BookOpen, 
    bgClass: 'bg-rose-50 group-hover:bg-rose-100',
    iconClass: 'text-rose-500'
  },
]);
</script>