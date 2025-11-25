"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Loader2,
  Share2,
  Menu,
  X,
  BookOpen,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import KajianSidebar from "@/components/KajianSidebar";

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

export default function KajianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [kajian, setKajian] = useState<Kajian | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedKajian, setRelatedKajian] = useState<Kajian[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchKajian();
      fetchRelatedKajian();
    }
  }, [slug]);

  const fetchKajian = async () => {
    try {
      const res = await fetch(`/api/kajian/slug/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Kajian tidak ditemukan");
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setKajian(data);
    } catch (error) {
      console.error("Error fetching kajian:", error);
      toast.error("Gagal memuat kajian");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedKajian = async () => {
    try {
      const res = await fetch("/api/kajian?status=published");
      const data = await res.json();
      // Get 3 random related kajian
      const filtered = data.filter((k: Kajian) => k.slug !== slug);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      setRelatedKajian(shuffled.slice(0, 3));
    } catch (error) {
      console.error("Error fetching related kajian:", error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: kajian?.title,
          text: kajian?.excerpt,
          url: url,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Link berhasil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-sm md:text-base text-gray-600">Memuat kajian...</p>
        </div>
      </div>
    );
  }

  if (!kajian) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Kajian tidak ditemukan
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-sm md:text-base text-emerald-600 hover:text-emerald-700"
          >
            Kembali ke beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

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
                onClick={handleShare}
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm md:text-base"
              >
                <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="font-medium hidden sm:inline">Bagikan</span>
              </button>

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

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Article Content */}
        <div className="flex-1 overflow-y-auto">
          <article className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
            {/* Cover Image */}
            {kajian.coverImage && (
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full mb-4 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={kajian.coverImage}
                  alt={kajian.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Title & Meta */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-4 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                {kajian.title}
              </h1>

              <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mb-4 md:mb-6 pb-4 md:pb-6 border-b">
                {kajian.ustadz && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{kajian.ustadz}</span>
                  </div>
                )}

                {kajian.location && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 flex-shrink-0" />
                    <span className="line-clamp-1">{kajian.location}</span>
                  </div>
                )}
                {kajian.date && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 flex-shrink-0" />
                    <span>
                      {format(new Date(kajian.date), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 md:p-4 rounded-r-lg mb-4 md:mb-6">
                <p className="text-sm md:text-base text-gray-700 leading-relaxed italic">
                  {kajian.excerpt}
                </p>
              </div>

              {/* Content */}
              <div
                className="prose prose-sm sm:prose-base md:prose-lg max-w-none kajian-content"
                dangerouslySetInnerHTML={{ __html: kajian.content }}
              />

              <span className="flex justify-start items-center gap-2 text-sm md:text-base text-gray-700">
                Baarakallahu Fiikum
                <Heart className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-red-600" />
              </span>

              {/* Author */}
              <div className="w-full flex justify-start border-t-1 border-gray-200 pt-4 mt-4">
                {kajian.author && (
                  <div className="flex justify-start items-center rounded-xl py-1 px-3 gap-1.5 md:gap-2 bg-emerald-600 text-xs md:text-sm">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                    <span className="font-medium">
                      Oleh: {kajian.author.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            {kajian.gallery && kajian.gallery.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 mb-4 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 md:h-8 bg-emerald-600 rounded"></span>
                  Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {kajian.gallery.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                    >
                      <Image
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Kajian */}
            {relatedKajian.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 md:h-8 bg-emerald-600 rounded"></span>
                  Kajian Terkait
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {relatedKajian.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => router.push(`/kajian/${related.slug}`)}
                      className="cursor-pointer group hover:shadow-lg transition-all rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-200"
                    >
                      {related.coverImage && (
                        <div className="relative h-36 sm:h-40 w-full bg-gray-200">
                          <Image
                            src={related.coverImage}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-3 md:p-4">
                        <h3 className="font-bold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                          {related.excerpt}
                        </p>
                        {related.date && (
                          <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 mt-2">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(related.date), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Sidebar Kajian - Desktop */}
        <div className="hidden lg:flex justify-center items-start border-l bg-gray-50 p-4 overflow-y-auto md:w-88.5 2xl:w-100">
          <KajianSidebar />
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
              <div className="flex-1 overflow-y-auto p-4">
                <KajianSidebar />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
