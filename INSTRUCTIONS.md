# 📋 INSTRUCTIONS - Hướng Dẫn Phát Triển Sahafa BookStore

## 1. Tổng Quan Dự Án

**Tên dự án:** Sahafa BookStore - Website Thương Mại Điện Tử Bán Sách  
**Mục tiêu:** Xây dựng nền tảng bán sách online hoàn chỉnh với hệ thống quản lý admin và trải nghiệm người dùng tương tự Fahasa.

---

## 2. Đánh Giá & Cảnh Báo Quan Trọng

### ⚠️ Cảnh Báo Server (Critical)
- **Vấn đề:** Server e2-micro (1GB RAM) + Docker + MySQL = **QUÁ TẢI**
- **Giải pháp bắt buộc:**
  - ✅ Tạo **SWAP Memory 2-4GB** ngay khi setup server
  - ✅ Nên dùng **Database bên ngoài** (Supabase, Aiven, Railway) để giảm tải
  - ✅ Nếu chạy MySQL local: config ở mức minimal memory

### 💰 Hệ Thống Thanh Toán
- **Giải pháp:** Dùng **Sepay hoặc Casso** (free cho giao dịch ít)
- **Luồng:** User chuyển khoản → Bank notify Sepay → Webhook về Backend → Xác nhận đơn hàng

### 🤖 AI Chatbot
- **Cấm local AI model** trên server ghẻ
- **Giải pháp:** Gọi API OpenAI (ChatGPT) hoặc Google Gemini qua Backend làm middleware

---

## 3. Tech Stack Chốt Chắc (Bắt Buộc)

### Frontend (Vue 3 + Vite)
```json
{
  "dependencies": {
    "vue": "^3.x",
    "vue-router": "^4.x",
    "pinia": "^2.x",
    "axios": "^1.x",
    "element-plus": "^2.x",      // Admin Dashboard UI
    "tailwindcss": "^3.x",        // User Frontend UI
    "chart.js": "^4.x",           // Thống kê/biểu đồ
    "vue-icon-lib": "latest"      // Icons (lib sẵn)
  }
}
```

### Backend (Node.js + Express)
```json
{
  "dependencies": {
    "express": "^4.x",
    "sequelize": "^6.x",          // ORM (MySQL)
    "mysql2": "^3.x",             // MySQL driver
    "jsonwebtoken": "^9.x",       // JWT Auth
    "bcryptjs": "^2.x",           // Password hashing
    "joi": "^17.x",               // Validation
    "multer": "^1.x",             // Upload files
    "cors": "^2.x",
    "dotenv": "^16.x",
    "helmet": "^7.x",             // Security
    "axios": "^1.x"               // Call 3rd party APIs
  }
}
```

### Database
- **MySQL 8.0+ / MariaDB 10.6+**
- Dùng **Sequelize migrations** để quản lý schema

### DevOps
- **Docker Compose** (Backend + Frontend + MySQL)
- **Nginx** reverse proxy + SSL (Let's Encrypt)
- **GitHub Actions** → Auto CI/CD
- **Cloudflare** DNS + DDoS protection
- **Domain:** xxx.id.vn

---

## 4. Roadmap Chi Tiết

### **Phase 1: Setup & Infrastructure** (Tuần 1)
- [ ] Khởi tạo repo GitHub với structure chuẩn
- [ ] Setup Vite project (Frontend)
- [ ] Setup Express server (Backend)
- [ ] Cấu hình environment (.env)
- [ ] Tạo Docker Compose (Backend + Frontend + MySQL)
- [ ] Tạo SWAP Memory 4GB trên VPS
- [ ] Test local environment

**Deliverable:** Repo chạy được, Docker Compose hoạt động local

---

### **Phase 2: Database Design & ORM Setup** (Tuần 1-2)
**Database Schema:**
```
TABLES:
├── Users (id, email, password_hash, fullname, phone, address, avatar, role, created_at)
├── Categories (id, name, slug, description, icon)
├── Suppliers (id, name, email, phone, address, website)
├── Books (id, title, slug, description, category_id, supplier_id, author, isbn, price, stock, cover_image, created_at)
├── Orders (id, user_id, total_price, status, payment_method, created_at, updated_at)
├── OrderItems (id, order_id, book_id, quantity, price)
├── Cart (id, user_id, book_id, quantity, added_at)
├── Reviews (id, user_id, book_id, rating, comment, created_at)
├── Staff (id, email, password_hash, fullname, role, permissions, created_at)
├── Transactions (id, order_id, amount, payment_gateway, transaction_id, status, created_at)
└── Analytics (id, date, revenue, orders_count, users_count)
```

**Tasks:**
- [ ] Thiết kế ER Diagram
- [ ] Tạo Sequelize models cho mỗi table
- [ ] Setup database connection & migrations
- [ ] Seed dữ liệu test (50 books, 5 categories, 3 suppliers)

**Deliverable:** Database schema hoàn chỉnh, có sample data

---

### **Phase 3: Backend API - Authentication & Authorization** (Tuần 2)
- [ ] JWT middleware & token refresh logic
- [ ] User registration endpoint (validation, bcrypt)
- [ ] User login endpoint
- [ ] User logout & token blacklist
- [ ] Role-based access control (RBAC) middleware
- [ ] User profile endpoints (get, update, change password)
- [ ] Error handling standardization
- [ ] Helmet & CORS security

**Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
PATCH  /api/users/:id
PUT    /api/users/:id/password
```

**Deliverable:** Complete auth system, JWT flow tested

---

### **Phase 4: Backend API - Core Resources** (Tuần 3)
**Categories:**
- [ ] GET /api/categories (list)
- [ ] GET /api/categories/:id
- [ ] POST /api/categories (admin)
- [ ] PATCH /api/categories/:id (admin)
- [ ] DELETE /api/categories/:id (admin)

**Suppliers:**
- [ ] GET /api/suppliers
- [ ] CRUD operations (admin only)

**Books:**
- [ ] GET /api/books (with filters: category, price range, search)
- [ ] GET /api/books/:id (detail page)
- [ ] POST /api/books (admin, with Multer upload)
- [ ] PATCH /api/books/:id (admin)
- [ ] DELETE /api/books/:id (admin)

**Cart:**
- [ ] POST /api/cart (add)
- [ ] GET /api/cart (list)
- [ ] PATCH /api/cart/:id (update quantity)
- [ ] DELETE /api/cart/:id (remove)
- [ ] DELETE /api/cart (clear)

**Orders:**
- [ ] POST /api/orders (checkout từ cart)
- [ ] GET /api/orders (user's orders)
- [ ] GET /api/orders/:id (order detail)
- [ ] PATCH /api/orders/:id/status (admin)

**Input Validation (Joi):**
- [ ] Validate tất cả request body
- [ ] Custom error messages tiếng Việt

**Deliverable:** Tất cả API endpoint hoạt động, tested với Postman

---

### **Phase 5: Backend - Advanced Features** (Tuần 4)
**File Upload:**
- [ ] Config Multer (save to /uploads folder)
- [ ] Validate file type & size
- [ ] Generate thumbnail cho book cover

**Payment Integration:**
- [ ] Setup Sepay/Casso sandbox
- [ ] Webhook receiver endpoint
- [ ] Transaction tracking
- [ ] Order status update on payment

**Reviews & Ratings:**
- [ ] POST /api/books/:id/reviews
- [ ] GET /api/books/:id/reviews
- [ ] Average rating calculation

**Analytics:**
- [ ] Daily revenue tracking
- [ ] Total orders, users count
- [ ] Top-selling books endpoint

**AI Chatbot Middleware:**
- [ ] Backend endpoint: POST /api/chat
- [ ] Call OpenAI/Gemini API
- [ ] Stream response hoặc return full message

**Deliverable:** Payment flow end-to-end tested, AI chat working

---

### **Phase 6: Frontend - User Storefront** (Tuần 3-4)
**Setup:**
- [ ] Install & config Vite + Vue Router + Pinia + Tailwind
- [ ] Create folder structure (components, pages, stores, utils)
- [ ] Setup Axios interceptor + error handling

**Pages:**
- [ ] **Home Page** - Hero section, featured books, categories
- [ ] **Books Listing** - Grid view, filters (category, price), search, pagination
- [ ] **Book Detail** - Book info, reviews, add to cart, recommendations
- [ ] **User Auth** - Login form, Register form, validation
- [ ] **User Profile** - Info, order history, settings, logout
- [ ] **Shopping Cart** - Item list, update quantity, remove, checkout button
- [ ] **Checkout** - Address, payment method selection, order summary
- [ ] **Order Confirmation** - Order number, QR code payment
- [ ] **Order Tracking** - Status, delivery info

**Components (Reusable):**
- [ ] BookCard (image, title, price, rating)
- [ ] BookFilters (category, price range)
- [ ] ReviewCard
- [ ] Navbar (logged in/out states)
- [ ] Footer
- [ ] Pagination

**Features:**
- [ ] Responsive design (mobile-first)
- [ ] Dark/Light mode toggle (optional)
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Search with debounce

**Deliverable:** User storefront fully functional, responsive

---

### **Phase 7: Frontend - Admin Dashboard** (Tuần 4-5)
**Setup:**
- [ ] Install Element Plus
- [ ] Create admin layout (sidebar, top bar, main content)
- [ ] Protected routes (require staff role)

**Pages:**
- [ ] **Dashboard** - Revenue chart, top books, orders count, user count
- [ ] **Books Management** - CRUD operations, bulk upload CSV, image gallery
- [ ] **Categories** - Create, edit, delete, reorder
- [ ] **Suppliers** - Full CRUD
- [ ] **Orders** - List, detail, status change, invoice generation
- [ ] **Users** - List, view profile, manage roles, ban/unban
- [ ] **Staff** - Manage employees, permissions
- [ ] **Analytics** - Revenue trends, sales by category, customer analytics
- [ ] **Reports** - Export to CSV/PDF, print

**Features:**
- [ ] Form validation with error messages
- [ ] Confirmation dialogs for dangerous actions
- [ ] Batch operations (select multiple, delete all)
- [ ] Real-time data sync (optional: WebSocket)
- [ ] Audit logs (who changed what, when)

**Deliverable:** Fully functional admin dashboard

---

### **Phase 8: Frontend - Advanced Features** (Tuần 5)
- [ ] **AI Chatbot Widget** - Chat panel (bottom-right), message history
- [ ] **Book Recommendations** - AI-powered suggestions based on user history
- [ ] **Wishlist** - Save favorite books
- [ ] **Reviews & Ratings** - User can submit reviews with images
- [ ] **Notifications** - Order status changes, new arrivals

**Deliverable:** User-friendly chatbot, personalized recommendations

---

### **Phase 9: Deployment & DevOps** (Tuần 6)
**Local Testing:**
- [ ] Docker Compose up tất cả services
- [ ] Test toàn bộ flow (user → admin)
- [ ] Load testing (Apache Bench)

**VPS Setup:**
- [ ] SSH into server
- [ ] Install Docker + Docker Compose
- [ ] Create SWAP 4GB
- [ ] Clone repo
- [ ] Configure environment variables
- [ ] Setup Nginx config (reverse proxy)
- [ ] SSL certificate (Let's Encrypt, auto-renewal)
- [ ] Firewall rules

**CI/CD (GitHub Actions):**
- [ ] Create workflow: test → build image → push Docker Hub → deploy to VPS
- [ ] SSH deploy script trong Actions
- [ ] Auto restart services

**DNS & Cloudflare:**
- [ ] Point domain A record to VPS IP
- [ ] Enable Cloudflare DDoS protection
- [ ] Add DNS records

**Monitoring:**
- [ ] Setup basic uptime checker
- [ ] Error logging (optional: Sentry)
- [ ] Resource monitoring

**Deliverable:** Website live trên domain, CI/CD working, auto-deploy from GitHub

---

### **Phase 10: Testing & Polish** (Tuần 6-7)
- [ ] End-to-end testing (user journey)
- [ ] Bug fixing
- [ ] Performance optimization
- [ ] UI/UX refinement
- [ ] Documentation (README, API docs, deployment guide)

**Deliverable:** Production-ready website

---

## 5. Folder Structure

```
SahafaBookStore/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── booksController.js
│   │   │   ├── ordersController.js
│   │   │   ├── usersController.js
│   │   │   ├── categoriesController.js
│   │   │   ├── suppliersController.js
│   │   │   ├── cartController.js
│   │   │   ├── reviewsController.js
│   │   │   └── analyticsController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   └── rbac.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   ├── Category.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Cart.js
│   │   │   ├── Review.js
│   │   │   ├── Supplier.js
│   │   │   ├── Staff.js
│   │   │   ├── Transaction.js
│   │   │   └── Analytics.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── books.js
│   │   │   ├── orders.js
│   │   │   ├── users.js
│   │   │   ├── cart.js
│   │   │   ├── admin.js
│   │   │   ├── reviews.js
│   │   │   └── chat.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── validation.js
│   │   │   ├── fileUpload.js
│   │   │   ├── sendEmail.js
│   │   │   └── apiResponse.js
│   │   ├── seeders/
│   │   │   ├── categories.js
│   │   │   ├── suppliers.js
│   │   │   └── books.js
│   │   └── app.js
│   ├── migrations/
│   ├── uploads/
│   │   └── books/
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── Dockerfile
│   └── docker-entrypoint.sh
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── user/
│   │   │   │   ├── Navbar.vue
│   │   │   │   ├── Footer.vue
│   │   │   │   ├── BookCard.vue
│   │   │   │   ├── BookFilters.vue
│   │   │   │   └── ChatBot.vue
│   │   │   ├── admin/
│   │   │   │   ├── Sidebar.vue
│   │   │   │   ├── TopBar.vue
│   │   │   │   └── DataTable.vue
│   │   │   └── shared/
│   │   │       ├── Loading.vue
│   │   │       └── Toast.vue
│   │   ├── pages/
│   │   │   ├── user/
│   │   │   │   ├── Home.vue
│   │   │   │   ├── BooksListing.vue
│   │   │   │   ├── BookDetail.vue
│   │   │   │   ├── Cart.vue
│   │   │   │   ├── Checkout.vue
│   │   │   │   ├── OrderConfirmation.vue
│   │   │   │   ├── Profile.vue
│   │   │   │   ├── Login.vue
│   │   │   │   └── Register.vue
│   │   │   └── admin/
│   │   │       ├── Dashboard.vue
│   │   │       ├── BooksManagement.vue
│   │   │       ├── OrdersManagement.vue
│   │   │       ├── UsersManagement.vue
│   │   │       ├── Analytics.vue
│   │   │       └── Reports.vue
│   │   ├── stores/
│   │   │   ├── auth.js
│   │   │   ├── cart.js
│   │   │   └── notifications.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── books.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml
├── INSTRUCTIONS.md
└── README.md
```

---

## 6. Git Workflow

```bash
# Feature branch
git checkout -b feature/auth-system
git add .
git commit -m "feat: implement JWT authentication"
git push origin feature/auth-system
# → Create Pull Request → Review → Merge to master

# CI/CD trigger → Auto deploy to VPS
```

---

## 7. Development Checklist

### Before starting each phase:
- [ ] Create feature branch
- [ ] Pull latest from master
- [ ] Update .env if needed

### During development:
- [ ] Follow naming conventions (camelCase for JS, snake_case for DB)
- [ ] Write meaningful commit messages
- [ ] Test locally before pushing
- [ ] No hardcoded secrets (use .env)

### Before merging:
- [ ] All tests pass
- [ ] No console.log in production code
- [ ] Code review by teammate
- [ ] Update documentation if needed

---

## 8. Environment Variables Template

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=sahafa_bookstore
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
SEPAY_API_KEY=xxx
OPENAI_API_KEY=xxx
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sahafa BookStore
```

---

## 9. Important Notes

✅ **DO:**
- Use Sequelize migrations for database changes
- Validate all inputs with Joi
- Hash passwords with bcrypt (cost: 10)
- Use JWT with refresh token strategy
- Write meaningful commit messages
- Test locally before pushing

❌ **DON'T:**
- Commit .env file
- Use `require()` for models after setup
- Hardcode values
- Skip validation
- Deploy without testing
- Use local AI models on server

---

## 10. Support & Resources

- **Sequelize Docs:** https://sequelize.org/
- **Express Security:** https://expressjs.com/en/advanced/best-practice-security.html
- **Vue 3 Guide:** https://vuejs.org/
- **Tailwind CSS:** https://tailwindcss.com/
- **Element Plus:** https://element-plus.org/
- **Sepay API:** https://sepay.vn/

---

**Cập nhật lần cuối:** December 5, 2025  
**Version:** 1.0
