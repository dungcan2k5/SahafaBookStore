const fs = require('fs');
const path = require('path');

// [GET] /api/uploads/images - List all images in the uploads directory (Recursive scan)
const listImages = async (req, res) => {
    try {
        const uploadRoot = process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads');
        // Scan cả folder images (cũ) và folder books (mới)
        const roots = ['images', 'books'];
        
        let allImages = [];

        for (const rootName of roots) {
            const rootDir = path.join(uploadRoot, rootName);
            if (!fs.existsSync(rootDir)) continue;

            const scanDir = (dir, prefix) => {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        scanDir(fullPath, `${prefix}/${file}`);
                    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
                        // Tên folder chứa (ví dụ: book ID)
                        const folderName = path.basename(dir);
                        allImages.push({
                            name: file,
                            url: `/uploads${prefix}/${file}`,
                            folder: prefix.includes('books') ? `Sách ID: ${folderName}` : 'Ảnh chung'
                        });
                    }
                }
            };
            
            scanDir(rootDir, `/${rootName}`);
        }

        res.status(200).json({ success: true, data: allImages });
    } catch (error) {
        console.error("Lỗi lấy danh sách ảnh:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = {
    listImages
};
