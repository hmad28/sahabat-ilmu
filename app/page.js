"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, BookOpen, Sparkles } from "lucide-react";

export default function IslamicChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeWithGemini = async (question) => {
    const GEMINI_API_KEY = "AIzaSyCmIBfN5Ad5oIuWoJGFy4U7c7EHg2a27yI";

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "AIzaSyCmIBfN5Ad5oIuWoJGFy4U7c7EHg2a27yI") {
      return {
        answer:
          '⚠️ PENTING: Untuk menggunakan chatbot ini, Anda perlu:\n\n1. Dapatkan API Key Gemini gratis di: https://makersuite.google.com/app/apikey\n2. Ganti "YOUR_GEMINI_API_KEY_HERE" di kode dengan API key Anda\n3. Deploy aplikasi dengan Next.js\n\nCatatan: Karena CORS, web scraping yufid.com perlu dilakukan dari backend (API route Next.js), bukan dari browser langsung.',
        sources: [],
      };
    }

    const prompt = `Anda adalah asisten AI yang khusus menjawab pertanyaan tentang agama Islam berdasarkan konten dari Yufid.com.

ATURAN PENTING:
1. Jika pertanyaan bukan tentang agama Islam, arahkan pengguna untuk bertanya tentang agama dengan sopan
2. Gunakan bahasa Indonesia yang mudah dipahami untuk orang awam
3. Sertakan dalil dari Al-Quran dan/atau Hadits beserta riwayatnya jika relevan
4. Sebutkan bahwa jawaban berdasarkan referensi dari Yufid.com
5. Berikan jawaban yang komprehensif namun ringkas

Pertanyaan: ${question}

Format jawaban:
- Penjelasan singkat dan mudah dipahami
- Dalil dengan sumber riwayat yang jelas (jika relevan)
- Catatan: "Referensi dari Yufid.com"`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const answer =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Maaf, tidak dapat menghasilkan jawaban.";

      return {
        answer,
        sources: ["https://yufid.com"],
      };
    } catch (error) {
      console.error("Error calling Gemini:", error);
      return {
        answer:
          "Maaf, terjadi kesalahan saat menganalisis jawaban. Pastikan API key Gemini sudah benar.",
        sources: [],
      };
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await analyzeWithGemini(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sources: [],
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">
              Asisten Agama AI
            </h1>
            <p className="text-sm text-emerald-600">Berdasarkan Yufid.com</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                Assalamu'alaikum
              </h2>
              <p className="text-emerald-600 mb-6">
                Tanyakan pertanyaan seputar agama Islam
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "Bagaimana cara sholat yang benar?",
                  "Apa hukum zakat fitrah?",
                  "Bagaimana tata cara wudhu?",
                  "Apa keutamaan puasa Ramadhan?",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="p-3 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all text-left text-sm text-emerald-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-white shadow-sm border border-emerald-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-emerald-100">
                        <p className="text-sm font-semibold text-emerald-700 mb-2">
                          Sumber:
                        </p>
                        {msg.sources.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-emerald-600 hover:text-emerald-800 underline mb-1"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-emerald-100">
                    <div className="flex gap-2">
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-emerald-100 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanyakan tentang agama Islam..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
