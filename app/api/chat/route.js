// app/api/chat/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi untuk search di yufid.com menggunakan Google
async function searchYufid(query) {
  try {
    const searchQuery = `site:yufid.com ${query}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}&num=5`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];
    $("div.g").each((i, elem) => {
      if (i < 5) {
        const title = $(elem).find("h3").text();
        const link = $(elem).find("a").attr("href");
        const snippet = $(elem).find(".VwiC3b").text();

        if (title && link && link.includes("yufid.com")) {
          results.push({ title, url: link, snippet });
        }
      }
    });

    return results;
  } catch (error) {
    console.error("Error searching yufid:", error);
    return [];
  }
}

// Fungsi untuk scrape konten dari URL yufid.com
async function scrapeYufidContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Ambil konten artikel (sesuaikan dengan struktur HTML yufid.com)
    const title = $("h1.entry-title").text();
    const content = $(".entry-content").text().trim();

    return { title, content: content.substring(0, 3000) }; // Limit untuk context
  } catch (error) {
    console.error("Error scraping content:", error);
    return null;
  }
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
    "sholat",
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
    "wudhu",
    "tayammum",
    "masjid",
    "ustadz",
    "ulama",
    "sahih",
    "muslim",
    "bukhari",
  ];

  const lowerQuestion = question.toLowerCase();
  return (
    religiousKeywords.some((keyword) => lowerQuestion.includes(keyword)) ||
    lowerQuestion.includes("bagaimana") ||
    lowerQuestion.includes("apa hukum")
  );
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Filter pertanyaan non-agama
    if (!isReligiousQuestion(message)) {
      return NextResponse.json({
        reply:
          "Maaf, saya hanya dapat menjawab pertanyaan seputar agama Islam. Silakan tanyakan hal-hal yang berkaitan dengan Islam, seperti ibadah, fiqih, akhlak, atau hal keislaman lainnya. Bagaimana saya bisa membantu Anda dengan pertanyaan agama?",
        sources: [],
      });
    }

    // 1. Search di yufid.com
    console.log("Searching yufid.com for:", message);
    const searchResults = await searchYufid(message);

    if (searchResults.length === 0) {
      return NextResponse.json({
        reply:
          "Maaf, saya tidak menemukan informasi terkait pertanyaan Anda di yufid.com. Coba ajukan pertanyaan dengan kata kunci yang berbeda atau lebih spesifik.",
        sources: [],
      });
    }

    // 2. Scrape konten dari top results
    const contentPromises = searchResults
      .slice(0, 3)
      .map((result) => scrapeYufidContent(result.url));
    const contents = await Promise.all(contentPromises);

    // 3. Gabungkan konten untuk context
    const context = contents
      .filter((c) => c !== null)
      .map(
        (c, i) => `
Sumber ${i + 1}: ${c.title}
${c.content}
---`
      )
      .join("\n\n");

    // 4. Generate response dengan Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Anda adalah asisten Islam yang hanya menjawab berdasarkan sumber dari yufid.com.

ATURAN PENTING:
1. Jawab HANYA berdasarkan informasi dari sumber di bawah ini
2. Jika informasi tidak ada di sumber, katakan tidak menemukan informasi tersebut
3. Berikan jawaban yang mudah dipahami untuk orang awam
4. WAJIB sertakan dalil dari Al-Quran atau Hadits jika ada di sumber
5. Sebutkan riwayat hadits (contoh: HR. Bukhari, HR. Muslim)
6. Gunakan bahasa Indonesia yang baik dan sopan
7. Jangan menambahkan informasi dari pengetahuan Anda sendiri

SUMBER DARI YUFID.COM:
${context}

PERTANYAAN USER:
${message}

Berikan jawaban yang mencakup:
- Penjelasan yang mudah dipahami
- Dalil Al-Quran (jika ada)
- Dalil Hadits beserta riwayatnya (jika ada)
- Kesimpulan singkat`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    // 5. Return response dengan sources
    return NextResponse.json({
      reply: reply,
      sources: searchResults.slice(0, 3).map((r) => ({
        title: r.title,
        url: r.url,
      })),
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        reply: "Maaf, terjadi kesalahan sistem. Silakan coba lagi.",
        sources: [],
      },
      { status: 500 }
    );
  }
}
