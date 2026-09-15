const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let moviesList = [];

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
    console.log(`Server is running on port ${PORT}`);
});
