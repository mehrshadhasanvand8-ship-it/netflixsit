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

// تابع خواندن ایمن اطلاعات
function getMovies() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf8');
            if (data.trim() === '') return [];
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading file:', error);
    }
    return [];
}

// تابع ذخیره‌سازی ایمن اطلاعات
function saveMovies(movies) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(movies, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

app.get('/api/movies', (req, res) => {
    const movies = getMovies();
    res.json(movies);
});

bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const caption = (msg.caption || '').replace(/\n/g, ' ').trim();
    const photoArray = msg.photo;
    const fileId = photoArray[photoArray.length - 1].file_id;

    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
        
        if (res.data && res.data.ok) {
            const filePath = res.data.result.file_path;
            const posterUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

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
            } else {
                if (parts.length >= 2) {
                    title = parts[0];
                    videoUrl = parts[parts.length - 1];
                } else {
                    videoUrl = caption;
                }
            }

            if (videoUrl && (videoUrl.startsWith('http://') || videoUrl.startsWith('https://'))) {
                let movies = getMovies();
                
                movies.unshift({
                    id: Date.now(),
                    title,
                    category,
                    subType,
                    genre,
                    posterUrl,
                    videoUrl,
                    createdAt: new Date()
                });

                saveMovies(movies);

                bot.sendMessage(chatId, `✅ فیلم "${title}" با موفقیت در NETFLIX SIT ثبت شد!`);
            } else {
                bot.sendMessage(chatId, `⚠️ لینک ویدیو در کپشن پیدا نشد!`);
            }
        } else {
            bot.sendMessage(chatId, '❌ خطا در دریافت پوستر.');
        }
    } catch (error) {
        console.error('Error handling photo:', error.message);
        bot.sendMessage(chatId, `❌ خطا در پردازش اطلاعات.`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
