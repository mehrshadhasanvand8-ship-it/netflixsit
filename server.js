const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const token = '8842470784:AAEgYN4qyK3cKBvtP2kRI_TzCEuqm0bpGFc';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// آرشیو فیلم‌ها
let movies = [];

// ۱. روش اضافه کردن از طریق ربات (با ارسال متن حاوی نام و لینک مستقیم ویدیو)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // اگر کاربر دستور /start یا پیام معمولی فرستاد که لینک فیلم بود
    if (text && !text.startsWith('/')) {
        // فرض می‌کنیم پیام شامل نام فیلم و لینک مستقیم است (یا کاربر لینک رو می‌فرسته)
        // مثلا فرمت: نام فیلم | لینک_مستقیم
        const parts = text.split('|');
        
        let title = "فیلم سینمایی جدید";
        let videoUrl = "";

        if (parts.length >= 2) {
            title = parts[0].trim();
            videoUrl = parts[1].trim();
        } else {
            videoUrl = text.trim();
        }

        // چک می‌کنیم که آیا متن ارسال شده یک لینک معتبر است یا خیر
        if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
            movies.push({
                id: Date.now(),
                title: title,
                videoUrl: videoUrl
            });

            bot.sendMessage(chatId, `✅ فیلم "${title}" با موفقیت به آرشیو سایت اضافه شد و الان قابل تماشا است!`);
        } else {
            bot.sendMessage(chatId, `🤖 راهنما:\nبرای افزودن فیلم به سایت، نام فیلم و لینک مستقیم ویدیو را با علامت | از هم جدا کرده و بفرستید.\n\nمثال:\nنام فیلم | https://example.com/video.mp4`);
        }
    }
});

// ۲. API برای دریافت لیست فیلم‌ها در سایت
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

// ۳. API برای افزودن فیلم مستقیماً از داخل سایت (اختیاری و فوق‌العاده کاربردی)
app.post('/api/movies', (req, res) => {
    const { title, videoUrl } = req.body;
    if (videoUrl) {
        movies.push({
            id: Date.now(),
            title: title || 'فیلم بدون نام',
            videoUrl: videoUrl
        });
        res.json({ success: true, message: 'فیلم با موفقیت اضافه شد!' });
    } else {
        res.status(400).json({ success: false, message: 'لینک ویدیو الزامی است.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
