<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>آرشیو فیلم و سریال</title>
    <style>
        body {
            font-family: Tahoma, sans-serif;
            background-color: #141414;
            color: #fff;
            margin: 0;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #e50914;
            margin-bottom: 30px;
        }
        .movie-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .movie-card {
            background-color: #1f1f1f;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            transition: transform 0.2s;
        }
        .movie-card:hover {
            transform: scale(1.03);
        }
        .movie-poster {
            width: 100%;
            height: 300px;
            object-fit: cover;
            background-color: #2c2c2c;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 14px;
        }
        .movie-info {
            padding: 12px;
            text-align: center;
        }
        .movie-title {
            font-size: 15px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* استایل مدال (پنجره پخش فیلم به صورت افقی/بزرگ) */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .modal-content {
            width: 90%;
            max-width: 900px;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.7);
        }
        .modal-content video {
            width: 100%;
            max-height: 80vh;
            display: block;
        }
        .close-btn {
            color: #fff;
            font-size: 35px;
            font-weight: bold;
            position: absolute;
            top: 20px;
            left: 30px;
            cursor: pointer;
        }
        .close-btn:hover {
            color: #e50914;
        }
        .no-movie {
            text-align: center;
            color: #888;
            grid-column: 1 / -1;
            font-size: 18px;
            margin-top: 50px;
        }
    </style>
</head>
<body>

    <h1>🎬 آرشیو فیلم و سریال کانال</h1>
    
    <div class="movie-container" id="movieList">
        <!-- فیلم‌ها به صورت کارت‌های پوستر اینجا قرار می‌گیرند -->
    </div>

    <!-- پنجره پاپ‌آپ (مدال) برای پخش ویدیو -->
    <div id="videoModal" class="modal">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <div class="modal-content">
            <video id="modalVideo" controls controlsList="nodownload">
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
        </div>
    </div>

    <script>
        async function fetchMovies() {
            try {
                const response = await fetch('/api/movies');
                const movies = await response.json();
                const container = document.getElementById('movieList');
                
                container.innerHTML = '';

                if (movies.length === 0) {
                    container.innerHTML = '<div class="no-movie">هنوز فیلمی به آرشیو اضافه نشده است. لینک فیلم را به ربات بفرستید!</div>';
                    return;
                }

                movies.reverse().forEach(movie => {
                    const card = document.createElement('div');
                    card.className = 'movie-card';
                    
                    // می‌توانید برای پوستر از یک عکس پیش‌فرض یا عکس دلخواه استفاده کنید
                    // ساختار کارت شامل پوستر و نام فیلم است
                    card.innerHTML = `
                        <div class="movie-poster">
                            <span>▶ پخش آنلاین</span>
                        </div>
                        <div class="movie-info">
                            <div class="movie-title" title="${movie.title}">${movie.title}</div>
                        </div>
                    `;
                    
                    // با کلیک روی کارت، فیلم در پنجره بزرگ (افقی) پخش می‌شود
                    card.onclick = () => openModal(movie.videoUrl);
                    
                    container.appendChild(card);
                });
            } catch (error) {
                console.error('خطا در دریافت لیست فیلم‌ها:', error);
            }
        }

        function openModal(url) {
            const modal = document.getElementById('videoModal');
            const video = document.getElementById('modalVideo');
            modal.style.display = 'flex';
            video.src = url;
            video.play();
        }

        function closeModal() {
            const modal = document.getElementById('videoModal');
            const video = document.getElementById('modalVideo');
            modal.style.display = 'none';
            video.pause();
            video.src = '';
        }

        // بارگذاری اولیه و آپدیت خودکار هر 5 ثانیه
        fetchMovies();
        setInterval(fetchMovies, 5000);
    </script>

</body>
</html>
