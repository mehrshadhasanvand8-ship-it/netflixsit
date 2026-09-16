const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const token = '8842470784:AAEgYN4qyK3cKBvtP2kRI_TzCEuqm0bpGFc';
const bot = new TelegramBot(token, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// مسیر فایل برای ذخیره دائمی فیلم‌ها
const dataFilePath = path.join(__dirname, 'movies.json');

// تابع خواندن فیلم‌ها از فایل
function getMovies() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading movies file:', error);
    }
    return [];
}

// تابع ذخیره فیلم‌ها در فایل
function saveMovies(movies) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(movies, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving movies file:', error);
    }
}

// دریافت عکس پوستر و لینک از طریق تلگرام
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
                let movies = getMovies();
                
                movies.push({
                    id: Date.now(),
                    title: title,
                    posterUrl: posterUrl,
                    videoUrl: videoUrl
                });

                saveMovies(movies); // ذخیره در فایل دائمی

                bot.sendMessage(chatId, `✅ فیلم "${title}" با موفقیت ذخیره شد و هرگز پاک نخواهد شد!`);
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

// API برای فرستادن اطلاعات فیلم‌ها به سایت
app.get('/api/movies', (req, res) => {
    const movies = getMovies();
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
