<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Clock, Ticket, Gift, Zap, ShoppingBag, Truck, Calendar } from 'lucide-vue-next';
import ProductCard from '../components/ProductCard.vue';

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
    { icon: Zap, label: "Flash Sale" },
    { icon: Ticket, label: "Mã Hot" },
    { icon: Truck, label: "Freeship" },
    { icon: Gift, label: "Quà Tặng" },
    { icon: Calendar, label: "Lịch Săn Deal" },
    { icon: ShoppingBag, label: "Bán Chạy" },
];

const products = ref(Array(10).fill({
    id: 1, 
    title: "Cây Cam Ngọt Của Tôi (Tái Bản)", 
    price: 96000, 
    oldPrice: 120000, 
    discount: 20, 
    sold: 1500, 
    image: "https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg", 
    rating: 5 
}));

// --- COUNTDOWN LOGIC ---
const countdown = ref({ h: 2, m: 45, s: 12 });
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value.s > 0) {
      countdown.value.s--;
    } else {
      countdown.value.s = 59;
      if (countdown.value.m > 0) countdown.value.m--;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="bg-primary min-h-screen font-sans pb-10">
    
    <header class="bg-white shadow-sm py-3 sticky top-0 z-50">
        <div class="container mx-auto px-4 flex justify-between items-center max-w-7xl">
            <h1 class="text-3xl font-black text-primary tracking-tighter">SAHAFA<span class="text-yellow-400">.COM</span></h1>
            <div class="flex gap-4 text-sm font-medium text-gray-600">
                <span class="hover:text-primary cursor-pointer">Thông báo</span>
                <span class="hover:text-primary cursor-pointer">Giỏ hàng</span>
                <span class="hover:text-primary cursor-pointer">Tài khoản</span>
            </div>
        </div>
    </header>

    <div class="container mx-auto px-4 py-6 max-w-7xl">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-primary-dark to-primary border-4 border-white/20">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            
            <div class="aspect-[3/1] flex items-center justify-center relative flex-col text-white p-8">
                <h1 class="text-[60px] md:text-[100px] font-black leading-none drop-shadow-lg tracking-tighter animate-pulse">12.12</h1>
                <h2 class="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4 bg-primary-dark/50 px-6 py-1 rounded-full backdrop-blur-sm border border-white/20">
                    Lễ Hội Mua Sắm Xanh
                </h2>
                <div class="flex gap-4 mt-2">
                    <span class="bg-white text-primary font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer">
                        ĐỒNG GIÁ 120K
                    </span>
                    <span class="bg-yellow-400 text-red-600 font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer">
                        VOUCHER 50%
                    </span>
                </div>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-4 mx-4 mb-4 rounded-xl border border-white/20">
               <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div v-for="(v, index) in vouchers" :key="index" class="bg-white flex rounded-lg overflow-hidden h-24 min-w-[260px] shadow-lg relative group">
                    <div class="bg-primary w-1.5 h-full absolute left-0 top-0"></div>
                    <div class="p-3 flex-1 flex flex-col justify-center border-r border-dashed border-gray-200">
                      <h3 class="text-primary font-bold text-lg">Giảm {{ v.value }}</h3>
                      <p class="text-xs text-gray-500">{{ v.condition }}</p>
                    </div>
                    <div class="w-16 flex items-center justify-center p-2 bg-primary-light/30">
                       <button class="text-[10px] font-bold bg-primary text-white px-2 py-1.5 rounded hover:bg-primary-dark transition shadow-md">
                         Lưu
                       </button>
                    </div>
                  </div>
               </div>
            </div>
        </div>

        <div class="flex flex-wrap justify-center gap-6 md:gap-10 py-8">
            <div v-for="(item, idx) in menuIcons" :key="idx" class="flex flex-col items-center gap-2 cursor-pointer group">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-primary group-hover:border-yellow-400 transition-all shadow-md text-primary">
                    <component :is="item.icon" :size="24" :strokeWidth="2" />
                </div>
                <span class="text-white font-medium text-xs md:text-sm group-hover:text-yellow-300 transition-colors">{{ item.label }}</span>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border-2 border-yellow-400">
            <div class="bg-gradient-to-r from-primary to-primary-dark p-4 flex justify-between items-center text-white">
                <div class="flex items-center gap-3">
                    <Zap class="fill-yellow-400 text-yellow-400 w-6 h-6 md:w-8 md:h-8 animate-bounce"/> 
                    <h2 class="text-xl md:text-2xl font-black italic uppercase">Flash Sale</h2>
                    <div class="hidden md:flex items-center gap-1 font-mono text-lg bg-black/20 px-3 py-1 rounded-lg ml-4">
                        <span class="text-sm mr-2">Kết thúc trong:</span>
                        <span class="bg-white text-primary font-bold px-1.5 rounded min-w-[28px] text-center">{{ countdown.h }}</span>:
                        <span class="bg-white text-primary font-bold px-1.5 rounded min-w-[28px] text-center">{{ countdown.m }}</span>:
                        <span class="bg-white text-primary font-bold px-1.5 rounded min-w-[28px] text-center">{{ countdown.s }}</span>
                    </div>
                </div>
                <button class="text-sm font-bold text-yellow-400 hover:text-white transition">Xem tất cả ></button>
            </div>

            <div class="p-6 bg-blue-50">
                 <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <ProductCard v-for="(p, idx) in products.slice(0, 5)" :key="idx" :product="p" />
                 </div>
            </div>
        </div>

        <div class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-white uppercase drop-shadow-md mb-6">Lịch Săn Deal</h2>
            <div class="flex flex-wrap justify-center gap-4">
                <div v-for="(item, idx) in timeline" :key="idx" 
                     class="bg-white rounded-xl p-4 w-40 md:w-48 border-b-4 border-yellow-400 transform hover:-translate-y-2 transition-transform cursor-pointer shadow-lg">
                    <div class="text-3xl md:text-4xl font-black text-primary mb-1">{{ item.date }}</div>
                    <div class="text-xs md:text-sm font-bold text-gray-800 uppercase">{{ item.title }}</div>
                    <div class="text-[10px] md:text-xs text-gray-500 uppercase">{{ item.sub }}</div>
                </div>
            </div>
        </div>

    </div>
    
  </div>
</template>

<style scoped>
/* Ẩn thanh cuộn cho list voucher */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>