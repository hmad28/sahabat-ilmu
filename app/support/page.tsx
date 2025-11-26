"use client";

import React, { useState } from "react";
import {
  Heart,
  Coffee,
  Zap,
  Star,
  Gift,
  Users,
  Code,
  Rocket,
  CheckCircle,
  Copy,
  QrCode,
  Smartphone,
  CreditCard,
  Sparkles,
} from "lucide-react";

export default function SupportPage() {
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const paymentMethods = [
    {
      name: "DANA",
      number: "0812-3456-7890",
      color: "from-blue-500 to-blue-600",
      icon: Smartphone,
    },
    {
      name: "GoPay",
      number: "0812-3456-7890",
      color: "from-green-500 to-green-600",
      icon: Smartphone,
    },
    {
      name: "OVO",
      number: "0812-3456-7890",
      color: "from-purple-500 to-purple-600",
      icon: Smartphone,
    },
    {
      name: "Bank Transfer",
      number: "1234567890 (BCA a.n. Nama)",
      color: "from-blue-600 to-blue-700",
      icon: CreditCard,
    },
  ];

  const supportTiers = [
    {
      icon: Coffee,
      name: "Secangkir Kopi",
      amount: "10K",
      description: "Bantu kami tetap semangat coding sambil ngopi",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: Zap,
      name: "Booster",
      amount: "25K",
      description: "Boost development speed dan fitur baru",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Star,
      name: "Super Supporter",
      amount: "50K",
      description: "Jadi bagian penting dari pengembangan",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Rocket,
      name: "Rocket Fuel",
      amount: "100K+",
      description: "Akselerasi penuh untuk inovasi platform",
      gradient: "from-purple-500 to-indigo-600",
    },
  ];

  const benefits = [
    {
      icon: Code,
      title: "Server & Hosting",
      description: "Biaya server database dan hosting",
    },
    {
      icon: Zap,
      title: "API Credits",
      description: "Credit untuk Google AI API",
    },
    {
      icon: Rocket,
      title: "Fitur Baru",
      description: "Development fitur-fitur canggih",
    },
    {
      icon: Users,
      title: "Maintenance",
      description: "Update dan perbaikan bug",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Heart className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Support Open Source</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Bantu Kami Terus
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
              Berkembang & Bermanfaat
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-emerald-50 mb-8 max-w-3xl mx-auto leading-relaxed">
            Kontribusi Anda membantu kami menjaga platform tetap gratis dan
            terus berkembang untuk ummat
          </p>

          <div className="flex items-center justify-center gap-2 text-emerald-100">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">
              100% akan digunakan untuk pengembangan platform
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
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

      {/* Why Support Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kenapa Dukungan Anda Penting?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Setiap rupiah yang Anda berikan akan langsung digunakan untuk
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Support Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-emerald-200"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                ></div>
                <div className="relative p-6">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${tier.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600 mb-3">
                    {tier.amount}
                  </div>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              <Gift className="w-4 h-4" />
              Pilih Metode Pembayaran
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Berdonasi
            </h2>
            <p className="text-lg text-gray-600">
              Pilih metode yang paling mudah untuk Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {paymentMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          E-Wallet / Transfer
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-700">
                        {method.number}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(method.number, method.name)
                        }
                        className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy nomor"
                      >
                        {copiedText === method.name ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  {copiedText === method.name && (
                    <p className="text-xs text-green-600 text-center">
                      ✓ Nomor berhasil disalin!
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-emerald-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
                <QrCode className="w-4 h-4" />
                Scan QR Code
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Atau Scan QR Code Ini
              </h3>
              <p className="text-gray-600">
                Lebih cepat dan mudah dengan scan langsung
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* QR Code Placeholder - Ganti dengan QR Code asli */}
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 shadow-lg">
                <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center border-4 border-emerald-500">
                  <div className="text-center p-6">
                    <QrCode className="w-32 h-32 text-emerald-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 font-medium">
                      Upload QR Code Anda di sini
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      (Ganti dengan gambar QR Code asli)
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-sm">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                  Cara Scan:
                </h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <span>
                      Buka aplikasi e-wallet Anda (DANA, GoPay, OVO, dll)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <span>Pilih menu "Scan" atau "Bayar"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <span>Arahkan kamera ke QR Code di atas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <span>Masukkan nominal dan konfirmasi</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Jazakumullah Khairan Katsira!
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Setiap kontribusi Anda, sekecil apapun, sangat berarti bagi kami dan
            ummat yang memanfaatkan platform ini. Semoga Allah membalas kebaikan
            Anda dengan yang lebih baik.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-emerald-50 leading-relaxed">
              "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia
              lain"
              <br />
              <span className="text-sm opacity-90">
                (HR. Ahmad, ath-Thabrani, ad-Daruquthi)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Kembali ke Beranda
        </a>
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
      `}</style>
    </div>
  );
}
