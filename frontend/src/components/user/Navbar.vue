<template>
  <div class="sticky top-0 z-50">
    <header class="bg-blue-600 text-white py-4 shadow-md font-sans">
      <div class="container mx-auto flex items-center justify-between px-4 lg:px-8 gap-6">
        
        <div class="flex items-center gap-6 shrink-0">
          <router-link to="/" class="text-3xl font-extrabold tracking-tighter flex items-center italic">
            Sahafa<span class="text-yellow-400">.com</span>
          </router-link>

          <div class="relative group z-50">
            <div class="flex items-center justify-center cursor-pointer hover:bg-blue-700 w-12 h-12 rounded-lg transition p-2.5 border-2 border-transparent hover:border-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clip-rule="evenodd" />
              </svg>
            </div>

            <div class="absolute top-full left-0 pt-4 w-[350px] hidden group-hover:block animate-fade-in">
                  <div class="bg-white text-gray-800 shadow-2xl rounded-xl border border-gray-200 overflow-hidden">
                    <ul class="flex flex-col text-base py-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <li v-if="genres.length === 0" class="px-6 py-3 text-gray-500 text-center">Đang tải danh mục...</li>
                        <li 
                          v-for="genre in genres" 
                          :key="genre.genre_id"
                          @click="goToCategory(genre.genre_slug)"
                          class="px-6 py-3 cursor-pointer hover:bg-blue-50 hover:text-blue-700 flex items-center gap-4 transition-colors border-l-4 border-transparent hover:border-blue-600"
                        >
                          <img :src="getGenreInfo(genre).icon" class="w-8 h-8 object-contain" alt="">
                          <div class="flex flex-col leading-tight">
                             <span class="font-bold text-gray-800 text-lg hover:text-blue-700">
                                {{ getGenreInfo(genre).viName }}
                             </span>
                             <span class="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                {{ genre.genre_name }}
                             </span>
                          </div>
                        </li>
                    </ul>
                  </div>
            </div>
          </div>
        </div>

        <div class="flex-grow-0 w-full lg:w-[700px] mx-auto relative group/search">
          <div class="bg-white rounded-xl flex items-center p-1.5 shadow-lg overflow-hidden">
            <input 
              v-model="searchQuery" 
              @input="handleLiveSearch"
              @focus="showDropdown = true"
              @keyup.enter="goToSearchPage"
              type="text" 
              placeholder="Tìm kiếm sách, tác giả, thể loại mong muốn..." 
              class="w-full px-6 py-3 text-gray-800 outline-none text-base font-medium placeholder:text-gray-400" 
            />
            
            <button @click="goToSearchPage" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          <div v-if="showDropdown && searchQuery.trim()" class="absolute top-full left-0 right-0 w-full mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 mt-2 overflow-hidden z-[60]">
              <div v-if="isSearching" class="p-6 text-center text-gray-500 text-base font-medium">Đang tìm...</div>
              <div v-else-if="searchResults.length > 0">
                 <div class="max-h-[400px] overflow-y-auto custom-scrollbar py-2">
                    <div v-for="book in searchResults" :key="book.book_id" @click="goToDetail(book.book_slug || book.book_id)" class="flex gap-4 p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none transition-colors">
                       <img :src="book.BookImages?.[0]?.book_image_url || 'https://placehold.co/100x150'" class="w-16 h-24 object-cover rounded-md border shadow-sm"/>
                       <div class="flex-1 flex flex-col justify-center">
                           <h4 class="text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-700">{{ book.book_title }}</h4>
                           <div class="flex items-center gap-2">
                              <span class="text-[#C92127] font-extrabold text-lg">{{ formatPrice(book.price) }}đ</span>
                              <span v-if="book.Author" class="text-sm text-gray-500">| {{ book.Author.author_name }}</span>
                           </div>
                       </div>
                    </div>
                 </div>
                 <div @click="goToSearchPage" class="p-4 text-center bg-gray-50 text-blue-600 text-sm font-extrabold uppercase hover:bg-blue-100 cursor-pointer border-t tracking-wider transition-colors">
                    Xem tất cả kết quả
                 </div>
              </div>
              <div v-else class="p-8 text-center text-gray-500 text-base">
                <img src="https://cdn-icons-png.flaticon.com/512/7465/7465679.png" alt="" class="w-16 h-16 mx-auto mb-4 opacity-50">
                Không tìm thấy sách nào phù hợp.
              </div>
          </div>
        </div>

        <div class="flex items-center gap-8 shrink-0">
          
          <div class="relative group z-50 cursor-pointer hover:text-yellow-300 text-white transition flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span class="text-sm font-bold mt-1 hidden lg:block">Thông báo</span>
          </div>

          <router-link to="/cart" class="relative cursor-pointer hover:text-yellow-300 text-white transition flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span class="text-sm font-bold mt-1 hidden lg:block">Giỏ hàng</span>
            <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-extrabold rounded-full h-6 w-6 flex items-center justify-center border-[3px] border-blue-600">{{ cartStore.totalItems }}</span>
          </router-link>

          <div class="relative group z-50">
            <div @click="!authStore.user ? openModal('login') : null" class="cursor-pointer hover:text-yellow-300 text-white transition flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span class="text-sm font-bold mt-1 hidden lg:block max-w-[100px] truncate text-center">
                {{ authStore.user ? (authStore.user.full_name || authStore.user.name) : 'Tài khoản' }}
              </span>
            </div>
            
            <div class="absolute top-full right-[-20px] pt-5 hidden group-hover:block w-[260px]">
              <div class="bg-white rounded-xl shadow-2xl p-5 border border-gray-100 flex flex-col gap-4 relative mt-2">
                 <div class="absolute -top-2 right-8 w-5 h-5 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                <template v-if="!authStore.user">
                    <button @click.stop="openModal('login')" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md text-base">Đăng nhập</button>
                    <button @click.stop="openModal('register')" class="w-full bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition text-base">Đăng ký</button>
                </template>
                <template v-else>
                      <div class="text-center font-bold text-gray-800 border-b pb-3 mb-2 truncate text-lg">Xin chào, {{ authStore.user.full_name || authStore.user.name }}</div>
                      <router-link v-if="['admin', 'employee'].includes(authStore.user.role)" to="/admin" class="w-full block text-center bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-md mb-2 flex items-center justify-center gap-2">
                        Trang Quản Trị
                      </router-link>
                      <router-link to="/user/profile" class="w-full block text-center py-3 hover:bg-blue-50 text-blue-700 rounded-lg text-base font-bold mb-1 transition flex items-center justify-center gap-2">
                        Hồ sơ cá nhân
                      </router-link>
                      <button @click="authStore.logout()" class="w-full text-center py-3 text-red-600 hover:bg-red-50 rounded-lg text-base font-bold flex items-center justify-center gap-2 transition">
                        Đăng xuất
                      </button>
                </template>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>

    <Teleport to="body">
      <LoginModal v-if="showLoginModal" :initialTab="modalTab" @close="showLoginModal = false" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import LoginModal from '@/components/user/LoginModal.vue';
import api from '@/services/api'; 

const cartStore = useCartStore();
const authStore = useAuthStore(); 
const router = useRouter();

const showLoginModal = ref(false);
const modalTab = ref('login');
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const showDropdown = ref(false);
const genres = ref([]); 
let debounceTimer = null;

const genreMap = {
  'fiction': { vi: 'Tiểu Thuyết', icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png' },
  'science-fiction': { vi: 'Viễn Tưởng', icon: 'https://cdn-icons-png.flaticon.com/512/2040/2040660.png' },
  'mystery': { vi: 'Trinh Thám', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079120.png' },
  'romance': { vi: 'Lãng Mạn', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png' },
  'horror': { vi: 'Kinh Dị', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079140.png' },
  'self-help': { vi: 'Kỹ Năng Sống', icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079166.png' },
  'business': { vi: 'Kinh Doanh', icon: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png' },
  'history': { vi: 'Lịch Sử', icon: 'https://cdn-icons-png.flaticon.com/512/3389/3389081.png' },
  'biography': { vi: 'Hồi Ký', icon: 'https://cdn-icons-png.flaticon.com/512/167/167755.png' },
  'fantasy': { vi: 'Giả Tưởng', icon: 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png' }
};

const getGenreInfo = (genre) => {
  const info = genreMap[genre.genre_slug];
  return {
    viName: info ? info.vi : genre.genre_name,
    icon: info ? info.icon : 'https://cdn-icons-png.flaticon.com/512/29/29302.png'
  };
};

const fetchGenres = async () => {
  try {
    const data = await api.get('/books/genres');
    // Vì Interceptor đã lo phần kiểm tra success và bóc tách data.data
    if (data) {
      genres.value = data;
    }
  } catch (e) {
    console.error("Lỗi tải Genres:", e);
  }
};

const goToCategory = (slug) => {
  router.push({ path: '/books', query: { category: slug } });
};

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val);

const handleLiveSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }
  showDropdown.value = true;
  isSearching.value = true;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      const response = await api.get('/books', { params: { search: searchQuery.value } });
      if (response.data.success) {
        searchResults.value = response.data.data.slice(0, 5); 
      }
    } catch (error) { console.error("Lỗi search:", error); } 
    finally { isSearching.value = false; }
  }, 300);
};

const goToDetail = (slugOrId) => {
  showDropdown.value = false;
  searchQuery.value = '';
  router.push(`/books/${slugOrId}`);
};

const goToSearchPage = () => {
  showDropdown.value = false;
  if (searchQuery.value.trim()) {
    router.push({ path: '/books', query: { search: searchQuery.value } });
  }
};

const openModal = (tab) => {
  modalTab.value = tab;
  showLoginModal.value = true;
};

onMounted(() => {
  fetchGenres();
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
</style>