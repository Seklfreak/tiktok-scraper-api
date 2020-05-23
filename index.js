const express = require("express");
const TikTokScraper = require('tiktok-scraper');
const app = express();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/users/:username", async (req, res) => {
    try {
        const posts = await TikTokScraper.user(req.params.username, { number: 10 });
        res.json(posts);
    } catch (error) {
        res.send(error);
    }
});
