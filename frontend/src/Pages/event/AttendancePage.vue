<template>
  <div class="bg-blue-600 min-h-screen pb-10 font-sans">
    
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

      <div class="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
        
        <div class="text-center md:text-left flex flex-col items-center md:items-start">
           <img src="https://cdn-icons-png.flaticon.com/512/3209/3209955.png" class="w-24 md:w-32 mb-4 drop-shadow-lg animate-bounce" />
           
           <h1 class="text-5xl md:text-7xl font-black text-white uppercase drop-shadow-xl tracking-tighter leading-tight mb-2" style="-webkit-text-stroke: 1px #1e3a8a;">
             GIẢI ĐỐ <br/>
             <span class="text-yellow-300">RỘN RÀNG</span>
           </h1>
           <h2 class="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide bg-blue-900/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
             Rinh Ngàn F-Point
           </h2>
        </div>

        <div class="relative w-64 md:w-80 transform hover:scale-105 transition duration-500">
           <div class="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
           <img src="https://cdn0.fahasa.com/media/wysiwyg/Thang-12-2023/Game_LandingPage_MainBanner_Mobile.jpg" 
                class="relative z-10 w-full rounded-[2.5rem] border-4 border-blue-300 shadow-2xl"
                alt="App Interface" />
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 mt-8">
      <div class="bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto border-4 border-blue-300">
        
        <div class="bg-gradient-to-r from-blue-700 to-blue-500 py-4 text-center">
          <h3 class="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            ĐẠI TIỆC CUỐI NĂM - SĂN F-POINT LIỀN TAY
          </h3>
        </div>

        <div class="p-6 md:p-10 space-y-6 text-gray-700">
          
          <div>
            <h4 class="font-bold text-lg text-blue-700 mb-2">1. Thời gian & Phạm vi áp dụng:</h4>
            <ul class="list-disc list-inside text-sm md:text-base space-y-1 ml-2">
              <li>Thời gian: Từ ngày <strong>01/12</strong> đến <strong>31/12</strong>.</li>
              <li>Phạm vi: Chỉ diễn ra trên ứng dụng <strong>Sahafa.com</strong>.</li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-lg text-blue-700 mb-2">2. Cách thức tham gia:</h4>
            <ul class="list-decimal list-inside text-sm md:text-base space-y-1 ml-2">
              <li><strong>Bước 1:</strong> Truy cập ứng dụng Sahafa.</li>
              <li><strong>Bước 2:</strong> Nhấn vào biểu tượng (icon) chương trình "Điểm danh săn F-Point" tại màn hình Homepage.</li>
              <li><strong>Bước 3:</strong> Tham gia trả lời câu đố vui hàng ngày để điểm danh nhận hàng ngàn F-Point.</li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-lg text-blue-700 mb-2">3. Quy định chung:</h4>
            <ul class="list-disc list-inside text-sm md:text-base space-y-1 ml-2">
              <li>Điểm danh nhận ngay F-Point: Mỗi ngày, bạn chỉ cần mở ứng dụng, tìm đến mục Điểm Danh và hoàn tất thao tác để nhận ngay <strong>1.200 F-Point</strong>.</li>
              <li>Trả lời câu hỏi đố vui: Sau khi điểm danh, bạn có thể tham gia trả lời 01 câu đố vui ngay trong game để nhận thêm <strong>500 F-Point</strong>.</li>
            </ul>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="font-bold text-lg text-blue-800 mb-2">4. Quà tặng đặc biệt khi điểm danh liên tục 7 ngày:</h4>
            <p class="text-sm md:text-base mb-2">
              Thưởng NÓNG <strong>12.000 F-Point</strong>: Khi bạn điểm danh liên tục đủ 06 ngày, bạn sẽ được thưởng thêm vào ngày thứ 7.
            </p>
            <p class="text-sm italic text-gray-600">
              Như vậy, tổng F-Point bạn nhận được cho một chuỗi 7 ngày điểm danh liên tục là: <br/>
              (6 ngày x 1.200) + 12.000 (thưởng chuỗi) = <strong class="text-blue-600">19.200 F-Point</strong>.
            </p>
          </div>

          <div>
            <h4 class="font-bold text-lg text-blue-700 mb-2">5. Lưu ý quan trọng:</h4>
            <ul class="list-disc list-inside text-sm md:text-base space-y-1 ml-2">
              <li>Reset chuỗi điểm danh: Sau khi bạn đã điểm danh đủ 7 ngày liên tiếp và nhận thưởng, chuỗi sẽ tự động reset.</li>
              <li>Nếu bạn quên điểm danh hoặc ngắt quãng, bạn sẽ phải bắt đầu lại từ đầu.</li>
              <li>Trong trường hợp phát sinh bất kỳ khiếu nại nào, Sahafa giữ quyền đưa ra quyết định cuối cùng.</li>
            </ul>
          </div>

          <div class="flex flex-col md:flex-row gap-4 justify-center mt-8">
             <button class="bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-800 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
               TẢI TRÊN IOS
             </button>
             <button class="bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-600 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
               TẢI TRÊN ANDROID
             </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>