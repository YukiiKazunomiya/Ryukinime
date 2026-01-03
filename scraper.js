const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'https://otakudesu.cloud'; 

class Otakudesu {
    // FUNGSI HOME
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
    
    // FUNGSI SEARCH
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

    // FUNGSI DETAIL (YANG TADINYA ERROR UNDEFINED)
    async detail(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const episodes = [];
            
            // Ambil daftar episode
            $('.episodelist ul li').each((i, el) => {
                episodes.push({
                    title: $(el).find('a').text().trim(),
                    url: $(el).find('a').attr('href')
                });
            });

            // Ambil Info Detail Lengkap
            const info = {};
            $('.infozin .infozingle').each((i, el) => {
                const text = $(el).text();
                const key = text.split(':')[0].trim().toLowerCase();
                const val = text.split(':')[1]?.trim();
                if(key) info[key] = val;
            });

            return {
                title: $('.infozin .infozingle p:contains("Judul")').text().split(':')[1]?.trim() || $('.jdlrx h1').text().trim(),
                thumb: $('.fotoanime img').attr('src'),
                sinopsis: $('.sinopc').text().trim(),
                genre: info['genre'] || 'Anime',
                studio: info['studio'] || '-',
                score: info['skor'] || '-',
                episodes: episodes
            };
        } catch (e) { return {}; }
    }

    // FUNGSI EPISODE (STREAMING & DOWNLOAD)
    async episode(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            
            // Ambil Link Download
            const downloads = [];
            $('.download ul li').each((i, el) => {
                const res = $(el).find('strong').text().trim(); // Misal: 360p
                const links = [];
                $(el).find('a').each((j, link) => {
                    links.push({
                        server: $(link).text().trim(),
                        url: $(link).attr('href')
                    });
                });
                downloads.push({ resolution: res, links: links });
            });

            // Ambil Link Streaming (Iframe)
            const streamUrl = $('.responsive-embed-stream iframe').attr('src') || $('#pembed iframe').attr('src');

            return {
                title: $('.venser h1').text().trim(),
                videoUrl: streamUrl,
                downloads: downloads
            };
        } catch (e) { return {}; }
    }
}
module.exports = new Otakudesu();
