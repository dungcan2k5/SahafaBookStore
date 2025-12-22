const { models } = require('../config/database');
const { Post, Category } = models;

// [GET] /api/posts - Lấy danh sách bài viết
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { status: 'published' },
            include: [{ model: Category, attributes: ['category_name'] }],
            order: [['post_id', 'DESC']]
        });
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [GET] /api/posts/:id - Lấy chi tiết bài viết
const getPostDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id, {
            include: [Category]
        });

        if (!post) return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [GET] /api/posts/categories - Lấy danh mục bài viết (VD: Tin tức, Review, Khuyến mãi)
const getPostCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/posts - Tạo bài viết mới (Admin/Employee)
const createPost = async (req, res) => {
    try {
        const { title, post_slug, thumbnail_url, content, category_id, status } = req.body;
        
        // Simple validation
        if (!title || !post_slug) {
            return res.status(400).json({ success: false, message: 'Tiêu đề và Slug là bắt buộc' });
        }

        const newPost = await Post.create({
            title,
            post_slug,
            thumbnail_url,
            content,
            category_id,
            status: status || 'draft',
            user_id: req.user_id // Người tạo
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: 'Slug bài viết đã tồn tại' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/posts/:id - Cập nhật bài viết (Admin/Employee)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, post_slug, thumbnail_url, content, category_id, status } = req.body;

        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ success: false, message: 'Bài viết không tìm thấy' });

        await post.update({
            title,
            post_slug,
            thumbnail_url,
            content,
            category_id,
            status
        });

        res.json({ success: true, message: 'Cập nhật bài viết thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [DELETE] /api/posts/:id - Xóa bài viết (Admin/Employee)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Post.destroy({ where: { post_id: id } });
        
        if (!deleted) return res.status(404).json({ success: false, message: 'Bài viết không tìm thấy' });

        res.json({ success: true, message: 'Xóa bài viết thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { 
    getAllPosts, 
    getPostDetail, 
    getPostCategories, 
    createPost, 
    updatePost, 
    deletePost 
};
