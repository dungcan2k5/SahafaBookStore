import axios from 'axios';

// URL API gốc
const API_URL = 'http://localhost:3000/api'; 

export const bookService = {

  // --- HÀM QUAN TRỌNG NHẤT ĐỂ LẤY SÁCH ---
  async getAllBooks() {
    try {
      // Thêm ?limit=100 để lấy nhiều sách về lọc Top Seller cho chuẩn
      const res = await axios.get(`${API_URL}/books?limit=100`);
      
      // LOGIC MỚI: Kiểm tra xem dữ liệu nằm ở đâu
      // Nếu API trả về dạng { data: [...] } thì lấy phần data bên trong
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        return res.data.data; 
      }
      
      // Dự phòng: Nếu API trả về thẳng mảng [...]
      if (Array.isArray(res.data)) {
        return res.data;
      }

      return []; 
    } catch (error) {
      console.error("Lỗi gọi API getAllBooks:", error);
      return [];
    }
  },

  // --- CÁC HÀM KHÁC GIỮ NGUYÊN HOẶC MOCK DATA ---
  async getFlashSale() {
    await new Promise(r => setTimeout(r, 500)); 
    return [
      { id: 101, title: 'Harry Potter Boxset', price: 1500000, oldPrice: 2500000, discount: 40, sold: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/h/a/harry-potter-full.jpg' },
      { id: 102, title: 'Sherlock Holmes', price: 180000, oldPrice: 300000, discount: 40, sold: 45, image: 'https://cdn0.fahasa.com/media/catalog/product/s/h/sherlock-holmes.jpg' },
      { id: 103, title: 'Conan 100', price: 25000, oldPrice: 30000, discount: 15, sold: 120, image: 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan_100_bia_roi.jpg' },
      { id: 104, title: 'Dế Mèn Phiêu Lưu Ký', price: 35000, oldPrice: 50000, discount: 30, sold: 80, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8936067605692.jpg' },
      { id: 105, title: 'Đất Rừng Phương Nam', price: 65000, oldPrice: 90000, discount: 25, sold: 60, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dat_rung_phuong_nam_-_bia_cung_1.jpg' }
    ];
  },

  async getTrending() {
    await new Promise(r => setTimeout(r, 600));
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: i % 2 === 0 ? 'Nhà Giả Kim' : 'Cây Cam Ngọt Của Tôi',
      price: i % 2 === 0 ? 63000 : 86000,
      oldPrice: i % 2 === 0 ? 79000 : 108000,
      discount: 20,
      sold: 100 + (i * 15),
      image: i % 2 === 0 
        ? 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' 
        : 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg'
    }));
  },

  async getNewArrivals() {
    return []; // Tạm thời để rỗng hoặc thêm mock data tùy ý
  },

  async getSuggestions() {
    return [];
  },

  async getBookById(id) {
    return {};
  }
};