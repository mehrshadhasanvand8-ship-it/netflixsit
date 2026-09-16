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

// دریافت عکس پوستر و لینک از طریق تلگرام با روش امن
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const caption = msg.caption || '';
    const photoArray = msg.photo;
    const fileId = photoArray[photoArray.length - 1].file_id;

    try {
        // گرفتن مسیر فایل از طریق API تلگرام به صورت مستقیم
        const res = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        
        if (res.data && res.data.ok) {
            const filePath = res.data.result.file_path;
            const posterUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

            // فرمت کپشن: نام فیلم | لینک_مستقیم_ویدیو
            const parts = caption.split('|');
            let title = "فیلم سینمایی";
            let videoUrl = "";

            if (parts.length >= 2) {
                title = parts[0].trim();
                videoUrl = parts[1].trim();
            } else {
                videoUrl = caption.trim();
            }

            if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
                movies.push({
                    id: Date.now(),
                    title: title,
                    posterUrl: posterUrl,
                    videoUrl: videoUrl
                });

                bot.sendMessage(chatId, `✅ فیلم "${title}" با موفقیت روی سایت قرار گرفت!`);
            } else {
                bot.sendMessage(chatId, `⚠️ کپشن نامعتبر است!\nلطفا زیر عکس بنویسید:\nنام فیلم | لینک_مستقیم_ویدیو`);
            }
        } else {
            bot.sendMessage(chatId, '❌ خطا در دریافت پوستر از تلگرام.');
        }
    } catch (error) {
        console.error('Error handling photo:', error.message);
        bot.sendMessage(chatId, '❌ خطا در پردازش اطلاعات.');
    }
});

app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
