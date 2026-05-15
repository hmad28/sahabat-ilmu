"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Filter,
  Loader2,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";
import SourceNotice from "@/components/public/SourceNotice";
import EmptyState from "@/components/public/EmptyState";

interface Kajian {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  ustadz: string | null;
  location: string | null;
  date: string | null;
  category: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

type SearchFilter = "all" | "title" | "ustadz" | "author";

const tracks = [
  "Dalil ibadah",
  "Aqidah dan tauhid",
  "Adab dan akhlak",
  "Tanya jawab hukum",
];

function stripHtml(html: string) {
  if (typeof document === "undefined") return html;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

function getFilterLabel(filter: SearchFilter) {
  switch (filter) {
    case "title":
      return "Judul";
    case "ustadz":
      return "Ustadz";
    case "author":
      return "Penulis";
    default:
      return "Semua";
  }
}

export default function KajianListPage() {
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    async function fetchKajian() {
      try {
        const response = await fetch("/api/kajian?status=published");
        const data = await response.json();
        setKajianList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching kajian:", error);
        setKajianList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchKajian();
  }, []);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return kajianList;
    const query = searchQuery.toLowerCase();

    return kajianList.filter((kajian) => {
      const excerpt = stripHtml(kajian.excerpt).toLowerCase();
      switch (searchFilter) {
        case "title":
          return kajian.title.toLowerCase().includes(query);
        case "ustadz":
          return kajian.ustadz?.toLowerCase().includes(query);
        case "author":
          return kajian.author?.name.toLowerCase().includes(query);
        default:
          return (
            kajian.title.toLowerCase().includes(query) ||
            excerpt.includes(query) ||
            kajian.ustadz?.toLowerCase().includes(query) ||
            kajian.author?.name.toLowerCase().includes(query)
          );
      }
    });
  }, [kajianList, searchFilter, searchQuery]);

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <PublicNav />

      <section className="border-b border-emerald-950/10 bg-[#f7f1df]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                Perpustakaan rujukan
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-emerald-950 md:text-6xl">
                Cari kajian, ustadz, atau topik yang ingin dirujuk.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-950/70">
                Halaman ini membantu menemukan konten berdasarkan judul,
                ustadz, penulis, atau topik. Untuk hukum, dalil, dan
                kesimpulan, tetap utamakan sumber rujukan asli.
              </p>
            </div>
            <SourceNotice compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-8 grid gap-3 md:grid-cols-4">
          {tracks.map((track, index) => (
            <div
              key={track}
              className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                Topik {index + 1}
              </p>
              <p className="mt-3 font-semibold text-emerald-950">{track}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-3xl border border-emerald-950/10 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/40" />
              <input
                type="text"
                placeholder="Cari judul, ustadz, penulis, atau topik..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-2xl border border-emerald-950/10 bg-stone-50 py-3 pl-12 pr-12 text-sm text-emerald-950 outline-none transition placeholder:text-emerald-950/40 focus:border-emerald-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/50"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterMenu((value) => !value)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-950/10 bg-stone-50 px-5 py-3 text-sm font-semibold text-emerald-950 md:w-auto"
              >
                <Filter className="h-4 w-4" />
                {getFilterLabel(searchFilter)}
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-emerald-950/10 bg-white p-2 shadow-xl">
                  {(["all", "title", "ustadz", "author"] as SearchFilter[]).map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setSearchFilter(filter);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full rounded-xl px-4 py-2 text-left text-sm font-semibold transition ${
                          searchFilter === filter
                            ? "bg-emerald-950 text-white"
                            : "text-emerald-950 hover:bg-stone-50"
                        }`}
                      >
                        {getFilterLabel(filter)}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-emerald-950/60">
            Menampilkan <strong>{filteredList.length}</strong> dari{" "}
            <strong>{kajianList.length}</strong> kajian.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-emerald-950/70">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-emerald-800" />
            Memuat kajian...
          </div>
        ) : filteredList.length === 0 ? (
          <EmptyState
            title={searchQuery ? "Tidak ada hasil" : "Belum ada kajian"}
            description={
              searchQuery
                ? "Coba kata kunci lain atau hapus filter untuk melihat semua konten."
                : "Konten yang dipublikasikan akan muncul di sini."
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((kajian) => (
              <Link
                key={kajian.id}
                href={`/kajian/${kajian.slug}`}
                className="group overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 bg-emerald-950/10">
                  {kajian.coverImage ? (
                    <Image
                      src={kajian.coverImage}
                      alt={kajian.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-12 w-12 text-emerald-900/35" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                      {kajian.category || "kajian"}
                    </span>
                    {kajian.date && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(kajian.date), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </span>
                    )}
                  </div>

                  <h2 className="line-clamp-2 text-xl font-semibold leading-snug text-emerald-950 group-hover:text-emerald-800">
                    {kajian.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-emerald-950/65">
                    {stripHtml(kajian.excerpt)}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-emerald-950/60">
                    {kajian.ustadz && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-800" />
                        <span className="truncate">{kajian.ustadz}</span>
                      </div>
                    )}
                    {kajian.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-800" />
                        <span className="truncate">{kajian.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </main>
  );
}
