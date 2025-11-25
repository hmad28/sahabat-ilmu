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
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

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
}

export default function KajianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [kajian, setKajian] = useState<Kajian | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedKajian, setRelatedKajian] = useState<Kajian[]>([]);

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
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat kajian...</p>
        </div>
      </div>
    );
  }

  if (!kajian) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Kajian tidak ditemukan
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Kembali ke beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image */}
        {kajian.coverImage && (
          <div className="relative h-96 w-full mb-8 rounded-2xl overflow-hidden shadow-lg">
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
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {kajian.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            {kajian.ustadz && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{kajian.ustadz}</span>
              </div>
            )}
            {kajian.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>{kajian.location}</span>
              </div>
            )}
            {kajian.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>
                  {format(new Date(kajian.date), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg mb-6">
            <p className="text-gray-700 leading-relaxed italic">
              {kajian.excerpt}
            </p>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-800 prose-p:leading-relaxed
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-em:text-gray-800
              prose-ul:text-gray-800 prose-ol:text-gray-800
              prose-li:text-gray-800 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-600 
              prose-blockquote:bg-emerald-50 prose-blockquote:text-gray-800
              prose-blockquote:py-2 prose-blockquote:px-4
              prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: kajian.content }}
          />
        </div>

        {/* Gallery */}
        {kajian.gallery && kajian.gallery.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-emerald-600 rounded"></span>
              Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kajian.gallery.map((url, i) => (
                <div
                  key={i}
                  className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-emerald-600 rounded"></span>
              Kajian Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedKajian.map((related) => (
                <div
                  key={related.id}
                  onClick={() => router.push(`/kajian/${related.slug}`)}
                  className="cursor-pointer group hover:shadow-lg transition-all rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-200"
                >
                  {related.coverImage && (
                    <div className="relative h-40 w-full bg-gray-200">
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {related.excerpt}
                    </p>
                    {related.date && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
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
  );
}
