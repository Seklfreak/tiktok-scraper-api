const express = require("express");
const TikTokScraper = require('tiktok-scraper');
const RSS = require('rss');

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server running on port', port);
});

app.get("/users/:username", async (req, res) => {
    try {
        const posts = await TikTokScraper.user(req.params.username, {number: 10});
        res.json(posts);
    } catch (error) {
        res.send(error);
    }
});

app.get("/users/:username/feed", async (req, res) => {
    let posts;
    try {
        posts = await TikTokScraper.user(req.params.username, {number: 10});
    } catch (error) {
        res.send(error);
        return;
    }

    let feed = new RSS({
        title: 'TikTok feed for @' + req.params.username,
        generator: 'https://github.com/Seklfreak/tiktok-scraper-api',
        feed_url: req.protocol + '://' + req.hostname + req.url,
        site_url: 'https://www.tiktok.com/@' + req.params.username
    });

    posts.collector.forEach((item) => {
        feed.item({
            title: 'New TikTok post by @' + item.authorMeta.name,
            description: item.text,
            url: 'https://www.tiktok.com/@' + item.authorMeta.name + '/video/' + item.id,
            guid: item.authorMeta.name + '_' + item.id,
            author: '@' + item.authorMeta.name,
            enclosure: {
                'url': item.imageUrl,
                'type': 'image/jpeg'
            }
        })
    });

    res.header('Content-Type', 'application/xml');
    res.send(feed.xml({indent: true}));
});
