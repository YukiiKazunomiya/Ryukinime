const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'https://otakudesu.best';

class Otakudesu {
    async home() {
        try {
            const { data } = await axios.get(baseUrl);
            const $ = cheerio.load(data);
            const result = [];
            $('.venz ul li').each((i, el) => {
                result.push({
                    title: $(el).find('h2').text().trim(),
                    thumb: $(el).find('img').attr('src'),
                    episode: $(el).find('.epz').text().trim(),
                    url: $(el).find('a').attr('href')
                });
            });
            return result;
        } catch (e) { return []; }
    }
    
    async search(query) {
        try {
            const { data } = await axios.get(`${baseUrl}/?s=${query}&post_type=anime`);
            const $ = cheerio.load(data);
            const result = [];
            $('.chivsrc li').each((i, el) => {
                result.push({
                    title: $(el).find('h2 a').text().trim(),
                    thumb: $(el).find('img').attr('src'),
                    url: $(el).find('h2 a').attr('href')
                });
            });
            return result;
        } catch (e) { return []; }
    }

    async detail(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const episodes = [];
            $('.episodelist ul li').each((i, el) => {
                episodes.push({
                    title: $(el).find('a').text().trim(),
                    url: $(el).find('a').attr('href')
                });
            });
            return {
                title: $('.infozin .infozingle p:contains("Judul")').text().split(':')[1]?.trim(),
                thumb: $('.fotoanime img').attr('src'),
                sinopsis: $('.sinopc').text().trim(),
                episodes: episodes
            };
        } catch (e) { return {}; }
    }

    async episode(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            return {
                title: $('.venser h1').text().trim(),
                videoUrl: $('#pembed iframe').attr('src')
            };
        } catch (e) { return {}; }
    }
}
module.exports = new Otakudesu();
