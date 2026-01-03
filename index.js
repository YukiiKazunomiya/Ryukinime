const express = require('express');
const app = express();
const scraper = require('./scraper');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Mesin Hidup!'));
app.get('/api/home', async (req, res) => res.json(await scraper.home()));
app.get('/api/search', async (req, res) => res.json(await scraper.search(req.query.q)));
app.get('/api/detail', async (req, res) => res.json(await scraper.detail(req.query.url)));
app.get('/api/episode', async (req, res) => res.json(await scraper.episode(req.query.url)));

module.exports = app;
