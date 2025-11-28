"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  Shield,
  Users,
  Sparkles,
  Heart,
  AlertCircle,
  Github,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Target,
  Star,
  ArrowLeft,
  Share2,
  Menu,
  X,
  User
} from "lucide-react";
import KajianSidebar from "@/components/KajianSidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const features = [
    {
      icon: Bot,
      title: "AI Chatbot Islami",
      description:
        "Chatbot pintar yang bisa menjawab pertanyaan seputar kajian Islam berdasarkan referensi dari Yufid.com. Tidak perlu lagi scroll banyak artikel, tinggal tanya saja!",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: BookOpen,
      title: "Manajemen Kajian",
      description:
        "Sistem CRUD lengkap untuk konten kajian dengan Rich Text Editor. Admin dapat upload artikel, edit konten, dan mengatur semuanya dengan mudah.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Sistem Autentikasi Aman",
      description:
        "Login/Register yang aman dengan role-based access (User, Admin, Super Admin). Setiap pengguna mendapat pengalaman yang disesuaikan dengan role-nya.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Dashboard Admin",
      description:
        "Dashboard lengkap untuk kelola user, monitor aktivitas, moderasi konten, dan melihat analytics platform.",
      color: "orange",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Sparkles,
      title: "Activity Logging",
      description:
        "Setiap aktivitas pengguna tercatat dengan baik untuk membantu memahami behavior user dan improve platform secara berkelanjutan.",
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: ExternalLink,
      title: "SEO Friendly",
      description:
        "Dynamic metadata, sitemap otomatis, dan Open Graph tags yang membuat konten mudah ditemukan di mesin pencari.",
      color: "teal",
      gradient: "from-teal-500 to-emerald-500",
    },
  ];

  const stats = [
    { icon: MessageCircle, value: "24/7", label: "AI Assistant" },
    { icon: BookOpen, value: "1000+", label: "Artikel Kajian" },
    { icon: Users, value: "Open", label: "Source Project" },
    { icon: TrendingUp, value: "Active", label: "Development" },
  ];

  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="font-medium text-sm md:text-base">Kembali</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline">Kajian</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl overflow-hidden animate-slide-in">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <h3 className="font-bold text-lg md:text-xl">Daftar Kajian</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full pt-4 px-4 space-y-2">
                {!session && (
                  <a
                    href="/register"
                    className="flex bg-emerald-600 text-white text-sm md:text-sm font-semibold px-3 py-3 rounded-lg hover:bg-emerald-600/90 transition-all items-center gap-1.5 shadow-md"
                  >
                    <User className="w-4 h-4" />
                    <span>Daftar Jadi Penulis</span>
                  </a>
                )}

                {session && (
                  <a
                    href="/dashboard"
                    className="flex bg-emerald-600 text-white text-sm md:text-sm font-semibold px-3 py-3 rounded-lg hover:bg-emerald-600/90 transition-all items-center gap-1.5 shadow-md"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <KajianSidebar />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden pb-32 md:pb-40">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                AI-Powered Islamic Learning
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Belajar Agama Jadi
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                Lebih Mudah & Menyenangkan
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Platform pembelajaran kajian Islami dengan bantuan AI untuk
              memudahkan perjalanan belajar agama Anda
            </p>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link
                href="/"
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Mulai Bertanya
              </Link>
              <a
                href="#features"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/30 inline-flex items-center gap-2"
              >
                <Lightbulb className="w-5 h-5" />
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              <Heart className="w-4 h-4" />
              Cerita Kami
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Kenapa Sahabat Ilmu Ada?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Sahabat Ilmu lahir dari keresahan yang sering kita alami:{" "}
                <span className="font-semibold text-emerald-700">
                  "Pengen belajar agama tapi bingung mulai dari mana?"
                </span>
                ,{" "}
                <span className="font-semibold text-emerald-700">
                  "Capek scroll-scroll nyari artikel yang valid"
                </span>
                , atau{" "}
                <span className="font-semibold text-emerald-700">
                  "Penasaran sesuatu tapi males buka banyak website"
                </span>
                .
              </p>
              <p className="text-lg">
                Platform ini hadir sebagai solusi praktis dan interaktif untuk
                membantu teman-teman Muslim belajar agama dengan cara yang lebih
                modern dan mudah diakses.
              </p>
              <p className="text-lg font-medium text-emerald-700">
                Kita hidup di era digital, kenapa cara belajar agama nggak ikut
                berkembang juga, kan? 🚀
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Misi Kami</h3>
                    <p className="text-sm text-gray-600">
                      Membantu Muslim belajar agama dengan cara yang modern dan
                      accessible
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Visi Kami</h3>
                    <p className="text-sm text-gray-600">
                      Menjadi jembatan antara teknologi modern dengan
                      pembelajaran Islam berkualitas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Nilai Kami</h3>
                    <p className="text-sm text-gray-600">
                      Kemudahan, kualitas referensi, dan pembelajaran
                      berkelanjutan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice - More Prominent */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-amber-400">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">
                  ⚠️ Catatan Penting untuk Pengguna
                </h3>
                <div className="space-y-4 text-amber-900">
                  <p className="leading-relaxed text-lg">
                    Jawaban yang diberikan AI mengambil referensi dari{" "}
                    <span className="font-bold text-emerald-700">
                      Yufid.com
                    </span>
                    , sebuah website kajian Islam yang Insya Allah berdasarkan
                    Al-Qur'an dan Sunnah.
                  </p>
                  <div className="bg-amber-100 rounded-xl p-4 border-l-4 border-amber-500">
                    <p className="font-bold text-lg mb-2">
                      Namun perlu diingat:
                    </p>
                    <p className="leading-relaxed">
                      <span className="underline decoration-amber-500 decoration-2">
                        Ini adalah kesimpulan AI
                      </span>
                      . Jika Anda ingin benar-benar mempelajari suatu topik
                      secara mendalam, sebaiknya baca langsung artikel aslinya
                      atau belajar dari sumber-sumber yang diberikan oleh AI.
                    </p>
                  </div>
                  <p className="leading-relaxed font-medium bg-gradient-to-r from-emerald-700 to-teal-700 text-transparent bg-clip-text">
                    Platform ini hanya alat bantu untuk mempermudah, bukan
                    pengganti pembelajaran yang sebenarnya. Tetap kritis dan
                    selalu verifikasi dengan ulama atau ustadz terpercaya! 📚🤲
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Fitur Unggulan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kenapa Harus Sahabat Ilmu?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami punya berbagai fitur canggih untuk mendukung perjalanan belajar
            agama Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 hover:-translate-y-2"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Github className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Open Source Project
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Sahabat Ilmu adalah proyek open-source yang tersedia di GitHub.
              Kami percaya bahwa dengan membuka kode sumber, kita bisa
              bersama-sama meningkatkan kualitas platform ini.
            </p>
          </div>

          {/* <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Transparan</h3>
              <p className="text-sm text-gray-300">
                Semua kode terbuka untuk umum
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Kolaboratif</h3>
              <p className="text-sm text-gray-300">Kontribusi dari developer</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Berkembang</h3>
              <p className="text-sm text-gray-300">
                Update dan improvement rutin
              </p>
            </div>
          </div> */}

          <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6 mb-8 text-center">
            <p className="text-amber-200 mb-2">
              <span className="font-bold">Mohon dimaklumi:</span> Karena ini
              proyek open-source dan masih dalam tahap pengembangan aktif,
              terkadang AI-nya mungkin error atau kena limit. Kami terus
              melakukan iterasi dan improvement! 🚀
            </p>
          </div>

          {/* <div className="text-center">
            <a
              href="https://github.com/hmad28/sahabat-ilmu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Github className="w-6 h-6" />
              Lihat di GitHub
              <ExternalLink className="w-5 h-5" />
            </a>
          </div> */}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Siap Mulai Belajar?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna lain yang sudah merasakan
            kemudahan belajar agama dengan Sahabat Ilmu
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Mulai Chat Sekarang
            </Link>
            <a
              href="/register"
              className="bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-xl inline-flex items-center gap-2 border-2 border-white/30 hover:scale-105"
            >
              <Users className="w-5 h-5" />
              Daftar Jadi Penulis
            </a>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 shadow-xl border border-emerald-200">
          <Heart className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kami Terbuka untuk Feedback!
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto">
            Masukan, kritik, dan saran dari Anda sangat berarti untuk
            perkembangan platform ini. Jangan ragu untuk berbagi pendapat Anda.
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            Jazakumullah Khairan Katsiran! ✨🤲
          </p>
        </div>
      </div>

      <div className="w-full flex items-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <Link
          href="support"
          className="text-xs md:text-base bg-gradient-to-br from-emerald-600 to-teal-600 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border-2 border-white/30 cursor-pointer hover:scale-105 transition-all hover:shadow-xl"
        >
          Support Kami
        </Link>
        <div className="border-l ml-4 pl-4 text-xs md:text-2xl font-bold text-emerald-700">
          Jazakumullah Khairan Katsiran! ✨🤲
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            Dibuat oleh{" "}
            <a
              href="https://www.hammad.biz.id/"
              className="font-bold text-yellow-400"
            >
              Hammad
            </a>{" "}
            untuk pembelajaran yang lebih baik
          </p>
          <p className="text-sm text-gray-500">
            © 2025 Sahabat Ilmu. Open Source Project.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
