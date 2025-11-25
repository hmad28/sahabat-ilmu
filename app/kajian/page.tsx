"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  User,
  Search,
  Loader2,
  BookOpen,
  Filter,
  X,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export default function KajianListPage() {
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [filteredList, setFilteredList] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchKajian();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(kajianList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = kajianList.filter((kajian) => {
        switch (searchFilter) {
          case "title":
            return kajian.title.toLowerCase().includes(query);
          case "ustadz":
            return kajian.ustadz?.toLowerCase().includes(query);
          case "author":
            return kajian.author?.name.toLowerCase().includes(query);
          case "all":
          default:
            return (
              kajian.title.toLowerCase().includes(query) ||
              kajian.excerpt.toLowerCase().includes(query) ||
              kajian.ustadz?.toLowerCase().includes(query) ||
              kajian.author?.name.toLowerCase().includes(query)
            );
        }
      });
      setFilteredList(filtered);
    }
  }, [searchQuery, searchFilter, kajianList]);

  const fetchKajian = async () => {
    try {
      const res = await fetch("/api/kajian?status=published");
      const data = await res.json();
      setKajianList(data);
      setFilteredList(data);
    } catch (error) {
      console.error("Error fetching kajian:", error);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getFilterLabel = (filter: SearchFilter) => {
    switch (filter) {
      case "all":
        return "Semua";
      case "title":
        return "Judul";
      case "ustadz":
        return "Ustadz";
      case "author":
        return "Penulis";
      default:
        return "Semua";
    }
  };

  const getPlaceholder = () => {
    switch (searchFilter) {
      case "title":
        return "Cari berdasarkan judul kajian...";
      case "ustadz":
        return "Cari berdasarkan nama ustadz...";
      case "author":
        return "Cari berdasarkan nama penulis...";
      case "all":
      default:
        return "Cari kajian berdasarkan judul, ustadz, penulis, atau topik...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - CLEANED UP VERSION */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>

            <div className="flex items-center gap-2">
              {!session ? (
                <Link
                  href="/register"
                  className="bg-white text-emerald-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Daftar Jadi Penulis</span>
                  <span className="sm:hidden">Daftar</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="bg-white text-emerald-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-all flex items-center gap-2 shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Menu</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-10 h-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Semua Kajian</h1>
              <p className="text-emerald-50 text-sm md:text-base mt-1">
                Jelajahi koleksi kajian Islam kami
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar with Filter */}
        <div className="mb-6">
          <div className="max-w-3xl">
            <div className="relative flex gap-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={getPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    searchFilter !== "all"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">
                    {getFilterLabel(searchFilter)}
                  </span>
                </button>

                {/* Filter Dropdown */}
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                    <div className="p-2">
                      {(
                        ["all", "title", "ustadz", "author"] as SearchFilter[]
                      ).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSearchFilter(filter);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            searchFilter === filter
                              ? "bg-emerald-100 text-emerald-700 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {getFilterLabel(filter)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Filter Badge */}
            {searchFilter !== "all" && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {getFilterLabel(searchFilter)}
                  <button
                    onClick={() => setSearchFilter("all")}
                    className="hover:bg-emerald-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-gray-600 mt-3">
              {searchQuery ? (
                <>
                  Ditemukan <strong>{filteredList.length}</strong> kajian dari{" "}
                  <strong>{kajianList.length}</strong> total kajian
                </>
              ) : (
                <>
                  Total <strong>{filteredList.length}</strong> kajian
                </>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Memuat kajian...</p>
            </div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery
                ? "Tidak ada hasil ditemukan"
                : "Belum ada kajian tersedia"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `Tidak ada kajian yang cocok dengan "${searchQuery}" di kategori ${getFilterLabel(
                    searchFilter
                  ).toLowerCase()}`
                : "Kajian akan segera ditambahkan"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchFilter("all");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((kajian) => (
              <Link
                key={kajian.id}
                href={`/kajian/${kajian.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {kajian.coverImage && (
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={kajian.coverImage}
                      alt={kajian.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {kajian.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {stripHtml(kajian.excerpt)}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    {kajian.ustadz && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="truncate">{kajian.ustadz}</span>
                      </div>
                    )}
                    {kajian.author && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="truncate">
                          Penulis: {kajian.author.name}
                        </span>
                      </div>
                    )}
                    {kajian.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="truncate">{kajian.location}</span>
                      </div>
                    )}
                    {kajian.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>
                          {format(new Date(kajian.date), "dd MMMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close filter menu */}
      {showFilterMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowFilterMenu(false)}
        />
      )}
    </div>
  );
}
