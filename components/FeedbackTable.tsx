"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";

interface FeedbackItem {
  id: number;
  name: string;
  email: string | null;
  category: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackResponse {
  feedback: FeedbackItem[];
  stats: {
    total: number;
    new: number;
    reviewed: number;
  };
  pagination: {
    page: number;
    totalPages: number;
  };
}

const categoryLabels: Record<string, string> = {
  general: "Umum",
  bug: "Bug",
  idea: "Ide",
  content: "Konten",
};

export default function FeedbackTable() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, reviewed: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "30",
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
      });

      const res = await fetch(`/api/feedback?${params}`);

      if (!res.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = (await res.json()) as FeedbackResponse;
      setItems(data.feedback);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Fetch feedback error:", error);
      toast.error("Gagal memuat feedback");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const updateStatus = async (feedbackId: number, status: "new" | "reviewed") => {
    setUpdatingId(feedbackId);

    try {
      const res = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update feedback");
      }

      toast.success(
        status === "reviewed"
          ? "Feedback ditandai sudah dibaca"
          : "Feedback dikembalikan ke baru"
      );
      await fetchFeedback();
    } catch (error) {
      console.error("Update feedback error:", error);
      toast.error("Gagal memperbarui feedback");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteFeedback = async (feedbackId: number) => {
    if (!confirm("Yakin ingin menghapus feedback ini?")) return;

    setUpdatingId(feedbackId);

    try {
      const res = await fetch(`/api/feedback/${feedbackId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete feedback");
      }

      toast.success("Feedback dihapus");
      await fetchFeedback();
    } catch (error) {
      console.error("Delete feedback error:", error);
      toast.error("Gagal menghapus feedback");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
              <MessageSquare className="h-3.5 w-3.5" />
              Feedback
            </div>
            <h2 className="text-lg font-semibold text-emerald-950">
              Masukan Pengguna
            </h2>
            <p className="text-sm text-emerald-950/60">
              Semua feedback publik masuk ke ruang super admin.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-md border border-emerald-900/10 bg-[#fffaf0] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/55">
                Total
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-950">
                {stats.total}
              </p>
            </div>
            <div className="rounded-md border border-emerald-900/10 bg-[#fffaf0] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/55">
                Baru
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-950">
                {stats.new}
              </p>
            </div>
            <div className="rounded-md border border-emerald-900/10 bg-[#fffaf0] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/55">
                Dibaca
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-950">
                {stats.reviewed}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/35" />
            <input
              type="text"
              placeholder="Cari nama, email, atau isi feedback..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-emerald-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option value="">Semua status</option>
            <option value="new">Baru</option>
            <option value="reviewed">Dibaca</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option value="">Semua kategori</option>
            <option value="general">Umum</option>
            <option value="bug">Bug</option>
            <option value="idea">Ide</option>
            <option value="content">Konten</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white/85 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
            <span className="ml-2 text-sm text-emerald-950/65">
              Memuat feedback...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <Inbox className="mx-auto mb-4 h-12 w-12 text-emerald-800/25" />
            <p className="text-lg font-semibold text-emerald-950">
              Belum ada feedback
            </p>
            <p className="mt-1 text-sm text-emerald-950/60">
              Feedback publik akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-900/10">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 p-4 transition hover:bg-emerald-50/55 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                        item.status === "new"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.status === "new" ? "Baru" : "Dibaca"}
                    </span>
                    <span className="rounded-md bg-[#fffaf0] px-2 py-1 text-xs font-semibold text-emerald-900">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <p className="font-semibold text-emerald-950">
                      {item.name}
                    </p>
                    {item.email && (
                      <span className="inline-flex items-center gap-1 text-emerald-950/60">
                        <Mail className="h-3.5 w-3.5" />
                        {item.email}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-emerald-950/60">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-emerald-950/75">
                    {item.message}
                  </p>
                </div>

                <div className="flex gap-2 lg:flex-col lg:justify-center">
                  {item.status === "new" ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, "reviewed")}
                      disabled={updatingId === item.id}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-emerald-900/15 bg-white px-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Dibaca
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, "new")}
                      disabled={updatingId === item.id}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-emerald-900/15 bg-white px-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Baru
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteFeedback(item.id)}
                    disabled={updatingId === item.id}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-red-900/15 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {!loading && items.length > 0 && (
        <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-emerald-950/65">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
