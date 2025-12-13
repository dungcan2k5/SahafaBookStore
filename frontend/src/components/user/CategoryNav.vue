<template>
  <div class="container mx-auto mt-6 px-4">
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div class="flex flex-wrap justify-between items-start gap-4 md:gap-8 px-4">
        
        <div 
          v-for="(item, index) in categories" 
          :key="index" 
          @click="goTo(item.path)"
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
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goTo = (path) => {
  if (path) router.push(path);
};
import { ref } from 'vue';

// Import các icon từ thư viện @element-plus/icons-vue
import { 
  Calendar,       // Thay cho CalendarDays
  Present,        // Thay cho Gift
  Ticket,         // Thay cho TicketPercent
  CircleCheck,    // Thay cho CheckCircle2
  EditPen,        // Thay cho PenTool
  Lightning,      // Thay cho Zap
  Star,           // Thay cho Sparkles
  Shop,           // Thay cho Store
  Compass,        // Thay cho Globe2 (Ngoại văn)
  Notebook        // Thay cho BookOpen (Manga)
} from '@element-plus/icons-vue';

const categories = ref([
  { 
    name: '12.12', 
    icon: Calendar, 
    bgClass: 'bg-red-50 group-hover:bg-red-100', 
    iconClass: 'text-red-500',
    path: '/event-1212'
  },
  { 
    name: 'Gift Card', 
    icon: Present, 
    bgClass: 'bg-green-50 group-hover:bg-green-100',
    iconClass: 'text-green-600',
    path: '/gift-card' 
  },
  { 
    name: 'Mã Giảm Giá', 
    icon: Ticket, 
    bgClass: 'bg-orange-50 group-hover:bg-orange-100', 
    iconClass: 'text-orange-500',
    path: '/vouchers'
  },
  { 
    name: 'Điểm Danh', 
    icon: CircleCheck, 
    bgClass: 'bg-blue-50 group-hover:bg-blue-100', 
    iconClass: 'text-blue-500',
    path: '/attendance'
  },
  { 
    name: 'Flash Sale', 
    icon: Lightning, 
    bgClass: 'bg-yellow-50 group-hover:bg-yellow-100', 
    iconClass: 'text-yellow-500',
    path: '/flash-sale'
  },
  { 
    name: 'Sản Phẩm Mới', 
    icon: Star, 
    bgClass: 'bg-pink-50 group-hover:bg-pink-100', 
    iconClass: 'text-pink-500',
    path: '/new-arrivals'
  },
  { 
    name: 'Phiên Chợ Cũ', 
    icon: Shop, 
    bgClass: 'bg-teal-50 group-hover:bg-teal-100', 
    iconClass: 'text-teal-600',
    path: '/second-hand'
  },
  { 
  name: 'Ngoại Văn', 
  icon: Compass, 
  bgClass: 'bg-indigo-50 group-hover:bg-indigo-100', 
  iconClass: 'text-indigo-500',
  path: '/foreign-books'
  },
  { 
    name: 'Manga', 
    icon: Notebook, 
    bgClass: 'bg-rose-50 group-hover:bg-rose-100',
    iconClass: 'text-rose-500'
  },
]);
</script>