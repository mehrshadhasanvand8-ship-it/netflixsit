const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

const token = '8842470784:AAEgYN4qyK3cKBvtP2kRI_TzCEuqm0bpGFc';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// لینک اتصال مستقیم به دیتابیس ابری MongoDB Atlas شما
const MONGO_URI = 'mongodb+srv://mehrshadhasanvandd_db_user:YeJq8PEIWCyAfHhH@cluster0.u9pbye1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// تعریف مدل فیلم در دیتابیس
const movieSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: String,
    category: String,
    subType: String,
    genre: String,
    posterUrl: String,
    videoUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// دریافت فیلم‌ها از دیتابیس ابری برای نمایش در سایت
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// دریافت عکس و ثبت فیلم از طریق ربات تلگرام
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const caption = msg.caption || '';
    const photoArray = msg.photo;
    const fileId = photoArray[photoArray.length - 1].file_id;

    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        
        if (res.data && res.data.ok) {
            const filePath = res.data.result.file_path;
            const posterUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

            // فرمت کپشن: نام فیلم | ایرانی/خارجی | دوبله/زیرنویس | ژانر | لینک_ویدیو
            const parts = caption.split('|').map(p => p.trim());
            
            let title = "فیلم سینمایی";
            let category = "خارجی";
            let subType = "زیرنویس";
            let genre = "سینمایی";
            let videoUrl = "";

            if (parts.length >= 5) {
                title = parts[0];
                category = parts[1];
                subType = parts[2];
                genre = parts[3];
                videoUrl = parts[4];
            } else if (parts.length >= 2) {
                title = parts[0];
                videoUrl = parts[1];
            } else {
                videoUrl = caption.trim();
            }

            if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
                const newMovie = new Movie({
                    id: Date.now(),
                    title,
                    category,
                    subType,
                    genre,
                    posterUrl,
                    videoUrl
                });

                await newMovie.save(); // ذخیره امن در فضای ابری مانگو

                bot.sendMessage(chatId, `✅ فیلم "${title}" با موفقیت در دیتابیس ابری NETFLIX SIT ثبت شد!`);
            } else {
                bot.sendMessage(chatId, `⚠️ فرمت کپشن نامعتبر است!\n\nفرمت صحیح:\nنام فیلم | ایرانی/خارجی | دوبله/زیرنویس | ژانر | لینک_مستقیم`);
            }
        } else {
            bot.sendMessage(chatId, '❌ خطا در دریافت پوستر.');
        }
    } catch (error) {
        console.error('Error handling photo:', error.message);
        bot.sendMessage(chatId, '❌ خطا در پردازش اطلاعات.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
