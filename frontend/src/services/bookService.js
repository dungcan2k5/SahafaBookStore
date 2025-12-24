import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const bookService = {
  
  // 1. Lấy sách Flash Sale (Đã có logic trong controller của bạn)
  async getFlashSale() {
    const res = await axios.get(`${API_URL}/books/flash-sale`);
    return res.data.data;
  },

  // 2. Lấy sách Xu Hướng (Dựa trên total_sold cao nhất)
  async getTrending() {
    const res = await axios.get(`${API_URL}/books`, {
        params: {
            sort: 'total_sold',
            order: 'DESC',
            limit: 10 // Lấy 10 cuốn xu hướng
        }
    });
    
    if (res.data.success) {
        return res.data.data.map(b => ({
            id: b.book_id,
            title: b.book_title,
            price: b.price,
            // Giả lập giá cũ cao hơn 20%
            oldPrice: Math.round((b.price * 1.25) / 1000) * 1000,
            discount: 20,
            sold: b.total_sold,
            image: b.BookImages?.[0]?.book_image_url || 'https://placehold.co/400x600'
        }));
    }
    return [];
  },

  // 3. Lấy sách Mới (Dựa trên ID mới nhất)
  async getNewArrivals() {
    const res = await axios.get(`${API_URL}/books`, {
        params: {
            sort: 'book_id',
            order: 'DESC',
            limit: 10
        }
    });
    
    if (res.data.success) {
        return res.data.data.map(b => ({
            id: b.book_id,
            title: b.book_title,
            price: b.price,
            discount: 10,
            sold: b.total_sold,
            image: b.BookImages?.[0]?.book_image_url || 'https://placehold.co/400x600'
        }));
    }
    return [];
  },

  // 4. Lấy sách Gợi Ý
  async getSuggestions() {
    const res = await axios.get(`${API_URL}/books`, {
        params: { limit: 10 } // Mặc định lấy danh sách bất kỳ làm gợi ý
    });
    
    if (res.data.success) {
        return res.data.data.map(b => ({
            id: b.book_id,
            title: b.book_title,
            price: b.price,
            oldPrice: Math.round((b.price * 1.2) / 1000) * 1000,
            discount: 15,
            sold: b.total_sold,
            image: b.BookImages?.[0]?.book_image_url || 'https://placehold.co/400x600'
        }));
    }
    return [];
  },

  // 5. Lấy chi tiết sách
  async getBookById(id) {
    const res = await axios.get(`${API_URL}/books/${id}`);
    if (res.data.success) {
        const b = res.data.data;
        return {
            id: b.book_id,
            title: b.book_title,
            price: b.price,
            oldPrice: Math.round((b.price * 1.25) / 1000) * 1000,
            discount: 20,
            sold: b.total_sold,
            description: b.description,
            image: b.BookImages?.[0]?.book_image_url || 'https://placehold.co/400x600',
            author: b.Author?.author_name
        };
    }
    return null;
  }
};