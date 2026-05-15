"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Heart,
  QrCode,
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

export default function SupportPage() {
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
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
              Bantu platform pencarian ilmu ini tetap hidup dan rapi.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-950/70 md:text-lg">
              Dukungan dipakai untuk kebutuhan teknis aplikasi: server,
              layanan pendukung, dan pengembangan pengalaman mencari rujukan.
            </p>
          </div>
          <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
            <Heart className="mb-5 h-10 w-10 text-red-700" />
            <p className="text-xl font-semibold">Jazakumullah khairan.</p>
            <p className="mt-3 text-sm leading-7 text-emerald-950/65">
              Setiap dukungan membantu menjaga Sahabat Ilmu tetap bisa
              dikembangkan dengan tenang.
            </p>
          </div>
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
