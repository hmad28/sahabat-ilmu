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
      try {
        const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CSE_API_KEY}&cx=${YUFID_CSE_ID}&q=${encodeURIComponent(
          query
        )}&num=10`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          console.log(`Found ${data.items.length} results from CSE API`);
          return data.items.map((item) => ({
            title: item.title,
            url: item.link,
            excerpt: item.snippet,
          }));
        }
      } catch (cseError) {
        console.log(
          "CSE API failed, falling back to scraping:",
          cseError.message
        );
      }
    }

    // Method 2: Fallback ke Google Search dengan site:yufid.com
    console.log("Using Google search fallback...");
    const googleSearchUrl = `https://www.google.com/search?q=site:yufid.com+${encodeURIComponent(
      query
    )}&num=10&hl=id`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(googleSearchUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];

    // Parse Google search results
    $("div.g, div[data-sokoban-container], div.Gx5Zad").each((i, elem) => {
      if (results.length < 10) {
        const $elem = $(elem);

        const title =
          $elem.find("h3").first().text().trim() ||
          $elem.find(".LC20lb").first().text().trim() ||
          $elem.find('[role="heading"]').first().text().trim();

        const link =
          $elem.find("a").first().attr("href") ||
          $elem.find('a[href*="yufid.com"]').first().attr("href");

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

    // Alternative parsing
    if (results.length === 0) {
      console.log("Trying alternative parsing...");
      $("a").each((i, elem) => {
        if (results.length < 10) {
          const $elem = $(elem);
          const href = $elem.attr("href");

          if (
            href &&
            href.includes("yufid.com") &&
            !href.includes("result.html") &&
            !href.includes("/search?")
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

// Fungsi untuk scrape konten dari artikel
async function scrapeYufidArticle(url) {
  try {
    console.log(`Scraping: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $("h1.entry-title").first().text().trim() ||
      $("h1.post-title").first().text().trim() ||
      $("h1").first().text().trim() ||
      "Untitled";

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

    content = content.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

    const completenessScore = calculateCompleteness(content);

    console.log(
      `Scraped: ${title.substring(0, 50)}... (${
        content.length
      } chars, score: ${completenessScore})`
    );

    return {
      title,
      url,
      content: content.substring(0, 5000),
      completenessScore,
      contentLength: content.length,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

function calculateCompleteness(content) {
  let score = 0;
  const lowerContent = content.toLowerCase();

  if (
    lowerContent.includes("al-quran") ||
    lowerContent.includes("al quran") ||
    lowerContent.includes("qs.")
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
  if (content.length > 1000) score += 2;
  if (content.length > 2500) score += 2;

  return score;
}

function isCompletelyOffTopic(question) {
  const lowerQuestion = question.toLowerCase();

  const offTopicPatterns = [
    /makanan.*enak/i,
    /restoran.*terbaik/i,
    /resep.*masak/i,
    /film.*bagus/i,
    /musik/i,
    /sepak bola/i,
    /game/i,
    /laptop/i,
    /hp.*murah/i,
    /tempat wisata/i,
    /cuaca/i,
  ];

  const isOffTopic = offTopicPatterns.some((pattern) =>
    pattern.test(lowerQuestion)
  );

  const religiousKeywords = [
    "islam",
    "allah",
    "nabi",
    "rasul",
    "quran",
    "hadis",
    "sholat",
    "salat",
    "puasa",
    "zakat",
    "haji",
    "doa",
    "sunnah",
    "haram",
    "halal",
    "ibadah",
    "muslim",
    "masjid",
  ];

  const hasReligiousKeyword = religiousKeywords.some((keyword) =>
    lowerQuestion.includes(keyword)
  );

  if (hasReligiousKeyword) {
    return false;
  }

  return isOffTopic;
}

export async function POST(request) {
  try {
    // Validate Gemini API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        {
          reply:
            "⚠️ Konfigurasi API belum lengkap. Silakan hubungi administrator untuk mengatur GEMINI_API_KEY.",
          sources: [],
        },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        {
          reply: "Silakan masukkan pertanyaan Anda.",
          sources: [],
        },
        { status: 400 }
      );
    }

    console.log("User question:", message);

    // Filter off-topic
    if (isCompletelyOffTopic(message)) {
      return NextResponse.json({
        reply:
          "Maaf, saya khusus menjawab pertanyaan agama Islam. Silakan tanyakan seputar ibadah, fiqih, Al-Quran, Hadits, atau topik Islam lainnya.",
        sources: [],
      });
    }

    // Search
    console.log("Searching yufid.com...");
    const searchResults = await searchYufidDirect(message);

    if (searchResults.length === 0) {
      return NextResponse.json({
        reply: `Maaf, tidak menemukan artikel untuk "${message}".\n\nCoba gunakan kata kunci berbeda atau lebih spesifik.`,
        sources: [],
      });
    }

    console.log(`Found ${searchResults.length} articles`);

    // Scrape articles
    console.log("Scraping articles...");
    const articlesToScrape = searchResults.slice(0, 5);

    const scrapedArticles = await Promise.allSettled(
      articlesToScrape.map((result) => scrapeYufidArticle(result.url))
    );

    const validArticles = scrapedArticles
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value)
      .filter((article) => article.content.length > 100);

    if (validArticles.length === 0) {
      return NextResponse.json({
        reply: `Maaf, kesulitan mengakses artikel saat ini.\n\nArtikel yang mungkin relevan:\n\n${searchResults
          .slice(0, 3)
          .map((r, i) => `${i + 1}. ${r.title}\n   ${r.url}`)
          .join("\n\n")}`,
        sources: searchResults.slice(0, 3),
      });
    }

    // Select top 3
    const top3Articles = validArticles
      .sort((a, b) => b.completenessScore - a.completenessScore)
      .slice(0, 3);

    console.log(`Using top ${top3Articles.length} articles`);

    // Build context
    const context = top3Articles
      .map(
        (article, i) => `
=== ARTIKEL ${i + 1} ===
Judul: ${article.title}

Isi:
${article.content}
===========================
`
      )
      .join("\n\n");

    // Generate with Gemini
    console.log("Generating response...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Anda adalah asisten agama Islam yang menjawab pertanyaan berdasarkan artikel dari yufid.com.

ATURAN FORMAT JAWABAN:
1. Tulis jawaban SINGKAT dan PADAT (maksimal 3 paragraf pendek)
2. Pisahkan bagian dalil dengan jelas menggunakan format khusus
3. Gunakan bahasa yang mudah dipahami
4. Fokus pada INTI jawaban saja, tidak bertele-tele

FORMAT WAJIB:
[Jawaban singkat 2-3 paragraf, langsung ke inti permasalahan]

📖 DALIL AL-QURAN:
[Jika ada dalil Al-Quran, tulis: "QS. [Nama Surat]:[Ayat] - '[Terjemahan singkat]'"]
[Jika tidak ada, tulis: "Tidak disebutkan dalam artikel"]

📚 DALIL HADITS:
[Jika ada hadits, tulis: "[Isi hadits singkat]" (HR. [Perawi] no. [nomor jika ada])"]
[Jika tidak ada, tulis: "Tidak disebutkan dalam artikel"]

✅ KESIMPULAN:
[1 kalimat ringkas tentang hukum/jawaban akhir]

ARTIKEL DARI YUFID.COM:
${context}

PERTANYAAN USER:
"${message}"

Jawab dengan format di atas, SINGKAT dan JELAS!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({
      reply: reply,
      sources: top3Articles.map((a) => ({
        title: a.title,
        url: a.url,
      })),
    });
  } catch (error) {
    console.error("API Error:", error);

    // More specific error messages
    let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi.";

    if (error.message.includes("API key")) {
      errorMessage = "⚠️ Error: API key tidak valid. Hubungi administrator.";
    } else if (
      error.message.includes("timeout") ||
      error.message.includes("aborted")
    ) {
      errorMessage =
        "⏱️ Timeout: Koneksi terlalu lama. Coba lagi dengan kata kunci lebih sederhana.";
    } else if (error.message.includes("fetch")) {
      errorMessage =
        "🌐 Error koneksi. Pastikan internet stabil dan coba lagi.";
    }

    return NextResponse.json(
      {
        reply: errorMessage,
        sources: [],
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
