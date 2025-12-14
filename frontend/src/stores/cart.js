import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // State: Lấy dữ liệu từ LocalStorage ngay khi khởi tạo
  const items = ref(JSON.parse(localStorage.getItem('cart-items')) || []);

  // Getter: Tổng số lượng
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Getter: Tổng tiền
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Action: Thêm vào giỏ
  function addToCart(product, quantity = 1) {
    const existingItem = items.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ ...product, quantity });
    }
    
    saveToLocalStorage();
    // alert('Đã thêm vào giỏ hàng thành công!'); // Có thể bỏ alert này nếu thấy phiền
  }

  // Action: Xóa sản phẩm
  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId);
    saveToLocalStorage();
  }

  // Action MỚI: Cập nhật số lượng (Tăng/Giảm)
  function updateQuantity(productId, change) {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      // Chỉ cho phép cập nhật nếu số lượng > 0
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        saveToLocalStorage();
      }
    }
  }

  // Action MỚI: Xóa sạch giỏ (Dùng khi thanh toán xong)
  function clearCart() {
    items.value = [];
    saveToLocalStorage();
  }

  // Helper: Lưu LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem('cart-items', JSON.stringify(items.value));
  }

  return { 
    items, 
    totalItems, 
    totalPrice, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  };
});