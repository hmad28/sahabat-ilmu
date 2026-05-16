"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Heart,
  Loader2,
  MapPin,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import PublicFooter from "@/components/public/PublicFooter";
import KajianEngagement from "@/components/public/KajianEngagement";
import PublicNav from "@/components/public/PublicNav";
import SourceNotice from "@/components/public/SourceNotice";

interface Kajian {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  gallery: string[];
  ustadz: string | null;
  location: string | null;
  date: string | null;
  category: string;
  status: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

function sanitizeKajianHtml(html: string) {
  if (typeof document === "undefined") return html;
  const template = document.createElement("template");
  template.innerHTML = html;

  template.content
    .querySelectorAll("script, style, iframe, object, embed")
    .forEach((node) => node.remove());

  template.content.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith("on") || value.startsWith("javascript:")) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return template.innerHTML;
}

export default function KajianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [kajian, setKajian] = useState<Kajian | null>(null);
  const [relatedKajian, setRelatedKajian] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [detailResponse, listResponse] = await Promise.all([
          fetch(`/api/kajian/slug/${slug}`),
          fetch("/api/kajian?status=published"),
        ]);

        if (!detailResponse.ok) {
          if (detailResponse.status === 404) {
            toast.error("Kajian tidak ditemukan");
            router.push("/kajian");
            return;
          }
          throw new Error("Failed to fetch kajian");
        }

        const detail = await detailResponse.json();
        setKajian(detail);

        const list = await listResponse.json();
        if (Array.isArray(list)) {
          setRelatedKajian(
            list.filter((item: Kajian) => item.slug !== slug).slice(0, 3)
          );
        }
      } catch (error) {
        console.error("Error fetching kajian:", error);
        toast.error("Gagal memuat kajian");
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [router, slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share && kajian) {
      try {
        await navigator.share({
          title: kajian.title,
          text: kajian.excerpt,
          url,
        });
      } catch {
        return;
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link kajian disalin");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
        <PublicNav />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-emerald-800" />
          <span className="text-emerald-950/70">Memuat kajian...</span>
        </div>
        <PublicFooter />
      </main>
    );
  }

  if (!kajian) {
    return (
      <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
        <PublicNav />
        <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-emerald-900/35" />
          <h1 className="text-2xl font-semibold">Kajian tidak ditemukan</h1>
          <Link href="/kajian" className="mt-4 font-semibold text-emerald-800">
            Kembali ke daftar kajian
          </Link>
        </div>
        <PublicFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <Toaster position="top-right" />
      <PublicNav />

      <div className="border-b border-emerald-950/10 bg-[#f7f1df]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-4 py-2 text-sm font-semibold text-emerald-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
          </div>
        </div>
      </div>

      <article className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[minmax(0,1fr)_340px] md:px-6 md:py-12">
        <div>
          {kajian.coverImage && (
            <div className="relative mb-6 h-64 overflow-hidden rounded-[2rem] bg-emerald-950/10 shadow-lg md:h-[430px]">
              <Image
                src={kajian.coverImage}
                alt={kajian.title}
                fill
                sizes="(min-width: 768px) calc(100vw - 420px), 100vw"
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-sm md:p-8">
            <p className="mb-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
              {kajian.category || "kajian"}
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-emerald-950 md:text-5xl">
              {kajian.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3 border-b border-emerald-950/10 pb-6 text-sm text-emerald-950/65">
              {kajian.ustadz && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2">
                  <User className="h-4 w-4 text-emerald-800" />
                  {kajian.ustadz}
                </span>
              )}
              {kajian.location && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2">
                  <MapPin className="h-4 w-4 text-emerald-800" />
                  {kajian.location}
                </span>
              )}
              {kajian.date && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2">
                  <Calendar className="h-4 w-4 text-emerald-800" />
                  {format(new Date(kajian.date), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              )}
            </div>

            <div className="my-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Baca dengan adab sumber
              </div>
              Ringkasan dan konten di halaman ini berasal dari data kajian yang
              dipublikasikan. Untuk kesimpulan agama, dalil, dan rincian hukum,
              buka sumber rujukan terkait dan jangan berhenti di tampilan web.
            </div>

            <p className="mb-7 border-l-4 border-emerald-800 bg-emerald-50 py-4 pl-4 text-base leading-8 text-emerald-950/75">
              {kajian.excerpt}
            </p>

            <div
              className="prose prose-stone max-w-none kajian-content prose-headings:text-emerald-950 prose-a:text-emerald-800"
              dangerouslySetInnerHTML={{ __html: sanitizeKajianHtml(kajian.content) }}
            />

            <div className="mt-8 flex items-center gap-2 border-t border-emerald-950/10 pt-6 text-sm font-semibold text-emerald-950/75">
              Baarakallahu fiikum
              <Heart className="h-4 w-4 text-red-700" />
            </div>
          </div>

          <KajianEngagement kajianId={kajian.id} />

          {kajian.gallery && kajian.gallery.length > 0 && (
            <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-emerald-950">Galeri</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kajian.gallery.map((url, index) => (
                  <div
                    key={url}
                    className="relative h-56 overflow-hidden rounded-2xl bg-emerald-950/10"
                  >
                    <Image
                      src={url}
                      alt={`Galeri kajian ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <SourceNotice compact />

          <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
              Penulis
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-emerald-950">
                  {kajian.author?.name || "Sahabat Ilmu"}
                </p>
                <p className="text-sm text-emerald-950/55">
                  Konten terpublikasi
                </p>
              </div>
            </div>
          </div>

          {relatedKajian.length > 0 && (
            <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-emerald-950">
                Lanjut baca
              </h2>
              <div className="mt-4 space-y-3">
                {relatedKajian.map((related) => (
                  <Link
                    key={related.id}
                    href={`/kajian/${related.slug}`}
                    className="block rounded-2xl border border-emerald-950/10 p-3 transition hover:border-emerald-800/30 hover:bg-stone-50"
                  >
                    <p className="line-clamp-2 text-sm font-semibold leading-6 text-emerald-950">
                      {related.title}
                    </p>
                    {related.date && (
                      <p className="mt-2 text-xs text-emerald-950/55">
                        {format(new Date(related.date), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </article>

      <PublicFooter />
    </main>
  );
}
