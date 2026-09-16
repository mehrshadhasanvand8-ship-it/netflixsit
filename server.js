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

// آرشیو برای ذخیره اطلاعات ویدیوها در حافظه
let movies = [];

// دریافت ویدیو از تلگرام به صورت امن و بدون محدودیت حجم
bot.on('video', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.video.file_id;
    const fileName = msg.video.file_name || 'فیلم سینمایی';
    const caption = msg.caption || fileName;

    try {
        // دریافت اطلاعات فایل شامل file_path از تلگرام بدون دانلود خود فایل
        const file = await bot.getFile(fileId);
        const filePath = file.file_path;
        
        // ساخت لینک مستقیم و پایدار دانلود از سرور تلگرام
        const directDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
        
        movies.push({
            id: Date.now(),
            title: caption,
            videoUrl: directDownloadUrl
        });

        bot.sendMessage(chatId, '✅ فیلم با موفقیت به آرشیو سایت اضافه شد!');
    } catch (error) {
        console.error('Error processing video:', error);
        bot.sendMessage(chatId, '❌ خطا در ثبت فیلم. لطفا دوباره تلاش کنید.');
    }
});

// ارسال لیست فیلم‌ها به فرانت‌اند سایت
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
