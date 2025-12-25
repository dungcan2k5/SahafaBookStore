import { defineStore } from 'pinia';
import api from '../services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Danh sách sản phẩm
    isLoading: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    // 1. Lấy giỏ hàng từ Server
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) {
         this.items = []; 
         return;
      }

      this.isLoading = true;
      try {
        const res = await api.get('/api/cart');

        // Map dữ liệu từ cấu trúc Backend (CartItems -> Book) sang Frontend
        const body = res.data || res;
        if (body.success && body.data) {
          this.items = body.data.CartItems.map(item => ({
             id: item.cart_item_id, // ID giỏ hàng (dùng để xóa/sửa)
             book_id: item.book_id, // ID sách (dùng để link trang chi tiết)
             title: item.Book.book_title,
             price: parseFloat(item.Book.price),
             // Lấy ảnh đầu tiên hoặc ảnh placeholder
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

    // 2. Thêm vào giỏ hàng
    async addToCart(book, quantity = 1) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vui lòng đăng nhập để mua hàng!");
        // window.location.href = '/login'; // Bỏ comment nếu muốn chuyển trang luôn
        return false;
      }

      try {
          await api.post('/api/cart/add', {
            book_id: book.id, 
            quantity: quantity
          });

        // Tải lại giỏ hàng để cập nhật ID mới nhất từ server
        await this.fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        alert("Lỗi thêm vào giỏ: " + (error.response?.data?.message || error.message));
        return false;
      }
    },

    // 3. Xóa sản phẩm
    async removeFromCart(cartItemId) {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

      try {
          await api.delete(`/api/cart/item/${cartItemId}`);
        
        // Cập nhật giao diện ngay lập tức
        this.items = this.items.filter(item => item.id !== cartItemId);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm.");
      }
    },

    // 4. Cập nhật số lượng (+/-)
    async updateQuantity(cartItemId, newQuantity) {
      if (newQuantity < 1) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      // Tìm vị trí sản phẩm trong mảng
      const itemIndex = this.items.findIndex(item => item.id === cartItemId);
      if (itemIndex === -1) return;

      // Lưu lại số cũ để phòng trường hợp lỗi thì hoàn tác
      const oldQuantity = this.items[itemIndex].quantity;
      
      // Cập nhật giao diện trước cho mượt (Optimistic Update)
      this.items[itemIndex].quantity = newQuantity;

      try {
          await api.put(`/api/cart/item/${cartItemId}`, {
            quantity: newQuantity
          });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        // Hoàn tác lại số lượng cũ nếu API lỗi
        this.items[itemIndex].quantity = oldQuantity;
        alert("Không thể cập nhật số lượng.");
      }
    },

    // 5. Xóa toàn bộ giỏ (Dùng nút "Xóa tất cả")
    async clearCartAPI() {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;

      try {
          await api.delete('/api/cart/clear');
        this.items = [];
        alert("Đã xóa sạch giỏ hàng!");
      } catch (error) {
        console.error("Lỗi clear cart:", error);
        alert("Lỗi khi xóa giỏ hàng.");
      }
    },
    
    // Reset giỏ hàng local (Dùng khi đăng xuất hoặc thanh toán xong)
    clearCart() {
      this.items = [];
    }
  }
});