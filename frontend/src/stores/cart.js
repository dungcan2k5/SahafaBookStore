// frontend/src/stores/cart.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Danh sách sản phẩm trong giỏ
    isLoading: false
  }),

  getters: {
    // Tính tổng số lượng
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    // Tính tổng tiền
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    // 1. Lấy giỏ hàng từ Server (Gọi khi Load trang hoặc Đăng nhập xong)
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) {
         this.items = []; 
         return;
      }

      this.isLoading = true;
      try {
        const res = await axios.get('http://localhost:3000/api/cart', {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success && res.data.data) {
          // Map dữ liệu từ Backend sang chuẩn Frontend
          // Backend trả về: CartItems -> Book -> BookImages
          this.items = res.data.data.CartItems.map(item => ({
             id: item.cart_item_id, // ID dòng trong giỏ hàng để xóa
             book_id: item.book_id,
             title: item.Book.book_title,
             price: parseFloat(item.Book.price),
             image: item.Book.BookImages?.[0]?.book_image_url || 'https://via.placeholder.com/150',
             quantity: item.quantity
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. Thêm vào giỏ (Gọi API POST /api/cart/add)
    async addToCart(book, quantity = 1) {
      const token = localStorage.getItem('token');
      
      // Nếu chưa đăng nhập -> Chỉ lưu tạm hoặc bắt đăng nhập (Ở đây mình bắt đăng nhập cho đồng bộ)
      if (!token) {
        alert("Vui lòng đăng nhập để mua hàng!");
        return false; // Trả về false để UI biết
      }

      try {
        await axios.post('http://localhost:3000/api/cart/add', {
           book_id: book.book_id || book.id, // Tuỳ cách bạn đặt tên ID ở object book
           quantity: quantity
        }, {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        // Sau khi thêm thành công, tải lại giỏ hàng mới nhất từ server
        await this.fetchCart();
        alert("Đã thêm vào giỏ hàng!");
        return true;
      } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        alert("Lỗi thêm vào giỏ: " + (error.response?.data?.message || error.message));
        return false;
      }
    },

    // 3. Xóa khỏi giỏ (Gọi API DELETE /api/cart/item/:id)
    async removeFromCart(cartItemId) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        await axios.delete(`http://localhost:3000/api/cart/item/${cartItemId}`, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Cập nhật lại list local (Xóa nhanh khỏi mảng đỡ phải gọi lại API)
        this.items = this.items.filter(item => item.id !== cartItemId);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm.");
      }
    },
    
    // 4. Clear giỏ hàng (Dùng khi Đăng xuất hoặc Thanh toán xong)
    clearCart() {
      this.items = [];
    }
  }
});