<template>
  <div class="bg-gray-50 py-8 min-h-screen">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-6">
        
        <div class="w-full md:w-1/4">
          <div class="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h3 class="font-bold text-lg mb-4 text-gray-800 border-b pb-2"></h3>
            <ul class="space-y-2">
              <li v-for="item in menuItems" :key="item.slug">
                <router-link 
                  :to="{ name: 'policy', params: { slug: item.slug }}" 
                  class="block px-3 py-2 rounded transition-colors"
                  :class="$route.params.slug === item.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="w-full md:w-3/4">
          <div class="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <div v-if="!currentPolicy" class="text-center py-10">
              <p class="text-gray-500">Đang tải nội dung...</p>
            </div>

            <article v-else class="prose max-w-none text-gray-700">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-4 border-b">
                {{ currentPolicy.title }}
              </h1>
              
              <div v-html="currentPolicy.content" class="policy-content space-y-4 leading-relaxed"></div>
              
              <div class="mt-8 pt-4 border-t text-sm text-gray-500 italic">
                Cập nhật lần cuối: {{ currentPolicy.updatedAt }}
              </div>
            </article>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Danh sách menu bên trái
const menuItems = [
  { name: 'Điều khoản sử dụng', slug: 'dieu-khoan-su-dung' },
  { name: 'Chính sách bảo mật', slug: 'chinh-sach-bao-mat' },
  { name: 'Bảo mật thanh toán', slug: 'bao-mat-thanh-toan' },
  { name: 'Chính sách đổi trả', slug: 'chinh-sach-doi-tra' },
];

// Database nội dung (Giả lập)
const policiesData = {
  'dieu-khoan-su-dung': {
    title: 'ĐIỀU KHOẢN SỬ DỤNG',
    updatedAt: '01/12/2025',
    content: `
      <p>Chào mừng quý khách đến mua sắm tại SAHAFA. Sau khi truy cập vào website SAHAFA để tham khảo hoặc mua sắm, quý khách đã đồng ý tuân thủ và ràng buộc với những quy định của SAHAFA.</p>
      
      <p>Mọi thắc mắc, vui lòng liên hệ hotline <strong>1900636469</strong> hoặc email <strong>cskh@sahafa.dungcan.id.vn</strong>.</p>

      <h3 class="text-lg font-bold text-gray-800 mt-6 mb-2">1. Tài khoản của khách hàng</h3>
      <p>Khi sử dụng dịch vụ, quý khách cần đăng ký tài khoản và cung cấp một số thông tin cá nhân:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Dữ liệu bắt buộc:</strong> Họ tên, email, số điện thoại.</li>
        <li><strong>Dữ liệu giao dịch:</strong> Địa chỉ giao hàng, phương thức thanh toán.</li>
        <li><strong>Dữ liệu tự nguyện:</strong> Ngày sinh, giới tính, sở thích.</li>
      </ul>
      <p class="mt-2">Quý khách có trách nhiệm bảo mật thông tin tài khoản và mật khẩu. Sahafa không chịu trách nhiệm nếu quý khách để lộ thông tin này.</p>
      <div class="bg-yellow-50 p-4 border-l-4 border-yellow-400 mt-4 text-sm">
        <strong>Lưu ý:</strong> Sahafa nghiêm cấm sử dụng các phần mềm giả lập, bot, tool tự động để truy cập hệ thống. Tài khoản vi phạm sẽ bị khóa vĩnh viễn.
      </div>

      <h3 class="text-lg font-bold text-gray-800 mt-6 mb-2">2. Quyền lợi bảo mật dữ liệu</h3>
      <p>Thông tin của quý khách chỉ được dùng để nâng cao chất lượng dịch vụ và không chuyển giao cho bên thứ ba vì mục đích thương mại, trừ khi pháp luật yêu cầu.</p>

      <h3 class="text-lg font-bold text-gray-800 mt-6 mb-2">3. Trách nhiệm của khách hàng</h3>
      <p>Quý khách tuyệt đối không được:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Sử dụng công cụ để can thiệp vào hệ thống Sahafa.</li>
        <li>Đưa ra nhận xét xúc phạm, chính trị, tôn giáo.</li>
        <li>Mạo danh người khác hoặc ban quản trị.</li>
      </ul>

      <h3 class="text-lg font-bold text-gray-800 mt-6 mb-2">4. Trách nhiệm và quyền lợi của SAHAFA</h3>
      <p>Sahafa cam kết tuân thủ quy định pháp luật về bảo vệ dữ liệu. Chúng tôi có quyền từ chối phục vụ hoặc hủy đơn hàng nếu phát hiện dấu hiệu đầu cơ, tích trữ hoặc gian lận.</p>

      <div class="mt-8 p-4 bg-blue-50 text-blue-800 rounded text-sm font-medium">
        Bằng cách bấm nút "ĐĂNG KÝ" khi tạo tài khoản, quý khách hiểu rằng đang tạo chữ ký điện tử có giá trị pháp lý tương đương chữ ký tay.
      </div>
    `
  },
  // Các trang khác tạm thời để nội dung mẫu
  // Trong file frontend/src/pages/user/Term.vue

'chinh-sach-bao-mat': {
  title: 'CHÍNH SÁCH BẢO MẬT DỮ LIỆU CÁ NHÂN CỦA KHÁCH HÀNG',
  updatedAt: '01/12/2025',
  content: `
    <div class="space-y-4 text-justify">
      <p class="font-medium text-gray-800">
        SAHAFA mong muốn đem lại một tiện ích mua hàng trực tuyến tin cậy, tiết kiệm và thấu hiểu người dùng. 
        Chúng tôi cam kết bảo mật dữ liệu cá nhân của khách hàng khi khách hàng tin tưởng cung cấp cho chúng tôi để mua sắm tại website 
        <span class="text-blue-600 font-semibold">sahafa.dungcan.id</span>.
      </p>

      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-6">
        <strong>Chính sách này bao gồm:</strong> 
        1. Sự chấp thuận | 2. Phạm vi thu thập | 3. Mục đích xử lý | 4. Cách thức xử lý | 5. Thời gian lưu trữ | 
        6. Chia sẻ dữ liệu | 7. An toàn dữ liệu | 8. Rủi ro | 9. Quyền & Nghĩa vụ | 10. Liên hệ | 11. Đơn vị xử lý | 12. Hiệu lực
      </div>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">1. Sự Chấp Thuận</h3>
      <p>
        Việc quý khách xác nhận đồng ý cho phép SAHAFA xử lý dữ liệu cá nhân của mình đồng nghĩa với việc quý khách đã đọc, hiểu rõ và tự nguyện đồng ý đối với các nội dung được nêu ra trong Chính Sách này.
        Chúng tôi khuyến khích quý khách thường xuyên xem lại Chính Sách để có được những cập nhật mới nhất.
      </p>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">2. Phạm Vi Thu Thập</h3>
      <p>SAHAFA chỉ thu thập dữ liệu cá nhân cơ bản, bao gồm:</p>
      <ul class="list-disc pl-5 space-y-1 mb-4 bg-gray-50 p-4 rounded">
        <li>Họ tên, giới tính, ngày tháng năm sinh.</li>
        <li>Địa chỉ email, số điện thoại.</li>
        <li>Địa chỉ giao hàng, địa chỉ thanh toán.</li>
        <li>Sở thích, thông tin đăng nhập Tài khoản (trừ mật khẩu).</li>
      </ul>
      <p class="italic text-gray-500 text-sm">Lưu ý: SAHAFA không thu thập dữ liệu cá nhân nhạy cảm.</p>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">3. Mục Đích Xử Lý Dữ Liệu</h3>
      <p>Chúng tôi xử lý dữ liệu nhằm phục vụ các mục đích sau:</p>
      <ul class="space-y-2 mt-2">
        <li><span class="font-bold text-gray-800">📦 Đơn Hàng:</span> Xử lý các vấn đề liên quan đến đơn đặt hàng.</li>
        <li><span class="font-bold text-gray-800">👤 Duy Trì Tài Khoản:</span> Tạo, xác thực và duy trì tài khoản, chương trình khách hàng thân thiết.</li>
        <li><span class="font-bold text-gray-800">🎧 CSKH:</span> Phản hồi yêu cầu, khiếu nại và đánh giá của khách hàng.</li>
        <li><span class="font-bold text-gray-800">🎨 Cá Nhân Hóa:</span> Cải thiện trải nghiệm, gợi ý sản phẩm phù hợp với sở thích.</li>
        <li><span class="font-bold text-gray-800">🛡️ An Ninh:</span> Ngăn ngừa giả mạo, phá hủy tài khoản.</li>
        <li><span class="font-bold text-gray-800">⚖️ Yêu cầu pháp luật:</span> Tuân thủ quy định của cơ quan nhà nước có thẩm quyền.</li>
      </ul>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">4. Cách Thức Xử Lý Dữ Liệu</h3>
      <p><strong>Thu thập:</strong> Trực tiếp khi khách hàng cung cấp và gián tiếp qua cookies/công nghệ theo dấu.</p>
      <p><strong>Lưu trữ & Bảo mật:</strong> Dữ liệu được lưu trữ trong cơ sở dữ liệu của SAHAFA với các biện pháp kỹ thuật an toàn.</p>
      <p><strong>Truyền đưa:</strong> Chỉ chuyển giao cho bên thứ ba khi có sự đồng ý của khách hàng hoặc theo quy định pháp luật.</p>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">5. Thời Gian Lưu Trữ</h3>
      <p>
        Dữ liệu được lưu trữ từ khi bắt đầu xử lý đến khi kết thúc (khi khách hàng hủy tài khoản), trừ khi pháp luật có quy định khác.
      </p>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">6. Không Chia Sẻ Dữ Liệu Cá Nhân</h3>
      <p>Chúng tôi cam kết không bán dữ liệu của bạn. Việc chia sẻ chỉ diễn ra trong các trường hợp cần thiết:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Đối tác vận chuyển, thanh toán (để thực hiện đơn hàng).</li>
        <li>Nhà cung cấp dịch vụ hạ tầng website (bảo mật theo hợp đồng).</li>
        <li>Yêu cầu pháp lý từ cơ quan nhà nước.</li>
        <li>Chuyển giao kinh doanh (sáp nhập, mua lại).</li>
      </ul>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">7. An Toàn Dữ Liệu & Rủi Ro</h3>
      <p>
        Chúng tôi áp dụng các tiêu chuẩn bảo mật ngành để bảo vệ dữ liệu. Tuy nhiên, rủi ro (hacker, lỗi hệ thống) vẫn có thể xảy ra. 
        Trong trường hợp này, chúng tôi sẽ phối hợp với cơ quan chức năng và thông báo kịp thời cho khách hàng.
      </p>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">9. Quyền & Nghĩa Vụ Của Khách Hàng</h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 p-4 rounded border border-green-100">
          <h4 class="font-bold text-green-800 mb-2">Quyền của bạn</h4>
          <p class="text-sm">Được biết về hoạt động xử lý; Đồng ý/Rút lại sự đồng ý; Truy cập, chỉnh sửa, xóa dữ liệu; Khiếu nại khi có vi phạm.</p>
        </div>
        <div class="bg-orange-50 p-4 rounded border border-orange-100">
          <h4 class="font-bold text-orange-800 mb-2">Nghĩa vụ của bạn</h4>
          <p class="text-sm">Tự bảo vệ tài khoản/mật khẩu; Cung cấp thông tin chính xác; Tôn trọng dữ liệu của người khác.</p>
        </div>
      </div>

      <h3 class="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase">10. Thông Tin Liên Hệ</h3>
      <p>Mọi thắc mắc xin vui lòng liên hệ:</p>
      <ul class="list-none space-y-2 font-medium">
        <li class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          Hotline: <span class="text-red-600">1900 636469</span>
        </li>
        <li class="flex items-center gap-2">
           <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Email: <a href="mailto:cskh@sahafa.dungcan.id.vn" class="text-blue-600 hover:underline">cskh@sahafa.dungcan.id.vn</a>
        </li>
      </ul>

      <div class="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <p class="font-bold text-gray-800 uppercase mb-1">Công ty Cổ phần Phát Hành Sách TP HCM - Sahafa</p>
        <p>GCNĐKDN số: 0304132047 do Sở KH&ĐT TP.HCM cấp lần đầu ngày 20/12/2005.</p>
        <p>Trụ sở chính: 60 – 62 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM.</p>
      </div>
    </div>
  `
},
  // Trong file frontend/src/pages/user/Term.vue

'bao-mat-thanh-toan': {
  title: 'CHÍNH SÁCH BẢO MẬT THANH TOÁN',
  updatedAt: '01/12/2025',
  content: `
    <div class="space-y-6 text-justify text-gray-700">
      
      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-3 uppercase border-l-4 border-blue-600 pl-3">1. Sự Chấp Thuận</h3>
        <p>
          Hệ thống thanh toán thẻ được cung cấp bởi các đối tác thanh toán (“<strong>Đối tác cổng thanh toán</strong>”) 
          đã được cấp phép hoạt động hợp pháp tại Việt Nam. Theo đó, các tiêu chuẩn bảo mật thanh toán thẻ tại SAHAFA 
          đảm bảo tuân thủ theo các tiêu chuẩn bảo mật ngành.
        </p>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-l-4 border-blue-600 pl-3">2. Quy định bảo mật</h3>
        
        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
          <p class="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Tiêu chuẩn của Đối tác cổng thanh toán:
          </p>
          <ul class="space-y-2 text-sm ml-2">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-1">●</span>
              <span><strong>SSL (Secure Sockets Layer):</strong> Bảo vệ thông tin tài chính bằng cách mã hóa dữ liệu nhập vào.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-1">●</span>
              <span><strong>PCI DSS:</strong> Chứng nhận tiêu chuẩn bảo mật dữ liệu thông tin thanh toán do Trustwave cung cấp.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-1">●</span>
              <span><strong>OTP (One Time Password):</strong> Mật khẩu sử dụng một lần gửi qua SMS để xác thực truy cập.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-1">●</span>
              <span>Tiêu chuẩn mã hóa MD5 12 bit.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-1">●</span>
              <span>Tuân thủ các nguyên tắc bảo mật thông tin ngành tài chính theo quy định của Ngân hàng Nhà nước Việt Nam.</span>
            </li>
          </ul>
        </div>

        <div class="bg-blue-50 rounded-lg p-5 border border-blue-100">
          <p class="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Cam kết bảo mật của SAHAFA với khách hàng:
          </p>
          <ul class="space-y-3 text-sm ml-2">
            <li class="flex gap-3">
              <div class="min-w-[24px] pt-1"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
              <div>
                <strong>Chỉ lưu trữ Token:</strong> SAHAFA không trực tiếp lưu giữ thông tin thẻ. Chúng tôi chỉ lưu chuỗi đã được mã hóa bởi Đối Tác Cổng Thanh Toán.
              </div>
            </li>
            <li class="flex gap-3">
              <div class="min-w-[24px] pt-1"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
              <div>
                <strong>Thẻ quốc tế:</strong> Thông tin thẻ không được lưu trên hệ thống SAHAFA. Đối Tác Cổng Thanh Toán chịu trách nhiệm lưu trữ và bảo mật.
              </div>
            </li>
            <li class="flex gap-3">
              <div class="min-w-[24px] pt-1"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
              <div>
                <strong>Thẻ nội địa:</strong> SAHAFA chỉ lưu trữ mã đơn hàng, mã giao dịch và tên Ngân hàng.
              </div>
            </li>
            <li class="flex gap-3">
              <div class="min-w-[24px] pt-1"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
              <div>
                <strong>Hỗ trợ sự cố:</strong> Nếu thông tin thanh toán bị thay đổi, xóa hoặc chiếm đoạt trái phép, SAHAFA cam kết phối hợp với Đối Tác để xử lý đến cùng cho khách hàng.
              </div>
            </li>
          </ul>
        </div>
        
        <p class="mt-4 italic text-gray-600 text-sm">
            * Các quy định tại <a href="/policy/chinh-sach-bao-mat" class="text-blue-600 hover:underline internal-link">Chính Sách Bảo Mật Dữ Liệu Cá Nhân</a> cũng sẽ được áp dụng đồng thời.
        </p>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-3 uppercase border-l-4 border-blue-600 pl-3">3. Hiệu Lực</h3>
        <p class="mb-2">Chính sách này có hiệu lực từ ngày <strong>01/12/2025</strong>.</p>
        <p>
          SAHAFA có thể điều chỉnh chính sách bất cứ lúc nào và công khai trên website 
          <span class="text-blue-600 font-semibold">sahafa.dungcan.id.vn</span>. 
          Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc khách hàng đã chấp thuận các thay đổi này.
        </p>
      </div>

    </div>
  `
},

};

// Lấy nội dung dựa trên slug hiện tại
const currentPolicy = computed(() => {
  const slug = route.params.slug;
  return policiesData[slug] || { title: 'Không tìm thấy', content: 'Trang này không tồn tại.' };
});
</script>

<style scoped>
/* Style riêng cho phần nội dung HTML được inject vào */
:deep(.policy-content h3) {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
:deep(.policy-content ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}
:deep(.policy-content p) {
  margin-bottom: 0.75rem;
}
</style>