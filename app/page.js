"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, BookOpen, AlertCircle } from "lucide-react";

// Component untuk format pesan dengan styling khusus
function FormattedMessage({ content }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        // Dalil Al-Quran
        if (line.includes("📖") || line.includes("DALIL AL-QURAN")) {
          return (
            <div key={index} className="mt-4 pt-3 border-t border-emerald-100">
              <div className="bg-emerald-50 rounded-lg p-3 border-l-4 border-emerald-500">
                <p className="font-semibold text-emerald-800 text-sm mb-1 flex items-center gap-1">
                  📖 Dalil Al-Quran
                </p>
              </div>
            </div>
          );
        }

        // Dalil Hadits
        if (line.includes("📚") || line.includes("DALIL HADITS")) {
          return (
            <div key={index} className="mt-3">
              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                <p className="font-semibold text-blue-800 text-sm mb-1 flex items-center gap-1">
                  📚 Dalil Hadits
                </p>
              </div>
            </div>
          );
        }

        // Kesimpulan
        if (line.includes("✅") || line.includes("KESIMPULAN")) {
          return (
            <div key={index} className="mt-3">
              <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-500">
                <p className="font-semibold text-amber-800 text-sm mb-1 flex items-center gap-1">
                  ✅ Kesimpulan
                </p>
              </div>
            </div>
          );
        }

        // Content dalil (QS., HR., atau isi dalam kotak)
        if (
          line.includes("QS.") ||
          line.includes("Q.S.") ||
          line.includes("HR.") ||
          (line.startsWith('"') && line.endsWith('"'))
        ) {
          return (
            <div
              key={index}
              className="pl-3 text-sm text-gray-700 italic leading-relaxed"
            >
              {line}
            </div>
          );
        }

        // Isi kesimpulan
        if (index > 0 && lines[index - 1].includes("✅")) {
          return (
            <div key={index} className="pl-3 text-sm text-gray-700 font-medium">
              {line}
            </div>
          );
        }

        // Skip empty lines
        if (line.trim() === "") {
          return <div key={index} className="h-2" />;
        }

        // Regular paragraph
        return (
          <p key={index} className="text-gray-800 leading-relaxed text-[15px]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "❌ Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi dalam beberapa saat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = [
    "Bagaimana cara sholat yang benar?",
    "Apa hukum zakat fitrah?",
    "Kapan waktu berbuka puasa?",
    "Bagaimana tata cara wudhu?",
    "Apa saja rukun Islam?",
    "Hukum mengucapkan selamat natal",
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Chatbot Agama Islam</h1>
              <p className="text-emerald-100 text-sm">
                Sumber terpercaya dari Yufid.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Assalamu'alaikum Warahmatullahi Wabarakatuh
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Silakan tanyakan pertanyaan seputar agama Islam. Saya akan
                mencari jawaban dari artikel-artikel berkualitas di yufid.com
                yang dilengkapi dengan dalil Al-Quran dan Hadits.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {exampleQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-all text-left text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl ${msg.role === "user" ? "order-1" : ""}`}
              >
                <div
                  className={`rounded-2xl p-4 shadow-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div className="prose prose-sm max-w-none overflow-hidden break-words">
                    {msg.role === "assistant" ? (
                      <FormattedMessage content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed break-words">
                        {msg.content}
                      </div>
                    )}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Sumber Referensi:
                      </p>
                      <div className="space-y-1.5">
                        {msg.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline block bg-emerald-50 px-2 py-1.5 rounded transition-colors"
                          >
                            📄 {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm">
                    Mencari jawaban dari yufid.com...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pertanyaan agama Anda di sini..."
              className="flex-1 rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white rounded-full p-3 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Kirim pertanyaan"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Tekan Enter untuk mengirim • Shift+Enter untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
}
