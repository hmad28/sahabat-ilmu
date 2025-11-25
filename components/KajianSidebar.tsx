// components/KajianSidebar.tsx

"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

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
}

export default function KajianSidebar() {
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKajian();
  }, []);

  const fetchKajian = async () => {
    try {
      const res = await fetch("/api/kajian?status=published");
      const data = await res.json();
      setKajianList(data.slice(0, 6)); // Show latest 6
    } catch (error) {
      console.error("Error fetching kajian:", error);
    } finally {
      setLoading(false);
    }
  };

  // Strip HTML tags from content
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <BookOpen className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-lg text-gray-900">Kajian Terbaru</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : kajianList.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">
          Belum ada kajian tersedia
        </p>
      ) : (
        <div className="space-y-3">
          {kajianList.map((kajian) => (
            <Link
              key={kajian.id}
              href={`/kajian/${kajian.slug}`}
              className="block group hover:bg-gray-50 p-3 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
            >
              {kajian.coverImage && (
                <div className="relative h-32 w-full mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={kajian.coverImage}
                    alt={kajian.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                {kajian.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {stripHtml(kajian.excerpt)}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {kajian.ustadz && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">
                        {kajian.ustadz}
                      </span>
                    </div>
                  )}
                  
                  {kajian.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(kajian.date), "dd MMM", {
                        locale: id,
                      })}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View All Button */}
      {kajianList.length > 0 && (
        <Link
          href="/kajian"
          className="block mt-4 pt-4 border-t text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Lihat Semua Kajian →
        </Link>
      )}
    </div>
  );
}
