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

let movies = [];

// تابع مشترک برای پردازش و ثبت فایل دریافتی از تلگرام
async function handleVideoFile(chatId, fileId, fileName, captionText) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        
        if (res.data && res.data.ok) {
            const filePath = res.data.result.file_path;
            const directDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
            
            movies.push({
                id: Date.now(),
                title: captionText || fileName,
                videoUrl: directDownloadUrl
            });

            bot.sendMessage(chatId, '✅ فیلم با موفقیت به آرشیو سایت اضافه شد!');
        } else {
            bot.sendMessage(chatId, '❌ خطا در دریافت لینک از تلگرام.');
        }
    } catch (error) {
        console.error('Error fetching file path details:', error.response?.data || error.message);
        bot.sendMessage(chatId, '❌ خطا در ثبت فیلم. لطفا دوباره تلاش کنید.');
    }
}

// گوش دادن به ویدیوهای معمولی
bot.on('video', (msg) => {
    handleVideoFile(msg.chat.id, msg.video.file_id, msg.video.file_name || 'فیلم سینمایی', msg.caption);
});

// گوش دادن به ویدیوهایی که به صورت فایل/داکیومنت ارسال میشن (حجم اصلی)
bot.on('document', (msg) => {
    const mimeType = msg.document.mime_type || '';
    if (mimeType.startsWith('video/')) {
        handleVideoFile(msg.chat.id, msg.document.file_id, msg.document.file_name || 'فیلم سینمایی', msg.caption);
    }
});

app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
