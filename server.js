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

const dataFilePath = path.join(__dirname, 'movies.json');

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

function saveMovies(movies) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(movies, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving movies file:', error);
    }
}

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

            // فرمت جدید کپشن: نام فیلم | ایرانی/خارجی | دوبله/زیرنویس | ژانر | لینک_ویدیو
            const parts = caption.split('|').map(p => p.trim());
            
            let title = "فیلم سینمایی";
            let category = "خارجی"; // ایرانی یا خارجی
            let subType = "زیرنویس"; // دوبله یا زیرنویس
            let genre = "اکشن"; // ژانر
            let videoUrl = "";

            if (parts.length >= 5) {
                title = parts[0];
                category = parts[1];
                subType = parts[2];
                genre = parts[3];
                videoUrl = parts[4];
            } else if (parts.length === 2) {
                // سازگاری با فرمت قبلی
                title = parts[0];
                videoUrl = parts[1];
            } else {
                videoUrl = caption.trim();
            }

            if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
                let movies = getMovies();
                
                movies.push({
                    id: Date.now(),
                    title: title,
                    category: category,
                    subType: subType,
                    genre: genre,
                    posterUrl: posterUrl,
                    videoUrl: videoUrl
                });

                saveMovies(movies);

                bot.sendMessage(chatId, `✅ فیلم "${title}" با مشخصات کامل ثبت شد!`);
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

app.get('/api/movies', (req, res) => {
    const movies = getMovies();
    res.json(movies);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
