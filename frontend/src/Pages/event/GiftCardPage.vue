<template>
  <div class="bg-gray-50 min-h-screen font-sans pb-10">
    
    <div class="bg-gradient-to-r from-blue-700 to-blue-600 relative overflow-hidden text-white">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div class="container mx-auto px-4 py-10 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div class="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 class="text-5xl md:text-7xl font-black drop-shadow-lg tracking-tighter mb-4" style="-webkit-text-stroke: 1px #1e3a8a;">
            GIFT <span class="text-yellow-400">CARD</span>
          </h1>
          <p class="text-xl md:text-3xl font-bold italic font-serif text-blue-100 mb-6">
            Thẻ quà tặng Sahafa - Mở ra thế giới tri thức
          </p>
          <div class="inline-block border-2 border-dashed border-blue-300 bg-blue-800/30 backdrop-blur-sm p-4 rounded-xl max-w-lg">
            <p class="text-sm md:text-base leading-relaxed">
              🎁 Món quà ý nghĩa dành tặng người thân, bạn bè. Sử dụng thanh toán tiện lợi trên toàn hệ thống Nhà sách Sahafa & Website.
            </p>
          </div>
        </div>
        
        <div class="md:w-1/2 flex justify-center">
           <img src="https://cdn0.fahasa.com/media/wysiwyg/Thang-12-2023/GiftCard_LandingPage_MainBanner_Mobile.jpg" 
                class="w-full max-w-[500px] object-contain drop-shadow-2xl hover:scale-105 transition duration-500 filter hue-rotate-[200deg]" 
                alt="Sahafa Gift Card" />
           </div>
      </div>
    </div>

    <div class="bg-blue-800 text-white py-10 -mt-1 relative z-20 shadow-xl">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-2xl md:text-3xl font-bold uppercase mb-10 tracking-wide text-yellow-400">
          Sử Dụng Tiện Lợi - Dùng Ở Mọi Nơi
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div class="flex items-center gap-6 border-2 border-blue-400/30 p-6 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 transition cursor-pointer">
            <div class="bg-white text-blue-800 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg shrink-0">🏪</div>
            <div>
              <h3 class="font-bold text-xl uppercase mb-1">TRỰC TIẾP</h3>
              <p class="text-sm opacity-90 text-blue-100">Thanh toán trực tiếp tại hệ thống nhà sách Sahafa toàn quốc.</p>
            </div>
          </div>
          <div class="flex items-center gap-6 border-2 border-blue-400/30 p-6 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 transition cursor-pointer">
            <div class="bg-white text-blue-800 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg shrink-0">🌐</div>
            <div>
              <h3 class="font-bold text-xl uppercase mb-1">WEB / APP</h3>
              <p class="text-sm opacity-90 text-blue-100">Chọn sản phẩm và nhập mã Gift Card ở bước thanh toán online.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 mt-12 mb-16">
      <div class="bg-white rounded-[2rem] shadow-xl border-4 border-blue-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
         <div class="md:w-1/3 relative group">
            <img src="https://placehold.co/600x375/1e3a8a/FFF?text=Sahafa+Gift+Card+100K&font=playfair-display" 
                 class="rounded-xl shadow-2xl w-full transform group-hover:rotate-2 transition duration-500" />
            <div class="absolute -top-4 -right-4 bg-yellow-400 text-blue-900 font-black px-4 py-2 rounded-full shadow-md">HOT</div>
         </div>
         <div class="md:w-2/3">
            <h2 class="text-4xl font-black text-blue-700 uppercase mb-4 drop-shadow-sm">Gift Card <span class="text-orange-500">100K</span></h2>
            <ul class="space-y-3 text-gray-600 text-lg mb-8">
               <li class="flex items-center gap-3"><span class="text-blue-500 text-xl">✔</span> Thẻ có giá trị tương đương tiền mặt <strong>100.000đ</strong></li>
               <li class="flex items-center gap-3"><span class="text-blue-500 text-xl">✔</span> Thẻ dùng <strong>1 lần duy nhất</strong>.</li>
               <li class="flex items-center gap-3"><span class="text-blue-500 text-xl">✔</span> Áp dụng cho toàn bộ hệ thống Sahafa (Online & Offline).</li>
            </ul>
            <button class="bg-blue-600 text-white text-lg font-bold px-10 py-3 rounded-full hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
              MUA NGAY
            </button>
         </div>
      </div>
    </div>

    <div class="container mx-auto px-4 space-y-16 mb-20">
      
      <section>
        <div class="flex items-center gap-4 mb-8">
           <div class="h-10 w-2 bg-blue-600 rounded-full"></div>
           <h3 class="font-bold text-gray-800 text-2xl uppercase">Bộ Sưu Tập Mùa Đông 200K</h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div v-for="i in 4" :key="i" class="group cursor-pointer">
              <div class="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border-2 border-transparent group-hover:border-blue-500">
                 <img :src="`https://placehold.co/600x375/${['1e3a8a','1d4ed8','2563eb','3b82f6'][i-1]}/FFF?text=Blue+Design+${i}`" 
                      class="w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div class="mt-3 text-center">
                <p class="font-bold text-gray-700 group-hover:text-blue-600 transition">Mẫu Blue Ice {{ i }}</p>
                <p class="text-blue-600 font-extrabold text-lg">200.000 đ</p>
              </div>
           </div>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-8">
           <div class="h-10 w-2 bg-cyan-500 rounded-full"></div>
           <h3 class="font-bold text-gray-800 text-2xl uppercase">Bộ sưu tập Tết 100K</h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div v-for="i in 4" :key="i" class="group cursor-pointer">
              <div class="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border-2 border-transparent group-hover:border-cyan-500">
                 <img :src="`https://placehold.co/600x375/${['0891b2','06b6d4','22d3ee','67e8f9'][i-1]}/FFF?text=Cyan+Design+${i}`" 
                      class="w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div class="mt-3 text-center">
                <p class="font-bold text-gray-700 group-hover:text-cyan-600 transition">Mẫu Cyan Sky {{ i }}</p>
                <p class="text-cyan-600 font-extrabold text-lg">100.000 đ</p>
              </div>
           </div>
        </div>
      </section>
    </div>

    <div class="bg-blue-600 py-16 text-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div class="container mx-auto px-4 relative z-10">
        <h2 class="text-center text-3xl md:text-4xl font-black uppercase mb-4 drop-shadow-md">Hướng Dẫn Sử Dụng</h2>
        <p class="text-center text-blue-100 mb-10 text-lg">Dễ dàng kích hoạt chỉ với vài bước đơn giản</p>

        <div class="flex justify-center mb-12">
           <div class="bg-blue-800/50 p-1.5 rounded-full flex backdrop-blur-md border border-blue-400/30">
              <button 
                @click="activeTab = 'desktop'"
                class="px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                :class="activeTab === 'desktop' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:bg-white/10'"
              >
                🖥️ Trên Máy Tính
              </button>
              <button 
                @click="activeTab = 'mobile'"
                class="px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
                :class="activeTab === 'mobile' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:bg-white/10'"
              >
                📱 Trên Điện Thoại
              </button>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           <div class="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition group text-center">
              <div class="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black shadow-lg mx-auto mb-6 group-hover:scale-110 transition">1</div>
              <div class="h-48 mb-6 overflow-hidden rounded-xl bg-blue-100 border-4 border-white/30 flex items-center justify-center">
                 <span class="text-blue-300 text-4xl">🖼️</span>
              </div>
              <h4 class="text-xl font-bold mb-2">Lấy mã thẻ</h4>
              <p class="text-sm text-blue-100 leading-relaxed">Cào lớp tráng bạc trên thẻ hoặc kiểm tra Email để lấy mã code 8 ký tự.</p>
           </div>

           <div class="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition group text-center">
              <div class="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black shadow-lg mx-auto mb-6 group-hover:scale-110 transition">2</div>
              <div class="h-48 mb-6 overflow-hidden rounded-xl bg-blue-100 border-4 border-white/30 flex items-center justify-center">
                 <span class="text-blue-300 text-4xl">⌨️</span>
              </div>
              <h4 class="text-xl font-bold mb-2">Nhập mã giảm giá</h4>
              <p class="text-sm text-blue-100 leading-relaxed">Tại bước thanh toán, nhập mã vào ô <strong>"Mã giảm giá/Giftcard"</strong> và bấm Áp dụng.</p>
           </div>

           <div class="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition group text-center">
              <div class="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-black shadow-lg mx-auto mb-6 group-hover:scale-110 transition">3</div>
              <div class="h-48 mb-6 overflow-hidden rounded-xl bg-blue-100 border-4 border-white/30 flex items-center justify-center">
                 <span class="text-blue-300 text-4xl">🎉</span>
              </div>
              <h4 class="text-xl font-bold mb-2">Hoàn tất</h4>
              <p class="text-sm text-blue-100 leading-relaxed">Hệ thống sẽ trừ trực tiếp giá trị thẻ vào đơn hàng. Mua sắm thành công!</p>
           </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-20">
       <div class="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <h2 class="text-3xl md:text-4xl font-black text-center text-blue-700 mb-12 uppercase tracking-tight relative z-10">
            Quy định sử dụng thẻ
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
             <div class="order-2 lg:order-1 space-y-6">
                <div class="flex gap-4">
                   <div class="bg-blue-100 p-3 rounded-xl h-fit text-blue-600 font-bold">1</div>
                   <div>
                      <h3 class="font-bold text-gray-800 text-lg mb-1">Mệnh giá & Giá trị</h3>
                      <p class="text-sm text-gray-600 leading-relaxed">Thẻ có giá trị tương đương tiền mặt. Thẻ chỉ dùng <strong>1 lần duy nhất</strong>. Không quy đổi thành tiền mặt.</p>
                   </div>
                </div>
                <div class="flex gap-4">
                   <div class="bg-cyan-100 p-3 rounded-xl h-fit text-cyan-600 font-bold">2</div>
                   <div>
                      <h3 class="font-bold text-gray-800 text-lg mb-1">Phạm vi sử dụng</h3>
                      <p class="text-sm text-gray-600 leading-relaxed">Áp dụng cho toàn bộ sản phẩm trên Website Sahafa.com và hệ thống nhà sách toàn quốc.</p>
                   </div>
                </div>
                <div class="flex gap-4">
                   <div class="bg-yellow-100 p-3 rounded-xl h-fit text-yellow-600 font-bold">3</div>
                   <div>
                      <h3 class="font-bold text-gray-800 text-lg mb-1">Bảo mật</h3>
                      <p class="text-sm text-gray-600 leading-relaxed">Khách hàng vui lòng bảo mật mã thẻ. Sahafa không chịu trách nhiệm nếu thẻ bị mất hoặc lộ thông tin.</p>
                   </div>
                </div>
             </div>
             
             <div class="order-1 lg:order-2 flex justify-center">
                <div class="relative w-full max-w-md">
                   <div class="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 opacity-20 transform translate-x-4 translate-y-4"></div>
                   <img src="https://placehold.co/500x300/1e3a8a/FFF?text=Rules+%26+Terms&font=roboto" 
                        class="w-full rounded-2xl shadow-xl relative z-10 border-4 border-white" 
                        alt="Quy định sử dụng"/>
                </div>
             </div>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// State quản lý Tabs
const activeTab = ref('desktop');
</script>

<style scoped>
/* Không cần thêm CSS custom nhiều vì Tailwind đã lo hết */
</style>