const { models } = require('../config/database');
const { Review, User, Book } = models;

// [GET] /api/reviews/book/:bookId - Lấy danh sách review của 1 cuốn sách
const getReviewsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.findAll({
            where: { book_id: bookId },
            include: [
                { model: User, attributes: ['full_name', 'avatar_url'] }
            ],
            order: [['review_id', 'DESC']]
        });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/reviews - Thêm review (yêu cầu login)
const addReview = async (req, res) => {
    try {
        const { book_id, rating, comment } = req.body;
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
        }

        // Tạo review
        const newReview = await Review.create({
            user_id: req.user_id,
            book_id,
            rating,
            comment
        });

        // Cập nhật average_rating cho Book
        // 1. Lấy tất cả review của book đó
        const reviews = await Review.findAll({ where: { book_id } });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = totalRating / reviews.length;

        // 2. Update Book
        await Book.update(
            { average_rating: avg },
            { where: { book_id } }
        );

        res.status(201).json({ success: true, data: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getReviewsByBook, addReview };
