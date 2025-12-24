const { models } = require('../config/database');
const { Order, User, Book, Author, Publisher, Post } = models;
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// [GET] /api/stats/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'year'
        
        // 1. Xác định khoảng thời gian lọc
        const now = new Date();
        let startDate;

        if (period === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6); // 7 ngày gần nhất
        } else if (period === 'year') {
             startDate = new Date();
             startDate.setMonth(now.getMonth() - 11); // 12 tháng gần nhất
        } else {
             // Default: Month (30 ngày)
             startDate = new Date();
             startDate.setDate(now.getDate() - 29);
        }

        // Set thời gian về 00:00:00 của ngày bắt đầu để chính xác hơn
        startDate.setHours(0, 0, 0, 0);

        // 2. Thống kê theo kỳ (Doanh thu & Đơn hàng)
        // Lưu ý: Chỉ tính đơn đã giao (delivered) & đã trả tiền (paid) vào Doanh thu
        // Còn số lượng đơn hàng thì có thể tính tất cả hoặc chỉ đơn thành công. 
        // Ở đây ta tính đơn thành công cho khớp doanh thu.
        const revenueStats = await Order.findAll({
            where: {
                created_at: { [Op.gte]: startDate },
                order_status: 'delivered',
                payment_status: 'paid'
            },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('final_amount')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.col('order_id')), 'totalOrders']
            ],
            raw: true
        });

        const periodRevenue = revenueStats[0].totalRevenue || 0;
        const periodOrders = revenueStats[0].totalOrders || 0;

        // 3. Thống kê Tổng quan hệ thống (All Time)
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalBooks = await Book.sum('stock_quantity') || 0; // Tổng số cuốn
        const totalTitles = await Book.count(); // Tổng đầu sách
        const totalAuthors = await Author.count();
        const totalPublishers = await Publisher.count();
        const totalPosts = await Post.count();

        // 4. Dữ liệu biểu đồ (Chi tiết theo thời gian)
        // Query lại các đơn hàng để vẽ chart (vì query trên là SUM cục bộ)
        const ordersForChart = await Order.findAll({
            where: {
                created_at: { [Op.gte]: startDate },
                order_status: 'delivered',
                payment_status: 'paid'
            },
            attributes: ['created_at', 'final_amount'],
            order: [['created_at', 'ASC']]
        });

        // Xử lý group data
        const grouped = {};
        
        if (period === 'year') {
             for (let i = 0; i < 12; i++) {
                 const d = new Date(startDate);
                 d.setMonth(startDate.getMonth() + i);
                 const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                 grouped[key] = 0;
             }
        } else {
             const diffTime = Math.abs(now - startDate);
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             for (let i = 0; i <= diffDays; i++) {
                 const d = new Date(startDate);
                 d.setDate(startDate.getDate() + i);
                 const key = d.toISOString().split('T')[0];
                 grouped[key] = 0;
             }
        }

        ordersForChart.forEach(order => {
            const date = new Date(order.created_at);
            let key;
            if (period === 'year') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = date.toISOString().split('T')[0];
            }

            if (grouped[key] !== undefined) {
                grouped[key] += parseFloat(order.final_amount);
            }
        });

        const chartData = Object.keys(grouped).map(key => ({
            label: key,
            value: grouped[key]
        }));

        res.status(200).json({
            success: true,
            data: {
                // Period Stats
                periodRevenue,
                periodOrders,
                
                // System Stats
                totalUsers,
                totalBooks,     // Số cuốn tồn kho
                totalTitles,    // Số đầu sách
                totalAuthors,
                totalPublishers,
                totalPosts,

                // Chart
                chartData
            }
        });

    } catch (error) {
        console.error("Lỗi stats:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { getDashboardStats };
