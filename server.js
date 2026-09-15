const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let moviesList = [];

// فرستادن مستقیم صفحه اصلی سایت
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>سایت فیلم و سریال من</title>
            <style>
                body { font-family: Tahoma, sans-serif; background-color: #141414; color: #fff; margin: 0; padding: 20px; }
                h1 { text-align: center; color: #e50914; }
                .movie-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
                .movie-card { background-color: #1f1f1f; border-radius: 8px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); text-align: center; }
                .movie-card h3 { font-size: 16px; margin-bottom: 10px; }
                .loading { text-align: center; font-size: 18px; color: #aaa; margin-top: 50px; }
            </style>
        </head>
        <body>
            <h1>🎬 فیلم‌های جدید کانال</h1>
            <div id="loading" class="loading">در حال بارگذاری لیست فیلم‌ها...</div>
            <div class="movie-container" id="movieList"></div>
            <script>
                async function fetchMovies() {
                    try {
                        const response = await fetch('/api/movies');
                        const movies = await response.json();
                        const container = document.getElementById('movieList');
                        const loading = document.getElementById('loading');
                        loading.style.display = 'none';
                        container.innerHTML = '';
                        if (movies.length === 0) {
                            container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">هنوز فیلمی ارسال نشده است.</p>';
                            return;
                        }
                        movies.forEach(movie => {
                            const card = document.createElement('div');
                            card.className = 'movie-card';
                            card.innerHTML = \`<h3>\${movie.title}</h3><p style="font-size: 12px; color: #888;">ثبت شده در سیستم</p>\`;
                            container.appendChild(card);
                        });
                    } catch (error) {
                        document.getElementById('loading').innerText = 'خطا در ارتباط با سرور!';
                    }
                }
                fetchMovies();
            </script>
        </body>
        </html>
    `);
});

app.post('/webhook', (req, res) => {
    const update = req.body;
    if (update.channel_post && update.channel_post.video) {
        const video = update.channel_post.video;
        const caption = update.channel_post.caption || "فیلم بدون عنوان";
        moviesList.push({
            title: caption,
            fileId: video.file_id,
            date: new Date()
        });
        console.log("فیلم جدید ثبت شد: ", caption);
    }
    res.sendStatus(200);
});

app.get('/api/movies', (req, res) => {
    res.json(moviesList);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
