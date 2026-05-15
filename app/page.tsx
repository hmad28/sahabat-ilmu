"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import EmptyState from "@/components/public/EmptyState";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";
import SourceNotice from "@/components/public/SourceNotice";

type Kajian = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  ustadz: string | null;
  category: string | null;
};

const learningPath = [
  {
    title: "Cari topik atau dalil",
    label: "Alur 01",
    description:
      "Tulis pertanyaan dengan bahasa sendiri: hukum, ibadah, adab, aqidah, atau topik agama yang ingin dirujuk.",
  },
  {
    title: "Baca ringkasan awal",
    label: "Alur 02",
    description:
      "AI membantu merangkum hasil pencarian agar inti pembahasan lebih mudah dipindai.",
  },
  {
    title: "Buka rujukan asli",
    label: "Alur 03",
    description:
      "Setiap jawaban diarahkan ke tautan sumber agar dalil dan penjelasan bisa dicek langsung.",
  },
];

function stripHtml(html: string) {
  if (typeof document === "undefined") return html;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

export default function HomePage() {
  const [latestKajian, setLatestKajian] = useState<Kajian[]>([]);
  const [kajianLoading, setKajianLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestKajian() {
      try {
        const response = await fetch("/api/kajian?status=published");
        const data = await response.json();
        if (Array.isArray(data)) {
          setLatestKajian(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching latest kajian:", error);
      } finally {
        setKajianLoading(false);
      }
    }

    fetchLatestKajian();
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <PublicNav />

      <section className="border-b border-emerald-950/10 bg-[linear-gradient(180deg,#fffaf0_0%,#f7f1df_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_0.75fr] md:px-6 md:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
              <Sparkles className="h-4 w-4" />
              Cari dalil dan ilmu dengan rujukan
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-emerald-950 md:text-6xl">
              Cari dalil, kajian, dan ilmu agama dengan rujukan Yufid.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-950/70 md:text-lg">
              Sahabat Ilmu membantu pengguna mencari pengetahuan agama,
              merangkum hasil dari Yufid.com, lalu membuka sumber asli agar
              dalil dan penjelasan bisa dicek langsung.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
              >
                Buka ruang chat
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="/kajian"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/15 bg-white px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:border-emerald-950/30"
              >
                Buka kajian
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Cari dalil", "Ringkasan Yufid", "Buka sumber asli"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border border-emerald-950/10 bg-white/75 px-4 py-3 text-sm font-semibold text-emerald-950/75"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-2xl shadow-emerald-950/10">
            <div className="border-b border-emerald-950/10 bg-[#f7f1df] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-950 text-white">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">
                      Ruang pencarian ilmu
                    </p>
                    <p className="text-xs text-emerald-950/55">
                      Ringkasan dari Yufid.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                  Live
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-[#fffaf0] p-5">
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-3xl rounded-tr-md bg-emerald-950 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                  Dalil tentang menjaga lisan?
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-emerald-900 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="rounded-3xl rounded-tl-md border border-emerald-950/10 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-amber-800">
                    AI mencari rujukan...
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-700" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-700 [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-700 [animation-delay:240ms]" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-900">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="max-w-[88%] rounded-3xl rounded-tl-md border border-emerald-950/10 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm leading-6 text-emerald-950/75">
                    Ditemukan beberapa rujukan terkait topik ini. Buka sumber
                    asli untuk membaca dalil dan penjelasan lengkap.
                  </p>
                  <div className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                    3 sumber Yufid.com siap dibuka
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-3xl rounded-tr-md bg-emerald-950 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                  Ada pembahasan tentang wudhu?
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-emerald-900 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-[160px] rounded-3xl rounded-tl-md border border-emerald-950/10 bg-white px-4 py-3 shadow-sm">
                  <div className="mb-2 h-2 w-24 animate-pulse rounded-full bg-emerald-950/20" />
                  <div className="h-2 w-36 animate-pulse rounded-full bg-emerald-950/10" />
                </div>
              </div>
            </div>

            <div className="border-t border-emerald-950/10 bg-white p-4">
              <Link
                href="/chat"
                className="flex items-center justify-between rounded-2xl border border-emerald-950/10 bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:border-emerald-950/20"
              >
                Coba tanya di ruang chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Alur pencarian
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-emerald-950 md:text-4xl">
              Dari pertanyaan ke sumber yang bisa dicek.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-emerald-950/65">
            Alur ini hanya membantu pencarian. Isi hukum, dalil, dan kesimpulan
            agama tetap harus dibaca dari sumber Yufid.com atau kajian asli.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {learningPath.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                {item.label}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-emerald-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-emerald-950/65">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-emerald-950/10 bg-[#f7f1df]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                Kajian terbaru
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-emerald-950">
                Lanjutkan dari bacaan yang tersedia.
              </h2>
            </div>
            <Link
              href="/kajian"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-950/15 bg-white px-5 py-3 text-sm font-semibold text-emerald-950"
            >
              Semua kajian
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {kajianLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-3xl bg-white/70"
                />
              ))}
            </div>
          ) : latestKajian.length === 0 ? (
            <EmptyState
              title="Kajian belum tersedia"
              description="Saat konten sudah dipublikasikan, bagian ini akan menjadi pintu masuk mencari kajian dan rujukan."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {latestKajian.map((kajian) => (
                <Link
                  key={kajian.id}
                  href={`/kajian/${kajian.slug}`}
                  className="group overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-44 bg-emerald-950/10">
                    {kajian.coverImage ? (
                      <Image
                        src={kajian.coverImage}
                        alt={kajian.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-emerald-900/35" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="mb-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                      {kajian.category || "kajian"}
                    </p>
                    <h3 className="line-clamp-2 text-lg font-semibold text-emerald-950 group-hover:text-emerald-800">
                      {kajian.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-emerald-950/65">
                      {stripHtml(kajian.excerpt)}
                    </p>
                    {kajian.ustadz && (
                      <p className="mt-4 text-xs font-semibold text-emerald-900/70">
                        {kajian.ustadz}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <SourceNotice />
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-800">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-emerald-950">
                  Siap dipakai untuk mencari rujukan
                </h2>
                <p className="mt-2 text-sm leading-7 text-emerald-950/65">
                  Fokus pengalaman publik ada di pencarian ilmu, ruang
                  bertanya, dan cara membuka sumber. Sistem tetap dibuat
                  sederhana agar pengalaman membaca rujukan stabil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
