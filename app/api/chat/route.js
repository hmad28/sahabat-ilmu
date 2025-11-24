// app/api/chat/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi untuk search langsung di yufid.com
async function searchYufidDirect(query) {
  try {
    // Search langsung di yufid.com seperti user search
    const searchUrl = `https://yufid.com/result.html?search=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];

    // Ambil hasil search dari yufid.com (sesuaikan selector dengan struktur HTML yufid)
    // Biasanya artikel ada di class seperti .post, .entry, atau .article
    $(".post, article, .entry").each((i, elem) => {
      if (i < 10) {
        // Ambil 10 hasil untuk difilter nanti
        const title = $(elem)
          .find("h2, h3, .entry-title, .post-title")
          .first()
          .text()
          .trim();
        const link = $(elem).find("a").first().attr("href");
        const excerpt = $(elem)
          .find(".entry-excerpt, .excerpt, p")
          .first()
          .text()
          .trim();

        if (title && link) {
          results.push({
            title,
            url: link.startsWith("http") ? link : `https://yufid.com${link}`,
            excerpt,
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error("Error searching yufid directly:", error);

    // Fallback: gunakan Google search jika direct search gagal
    try {
      const googleSearchUrl = `https://www.google.com/search?q=site:yufid.com+${encodeURIComponent(
        query
      )}&num=10`;

      const response = await fetch(googleSearchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      const results = [];
      $("div.g").each((i, elem) => {
        if (i < 10) {
          const title = $(elem).find("h3").text();
          const link = $(elem).find("a").attr("href");
          const snippet = $(elem).find(".VwiC3b, .st").text();

          if (title && link && link.includes("yufid.com")) {
            results.push({ title, url: link, excerpt: snippet });
          }
        }
      });

      return results;
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      return [];
    }
  }
}

// Fungsi untuk scrape konten lengkap dari artikel yufid.com
async function scrapeYufidArticle(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Ambil judul
    const title = $("h1.entry-title, h1.post-title, h1").first().text().trim();

    // Ambil konten artikel - coba berbagai selector
    let content = "";
    const contentSelectors = [
      ".entry-content",
      ".post-content",
      "article .content",
      ".article-content",
      "main article",
      ".post-body",
    ];

    for (const selector of contentSelectors) {
      const potentialContent = $(selector).text().trim();
      if (potentialContent.length > content.length) {
        content = potentialContent;
      }
    }

    // Clean up content
    content = content.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();

    // Hitung "skor kelengkapan" berdasarkan indikator
    const completenessScore = calculateCompleteness(content);

    return {
      title,
      url,
      content: content.substring(0, 4000), // Limit untuk tidak overflow context
      completenessScore,
      contentLength: content.length,
    };
  } catch (error) {
    console.error("Error scraping article:", url, error);
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
    lowerContent.includes("qs.")
  )
    score += 2;
  if (lowerContent.includes("hadits") || lowerContent.includes("hadis"))
    score += 2;
  if (lowerContent.includes("hr.") || lowerContent.includes("riwayat"))
    score += 2;
  if (lowerContent.includes("bukhari")) score += 1;
  if (lowerContent.includes("muslim")) score += 1;
  if (lowerContent.includes("dalil")) score += 1;
  if (lowerContent.includes("ulama")) score += 1;
  if (lowerContent.includes("hukum")) score += 1;
  if (content.length > 1000) score += 2; // Artikel panjang biasanya lebih lengkap
  if (content.length > 2000) score += 2;

  return score;
}

// Fungsi untuk filter pertanyaan non-agama
function isReligiousQuestion(question) {
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
    "shaum",
    "zakat",
    "haji",
    "umrah",
    "doa",
    "sunnah",
    "haram",
    "halal",
    "syariat",
    "fiqih",
    "fiqh",
    "ibadah",
    "tauhid",
    "iman",
    "wudhu",
    "tayammum",
    "masjid",
    "mushalla",
    "ustadz",
    "ulama",
    "sahih",
    "bukhari",
    "muslim",
    "tirmidzi",
    "dhuha",
    "dzuhur",
    "ashar",
    "maghrib",
    "isya",
    "tahajud",
    "witir",
    "jenazah",
    "nikah",
    "talak",
    "waris",
    "riba",
    "hijab",
    "jilbab",
  ];

  const lowerQuestion = question.toLowerCase();
  return religiousKeywords.some((keyword) => lowerQuestion.includes(keyword));
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    console.log("User question:", message);

    // Filter pertanyaan non-agama
    if (!isReligiousQuestion(message)) {
      return NextResponse.json({
        reply:
          "Maaf, saya adalah chatbot khusus untuk pertanyaan agama Islam. Saya hanya dapat membantu menjawab pertanyaan seputar:\n\n• Ibadah (sholat, puasa, zakat, haji)\n• Fiqih dan hukum Islam\n• Al-Quran dan Hadits\n• Akhlak dan adab\n• Tauhid dan iman\n\nSilakan ajukan pertanyaan tentang Islam dan saya akan mencari jawabannya dari yufid.com dengan dalil yang lengkap. Apa yang ingin Anda tanyakan?",
        sources: [],
      });
    }

    // 1. Search di yufid.com dengan query user
    console.log("Searching yufid.com...");
    const searchResults = await searchYufidDirect(message);

    if (searchResults.length === 0) {
      return NextResponse.json({
        reply: `Maaf, saya tidak menemukan artikel di yufid.com untuk pertanyaan "${message}".\n\nCoba gunakan kata kunci yang lebih umum atau kata kunci berbeda. Contoh:\n• "hukum shalat dhuha"\n• "shalat berjamaah"\n• "shalat sunnah"`,
        sources: [],
      });
    }

    console.log(`Found ${searchResults.length} articles from yufid.com`);

    // 2. Scrape konten dari semua hasil
    console.log("Scraping articles...");
    const scrapingPromises = searchResults.map((result) =>
      scrapeYufidArticle(result.url)
    );
    const scrapedArticles = await Promise.all(scrapingPromises);

    // Filter yang berhasil di-scrape
    const validArticles = scrapedArticles.filter(
      (article) => article !== null && article.content.length > 200
    );

    if (validArticles.length === 0) {
      return NextResponse.json({
        reply:
          "Maaf, saya mengalami kesulitan mengakses artikel dari yufid.com saat ini. Silakan coba lagi dalam beberapa saat.",
        sources: [],
      });
    }

    // 3. Sort berdasarkan kelengkapan dan ambil 3 terbaik
    const top3Articles = validArticles
      .sort((a, b) => b.completenessScore - a.completenessScore)
      .slice(0, 3);

    console.log(`Selected top 3 articles based on completeness`);

    // 4. Gabungkan konten untuk context
    const context = top3Articles
      .map(
        (article, i) => `
=== ARTIKEL ${i + 1} ===
Judul: ${article.title}
URL: ${article.url}
Skor Kelengkapan: ${article.completenessScore}

Isi Artikel:
${article.content}

===========================
`
      )
      .join("\n\n");

    // 5. Generate response dengan Gemini
    console.log("Generating response with Gemini AI...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Anda adalah asisten ahli agama Islam yang bertugas merangkum dan menjawab pertanyaan HANYA berdasarkan artikel dari yufid.com.

ATURAN KETAT:
1. Baca dan analisis SEMUA 3 artikel yang diberikan di bawah
2. Rangkum informasi dari artikel-artikel tersebut untuk menjawab pertanyaan user
3. WAJIB cantumkan dalil dari Al-Quran jika ada di artikel
4. WAJIB cantumkan dalil dari Hadits BESERTA RIWAYATNYA (HR. Bukhari, HR. Muslim, dll) jika ada di artikel
5. Gunakan bahasa yang MUDAH DIPAHAMI untuk orang awam
6. Jika artikel memberikan pendapat ulama, sebutkan
7. JANGAN menambahkan informasi dari pengetahuan Anda sendiri
8. Jika informasi tidak cukup di artikel, katakan "Berdasarkan artikel yang saya temukan..."

ARTIKEL DARI YUFID.COM:
${context}

PERTANYAAN USER:
"${message}"

FORMAT JAWABAN:
[Penjelasan singkat dan jelas dalam 2-3 paragraf]

Dalil Al-Quran:
[Jika ada, tulis ayat dan surat]

Dalil Hadits:
[Jika ada, tulis hadits dan riwayatnya lengkap]

Kesimpulan:
[Ringkasan singkat hukum/jawaban]

PENTING: Tulis dengan bahasa yang santun, jelas, dan mudah dipahami!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

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
          "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi. Jika masalah berlanjut, coba gunakan kata kunci yang berbeda.",
        sources: [],
      },
      { status: 500 }
    );
  }
}
