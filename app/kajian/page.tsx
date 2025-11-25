"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  User,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

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
}

export default function KajianListPage() {
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [filteredList, setFilteredList] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchKajian();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(kajianList);
    } else {
      const filtered = kajianList.filter(
        (kajian) =>
          kajian.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kajian.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kajian.ustadz?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, kajianList]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Semua Kajian</h1>
          </div>
          <p className="text-emerald-50 text-lg">
            Jelajahi koleksi kajian Islam kami
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kajian berdasarkan judul, ustadz, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ditemukan {filteredList.length} kajian
          </p>
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
            <p className="text-gray-600">
              {searchQuery
                ? "Coba kata kunci yang berbeda"
                : "Kajian akan segera ditambahkan"}
            </p>
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
    </div>
  );
}
