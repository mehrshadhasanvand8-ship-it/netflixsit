const express = require('express');
const path = require('path');
const app = express();

// خواندن اطلاعات ارسالی (JSON)
app.use(express.json());

// آرشیو فیلم‌ها
let moviesList = [];

// فرستادن فایل index.html اصلی سایت به کاربر
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// دریافت فیلم جدید از روبات تلگرام (وب‌هوک)
app.post('/webhook', (req, res) => {
    const update = req.body;
    
    if (update.channel_post) {
        const video = update.channel_post.video || update.channel_post.document;
        const caption = update.channel_post.caption || "بدون عنوان";
        
        if (video) {
            moviesList.push({
                title: caption,
                fileId: video.file_id,
                date: new Date()
            });
            console.log("فیلم جدید ثبت شد: ", caption);
        }
    }
    
    res.sendStatus(200);
});

// ارسال لیست فیلم‌ها به صفحه سایت
app.get('/api/movies', (req, res) => {
    res.json(moviesList);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
