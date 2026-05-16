"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bug,
  CheckCircle2,
  Copy,
  CreditCard,
  Lightbulb,
  MessageSquare,
  QrCode,
  Send,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";

const paymentMethods = [
  {
    name: "DANA",
    number: "0896-9612-7555",
  },
  {
    name: "GoPay",
    number: "0896-9612-7555",
  },
];

const needs = [
  {
    title: "Server dan hosting",
    description: "Menjaga aplikasi tetap bisa diakses saat diuji dan dipakai.",
    icon: Server,
  },
  {
    title: "API credits",
    description: "Membantu biaya ringkasan AI dan proses pencarian sumber.",
    icon: Zap,
  },
  {
    title: "Pengembangan",
    description: "Merapikan fitur pencarian dalil, konten, dan pengalaman membaca sumber.",
    icon: Sparkles,
  },
];

const feedbackCategories = [
  {
    value: "general",
    label: "Feedback umum",
    icon: MessageSquare,
  },
  {
    value: "bug",
    label: "Lapor masalah",
    icon: Bug,
  },
  {
    value: "idea",
    label: "Ide fitur",
    icon: Lightbulb,
  },
  {
    value: "content",
    label: "Masukan konten",
    icon: Sparkles,
  },
];

export default function SupportPage() {
  const [copiedText, setCopiedText] = useState("");
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    category: "general",
    message: "",
    website: "",
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage("");
    setFeedbackError("");
    setIsSubmittingFeedback(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim feedback");
      }

      setFeedbackMessage("Feedback terkirim. Terima kasih atas masukannya.");
      setFeedbackForm({
        name: "",
        email: "",
        category: "general",
        message: "",
        website: "",
      });
    } catch (error) {
      setFeedbackError(
        error instanceof Error ? error.message : "Gagal mengirim feedback"
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <PublicNav />

      <section className="border-b border-emerald-950/10 bg-[#f7f1df]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_0.8fr] md:px-6 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Support Sahabat Ilmu
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Bantu Sahabat Ilmu jadi lebih tepat guna.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-950/70 md:text-lg">
              Kirim feedback, laporkan masalah, atau usulkan fitur agar
              pengalaman mencari rujukan bisa makin rapi.
            </p>
          </div>
          <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
            <MessageSquare className="mb-5 h-10 w-10 text-emerald-800" />
            <p className="text-xl font-semibold">Masukan kamu dibaca admin.</p>
            <p className="mt-3 text-sm leading-7 text-emerald-950/65">
              Feedback yang masuk hanya tampil di dashboard super admin.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Kirim Feedback
            </p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
              Ceritakan apa yang perlu diperbaiki.
            </h2>
            <p className="mt-4 text-sm leading-7 text-emerald-950/65">
              Bisa berupa bug, ide fitur, masukan tampilan, atau saran alur
              pencarian. Email opsional, isi jika kamu ingin bisa dihubungi
              balik.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {feedbackCategories.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.value}
                    className="rounded-lg border border-emerald-950/10 bg-white p-4"
                  >
                    <Icon className="mb-3 h-5 w-5 text-emerald-800" />
                    <p className="text-sm font-semibold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleFeedbackSubmit}
            className="rounded-lg border border-emerald-950/10 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">
                  Nama <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={feedbackForm.name}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
                  placeholder="Nama kamu"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">
                  Email
                </label>
                <input
                  type="email"
                  maxLength={255}
                  value={feedbackForm.email}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
                  placeholder="opsional@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-emerald-950">
                Kategori
              </label>
              <select
                value={feedbackForm.category}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
              >
                {feedbackCategories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-emerald-950">
                Feedback <span className="text-red-600">*</span>
              </label>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={7}
                value={feedbackForm.message}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    message: e.target.value,
                  })
                }
                className="w-full resize-none rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm leading-7 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
                placeholder="Tulis masukan kamu..."
              />
            </div>

            <input
              tabIndex={-1}
              autoComplete="off"
              value={feedbackForm.website}
              onChange={(e) =>
                setFeedbackForm({
                  ...feedbackForm,
                  website: e.target.value,
                })
              }
              className="hidden"
              aria-hidden="true"
            />

            {feedbackMessage && (
              <div className="mt-4 rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                {feedbackMessage}
              </div>
            )}
            {feedbackError && (
              <div className="mt-4 rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {feedbackError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingFeedback}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              <Send className="h-4 w-4" />
              {isSubmittingFeedback ? "Mengirim..." : "Kirim feedback"}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {needs.map((need) => {
            const Icon = need.icon;
            return (
              <article
                key={need.title}
                className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">{need.title}</h2>
                <p className="mt-3 text-sm leading-7 text-emerald-950/65">
                  {need.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-emerald-950/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Cara berdonasi
            </p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
              Pilih metode yang paling mudah.
            </h2>
            <p className="mt-4 text-sm leading-7 text-emerald-950/65">
              Nomor dapat disalin langsung. QR code tersedia untuk pembayaran
              yang mendukung scan.
            </p>
          </div>

          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="rounded-3xl border border-emerald-950/10 bg-[#fffaf0] p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-emerald-950/55">E-wallet</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
                  <code className="text-sm font-semibold text-emerald-950">
                    {method.number}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(method.number, method.name)}
                    className="rounded-full border border-emerald-950/10 p-2 text-emerald-950"
                    aria-label={`Salin ${method.name}`}
                  >
                    {copiedText === method.name ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-900">
            <QrCode className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-semibold">Scan QR Code</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-emerald-950/65">
            Gunakan aplikasi pembayaran yang mendukung QR scan.
          </p>
          <div className="mx-auto mt-8 w-fit rounded-3xl border border-emerald-950/10 bg-[#fffaf0] p-4">
            <Image
              src="/images/qr-code.jpeg"
              alt="QR Code support Sahabat Ilmu"
              width={807}
              height={792}
              className="h-auto w-[280px] max-w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-emerald-950 p-6 text-white md:flex-row md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
              Lanjut cari rujukan
            </p>
            <p className="mt-2 text-2xl font-semibold">
              Kembali ke Sahabat Ilmu.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-950"
          >
            Buka beranda
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
