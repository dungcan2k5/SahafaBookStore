import axios from 'axios';

// URL API gốc (Sau này khi có Backend thì đổi link này)
// const API_URL = 'http://localhost:3000/api';

export const bookService = {
  
  // 1. Lấy sách Flash Sale
  async getFlashSale() {
    // --- KHI CÓ API THÌ DÙNG ĐOẠN NÀY ---
    // const res = await axios.get(`${API_URL}/books/flash-sale`);
    // return res.data;

    // --- DỮ LIỆU GIẢ (MOCK DATA) ---
    await new Promise(r => setTimeout(r, 500)); // Giả lập mạng chậm
    return [
      { id: 101, title: 'Harry Potter Boxset (7 Tập)', price: 1500000, oldPrice: 2500000, discount: 40, sold: 15, image: 'https://cdn0.fahasa.com/media/catalog/product/h/a/harry-potter-full.jpg' },
      { id: 102, title: 'Sherlock Holmes Toàn Tập', price: 180000, oldPrice: 300000, discount: 40, sold: 45, image: 'https://cdn0.fahasa.com/media/catalog/product/s/h/sherlock-holmes.jpg' },
      { id: 103, title: 'Thám Tử Lừng Danh Conan 100', price: 25000, oldPrice: 30000, discount: 15, sold: 120, image: 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan_100_bia_roi.jpg' },
      { id: 104, title: 'Dế Mèn Phiêu Lưu Ký', price: 35000, oldPrice: 50000, discount: 30, sold: 80, image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8936067605692.jpg' },
      { id: 105, title: 'Đất Rừng Phương Nam', price: 65000, oldPrice: 90000, discount: 25, sold: 60, image: 'https://cdn0.fahasa.com/media/catalog/product/d/a/dat_rung_phuong_nam_-_bia_cung_1.jpg' }
    ];
  },

  // 2. Lấy sách Xu Hướng (Trả về nhiều sách hơn để test trang Trending)
  async getTrending() {
    // const res = await axios.get(`${API_URL}/books/trending`);
    // return res.data;

    await new Promise(r => setTimeout(r, 600));
    // Tạo tự động 12 cuốn sách giả
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: i % 2 === 0 ? 'Nhà Giả Kim (Tái Bản 2024)' : 'Cây Cam Ngọt Của Tôi',
      price: i % 2 === 0 ? 63000 : 86000,
      oldPrice: i % 2 === 0 ? 79000 : 108000,
      discount: 20,
      sold: 100 + (i * 15),
      image: i % 2 === 0 
        ? 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' 
        : 'https://cdn0.fahasa.com/media/catalog/product/c/a/cay_cam_ngot_cua_toi_1.jpg'
    }));
  },

  // 3. Lấy sách Mới
  async getNewArrivals() {
    await new Promise(r => setTimeout(r, 400));
    return [
      { id: 201, title: 'Muôn Kiếp Nhân Sinh 3', price: 180000, discount: 10, sold: 50, image: 'https://cdn0.fahasa.com/media/catalog/product/m/u/muon-kiep-nhan-sinh-2.jpg' },
      { id: 202, title: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải', price: 120000, discount: 15, sold: 200, image: 'https://cdn0.fahasa.com/media/catalog/product/t/h/thien-tai-ben-trai-ke-dien-ben-phai.jpg' },
      { id: 203, title: 'Không Gia Đình', price: 90000, discount: 25, sold: 1500, image: 'https://cdn0.fahasa.com/media/catalog/product/k/h/khong-gia-dinh.jpg' },
      { id: 204, title: 'Totto-chan Bên Cửa Sổ', price: 85000, discount: 10, sold: 900, image: 'https://cdn0.fahasa.com/media/catalog/product/t/o/totto-chan-ben-cua-so.jpg' },
      { id: 205, title: 'Hoàng Tử Bé', price: 50000, discount: 30, sold: 3000, image: 'https://cdn0.fahasa.com/media/catalog/product/h/o/hoang-tu-be.jpg' },
    ];
  },

  // 4. Lấy sách Gợi Ý - sách được đề xuất cho người dùng
  async getSuggestions() {
    // const res = await axios.get(`${API_URL}/books/suggestions`);
    // return res.data;

    await new Promise(r => setTimeout(r, 700));
    // Tạo tự động 10 cuốn sách gợi ý giả
    return Array.from({ length: 10 }, (_, i) => ({
      id: 300 + i,
      title: i % 3 === 0 ? 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh' : i % 3 === 1 ? 'Sapiens: Lược Sử Loài Người' : 'Đắc Nhân Tâm',
      price: i % 3 === 0 ? 95000 : i % 3 === 1 ? 150000 : 76000,
      oldPrice: i % 3 === 0 ? 120000 : i % 3 === 1 ? 180000 : 95000,
      discount: 20,
      sold: 50 + (i * 20),
      image: i % 3 === 0 
        ? 'https://cdn0.fahasa.com/media/catalog/product/t/o/toi-thay-hoa-vang-tren-co-xanh.jpg' 
        : i % 3 === 1 
          ? 'https://cdn0.fahasa.com/media/catalog/product/s/a/sapiens.jpg'
          : 'https://cdn0.fahasa.com/media/catalog/product/d/a/dac-nhan-tam-biamem-2023.jpg'
    }));
  },

  // 5. Lấy chi tiết 1 cuốn sách (Dùng cho trang BookDetail)
  async getBookById(id) {
    // const res = await axios.get(`${API_URL}/books/${id}`);
    // return res.data;

    await new Promise(r => setTimeout(r, 300));
    // Trả về 1 object sách giả lập
    return {
      id: id,
      title: `Sách Demo (ID: ${id})`,
      price: 125000,
      oldPrice: 150000,
      discount: 15,
      sold: 500,
      description: 'Đây là mô tả chi tiết của cuốn sách. Sau này dữ liệu sẽ được lấy từ database.',
      image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' // Ảnh mặc định
    };
  }
};