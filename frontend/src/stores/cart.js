import { defineStore } from 'pinia';
import api from '../services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], 
    isLoading: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  actions: {
    // 1. Lấy Giỏ Hàng từ Máy Chủ
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) {
         this.items = []; 
         return;
      }

      this.isLoading = true;
      try {
        const res = await api.get('/api/cart');

        // `api` interceptor có thể đã giải nén { success:true, data } để trả về data trực tiếp.
        // Chuẩn hóa thành đối tượng `cart` chứa `CartItems`.
        let cart = null;
        if (res && res.success && res.data) cart = res.data;
        else if (res && res.CartItems) cart = res;
        else if (res && res.data && res.data.CartItems) cart = res.data;

        if (cart && Array.isArray(cart.CartItems)) {
          this.items = cart.CartItems.map(item => ({
             id: item.cart_item_id, 
             book_id: item.book_id, 
             title: item.Book?.book_title || item.Book?.book_title,
             price: parseFloat(item.Book?.price || 0),
             image: item.Book?.BookImages?.[0]?.book_image_url || 'https://via.placeholder.com/150',
             quantity: Number(item.quantity || 1)
          }));
        } else {
          this.items = [];
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. Thêm Sản Phẩm vào Giỏ
    async addToCart(book, quantity = 1) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vui lòng đăng nhập để mua sắm!");
        return false;
      }

      try {
          await api.post('/api/cart/add', {
            book_id: book.id, 
            quantity: quantity
          });

        // Tải lại giỏ hàng để lấy ID mới nhất
        await this.fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi thêm vào giỏ:", error);
        alert("Thêm vào giỏ thất bại: " + (error.response?.data?.message || error.message));
        return false;
      }
    },

    // 3. Xóa Sản Phẩm
    async removeFromCart(cartItemId) {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

      try {
          await api.delete(`/api/cart/item/${cartItemId}`);
        
        // Cập nhật UI ngay lập tức
        this.items = this.items.filter(item => item.id !== cartItemId);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm.");
      }
    },

    // 4. Cập Nhật Số Lượng
    async updateQuantity(cartItemId, newQuantity) {
      if (newQuantity < 1) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      const itemIndex = this.items.findIndex(item => item.id === cartItemId);
      if (itemIndex === -1) return;

      const oldQuantity = this.items[itemIndex].quantity;
      
      // Cập nhật ngay lập tức
      this.items[itemIndex].quantity = newQuantity;

      try {
          await api.put(`/api/cart/item/${cartItemId}`, {
            quantity: newQuantity
          });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        // Hoàn tác nếu lỗi
        this.items[itemIndex].quantity = oldQuantity;
        alert("Không thể cập nhật số lượng.");
      }
    },

    // 5. Xóa Giỏ Hàng
    async clearCartAPI() {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn có chắc chắn muốn xóa giỏ hàng của mình không?")) return;

      try {
          await api.delete('/api/cart/clear');
        this.items = [];
        alert("Đã xóa giỏ hàng!");
      } catch (error) {
        console.error("Lỗi xóa giỏ hàng:", error);
        alert("Xóa giỏ hàng thất bại.");
      }
    },
    
    // Đặt lại trạng thái giỏ hàng cục bộ
    clearCart() {
      this.items = [];
    }
  }
});