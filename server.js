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

bot.on('video', async (msg) => {
    const chatId = msg.chat.id;
    const fileId = msg.video.file_id;
    const fileName = msg.video.file_name || 'فیلم سینمایی';
    const caption = msg.caption || fileName;

    try {
        // گرفتن آدرس فایل مستقیم از طریق API رسمی تلگرام با axios
        const res = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        
        if (res.data && res.data.ok) {
            const filePath = res.data.result.file_path;
            const directDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
            
            movies.push({
                id: Date.now(),
                title: caption,
                videoUrl: directDownloadUrl
            });

            bot.sendMessage(chatId, '✅ فیلم با موفقیت به آرشیو سایت اضافه شد!');
        } else {
            bot.sendMessage(chatId, '❌ خطا در دریافت اطلاعات فایل از تلگرام.');
        }
    } catch (error) {
        console.error('Error fetching file path:', error.message);
        bot.sendMessage(chatId, '❌ خطا در ثبت فیلم. لطفا دوباره تلاش کنید.');
    }
});

app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
