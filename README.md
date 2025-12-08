# 📚 Sahafa BookStore - E-Commerce Platform

**Website thương mại điện tử bán sách** xây dựng bằng Vue 3, Express.js, MySQL, with Admin Dashboard & AI Chatbot.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)
![Vue](https://img.shields.io/badge/Vue-3-green)

---

## 🎯 Chức Năng Chính

### 👤 **User Storefront**
- ✅ Duyệt sách theo danh mục (category), tìm kiếm
- ✅ Xem chi tiết sách (ratings, reviews, tác giả, giá)
- ✅ Quản lý giỏ hàng (add, update, remove)
- ✅ Thanh toán qua QR code (Sepay/Casso)
- ✅ Đăng ký/Đăng nhập, quản lý tài khoản
- ✅ Lịch sử đơn hàng, theo dõi trạng thái
- ✅ Viết review, đánh giá sách
- ✅ 🤖 **AI Chatbot** - Gợi ý sách, hỗ trợ khách hàng

### 👨‍💼 **Admin Dashboard**
- ✅ Quản lý sách (CRUD, upload ảnh bìa)
- ✅ Quản lý danh mục & nhà cung cấp
- ✅ Quản lý đơn hàng (xem, sửa trạng thái)
- ✅ Quản lý người dùng (roles, ban/unban)
- ✅ Quản lý nhân viên (permissions)
- ✅ Thống kê & phân tích (doanh thu, top books, customer insights)
- ✅ Xuất báo cáo (CSV, PDF, In)
- ✅ Audit logs (lịch sử thay đổi)

---

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - User storefront styling
- **Element Plus** - Admin dashboard UI components
- **Chart.js** - Data visualization (thống kê)

### Backend
- **Node.js + Express** - Server framework
- **Sequelize** - ORM (MySQL)
- **JWT** - Authentication (jsonwebtoken)
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Multer** - File upload (book covers)
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0** / **MariaDB 10.6+**
- Relational schema with proper indexing
- Migrations managed by Sequelize

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy & web server
- **Let's Encrypt** - SSL/TLS certificates
- **Cloudflare** - DNS & DDoS protection
- **GCP e2-micro** - VPS (0.25 vCPU, 1GB RAM, 30GB HDD)

### Third-party Integration
- **Sepay/Casso** - Payment gateway (QR code, bank transfer)
- **OpenAI API / Google Gemini** - AI Chatbot

---

## 📋 Project Structure

```
SahafaBookStore/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database, constants
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Sequelize ORM models
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── utils/          # Helpers, JWT, file upload
│   │   └── app.js          # Express app setup
│   ├── uploads/            # Book cover images
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Initial data (categories, books)
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/               # Vue 3 + Vite
│   ├── src/
│   │   ├── components/     # Reusable Vue components
│   │   ├── pages/          # Route pages (Home, Cart, Admin, etc)
│   │   ├── stores/         # Pinia state management
│   │   ├── router/         # Vue Router config
│   │   ├── services/       # API services (Axios)
│   │   ├── utils/          # Utility functions
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/             # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml      # Multi-container setup
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── INSTRUCTIONS.md         # Detailed development guide
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+ (hoặc MariaDB)
- Git

### Local Development

#### 1️⃣ Clone & Setup
```bash
git clone https://github.com/dungcan2k5/SahafaBookStore.git
cd SahafaBookStore

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

#### 2️⃣ Database Setup
```bash
cd backend
# Tạo database
mysql -u root -p < setup.sql

# Chạy migrations
npm run migrate

# Seed dữ liệu test
npm run seed
```

#### 3️⃣ Run Local (Docker Compose)
```bash
cd ..  # Back to root
docker-compose up --build
```

Services sẽ chạy trên:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Nginx:** http://localhost:80
- **MySQL:** localhost:3306

#### 4️⃣ Login Credentials (Demo)
```
Admin Account:
Email: admin@sahafa.com
Password: Admin@123

User Account:
Email: user@sahafa.com
Password: User@123
```

---

## 📚 API Documentation

### Base URL
- **Local:** `http://localhost:3000/api`
- **Production:** `https://sahafa.id.vn/api`

### Authentication
```
Authorization: Bearer <JWT_TOKEN>
```

### Main Endpoints

#### Auth
```
POST   /auth/register          # User registration
POST   /auth/login             # Login
POST   /auth/logout            # Logout
POST   /auth/refresh-token     # Refresh JWT
GET    /auth/me                # Current user info
```

#### Books
```
GET    /books                  # List all books (with filters, pagination)
GET    /books/:id              # Book detail
POST   /books                  # Create (admin only)
PATCH  /books/:id              # Update (admin only)
DELETE /books/:id              # Delete (admin only)
```

#### Orders
```
POST   /orders                 # Create order (checkout)
GET    /orders                 # User's orders
GET    /orders/:id             # Order detail
PATCH  /orders/:id/status      # Update status (admin)
```

#### Cart
```
POST   /cart                   # Add to cart
GET    /cart                   # Get cart items
PATCH  /cart/:id               # Update quantity
DELETE /cart/:id               # Remove item
DELETE /cart                   # Clear cart
```

#### Admin Resources
```
GET    /admin/analytics        # Dashboard stats
GET    /admin/reports          # Export reports
PATCH  /admin/users/:id/role   # Change user role
```

**Full API documentation:** See `INSTRUCTIONS.md` or Postman collection (to be added)

---

## 📊 Database Schema

### Key Tables
- **users** - Customer accounts with roles
- **books** - Product catalog with cover images
- **categories** - Book categories
- **suppliers** - Book suppliers
- **orders** - Order records
- **order_items** - Items in each order
- **cart** - Shopping cart items
- **reviews** - User reviews & ratings
- **transactions** - Payment history
- **staff** - Admin & employee accounts
- **analytics** - Daily revenue/stats

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT token-based auth
- Refresh token strategy
- Role-based access control (RBAC)
- Password hashing with bcrypt (cost: 10)

✅ **API Security**
- Helmet.js security headers
- CORS configuration
- Input validation with Joi
- SQL injection prevention (ORM)
- Rate limiting (to be added)

✅ **Database**
- Parameterized queries (Sequelize)
- User password encryption
- Sensitive data masking in logs

✅ **Deployment**
- SSL/TLS via Let's Encrypt
- Cloudflare DDoS protection
- Environment variables for secrets
- Docker container isolation

---

## 💰 Payment Integration

### Sepay / Casso Bank Transfer
1. User selects "Bank Transfer" at checkout
2. System generates QR code for payment
3. User scans & transfers money
4. Bank notifies Sepay
5. Sepay sends webhook to Backend
6. Backend verifies & updates order status
7. Frontend receives notification

---

## 🤖 AI Features

### AI Chatbot
- Real-time chat with customers
- Book recommendations based on preferences
- FAQ answering
- Backend calls OpenAI / Google Gemini API
- Responses streamed to frontend

### Recommendation Engine
- Suggest books based on user's purchase history
- Similar books based on category/author
- Trending books

---

## 📱 Performance & Optimization

- **Frontend:** Code splitting, lazy loading, caching
- **Backend:** Database indexing, API response caching, SWAP memory for server
- **Images:** Compressed covers, CDN delivery (Cloudflare)
- **Load Testing:** Apache Bench, K6 (to be added)

---

## 🚨 Important Notes

### ⚠️ Server Resource Warning
- **VPS:** 1GB RAM + Docker + MySQL = High resource usage
- **Solution:** Create 2-4GB SWAP memory immediately
- **Alternative:** Use external database (Supabase, Aiven, Railway)

### 🔧 Configuration Files
- **Backend:** `backend/.env` (database, JWT secret, API keys)
- **Frontend:** `frontend/.env` (API URL, app name)
- **Docker:** `docker-compose.yml` (service configuration)
- **Nginx:** `frontend/nginx.conf` (reverse proxy)

### 📦 Dependencies Management
- Lock versions in `package-lock.json` / `yarn.lock`
- Regular security audits: `npm audit`
- Update critical patches only

---

## 📖 Development Workflow

1. **Create feature branch:** `git checkout -b feature/feature-name`
2. **Make changes** following INSTRUCTIONS.md
3. **Test locally:** `docker-compose up`
4. **Commit:** `git commit -m "feat: description"`
5. **Push & Create PR:** `git push origin feature/feature-name`
6. **Code review & merge** → Auto-deploy via GitHub Actions

---

## 🐛 Troubleshooting

### Docker issues
```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database connection failed
```bash
# Check MySQL container
docker-compose logs mysql

# Verify .env credentials
cat backend/.env | grep DB_
```

### Port already in use
```bash
# Change ports in docker-compose.yml or kill process
lsof -i :3000
kill -9 <PID>
```

---

## 📝 Contributing

1. Follow the roadmap in `INSTRUCTIONS.md`
2. Create feature branches from `master`
3. Write meaningful commit messages
4. No hardcoded secrets or credentials
5. Test before pushing
6. Update README if adding new features

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

- **Backend Development:** Node.js + Express
- **Frontend Development:** Vue 3 + Vite
- **DevOps & Deployment:** Docker, GitHub Actions, Nginx
- **Database:** MySQL + Sequelize ORM

---

## 🔗 Useful Resources

- [Sequelize Documentation](https://sequelize.org/)
- [Vue 3 Guide](https://vuejs.org/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Tailwind CSS](https://tailwindcss.com/)
- [Element Plus](https://element-plus.org/)
- [Sepay API](https://sepay.vn/)
- [Docker Docs](https://docs.docker.com/)

---

## 📞 Support & Questions

Refer to `INSTRUCTIONS.md` for detailed development guide and troubleshooting.

---

**Last Updated:** December 5, 2025  
**Version:** 1.0.0  
**Status:** 🔄 In Development
