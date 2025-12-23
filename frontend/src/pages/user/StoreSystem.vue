<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-600 mb-2 uppercase">Hệ Thống Nhà Sách Sahafa</h1>
        <p class="text-gray-600">Tìm nhà sách gần bạn nhất để trải nghiệm không gian văn hóa đọc tuyệt vời</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-gray-200">
        
        <div class="w-full lg:w-1/3 border-r border-gray-200 flex flex-col">
          
          <div class="flex border-b border-gray-200 bg-gray-50">
             <button 
               class="flex-1 py-4 font-bold text-sm uppercase tracking-wide bg-white text-blue-600 border-b-2 border-blue-600"
             >
               Hà Nội
             </button>
          </div>

          <div class="p-4 border-b border-gray-100">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                class="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm transition duration-300 outline-none border"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div class="overflow-y-auto flex-1 h-[500px] lg:h-auto custom-scrollbar p-0">
            <div class="p-5 border-b border-gray-100 cursor-pointer transition bg-blue-50 border-l-4 border-l-blue-600">
               <h3 class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                 Sahafa Store Hà Nội
               </h3>
               <p class="text-sm text-gray-600 ml-7 mb-2 italic">Đang cập nhật địa chỉ...</p>
               
               <div class="ml-7 flex items-center gap-4 text-xs text-gray-500">
                  <span class="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    1900 636469
                  </span>
                  <span class="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    8:00 - 22:00
                  </span>
               </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-2/3 bg-gray-200 relative min-h-[400px]">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096814183571!2d105.85017607504866!3d21.02881188778021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSOG7kyBHxrDGoW0!5e0!3m2!1svi!2s!4v1703000000000!5m2!1svi!2s" 
             width="100%" 
             height="100%" 
             style="border:0;" 
             allowfullscreen="" 
             loading="lazy" 
             referrerpolicy="no-referrer-when-downgrade"
             class="absolute inset-0 w-full h-full"
           ></iframe>
           
           <div class="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg max-w-sm hidden md:block animate-fade-in border-l-4 border-blue-600">
              <h4 class="font-bold text-gray-800 text-lg">Sahafa Store Hà Nội</h4>
              <p class="text-sm text-gray-600 mt-1 italic">Đang cập nhật địa chỉ...</p>
              <div class="mt-2 text-blue-600 text-xs font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Vị trí chính xác sẽ sớm được công bố
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Không cần script phức tạp vì chỉ có 1 store tĩnh
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>