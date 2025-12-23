// backend/src/seed.js
const { sequelize, models } = require('./config/database');
const bcrypt = require('bcrypt');

// Load models
const { 
    User, Book, Author, Genre, Publisher, 
    Cart, BookImage, Category, Post, Voucher, Review,
    Address
} = models;

const seed = async () => {
    let t;

    try {
        await sequelize.authenticate();
        console.log("🔌 Database connected. Starting safe seed with Transaction...");

        t = await sequelize.transaction();

        // 1. Reset DB
        await sequelize.sync({ force: true }); 
        console.log("🗑️  Database cleared.");

        // =============================================
        // 2. USERS
        // =============================================
        console.log("👤 Creating Users...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);
        
        const usersData = [
            { full_name: 'Admin User', email: 'admin@sahafa.com', password: hash, role: 'admin', phone: '0901000001' },
            { full_name: 'Staff Member', email: 'staff@sahafa.com', password: hash, role: 'employee', phone: '0901000002' },
            { full_name: 'Normal Customer', email: 'user@sahafa.com', password: hash, role: 'customer', phone: '0901000003' }
        ];

        const createdUsers = [];
        for (const u of usersData) {
            const user = await User.create(u, { transaction: t });
            createdUsers.push(user);
            // Create Cart for each user
            await Cart.create({ user_id: user.user_id }, { transaction: t });
            
            // Create default address for customer
            if (u.role === 'customer') {
                await Address.create({
                    user_id: user.user_id,
                    recipient_name: u.full_name,
                    phone: u.phone,
                    address_detail: '123 Nguyen Van Linh, District 7, HCMC',
                    is_default: true
                }, { transaction: t });
            }
        }

        // =============================================
        // 3. MASTER DATA (Authors, Genres, Publishers, Categories)
        // =============================================
        console.log("📚 Creating Master Data...");

        // Genres
        const genreNames = [
            'Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Horror', 
            'Self-Help', 'Business', 'History', 'Biography', 'Fantasy'
        ];
        const genreMap = {}; // name -> id
        for (const name of genreNames) {
            const slug = name.toLowerCase().replace(/ /g, '-')
            const g = await Genre.create({ genre_name: name, genre_slug: slug }, { transaction: t });
            genreMap[name] = g.genre_id;
        }

        // Publishers
        const publisherNames = ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'NXB Tre', 'NXB Kim Dong'];
        const publisherMap = {};
        for (const name of publisherNames) {
            const slug = name.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
            const p = await Publisher.create({ publisher_name: name, publisher_slug: slug }, { transaction: t });
            publisherMap[name] = p.publisher_id;
        }

        // Authors
        const authorsData = [
            { name: 'J.K. Rowling', bio: 'British author, philanthropist, film producer, television producer, and screenwriter.' },
            { name: 'Stephen King', bio: 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.' },
            { name: 'Haruki Murakami', bio: 'Japanese writer. His books and stories have been bestsellers in Japan as well as internationally.' },
            { name: 'George Orwell', bio: 'English novelist, essayist, journalist and critic.' },
            { name: 'Agatha Christie', bio: 'English writer known for her sixty-six detective novels and fourteen short story collections.' },
            { name: 'Walter Isaacson', bio: 'American author, journalist, and professor.' },
            { name: 'Dale Carnegie', bio: 'American writer and lecturer, and the developer of courses in self-improvement.' },
            { name: 'Yuval Noah Harari', bio: 'Israeli public intellectual, historian and a professor in the Department of History at the Hebrew University of Jerusalem.' },
            { name: 'Tolkien', bio: 'English writer, poet, philologist, and academic.' },
            { name: 'Paulo Coelho', bio: 'Brazilian lyricist and novelist.' }
        ];
        const authorMap = {};
        for (const a of authorsData) {
            const slug = a.name.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
            const author = await Author.create({ author_name: a.name, author_bio: a.bio, author_slug: slug }, { transaction: t });
            authorMap[a.name] = author.author_id;
        }

        // Post Categories
        const categoryNames = ['News', 'Events', 'Promotions', 'Reviews'];
        const categoryMap = {};
        for (const name of categoryNames) {
            const slug = name.toLowerCase().replace(/ /g, '-');
            const c = await Category.create({ category_name: name, category_slug: slug }, { transaction: t });
            categoryMap[name] = c.category_id;
        }

        // =============================================
        // 4. BOOKS
        // =============================================
        console.log("📖 Creating Books...");

        const booksData = [
            {
                title: 'Harry Potter and the Sorcerer\'s Stone',
                price: 150000,
                stock: 100,
                year: 1997,
                desc: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive.',
                slug: 'harry-potter-1',
                isbn: '978-0747532743',
                author: 'J.K. Rowling',
                genre: 'Fantasy',
                publisher: 'Penguin Random House',
                rating: 4.8
            },
            {
                title: 'It',
                price: 200000,
                stock: 50,
                year: 1986,
                desc: 'The story follows the experiences of seven children as they are terrorized by an evil entity that exploits the fears of its victims.',
                slug: 'it-stephen-king',
                isbn: '978-1501142970',
                author: 'Stephen King',
                genre: 'Horror',
                publisher: 'Simon & Schuster',
                rating: 4.5
            },
            {
                title: 'Norwegian Wood',
                price: 120000,
                stock: 80,
                year: 1987,
                desc: 'A magnificent blending of the music, the mood, and the ethos that were the sixties with a young man\'s hopeless and heroic first love.',
                slug: 'norwegian-wood',
                isbn: '978-0375704024',
                author: 'Haruki Murakami',
                genre: 'Romance',
                publisher: 'HarperCollins',
                rating: 4.3
            },
            {
                title: '1984',
                price: 110000,
                stock: 120,
                year: 1949,
                desc: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
                slug: '1984-george-orwell',
                isbn: '978-0451524935',
                author: 'George Orwell',
                genre: 'Science Fiction',
                publisher: 'Penguin Random House',
                rating: 4.7
            },
            {
                title: 'Murder on the Orient Express',
                price: 130000,
                stock: 60,
                year: 1934,
                desc: 'Just after midnight, the famous Orient Express is stopped in its tracks by a snowdrift. By morning, the millionaire Samuel Edward Ratchett lies dead.',
                slug: 'murder-on-the-orient-express',
                isbn: '978-0062073501',
                author: 'Agatha Christie',
                genre: 'Mystery',
                publisher: 'HarperCollins',
                rating: 4.6
            },
            {
                title: 'Steve Jobs',
                price: 250000,
                stock: 30,
                year: 2011,
                desc: 'Based on more than forty interviews with Jobs conducted over two years, as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues.',
                slug: 'steve-jobs',
                isbn: '978-1451648539',
                author: 'Walter Isaacson',
                genre: 'Biography',
                publisher: 'Simon & Schuster',
                rating: 4.8
            },
            {
                title: 'How to Win Friends and Influence People',
                price: 90000,
                stock: 200,
                year: 1936,
                desc: 'You can go after the job you want—and get it! You can take the job you have—and improve it! You can take any situation—and make it work for you!',
                slug: 'how-to-win-friends',
                isbn: '978-0671027032',
                author: 'Dale Carnegie',
                genre: 'Self-Help',
                publisher: 'Simon & Schuster',
                rating: 4.9
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                price: 180000,
                stock: 90,
                year: 2011,
                desc: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller.',
                slug: 'sapiens',
                isbn: '978-0062316097',
                author: 'Yuval Noah Harari',
                genre: 'History',
                publisher: 'HarperCollins',
                rating: 4.7
            },
            {
                title: 'The Hobbit',
                price: 140000,
                stock: 75,
                year: 1937,
                desc: 'A great modern classic and the prelude to The Lord of the Rings.',
                slug: 'the-hobbit',
                isbn: '978-0547928227',
                author: 'Tolkien',
                genre: 'Fantasy',
                publisher: 'HarperCollins',
                rating: 4.8
            },
            {
                title: 'The Alchemist',
                price: 100000,
                stock: 150,
                year: 1988,
                desc: 'Combining magic, mysticism, wisdom and wonder into an inspiring tale of self-discovery, The Alchemist has become a modern classic.',
                slug: 'the-alchemist',
                isbn: '978-0062315007',
                author: 'Paulo Coelho',
                genre: 'Fiction',
                publisher: 'HarperCollins',
                rating: 4.4
            }
        ];

        for (const b of booksData) {
            const newBook = await Book.create({
                book_title: b.title,
                price: b.price,
                stock_quantity: b.stock,
                publication_year: b.year,
                description: b.desc,
                book_slug: b.slug,
                total_sold: Math.floor(Math.random() * 50),
                average_rating: b.rating,
                isbn: b.isbn,
                author_id: authorMap[b.author],
                genre_id: genreMap[b.genre],
                publisher_id: publisherMap[b.publisher]
            }, { transaction: t });

            // Create Image
            await BookImage.create({
                book_image_url: 'https://placehold.co/400x600?text=' + encodeURIComponent(b.title),
                book_id: newBook.book_id
            }, { transaction: t });

            // Create some random reviews
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            await Review.create({
                user_id: randomUser.user_id,
                book_id: newBook.book_id,
                rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
                comment: 'Great book! Highly recommended.'
            }, { transaction: t });
        }

        // =============================================
        // 5. OTHER DATA (Vouchers, Posts)
        // =============================================
        console.log("🎫 Creating Vouchers & Posts...");

        await Voucher.create({
            code: 'WELCOME10',
            discount_type: 'percent',
            value: 10,
            min_order_value: 0,
            usage_limit: 1000,
            start_at: new Date(),
            end_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        }, { transaction: t });

        await Voucher.create({
            code: 'SALE50K',
            discount_type: 'fixed',
            value: 50000,
            min_order_value: 200000,
            usage_limit: 100,
            start_at: new Date(),
            end_at: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }, { transaction: t });

        // Posts
        const adminUser = createdUsers.find(u => u.role === 'admin');
        await Post.create({
            title: 'Grand Opening Sahafa Bookstore',
            post_slug: 'grand-opening',
            thumbnail_url: 'https://placehold.co/800x400?text=Grand+Opening',
            content: 'Welcome to Sahafa Bookstore. We are happy to serve you with the best books from around the world.',
            status: 'published',
            user_id: adminUser.user_id,
            category_id: categoryMap['News']
        }, { transaction: t });

        await Post.create({
            title: 'Top 10 Books of 2024',
            post_slug: 'top-10-books-2024',
            thumbnail_url: 'https://placehold.co/800x400?text=Top+10',
            content: 'Here are the top 10 books you must read in 2024...',
            status: 'published',
            user_id: adminUser.user_id,
            category_id: categoryMap['Reviews']
        }, { transaction: t });

        await t.commit();
        console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");

    } catch (error) {
        if (t) await t.rollback();
        console.error("❌ Seeding Failed (Rolled back):", error);
    }
};

seed();
