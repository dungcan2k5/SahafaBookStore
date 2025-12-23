// frontend/src/stores/cart.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Danh sách sản phẩm trong giỏ
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
        const res = await axios.get('http://localhost:3000/api/cart', {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success && res.data.data) {
          // Map dữ liệu từ Backend sang chuẩn Frontend
          this.items = res.data.data.CartItems.map(item => ({
             id: item.cart_item_id, // ID để xóa/sửa trong giỏ
             book_id: item.book_id, // ID sách để link tới trang chi tiết
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

    // 2. Thêm vào giỏ
    async addToCart(book, quantity = 1) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Vui lòng đăng nhập để mua hàng!");
        // Chuyển hướng login nếu cần: window.location.href = '/login';
        return false;
      }

      try {
        // Gọi API Backend
        await axios.post('http://localhost:3000/api/cart/add', {
           book_id: book.id, // Đảm bảo truyền đúng ID sách
           quantity: quantity
        }, {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        // Sau khi thêm thành công, tải lại giỏ hàng để cập nhật ID cart_item chuẩn
        await this.fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        alert("Lỗi thêm vào giỏ: " + (error.response?.data?.message || error.message));
        return false;
      }
    },

    // 3. Xóa khỏi giỏ
    async removeFromCart(cartItemId) {
      const token = localStorage.getItem('token');
      if (!token) return;

      if(!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

      try {
        await axios.delete(`http://localhost:3000/api/cart/item/${cartItemId}`, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Xóa nhanh trên giao diện
        this.items = this.items.filter(item => item.id !== cartItemId);
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm.");
      }
    },

    // 4. Cập nhật số lượng
    async updateQuantity(cartItemId, newQuantity) {
      if (newQuantity < 1) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      const itemIndex = this.items.findIndex(item => item.id === cartItemId);
      if (itemIndex === -1) return;

      const oldQuantity = this.items[itemIndex].quantity;
      this.items[itemIndex].quantity = newQuantity; // Cập nhật UI ngay

      try {
        await axios.put(`http://localhost:3000/api/cart/item/${cartItemId}`, {
           quantity: newQuantity
        }, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        this.items[itemIndex].quantity = oldQuantity; // Revert nếu lỗi
        alert("Không thể cập nhật số lượng.");
      }
    },

    // 5. Xóa toàn bộ giỏ
    async clearCartAPI() {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;

      try {
        await axios.delete('http://localhost:3000/api/cart/clear', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        this.items = [];
      } catch (error) {
        console.error("Lỗi clear cart:", error);
        alert("Lỗi khi xóa giỏ hàng.");
      }
    },
    
    // Clear state local (khi logout)
    clearCart() {
      this.items = [];
    }
  }
});