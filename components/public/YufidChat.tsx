"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ChevronDown,
  ExternalLink,
  Home,
  Library,
  Loader2,
  Menu,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatSource = { title: string; url: string; website: string };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
};

type PreparedMessage = {
  apiMessage: string;
  localReply: string;
  notice: string;
};

const starterQuestions = [
  "Apa itu bid'ah?",
  "Hukum puasa di bulan Ramadhan",
  "Dalil tentang menjaga lisan",
  "Cara mencari ilmu agama yang benar",
];

const recentTopics = [
  "Apa itu bid'ah?",
  "Hukum puasa Ramadhan",
  "Dalil menjaga lisan",
  "Tata cara wudhu",
  "Adab menuntut ilmu",
];

const greetingPattern =
  /^(assalamu'?alaikum|assalamualaikum|wa'?alaikumussalam|waalaikumsalam|salam|halo|hai|hi|hello|pagi|siang|sore|malam|permisi)(\s+(akhi|ukhti|ustadz|ustaz|kak|bro|admin))?[\s!?.]*$/i;

const assistantQuestionPattern =
  /(kamu siapa|siapa kamu|ini apa|bisa apa|cara pakai|fitur|bantuan|help)/i;

const smallTalkPattern =
  /^(apa kabar|gimana kabarnya|bagaimana kabarnya|makasih|terima kasih|thanks|jazakallah|jazakillahu khairan|jazakallahu khairan)[\s!?.]*$/i;

const religiousPattern =
  /(agama|islam|muslim|allah|rasul|nabi|qur'?an|alquran|al-qur'?an|hadits|hadis|sunnah|dalil|hukum|halal|haram|boleh|bid'?ah|shalat|salat|wudhu|tayamum|puasa|ramadhan|zakat|haji|umrah|doa|dzikir|zikir|aqidah|akidah|tauhid|syirik|fikih|fiqih|adab|akhlak|ibadah|aurat|hijab|jilbab|nikah|talak|riba|muamalah|sedekah|infak|qurban|aqiqah|masjid|ustadz|ustaz|kajian|surah|ayat|tafsir|dosa|pahala|surga|neraka|malaikat|jin|ruqyah|waris|haid|nifas|junub|najis|lisan|wajib|sunnah)/i;

const offTopicPattern =
  /(coding|programming|javascript|typescript|python|react|next\.?js|laravel|flutter|bug|error|database|bitcoin|crypto|saham|trading|forex|cuaca|film|anime|game|mobile legends|valorant|sepak bola|bola|resep|masak|makanan|musik|lagu|lirik|pacar|curhat|matematika|fisika|kimia|sejarah indonesia|presiden|politik)/i;

const genericQuestionPattern =
  /^(apa|siapa|kapan|dimana|di mana|bagaimana|kenapa|mengapa|berapa|buatkan|bikinkan|tolong|jelaskan|ceritakan|rekomendasi|kasih|beri)\b/i;

const technicalWorkPattern =
  /\b(kode|script|program|python|javascript|typescript|react|next\.?js|laravel|flutter|database|coding|programming|debug|bug|error|html|css|sql)\b/i;

const technicalTaskIntentPattern =
  /\b(tolong|buat(?:kan)?|bikin(?:kan)?|generate|tulis(?:kan)?|kasih|beri|minta|kode|script|program|debug|fix|perbaiki)\b/i;

const technicalTaskTailPattern =
  /\b(tolong\s+)?(buat(?:kan)?|bikin(?:kan)?|generate|tulis(?:kan)?|kasih|beri|minta)?\s*[^.!?\n]*(kode|script|program|python|javascript|typescript|react|next\.?js|laravel|flutter|database|coding|programming|debug|bug|error|html|css|sql)[^.!?\n]*/i;

function stripInjectedTasks(message: string) {
  const segments = message
    .replace(/\s+([?.!,])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+|\s+\b(?:dan|lalu|terus|kemudian|sekalian)\b\s+/i);

  let removed = false;
  const keptSegments = segments.flatMap((segment) => {
    const trimmedSegment = segment.trim();
    const isTechnicalTask =
      technicalWorkPattern.test(trimmedSegment) &&
      technicalTaskIntentPattern.test(trimmedSegment);

    if (!isTechnicalTask) {
      return trimmedSegment ? [trimmedSegment] : [];
    }

    removed = true;
    const safePart = trimmedSegment.replace(technicalTaskTailPattern, "").trim();
    return safePart && religiousPattern.test(safePart) ? [safePart] : [];
  });

  const cleaned = keptSegments
    .join(" ")
    .replace(/\s+([?.!,])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/[.!?\s]+$/g, "")
    .trim();

  return {
    cleaned,
    removed,
  };
}

function normalizeSearchQuery(message: string) {
  const compact = message
    .replace(/\bhukum\s+nya\b/gi, "hukumnya")
    .replace(/\bgimana\b/gi, "bagaimana")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (/\b(musik|lagu|nyanyian)\b/i.test(compact) && religiousPattern.test(compact)) {
    return "hukum musik dalam Islam";
  }

  if (compact.length <= 140) {
    return compact;
  }

  const firstSentence = compact.split(/[.!?]/).find(Boolean)?.trim();
  if (firstSentence && firstSentence.length >= 12) {
    return firstSentence.slice(0, 140).trim();
  }

  return compact.slice(0, 140).trim();
}

function getNoSourceReply(query: string) {
  return `Belum ketemu rujukan Yufid.com yang cukup untuk: "${query}".\n\nAku belum bisa menyimpulkan jawaban agama tanpa sumber. Coba pakai kata kunci yang lebih pendek dan langsung, misalnya "hukum musik", "dalil menjaga lisan", atau "tata cara wudhu".`;
}

function combineNotice(notice: string, reply: string) {
  return notice ? `${notice}\n\n${reply}` : reply;
}

function prepareMessage(message: string): PreparedMessage {
  const trimmed = message.trim();
  const hasReligiousContext = religiousPattern.test(trimmed);
  const stripped = stripInjectedTasks(trimmed);
  const hasInjectedTask = stripped.removed;
  const cleanedMessage = stripped.cleaned || trimmed;

  if (greetingPattern.test(trimmed)) {
    return {
      apiMessage: "",
      localReply:
        "Halo akhi/ukhti. Ada dalil, kajian, atau pembahasan agama yang mau dicari? Coba tulis misalnya: \"dalil menjaga lisan\", \"hukum puasa Ramadhan\", atau \"tata cara wudhu\".",
      notice: "",
    };
  }

  if (smallTalkPattern.test(trimmed)) {
    return {
      apiMessage: "",
      localReply:
        "Alhamdulillah, siap bantu. Ada dalil, kajian, atau pembahasan agama yang mau dicari hari ini?",
      notice: "",
    };
  }

  if (assistantQuestionPattern.test(trimmed)) {
    return {
      apiMessage: "",
      localReply:
        "Aku Sahabat Ilmu. Tugasku membantu mencari dalil, kajian, dan pengetahuan agama dari rujukan Yufid.com. Tulis topik yang ingin dicari, nanti aku bantu ringkas dan tampilkan sumbernya bila tersedia.",
      notice: "",
    };
  }

  if (!hasReligiousContext && (offTopicPattern.test(trimmed) || genericQuestionPattern.test(trimmed))) {
    return {
      apiMessage: "",
      localReply:
        "Sahabat Ilmu fokus membantu mencari dalil, kajian, dan pengetahuan agama. Untuk topik di luar pembahasan agama, aku tidak menjawab agar tetap aman dan sesuai tujuan aplikasi. Coba tulis pertanyaan agama atau kata kunci rujukan yang ingin dicari.",
      notice: "",
    };
  }

  if (hasInjectedTask && !religiousPattern.test(cleanedMessage)) {
    return {
      apiMessage: "",
      localReply:
        "Aku abaikan permintaan teknis seperti kode atau program karena di luar fokus Sahabat Ilmu. Silakan tulis ulang bagian pertanyaan agama yang ingin dicari dari rujukan Yufid.com.",
      notice: "",
    };
  }

  return {
    apiMessage: normalizeSearchQuery(cleanedMessage),
    localReply: "",
    notice: hasInjectedTask
      ? "Catatan: permintaan teknis seperti kode atau program aku abaikan karena di luar fokus Sahabat Ilmu. Aku lanjut mencari bagian pertanyaan agama saja."
      : "",
  };
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2.5">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-1" />;
        }

        if (/^[\u0600-\u06FF\s\u060C\u061B\u061F]+$/.test(trimmed)) {
          return (
            <div
              key={index}
              className="rounded-2xl border border-emerald-950/10 bg-white px-4 py-3"
            >
              <p className="text-right text-lg leading-loose text-emerald-950" dir="rtl">
                {trimmed}
              </p>
            </div>
          );
        }

        if (/^[\s]*[-*]\s+/.test(line)) {
          return (
            <div key={index} className="flex gap-2 text-[15px] leading-7 text-emerald-950/80">
              <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-700" />
              <span>{trimmed.replace(/^[-*]\s+/, "")}</span>
            </div>
          );
        }

        const numbered = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numbered) {
          return (
            <div key={index} className="flex gap-2 text-[15px] leading-7 text-emerald-950/80">
              <span className="font-semibold text-amber-800">{numbered[1]}.</span>
              <span>{numbered[2]}</span>
            </div>
          );
        }

        return (
          <p key={index} className="text-[15px] leading-7 text-emerald-950/80">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function ChatComposer({
  input,
  loading,
  onInputChange,
  onSubmit,
}: {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 168)}px`;
  }, [input]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-[1.75rem] border border-emerald-950/15 bg-white p-2 shadow-2xl shadow-emerald-950/10"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tanyakan sesuatu ke Sahabat Ilmu..."
        rows={1}
        disabled={loading}
        className="block max-h-40 min-h-12 w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-6 text-emerald-950 outline-none placeholder:text-emerald-950/40 disabled:cursor-not-allowed"
      />
      <div className="flex items-center justify-between gap-3 px-2 pb-1">
        <div className="inline-flex min-w-0 items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-emerald-700" />
          <span className="truncate">Ringkasan dari referensi Yufid.com</span>
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-950 text-white transition hover:bg-emerald-900 disabled:bg-emerald-950/20 disabled:text-emerald-950/40"
          aria-label="Kirim pertanyaan"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
}

export default function YufidChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Mencari referensi Yufid.com...");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const prepared = prepareMessage(userMessage);
      if (prepared.localReply) {
        setLoadingText("Menyiapkan jawaban...");
        await new Promise((resolve) => setTimeout(resolve, 450));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: prepared.localReply,
            sources: [],
          },
        ]);
        return;
      }

      setLoadingText(
        prepared.notice
          ? "Menyaring pertanyaan lalu mencari rujukan..."
          : "Mencari referensi Yufid.com..."
      );
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prepared.apiMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.reply || `HTTP error ${response.status}`);
      }

      const sources: ChatSource[] = Array.isArray(data.sources) ? data.sources : [];
      const noSourceReply =
        sources.length === 0 && /tidak menemukan artikel|belum menemukan/i.test(data.reply || "")
          ? getNoSourceReply(prepared.apiMessage)
          : data.reply;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: combineNotice(prepared.notice, noSourceReply),
          sources,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, koneksi ke ringkasan Yufid.com sedang bermasalah. Coba lagi sebentar lagi atau buka Yufid.com langsung untuk membaca sumber asli.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
  };

  const startPrompt = (question: string) => {
    setInput(question);
    setSidebarOpen(false);
  };

  return (
    <main className="h-screen overflow-hidden bg-[#fffaf0] text-emerald-950">
      <div className="flex h-full">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Tutup sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-emerald-950/30 md:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-emerald-950/10 bg-[#f7f1df] transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-3">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white"
            >
              <Image
                src="/images/Sahabat-logo-icon.png"
                alt="Sahabat Ilmu"
                width={30}
                height={30}
                className="rounded-lg"
                priority
              />
              <span className="truncate text-sm font-semibold text-emerald-950">Sahabat Ilmu</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-emerald-950/70 hover:bg-white md:hidden"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1 px-2">
            <button
              type="button"
              onClick={resetChat}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-emerald-950 hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Chat baru
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-emerald-950/75 hover:bg-white hover:text-emerald-950"
            >
              <Home className="h-4 w-4" />
              Beranda
            </Link>
            <Link
              href="/kajian"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-emerald-950/75 hover:bg-white hover:text-emerald-950"
            >
              <Library className="h-4 w-4" />
              Kajian
            </Link>
            <a
              href="https://yufid.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-emerald-950/75 hover:bg-white hover:text-emerald-950"
            >
              <ExternalLink className="h-4 w-4" />
              Yufid.com
            </a>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">Terbaru</p>
            <div className="mt-2 space-y-1">
              {recentTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => startPrompt(topic)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-emerald-950/75 hover:bg-white hover:text-emerald-950"
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{topic}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            <div className="rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Sumber dijaga
              </div>
              <p className="mt-2 text-xs leading-5 text-emerald-950/65">
                Jawaban AI adalah ringkasan dari referensi Yufid.com, bukan
                pengganti belajar langsung.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-[#fffaf0]">
          <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-emerald-950/10 bg-[#fffaf0]/90 px-3 backdrop-blur md:px-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-emerald-950/70 hover:bg-white md:hidden"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-emerald-950 hover:bg-white md:inline-flex"
                aria-label="Mode chat"
              >
                Sahabat Ilmu
                <ChevronDown className="h-4 w-4 text-emerald-950/50" />
              </button>
              <span className="text-sm font-semibold text-emerald-950 md:hidden">
                Sahabat Ilmu
              </span>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-emerald-950/75 hover:bg-white hover:text-emerald-950"
            >
              Chat baru
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4">
              {messages.length === 0 ? (
                <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center pb-24 pt-10">
                  <div className="text-center">
                    <Image
                      src="/images/sahabat-ilmu-horizontal2.png"
                      alt="Sahabat Ilmu"
                      width={220}
                      height={176}
                      className="mx-auto mb-5 h-auto w-44 object-contain md:w-52"
                      priority
                    />
                    <h1 className="text-2xl font-semibold tracking-normal text-emerald-950 md:text-[32px]">
                      Cari dalil atau ilmu apa?
                    </h1>
                  </div>

                  <div className="mt-8">
                    <ChatComposer
                      input={input}
                      loading={loading}
                      onInputChange={setInput}
                      onSubmit={handleSend}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {starterQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => startPrompt(question)}
                        className="group flex min-h-[72px] items-start gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4 text-left shadow-sm transition hover:border-emerald-950/20 hover:shadow-md"
                      >
                        <Search className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-800 group-hover:text-emerald-700" />
                        <span className="text-sm leading-5 text-emerald-950/75">
                          {question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-7 pb-32 pt-8">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex gap-4 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-950 text-white">
                          <Image
                            src="/images/Sahabat-logo-icon.png"
                            alt="Sahabat Ilmu"
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={
                          message.role === "user"
                            ? "max-w-[78%] rounded-3xl bg-emerald-950 px-5 py-3 text-white shadow-sm"
                            : "min-w-0 flex-1 pt-1 text-emerald-950"
                        }
                      >
                        {message.role === "assistant" ? (
                          <>
                            <FormattedMessage content={message.content} />
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-5 rounded-2xl border border-emerald-950/10 bg-white p-3 shadow-sm">
                                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Sumber Yufid.com
                                </p>
                                <div className="grid gap-2">
                                  {message.sources.map((source) => (
                                    <a
                                      key={source.url}
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block rounded-xl border border-emerald-950/10 bg-[#fffaf0] px-3 py-2 text-xs font-medium text-emerald-950 transition hover:border-emerald-950/20 hover:bg-[#f7f1df]"
                                    >
                                      <span className="line-clamp-2">
                                        {source.title}
                                      </span>
                                      <span className="mt-1 block text-[11px] text-emerald-950/50">
                                        {source.website}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="whitespace-pre-wrap text-[15px] leading-7">
                            {message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-4 text-sm font-medium text-emerald-950/60">
                      <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-950 text-white">
                        <Image
                          src="/images/Sahabat-logo-icon.png"
                          alt="Sahabat Ilmu"
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-800" />
                        {loadingText}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {messages.length > 0 && (
              <div className="pointer-events-none fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0] to-transparent px-4 pb-4 pt-10 md:left-[260px]">
                <div className="pointer-events-auto">
                  <ChatComposer
                    input={input}
                    loading={loading}
                    onInputChange={setInput}
                    onSubmit={handleSend}
                  />
                  <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-emerald-950/55">
                    Jawaban AI bisa kurang tepat. Buka sumber Yufid.com untuk
                    membaca rujukan asli.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
