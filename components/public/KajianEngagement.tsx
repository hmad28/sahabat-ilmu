"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Heart, Loader2, MessageSquare, Send, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";

interface CommentItem {
  id: number;
  name: string;
  content: string;
  createdAt: string;
}

interface EngagementResponse {
  likeCount: number;
  liked: boolean;
  comments: CommentItem[];
}

interface KajianEngagementProps {
  kajianId: number;
}

export default function KajianEngagement({ kajianId }: KajianEngagementProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    website: "",
  });

  const fetchEngagement = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/kajian/${kajianId}/engagement`);

      if (!res.ok) {
        throw new Error("Failed to fetch engagement");
      }

      const data = (await res.json()) as EngagementResponse;
      setLikeCount(data.likeCount);
      setLiked(data.liked);
      setComments(data.comments);
    } catch (error) {
      console.error("Fetch engagement error:", error);
    } finally {
      setLoading(false);
    }
  }, [kajianId]);

  useEffect(() => {
    fetchEngagement();
  }, [fetchEngagement]);

  const handleLike = async () => {
    setLiking(true);

    try {
      const res = await fetch(`/api/kajian/${kajianId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to save like");
      }

      const data = (await res.json()) as Pick<
        EngagementResponse,
        "liked" | "likeCount"
      >;
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Gagal menyimpan like");
    } finally {
      setLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/kajian/${kajianId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim komentar");
      }

      toast.success("Komentar terkirim");
      setFormData({
        name: "",
        content: "",
        website: "",
      });
      await fetchEngagement();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim komentar"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-6 rounded-lg border border-emerald-950/10 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 border-b border-emerald-950/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
            <MessageSquare className="h-3.5 w-3.5" />
            Diskusi
          </p>
          <h2 className="text-2xl font-semibold text-emerald-950">
            Komentar dan Like
          </h2>
          <p className="mt-1 text-sm leading-6 text-emerald-950/60">
            Tulis komentar dengan nama saja. Jaga adab dan tetap merujuk ke
            sumber belajar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          aria-pressed={liked}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
            liked
              ? "bg-red-700 text-white hover:bg-red-800"
              : "border border-emerald-950/15 bg-[#fffaf0] text-emerald-950 hover:bg-emerald-50"
          }`}
        >
          {liking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          )}
          {likeCount} Suka
        </button>
      </div>

      <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-emerald-950">
            Nama <span className="text-red-600">*</span>
          </label>
          <input
            required
            minLength={2}
            maxLength={100}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
            placeholder="Nama kamu"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-emerald-950">
            Komentar <span className="text-red-600">*</span>
          </label>
          <textarea
            required
            minLength={3}
            maxLength={1000}
            rows={4}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full resize-none rounded-md border border-emerald-950/15 bg-[#fffaf0] px-3 py-2.5 text-sm leading-7 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
            placeholder="Tulis komentar..."
          />
        </div>

        <input
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          className="hidden"
          aria-hidden="true"
        />

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400 sm:w-auto"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Kirim komentar
        </button>
      </form>

      <div className="mt-7 border-t border-emerald-950/10 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-emerald-950">
            {comments.length} Komentar
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center py-8 text-sm text-emerald-950/60">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-800" />
            Memuat komentar...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-md border border-dashed border-emerald-950/15 bg-[#fffaf0] p-5 text-sm leading-6 text-emerald-950/60">
            Belum ada komentar. Jadilah yang pertama memberi tanggapan.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-md border border-emerald-950/10 bg-[#fffaf0] p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-950">
                    <User className="h-3.5 w-3.5" />
                    {comment.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-950/55">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-emerald-950/75">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
