import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // State: Danh sách sản phẩm trong giỏ
  const items = ref([]);

  // Getter: Tính tổng số lượng sản phẩm
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Getter: Tính tổng tiền
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Action: Thêm sản phẩm vào giỏ
  function addToCart(product, quantity) {
    const existingItem = items.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ ...product, quantity });
    }
    
    // Lưu vào LocalStorage để F5 không mất
    saveToLocalStorage();
    alert('Đã thêm vào giỏ hàng thành công!');
  }

  // Action: Xóa sản phẩm
  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId);
    saveToLocalStorage();
  }

  // Helper: Lưu LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem('cart-items', JSON.stringify(items.value));
  }

  // Init: Lấy lại dữ liệu cũ nếu có
  const savedItems = localStorage.getItem('cart-items');
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }

  return { items, totalItems, totalPrice, addToCart, removeFromCart };
});