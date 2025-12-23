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
    // . Cập nhật số lượng (Gọi API PUT)
    async updateQuantity(cartItemId, newQuantity) {
      // Chặn không cho giảm xuống dưới 1
      if (newQuantity < 1) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      // Tìm sản phẩm trong danh sách local để cập nhật giao diện trước (Optimistic UI)
      const itemIndex = this.items.findIndex(item => item.id === cartItemId);
      if (itemIndex === -1) return;

      // Lưu lại số lượng cũ để nếu API lỗi thì quay xe (revert)
      const oldQuantity = this.items[itemIndex].quantity;
      
      // Cập nhật ngay trên giao diện cho mượt
      this.items[itemIndex].quantity = newQuantity;

      try {
        // Gọi API cập nhật xuống DB
        // LƯU Ý: Bạn cần kiểm tra xem API backend của bạn là đường dẫn nào. 
        // Thường là PUT /api/cart/item/:id hoặc PUT /api/cart/update
        await axios.put(`http://localhost:3000/api/cart/item/${cartItemId}`, {
           quantity: newQuantity
        }, {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Nếu API trả về data mới chuẩn xác thì có thể cập nhật lại lần nữa cho chắc
        // this.items[itemIndex].quantity = res.data.quantity; 

      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        // Nếu lỗi, trả lại số lượng cũ
        this.items[itemIndex].quantity = oldQuantity;
        alert("Không thể cập nhật số lượng.");
      }
    },
    // Xóa toàn bộ giỏ hàng (Gọi API)
    async clearCartAPI() {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!confirm("Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;

      try {
        // Gọi API Backend để xóa dữ liệu thật
        await axios.delete('http://localhost:3000/api/cart/clear', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Sau đó xóa ở Frontend
        this.items = [];
        alert("Đã xóa sạch giỏ hàng!");
      } catch (error) {
        console.error("Lỗi clear cart:", error);
        alert("Lỗi khi xóa giỏ hàng.");
      }
    },
    
    // 4. Clear giỏ hàng (Dùng khi Đăng xuất hoặc Thanh toán xong)
    clearCart() {
      this.items = [];
    }
  }
});