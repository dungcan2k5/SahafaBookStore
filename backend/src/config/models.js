const { DataTypes } = require('sequelize');
const { sequelize } = require('./database'); 

// ============================================================
// 1. NHÓM TÀI KHOẢN & ĐỊA CHỈ
// ============================================================

// Bảng: TAI_KHOAN
const User = sequelize.define('User', {
    UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // PK tự tăng
    HoTen: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false, unique: true },
    SoDienThoai: { type: DataTypes.STRING },
    VaiTro: { type: DataTypes.STRING, defaultValue: 'User' } // Admin/User
}, {
    tableName: 'TAI_KHOAN', // Tên bảng trong DB
    timestamps: false // Tạm tắt created_at nếu ERD ko có (hoặc bật lên tùy mày)
});

// Bảng: SO_DIA_CHI
const Address = sequelize.define('Address', {
    DiaChiID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    DiaChiCuThe: { type: DataTypes.STRING, allowNull: false },
    // UserID sẽ được tạo tự động qua quan hệ bên dưới
}, {
    tableName: 'SO_DIA_CHI',
    timestamps: false
});

// ============================================================
// 2. NHÓM SẢN PHẨM & METADATA
// ============================================================

// Bảng: TAC_GIA
const Author = sequelize.define('Author', {
    TacGiaID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    TenTacGia: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'TAC_GIA',
    timestamps: false
});

// Bảng: THE_LOAI
const Category = sequelize.define('Category', {
    TheLoaiID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    TenTheLoai: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'THE_LOAI',
    timestamps: false
});

// Bảng: NHA_XUAT_BAN
const Publisher = sequelize.define('Publisher', {
    NhaXBID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    TenNXB: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'NHA_XUAT_BAN',
    timestamps: false
});

// Bảng: SACH
const Book = sequelize.define('Book', {
    SachID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    TenSach: { type: DataTypes.STRING, allowNull: false },
    GiaBan: { type: DataTypes.INTEGER, allowNull: false },
    SoLuongTon: { type: DataTypes.INTEGER, defaultValue: 0 },
    NamXuatBan: { type: DataTypes.INTEGER }
    // TacGiaID, TheLoaiID, NhaXBID sẽ tự mapping qua quan hệ
}, {
    tableName: 'SACH',
    timestamps: false
});

// Bảng: HINH_ANH_SACH
const BookImage = sequelize.define('BookImage', {
    HinhAnhID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UrlHinhAnh: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'HINH_ANH_SACH',
    timestamps: false
});

// ============================================================
// 3. NHÓM ĐƠN HÀNG & KHUYẾN MÃI
// ============================================================

// Bảng: MA_GIAM_GIA
const Discount = sequelize.define('Discount', {
    GiamID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Code: { type: DataTypes.STRING, allowNull: false, unique: true },
    PhanTramGiam: { type: DataTypes.INTEGER, allowNull: false },
    SoLuongConLai: { type: DataTypes.INTEGER, defaultValue: 0 },
    NgayBatDau: { type: DataTypes.DATE },
    NgayKetThuc: { type: DataTypes.DATE }
}, {
    tableName: 'MA_GIAM_GIA',
    timestamps: false
});

// Bảng: DON_HANG
const Order = sequelize.define('Order', {
    DonID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NgayDat: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    TongTien: { type: DataTypes.INTEGER, defaultValue: 0 },
    TrangThaiDon: { type: DataTypes.STRING, defaultValue: 'Pending' },
    DiaChiGiaoHang: { type: DataTypes.STRING, allowNull: false } // Snapshot địa chỉ text
}, {
    tableName: 'DON_HANG',
    timestamps: false
});

// Bảng: CHI_TIET_DON_HANG
const OrderDetail = sequelize.define('OrderDetail', {
    ChiTietID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    SoLuongMua: { type: DataTypes.INTEGER, allowNull: false },
    GiaTaiThoiDiemMua: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'CHI_TIET_DON_HANG',
    timestamps: false
});

// ============================================================
// 4. NHÓM NHẬP HÀNG (KHO) - MỚI THÊM
// ============================================================

// Bảng: PHIEU_NHAP
const ImportSlip = sequelize.define('ImportSlip', {
    PhieuNhapID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NgayNhap: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'PHIEU_NHAP',
    timestamps: false
});

// Bảng: CT_PHIEU_NHAP
const ImportSlipDetail = sequelize.define('ImportSlipDetail', {
    CTNhapID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    SoLuongNhap: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'CT_PHIEU_NHAP',
    timestamps: false
});

// ============================================================
// 5. THIẾT LẬP QUAN HỆ (ASSOCIATIONS)
// Quan trọng: Phải chỉ định rõ 'foreignKey' để nó không tự đẻ ra cái tên tào lao
// ============================================================

// User (1) -> Address (N)
User.hasMany(Address, { foreignKey: 'UserID' });
Address.belongsTo(User, { foreignKey: 'UserID' });

// Author (1) -> Book (N)
Author.hasMany(Book, { foreignKey: 'TacGiaID' });
Book.belongsTo(Author, { foreignKey: 'TacGiaID' });

// Category (1) -> Book (N)
Category.hasMany(Book, { foreignKey: 'TheLoaiID' });
Book.belongsTo(Category, { foreignKey: 'TheLoaiID' });

// Publisher (1) -> Book (N)
Publisher.hasMany(Book, { foreignKey: 'NhaXBID' });
Book.belongsTo(Publisher, { foreignKey: 'NhaXBID' });

// Book (1) -> Image (N)
Book.hasMany(BookImage, { foreignKey: 'SachID' });
BookImage.belongsTo(Book, { foreignKey: 'SachID' });

// User (1) -> Order (N)
User.hasMany(Order, { foreignKey: 'UserID' });
Order.belongsTo(User, { foreignKey: 'UserID' });

// Discount (1) -> Order (N) - Optional
Discount.hasMany(Order, { foreignKey: 'GiamID' });
Order.belongsTo(Discount, { foreignKey: 'GiamID' });

// Order (1) -> OrderDetail (N)
Order.hasMany(OrderDetail, { foreignKey: 'DonID' });
OrderDetail.belongsTo(Order, { foreignKey: 'DonID' });

// Book (1) -> OrderDetail (N)
Book.hasMany(OrderDetail, { foreignKey: 'SachID' });
OrderDetail.belongsTo(Book, { foreignKey: 'SachID' });

// ImportSlip (1) -> ImportSlipDetail (N)
ImportSlip.hasMany(ImportSlipDetail, { foreignKey: 'PhieuNhapID' });
ImportSlipDetail.belongsTo(ImportSlip, { foreignKey: 'PhieuNhapID' });

// Book (1) -> ImportSlipDetail (N)
Book.hasMany(ImportSlipDetail, { foreignKey: 'SachID' });
ImportSlipDetail.belongsTo(Book, { foreignKey: 'SachID' });

// Export hết ra
module.exports = { 
    sequelize, // Export cả cái instance để dùng transaction nếu cần
    User, Address, 
    Author, Category, Publisher, Book, BookImage, 
    Discount, Order, OrderDetail, 
    ImportSlip, ImportSlipDetail 
};