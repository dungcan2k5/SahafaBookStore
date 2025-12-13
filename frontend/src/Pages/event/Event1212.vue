<template>
  <div class="bg-blue-600 min-h-screen font-sans pb-10">
    
    <div class="container mx-auto px-4 py-8">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-blue-800 to-blue-600 border-4 border-white/20">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div class="aspect-[3/1] flex items-center justify-center relative flex-col text-white p-8 text-center">
                <h1 class="text-[60px] md:text-[100px] font-black leading-none drop-shadow-lg tracking-tighter animate-pulse text-yellow-300">
                  12.12
                </h1>
                <h2 class="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-6 bg-blue-900/50 px-8 py-2 rounded-full backdrop-blur-md border border-white/30">
                    Lễ Hội Mua Sắm Xanh
                </h2>
                
                <div class="flex gap-4 mb-6">
                   <div class="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20 min-w-[80px]">
                      <span class="text-3xl font-black">{{ countdown.h }}</span>
                      <span class="text-xs uppercase">Giờ</span>
                   </div>
                   <div class="text-2xl font-bold mt-2">:</div>
                   <div class="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20 min-w-[80px]">
                      <span class="text-3xl font-black">{{ countdown.m }}</span>
                      <span class="text-xs uppercase">Phút</span>
                   </div>
                   <div class="text-2xl font-bold mt-2">:</div>
                   <div class="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20 min-w-[80px]">
                      <span class="text-3xl font-black text-yellow-300">{{ countdown.s }}</span>
                      <span class="text-xs uppercase">Giây</span>
                   </div>
                </div>

                <div class="flex gap-4 flex-wrap justify-center">
                    <button class="bg-white text-blue-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition hover:bg-gray-100">
                        ĐỒNG GIÁ 120K
                    </button>
                    <button class="bg-yellow-400 text-red-600 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition hover:bg-yellow-300">
                        VOUCHER 50%
                    </button>
                </div>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-4 mx-4 mb-4 rounded-xl border border-white/20">
               <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div v-for="(v, index) in vouchers" :key="index" class="bg-white flex rounded-lg overflow-hidden h-24 min-w-[260px] shadow-lg relative group shrink-0">
                    <div class="bg-blue-600 w-1.5 h-full absolute left-0 top-0"></div>
                    <div class="p-3 flex-1 flex flex-col justify-center border-r border-dashed border-gray-200">
                      <h3 class="text-blue-700 font-bold text-lg">Giảm {{ v.value }}</h3>
                      <p class="text-xs text-gray-500">{{ v.condition }}</p>
                    </div>
                    <div class="w-20 flex items-center justify-center p-2 bg-blue-50">
                       <button class="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition shadow-sm">
                         Lưu
                       </button>
                    </div>
                  </div>
               </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center gap-6 md:gap-12 py-8">
            <div v-for="(item, idx) in menuIcons" :key="idx" class="flex flex-col items-center gap-2 cursor-pointer group">
                <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover:-translate-y-2 transition duration-300">
                    <component :is="item.icon" class="w-8 h-8 text-blue-600 group-hover:text-yellow-500 transition" />
                </div>
                <span class="text-white font-medium text-sm group-hover:text-yellow-300 transition-colors">{{ item.label }}</span>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 mb-12">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-400">
            <div class="bg-gradient-to-r from-blue-700 to-blue-500 p-4 flex justify-between items-center text-white">
                <div class="flex items-center gap-2">
                    <Lightning class="w-8 h-8 text-yellow-300 animate-bounce" />
                    <h2 class="text-2xl font-black italic uppercase">Flash Sale</h2>
                </div>
                <button class="text-sm font-bold text-yellow-300 hover:text-white transition">Xem tất cả ></button>
            </div>

            <div class="p-6 bg-blue-50">
                 <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div v-for="i in 5" :key="i" class="bg-white p-3 rounded-xl shadow-sm hover:shadow-lg transition group cursor-pointer">
                        <div class="relative pt-[100%] mb-3">
                            <img src="https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg" class="absolute top-0 left-0 w-full h-full object-contain group-hover:scale-105 transition duration-300"/>
                            <div class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-20%</div>
                        </div>
                        <h3 class="text-sm font-medium text-gray-700 line-clamp-2 mb-2 h-10">Cây Cam Ngọt Của Tôi (Tái Bản)</h3>
                        <div class="text-red-600 font-bold text-lg">96.000đ</div>
                        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div class="bg-red-500 h-1.5 rounded-full" style="width: 70%"></div>
                        </div>
                        <div class="text-[10px] text-gray-500 mt-1">Đã bán 1.5k</div>
                    </div>
                 </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 pb-12 text-center">
        <h2 class="text-3xl font-bold text-white uppercase drop-shadow-md mb-8">Lịch Săn Deal</h2>
        <div class="flex flex-wrap justify-center gap-6">
            <div v-for="(item, idx) in timeline" :key="idx" 
                 class="bg-white rounded-2xl p-4 w-40 md:w-48 border-b-8 border-yellow-400 transform hover:-translate-y-2 transition-transform cursor-pointer shadow-xl">
                <div class="text-4xl font-black text-blue-700 mb-1">{{ item.date }}</div>
                <div class="text-sm font-bold text-gray-800 uppercase">{{ item.title }}</div>
                <div class="text-xs text-gray-500 uppercase">{{ item.sub }}</div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import Footer from '@/components/user/Footer.vue';
import { ref, onMounted, onUnmounted } from 'vue';
// Sử dụng bộ icon Element Plus có sẵn trong dự án của bạn
import { 
  Lightning, 
  Ticket, 
  Van, 
  Present, 
  Calendar, 
  ShoppingBag 
} from '@element-plus/icons-vue';

const vouchers = ref([
  { value: '10K', code: 'GIAM10K', condition: 'Đơn từ 120K' },
  { value: '15K', code: 'GIAM15K', condition: 'Đơn từ 150K' },
  { value: '25K', code: 'GIAM25K', condition: 'Đơn từ 250K' },
  { value: '50K', code: 'GIAM50K', condition: 'Đơn từ 500K' },
]);

const timeline = ref([
  { date: '12.12', title: 'DEAL KHỦNG', sub: 'SALE NGÀY ĐÔI' },
  { date: '15.12', title: 'DEAL VÀNG', sub: 'SALE GIỮA THÁNG' },
  { date: '25.12', title: 'DEAL HOT', sub: 'SALE CUỐI THÁNG' },
  { date: 'THỨ 4', title: 'FREESHIP', sub: 'NGẬP TRÀN' },
]);

const menuIcons = [
    { icon: Lightning, label: "Flash Sale" },
    { icon: Ticket, label: "Mã Hot" },
    { icon: Van, label: "Freeship" },
    { icon: Present, label: "Quà Tặng" },
    { icon: Calendar, label: "Lịch Săn Deal" },
    { icon: ShoppingBag, label: "Bán Chạy" },
];

// --- LOGIC ĐẾM NGƯỢC (Đã fix lỗi kẹt số) ---
const countdown = ref({ h: '02', m: '45', s: '12' });
let timer = null;

onMounted(() => {
  // Tổng thời gian tính bằng giây (Ví dụ: 2 giờ 45 phút 12 giây)
  let totalSeconds = 2 * 3600 + 45 * 60 + 12;

  timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer);
      return;
    }
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    // Format thêm số 0 đằng trước
    countdown.value.h = h.toString().padStart(2, '0');
    countdown.value.m = m.toString().padStart(2, '0');
    countdown.value.s = s.toString().padStart(2, '0');
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>