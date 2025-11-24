// pages/api/search-yufid.js
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { query } = req.query;

  try {
    // Search di yufid.com
    const searchRes = await fetch(
      `https://www.yufid.com/?s=${encodeURIComponent(query)}`
    );
    const html = await searchRes.text();
    const $ = cheerio.load(html);

    // Extract artikel
    const articles = [];
    $("article a")
      .slice(0, 3)
      .each((i, el) => {
        articles.push($(el).attr("href"));
      });

    // Ambil konten dari setiap artikel
    const contents = await Promise.all(
      articles.map(async (url) => {
        const res = await fetch(url);
        const html = await res.text();
        const $page = cheerio.load(html);
        return {
          url,
          content: $page("article").text().trim().substring(0, 3000),
        };
      })
    );

    res.status(200).json({ contents });
  } catch (error) {
    res.status(500).json({ error: "Error scraping Yufid" });
  }
}
