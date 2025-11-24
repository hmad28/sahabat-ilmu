// app/api/chat/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi untuk search di yufid.com menggunakan Google Custom Search API
async function searchYufidDirect(query) {
  try {
    // Method 1: Gunakan Google Custom Search JSON API (RECOMMENDED)
    const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
    const YUFID_CSE_ID = process.env.YUFID_CSE_ID;

    if (GOOGLE_CSE_API_KEY && YUFID_CSE_ID) {
      console.log("Using Google CSE API...");
      const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_API_KEY}&cx=${YUFID_CSE_ID}&q=${encodeURIComponent(
        query
      )}&num=10`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        console.log(`Found ${data.items.length} results from CSE API`);
        return data.items.map((item) => ({
          title: item.title,
          url: item.link,
          excerpt: item.snippet,
        }));
      }
    }

    // Method 2: Fallback ke Google Search dengan site:yufid.com
    console.log("Using Google search fallback...");
    const googleSearchUrl = `https://www.google.com/search?q=site:yufid.com+${encodeURIComponent(
      query
    )}&num=10&hl=id`;

    const response = await fetch(googleSearchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];

    // Parse Google search results - updated selectors for 2024
    $("div.g, div[data-sokoban-container], div.Gx5Zad").each((i, elem) => {
      if (results.length < 10) {
        const $elem = $(elem);

        // Try multiple selectors for title
        const title =
          $elem.find("h3").first().text().trim() ||
          $elem.find(".LC20lb").first().text().trim() ||
          $elem.find('[role="heading"]').first().text().trim();

        // Try multiple selectors for link
        const link =
          $elem.find("a").first().attr("href") ||
          $elem.find('a[href*="yufid.com"]').first().attr("href");

        // Try multiple selectors for snippet
        const snippet =
          $elem.find(".VwiC3b").first().text().trim() ||
          $elem.find(".lyLwlc").first().text().trim() ||
          $elem.find(".lEBKkf").first().text().trim() ||
          $elem.find('div[style*="-webkit-line-clamp"]').first().text().trim();

        if (
          title &&
          link &&
          link.includes("yufid.com") &&
          !link.includes("/search?") &&
          !link.includes("webcache")
        ) {
          // Clean URL - remove Google redirect
          let cleanUrl = link;
          if (link.includes("/url?q=")) {
            cleanUrl = link.split("/url?q=")[1].split("&")[0];
            cleanUrl = decodeURIComponent(cleanUrl);
          }

          results.push({
            title,
            url: cleanUrl,
            excerpt: snippet,
          });
        }
      }
    });

    // Alternative parsing if main method fails
    if (results.length === 0) {
      console.log("Trying alternative parsing method...");

      $("a").each((i, elem) => {
        if (results.length < 10) {
          const $elem = $(elem);
          const href = $elem.attr("href");

          if (
            href &&
            href.includes("yufid.com") &&
            !href.includes("result.html") &&
            !href.includes("/search?") &&
            !href.includes("webcache")
          ) {
            const title =
              $elem.find("h3").text().trim() ||
              $elem.text().trim().substring(0, 100);

            if (title.length > 10) {
              let cleanUrl = href;
              if (href.includes("/url?q=")) {
                cleanUrl = href.split("/url?q=")[1].split("&")[0];
                cleanUrl = decodeURIComponent(cleanUrl);
              }

              // Avoid duplicates
              if (!results.find((r) => r.url === cleanUrl)) {
                results.push({
                  title,
                  url: cleanUrl,
                  excerpt: $elem.parent().text().substring(0, 200),
                });
              }
            }
          }
        }
      });
    }

    console.log(`Found ${results.length} results from search`);
    return results;
  } catch (error) {
    console.error("Error searching:", error.message);
    return [];
  }
}

// Fungsi untuk scrape konten lengkap dari artikel yufid.com
async function scrapeYufidArticle(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Ambil judul
    const title =
      $("h1.entry-title").first().text().trim() ||
      $("h1.post-title").first().text().trim() ||
      $("h1").first().text().trim() ||
      "Untitled";

    // Ambil konten artikel - coba berbagai selector
    let content = "";
    const contentSelectors = [
      ".entry-content",
      ".post-content",
      "article .content",
      ".article-content",
      "main article",
      ".post-body",
      "article",
    ];

    for (const selector of contentSelectors) {
      const potentialContent = $(selector).text().trim();
      if (potentialContent.length > content.length) {
        content = potentialContent;
      }
    }

    // Clean up content
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .replace(/\t+/g, " ")
      .trim();

    // Hitung "skor kelengkapan" berdasarkan indikator
    const completenessScore = calculateCompleteness(content);

    console.log(
      `Scraped ${url}: ${content.length} chars, score: ${completenessScore}`
    );

    return {
      title,
      url,
      content: content.substring(0, 5000), // Limit untuk tidak overflow context
      completenessScore,
      contentLength: content.length,
    };
  } catch (error) {
    console.error("Error scraping article:", url, error.message);
    return null;
  }
}

// Fungsi untuk menghitung kelengkapan artikel
function calculateCompleteness(content) {
  let score = 0;
  const lowerContent = content.toLowerCase();

  // Indikator artikel lengkap
  if (
    lowerContent.includes("al-quran") ||
    lowerContent.includes("al quran") ||
    lowerContent.includes("qs.") ||
    lowerContent.includes("q.s.")
  )
    score += 3;
  if (lowerContent.includes("hadits") || lowerContent.includes("hadis"))
    score += 3;
  if (lowerContent.includes("hr.") || lowerContent.includes("riwayat"))
    score += 2;
  if (lowerContent.includes("bukhari")) score += 1;
  if (lowerContent.includes("muslim")) score += 1;
  if (lowerContent.includes("dalil")) score += 2;
  if (lowerContent.includes("ulama")) score += 1;
  if (lowerContent.includes("hukum")) score += 1;
  if (lowerContent.includes("syaikh") || lowerContent.includes("syekh"))
    score += 1;
  if (content.length > 1000) score += 2;
  if (content.length > 2500) score += 2;
  if (content.length > 4000) score += 1;

  return score;
}

// Fungsi untuk filter pertanyaan yang JELAS BUKAN tentang agama
function isCompletelyOffTopic(question) {
  const lowerQuestion = question.toLowerCase();

  // Hanya tolak pertanyaan yang JELAS tidak ada hubungannya dengan agama
  const offTopicPatterns = [
    /makanan.*enak/i,
    /restoran.*terbaik/i,
    /resep.*masak/i,
    /film.*bagus/i,
    /musik.*favorit/i,
    /sepak bola/i,
    /game.*seru/i,
    /laptop.*terbaik/i,
    /hp.*murah/i,
    /tempat wisata/i,
    /cuaca.*hari ini/i,
  ];

  // Check jika pertanyaan match dengan pattern yang jelas off-topic
  const isOffTopic = offTopicPatterns.some((pattern) =>
    pattern.test(lowerQuestion)
  );

  // Jika mengandung kata kunci agama, pasti bukan off-topic
  const religiousKeywords = [
    "islam",
    "allah",
    "nabi",
    "rasul",
    "quran",
    "hadis",
    "hadits",
    "sholat",
    "salat",
    "shalat",
    "puasa",
    "zakat",
    "haji",
    "umrah",
    "doa",
    "sunnah",
    "haram",
    "halal",
    "syariat",
    "fiqih",
    "ibadah",
    "tauhid",
    "iman",
    "muslim",
    "masjid",
    "ustadz",
    "ulama",
  ];

  const hasReligiousKeyword = religiousKeywords.some((keyword) =>
    lowerQuestion.includes(keyword)
  );

  // Jika ada kata kunci agama, pasti tidak off-topic
  if (hasReligiousKeyword) {
    return false;
  }

  return isOffTopic;
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    console.log("User question:", message);

    // Hanya filter pertanyaan yang JELAS bukan tentang agama
    if (isCompletelyOffTopic(message)) {
      return NextResponse.json({
        reply:
          "Maaf, saya adalah chatbot khusus untuk pertanyaan seputar agama Islam. Pertanyaan Anda sepertinya tidak berkaitan dengan topik agama.\n\nSaya dapat membantu menjawab pertanyaan tentang:\n• Ibadah (sholat, puasa, zakat, haji)\n• Fiqih dan hukum Islam\n• Al-Quran dan Hadits\n• Akhlak dan adab Islam\n• Tauhid dan iman\n• Kehidupan Islami sehari-hari\n\nSilakan ajukan pertanyaan seputar Islam. Apa yang ingin Anda tanyakan?",
        sources: [],
      });
    }

    // 1. Search di yufid.com dengan query user
    console.log("Searching yufid.com...");
    const searchResults = await searchYufidDirect(message);

    if (searchResults.length === 0) {
      return NextResponse.json({
        reply: `Maaf, saya tidak menemukan artikel di yufid.com untuk pertanyaan "${message}".\n\n💡 Tips:\n• Coba gunakan kata kunci yang lebih spesifik\n• Gunakan istilah yang umum dalam Islam\n• Contoh: "hukum shalat dhuha", "tata cara wudhu", "zakat fitrah"\n\nSilakan coba pertanyaan lain!`,
        sources: [],
      });
    }

    console.log(`Found ${searchResults.length} articles from yufid.com`);

    // 2. Scrape konten dari hasil pencarian (ambil 5 artikel pertama untuk efisiensi)
    console.log("Scraping articles...");
    const articlesToScrape = searchResults.slice(0, 5);
    const scrapingPromises = articlesToScrape.map((result) =>
      scrapeYufidArticle(result.url)
    );
    const scrapedArticles = await Promise.all(scrapingPromises);

    // Filter yang berhasil di-scrape dan punya konten cukup
    const validArticles = scrapedArticles.filter(
      (article) => article !== null && article.content.length > 100
    );

    if (validArticles.length === 0) {
      return NextResponse.json({
        reply: `Maaf, saya mengalami kesulitan mengakses konten artikel dari yufid.com saat ini.\n\nNamun, saya menemukan artikel-artikel berikut yang mungkin relevan:\n\n${searchResults
          .slice(0, 5)
          .map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}`)
          .join(
            "\n\n"
          )}\n\nSilakan kunjungi link di atas untuk membaca langsung, atau coba lagi dalam beberapa saat.`,
        sources: searchResults.slice(0, 5),
      });
    }

    // 3. Sort berdasarkan kelengkapan dan ambil 3 terbaik
    const top3Articles = validArticles
      .sort((a, b) => b.completenessScore - a.completenessScore)
      .slice(0, 3);

    console.log(
      `Selected top 3 articles based on completeness:`,
      top3Articles.map((a) => ({ title: a.title, score: a.completenessScore }))
    );

    // 4. Gabungkan konten untuk context
    const context = top3Articles
      .map(
        (article, i) => `
=== ARTIKEL ${i + 1} ===
Judul: ${article.title}
Sumber: ${article.url}

Isi Artikel:
${article.content}

===========================
`
      )
      .join("\n\n");

    // 5. Generate response dengan Gemini
    console.log("Generating response with Gemini AI...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Anda adalah asisten ahli agama Islam yang membantu menjawab pertanyaan berdasarkan artikel dari yufid.com.

ATURAN PENTING:
1. Baca dan pahami SEMUA artikel yang diberikan
2. Jawab pertanyaan user dengan ringkas dan jelas
3. WAJIB sertakan dalil Al-Quran jika disebutkan dalam artikel (tulis ayat dan suratnya)
4. WAJIB sertakan dalil Hadits dengan RIWAYAT LENGKAP jika ada (contoh: HR. Bukhari no. 123, HR. Muslim)
5. Gunakan bahasa Indonesia yang mudah dipahami
6. Jika artikel menyebutkan pendapat ulama, sebutkan nama ulamanya
7. Fokus pada informasi dari artikel - JANGAN menambah dari pengetahuan pribadi
8. Jika informasi kurang lengkap, katakan "Berdasarkan artikel dari yufid.com yang saya temukan..."

FORMAT JAWABAN YANG BAIK:
- Mulai dengan penjelasan langsung (2-3 paragraf)
- Cantumkan dalil Al-Quran jika ada
- Cantumkan dalil Hadits dengan riwayat lengkap jika ada
- Tutup dengan kesimpulan singkat

ARTIKEL DARI YUFID.COM:
${context}

PERTANYAAN USER:
"${message}"

Jawab dengan jelas, ringkas, dan berdasarkan artikel di atas!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let reply = response.text();

    // Tambahkan catatan jika jawaban mungkin tidak lengkap
    if (validArticles.length < 3 || validArticles[0].contentLength < 500) {
      reply += `\n\n📝 *Catatan: Jawaban ini berdasarkan ${validArticles.length} artikel yang berhasil diakses. Untuk informasi lebih lengkap, silakan kunjungi sumber di bawah.*`;
    }

    // 6. Return response dengan sources
    return NextResponse.json({
      reply: reply,
      sources: top3Articles.map((article) => ({
        title: article.title,
        url: article.url,
      })),
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        reply:
          "Maaf, terjadi kesalahan teknis saat memproses pertanyaan Anda.\n\n🔧 Saran:\n• Coba lagi dalam beberapa saat\n• Gunakan kata kunci yang lebih sederhana\n• Pastikan koneksi internet Anda stabil\n\nJika masalah berlanjut, silakan hubungi administrator.",
        sources: [],
      },
      { status: 500 }
    );
  }
}
