const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const path = require('path');

const token = '8842470784:AAEgYN4qyK3cKBvtP2kRI_TzCEuqm0bpGFc';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// آرشیو ساده برای ذخیره فیلم‌ها در حافظه سرور
let movies = [];

// دریافت ویدیو از تلگرام
bot.on('video', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.video.file_id;
    const fileName = msg.video.file_name || 'فیلم بدون نام';
    const caption = msg.caption || fileName;

    try {
        // گرفتن لینک دانلود مستقیم از تلگرام
        const fileLink = await bot.getFileLink(fileId);
        
        movies.push({
            id: Date.now(),
            title: caption,
            videoUrl: fileLink
        });

        bot.sendMessage(chatId, '✅ فیلم با موفقیت به آرشیو سایت اضافه شد و الان قابل پخش است!');
    } catch (error) {
        console.error('Error getting file link:', error);
        bot.sendMessage(chatId, '❌ خطا در ثبت فیلم. دوباره تلاش کنید.');
    }
});

// ارسال لیست فیلم‌ها به سایت
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
