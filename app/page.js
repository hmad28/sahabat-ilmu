// app/page.js

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import KajianSidebar from "@/components/KajianSidebar";

// Component untuk format pesan dengan styling khusus
function FormattedMessage({ content }) {
  const lines = content.split("\n");

  // Helper function to parse inline markdown
  const parseMarkdown = (text) => {
    // Handle bold text (**text** or __text__)
    let parsed = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Handle italic text (*text* or _text_)
    parsed = parsed.replace(/\*(.+?)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/_(.+?)_/g, '<em>$1</em>');
    
    return parsed;
  };

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        // Deteksi teks Arab (hanya tampilkan dengan styling khusus jika baris HANYA berisi Arab)
        if (/^[\u0600-\u06FF\s\u060C\u061B\u061F]+$/.test(line.trim()) && line.trim().length > 0) {
          return (
            <div
              key={index}
              className="bg-emerald-50/50 rounded-lg px-4 py-3 my-2"
            >
              <p
                className="text-right text-lg leading-loose text-gray-800"
                dir="rtl"
              >
                {line.trim()}
              </p>
            </div>
          );
        }

        // Skip empty lines
        if (line.trim() === "") {
          return <div key={index} className="h-1" />;
        }

        // Bullet points (*, -, •)
        if (/^[\s]*[\*\-•]\s+/.test(line)) {
          const bulletText = line.replace(/^[\s]*[\*\-•]\s+/, '');
          return (
            <div key={index} className="flex gap-2 text-sm text-gray-800 leading-relaxed">
              <span className="text-emerald-600 mt-1">•</span>
              <span 
                dangerouslySetInnerHTML={{ __html: parseMarkdown(bulletText) }}
              />
            </div>
          );
        }

        // Numbered lists (1., 2., etc.)
        if (/^[\s]*\d+\.\s+/.test(line)) {
          const match = line.match(/^[\s]*(\d+)\.\s+(.+)/);
          if (match) {
            return (
              <div key={index} className="flex gap-2 text-sm text-gray-800 leading-relaxed">
                <span className="text-emerald-600 font-semibold">{match[1]}.</span>
                <span 
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(match[2]) }}
                />
              </div>
            );
          }
        }

        // Regular paragraph with markdown support
        return (
          <p 
            key={index} 
            className="text-gray-800 leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(line) }}
          />
        );
      })}
    </div>
  );
}

// export default FormattedMessage;

export default function IslamicChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
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
    "Apa hukum trading dalam Islam?",
    "Bagaimana tata cara haji/umrah sesuai tuntunan yang shahih?",
    "Amalan apa yang bisa menghapus dosa-dosa saya yang sudah banyak?",
    "Apa itu bid'ah?",
    "Apa hukum pacaran?",
    "Hukum merayakan ulang tahun?",
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              <Image
                src="/images/sahabat-ilmu-vertikal2.png"
                alt="Logo"
                width={200}
                height={50}
                className="inline-block"
              />
            </h1>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden bg-white/20 text-xs px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              {showSidebar ? "Sembunyikan" : "Lihat"} Kajian
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Image
                    src="/images/sahabat-ilmu-horizontal2.png"
                    alt="Logo"
                    width={200}
                    height={50}
                    className="inline-block"
                  />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Assalamu'alaikum Warahmatullahi Wabarakatuh
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Setiap jawaban dirangkum dari Al-Qur'an, Sunnah yang shahih,
                    dan penjelasan para ulama, mengacu pada konten ilmiah di
                    yufid.com
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
                    className={`max-w-2xl ${
                      msg.role === "user" ? "order-1" : ""
                    }`}
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
                                <div className="flex items-center justify-between gap-2">
                                  <span className="flex-1">
                                    📄 {source.title}
                                  </span>
                                  <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded">
                                    {source.website}
                                  </span>
                                </div>
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

        {/* Sidebar Kajian */}
        {showSidebar && (
          <div className="hidden lg:block border-l bg-gray-50 p-4 overflow-y-auto">
            <KajianSidebar />
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 text-gray-900">
              <h3 className="font-bold text-2xl">Daftar Kajian</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <KajianSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
