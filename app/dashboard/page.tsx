// app/dashboard/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  BookOpen,
  Loader2,
  X,
  FileText,
  LogOut,
  Shield,
  Eye,
  Crown,
  Users,
  Settings,
  Lock,
  History,
  MessageSquare,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import mammoth from "mammoth";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";
import AdminTable from "@/components/AdminTable";
import ActivityLogs from "@/components/ActivityLogs";
import FeedbackTable from "@/components/FeedbackTable";
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
  status: string;
  createdAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingKajian, setEditingKajian] = useState<Kajian | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "kajian" | "feedback" | "admins" | "logs"
  >("kajian");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    gallery: [] as string[],
    ustadz: "",
    location: "",
    date: "",
    category: "kajian",
    status: "published",
  });

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize UploadThing hook
  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("Upload completed:", res);
      },
      onUploadError: (error) => {
        console.error("Upload error:", error);
        alert("Gagal upload gambar: " + error.message);
      },
    }
  );

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const hasPassword = session?.user?.hasPassword ?? true;

  useEffect(() => {
    if (status === "authenticated") {
      fetchKajian();
      setProfileData({
        name: session?.user?.name || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [status, session?.user?.name]);

  const fetchKajian = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("/api/kajian?status=all");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setKajianList(data);
      } else {
        setKajianList([]);
        toast.error("Format data tidak valid");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setKajianList([]);
      toast.error("Gagal memuat data kajian");
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!profileData.name.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        toast.error("Password baru minimal 6 karakter");
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
        return;
      }
      if (hasPassword && !profileData.currentPassword) {
        toast.error("Masukkan password lama untuk mengubah password");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          currentPassword: profileData.currentPassword || undefined,
          newPassword: profileData.newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);

        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: profileData.name,
            hasPassword: profileData.newPassword
              ? true
              : session?.user?.hasPassword,
          },
        });

        setShowProfileModal(false);
        setProfileData({
          name: profileData.name,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk upload gambar
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "gallery"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      // Validate file size (max 4MB per file)
      const maxSize = 4 * 1024 * 1024; // 4MB
      const oversizedFiles = Array.from(files).filter(
        (file) => file.size > maxSize
      );

      if (oversizedFiles.length > 0) {
        alert(
          `File terlalu besar: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}. Maksimal 4MB per file.`
        );
        setIsUploading(false);
        return;
      }

      // Upload files using UploadThing
      const uploadedFiles = await startUpload(Array.from(files));

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("Upload gagal, tidak ada file yang ter-upload");
      }

      // Update form data based on upload type
      if (type === "cover") {
        setFormData({
          ...formData,
          coverImage: uploadedFiles[0].url,
        });
        alert("Cover image berhasil di-upload!");
      } else if (type === "gallery") {
        setFormData({
          ...formData,
          gallery: [...formData.gallery, ...uploadedFiles.map((f) => f.url)],
        });
        alert(`${uploadedFiles.length} gambar berhasil di-upload!`);
      }

      // Reset input
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal upload gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocxImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      toast.error("Hanya file .docx yang didukung");
      return;
    }

    try {
      toast.loading("Memproses file DOCX...");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (result.value) {
        setFormData({ ...formData, content: result.value });
        toast.dismiss();
        toast.success("File DOCX berhasil diimport!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("DOCX import error:", error);
      toast.error("Gagal mengimport file DOCX");
    }
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        coverImage: formData.coverImage || null,
        ustadz: formData.ustadz.trim() || null,
        location: formData.location.trim() || null,
        date: formData.date || null,
      };

      const url = editingKajian
        ? `/api/kajian/${editingKajian.id}`
        : "/api/kajian";
      const method = editingKajian ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingKajian
            ? "Kajian berhasil diupdate!"
            : "Kajian berhasil ditambahkan!"
        );
        setShowModal(false);
        resetForm();
        fetchKajian();
      } else {
        throw new Error(data.details || data.error || "Failed to save");
      }
    } catch (error: unknown) {
      console.error("Submit error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Gagal menyimpan kajian: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kajian: Kajian) => {
    if (!isSuperAdmin && kajian.authorId !== session?.user?.id) {
      toast.error("Anda tidak memiliki akses untuk mengedit kajian ini");
      return;
    }

    setEditingKajian(kajian);
    setFormData({
      title: kajian.title,
      excerpt: kajian.excerpt,
      content: kajian.content,
      coverImage: kajian.coverImage || "",
      gallery: kajian.gallery || [],
      ustadz: kajian.ustadz || "",
      location: kajian.location || "",
      date: kajian.date ? kajian.date.split("T")[0] : "",
      category: kajian.category,
      status: kajian.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (kajian: Kajian) => {
    if (!isSuperAdmin && kajian.authorId !== session?.user?.id) {
      toast.error("Anda tidak memiliki akses untuk menghapus kajian ini");
      return;
    }

    if (!confirm("Yakin ingin menghapus kajian ini?")) return;

    try {
      const res = await fetch(`/api/kajian/${kajian.id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Kajian dihapus!");
        fetchKajian();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus kajian");
      }
    } catch {
      toast.error("Gagal menghapus kajian");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      gallery: [],
      ustadz: "",
      location: "",
      date: "",
      category: "kajian",
      status: "published",
    });
    setEditingKajian(null);
  };

  const stripHtml = (html: string) => {
    if (typeof document === "undefined") {
      return html.replace(/<[^>]*>/g, "");
    }

    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const filteredKajianList = isSuperAdmin
    ? kajianList
    : kajianList.filter((k) => k.authorId === session?.user?.id);

  const publishedCount = filteredKajianList.filter(
    (k) => k.status === "published"
  ).length;
  const draftCount = filteredKajianList.filter(
    (k) => k.status === "draft"
  ).length;
  const latestKajian = filteredKajianList[0];

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <Toaster position="top-right" />

      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#fffaf0]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/sahabat-ilmu-horizontal2.png"
              alt="Sahabat Ilmu"
              width={190}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-900/15 bg-white/70 px-3 text-sm font-semibold text-emerald-900 transition hover:bg-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-red-900/15 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="border-b border-emerald-900/10 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-amber-500/30 bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-900">
                  Admin Workspace
                </span>
                {isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-700/20 bg-emerald-900 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
                    <Crown className="h-3.5 w-3.5" />
                    Super Admin
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
                Dashboard Kajian
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-950/70">
                Kelola artikel kajian, status publikasi, admin, dan aktivitas
                sistem dari satu ruang kerja yang rapi.
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-900">
                Masuk sebagai {session?.user?.name}
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-900 px-4 text-sm font-bold text-amber-50 shadow-sm transition hover:bg-emerald-800"
            >
              <Plus className="h-4 w-4" />
              Tambah Kajian
            </button>
          </div>

          {isSuperAdmin && (
            <div className="mt-6 overflow-x-auto">
              <nav className="inline-flex rounded-lg border border-emerald-900/10 bg-white/70 p-1">
                <button
                  onClick={() => setActiveTab("kajian")}
                  className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    activeTab === "kajian"
                      ? "bg-emerald-900 text-amber-50"
                      : "text-emerald-950/70 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Kelola Kajian
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    activeTab === "feedback"
                      ? "bg-emerald-900 text-amber-50"
                      : "text-emerald-950/70 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </button>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    activeTab === "admins"
                      ? "bg-emerald-900 text-amber-50"
                      : "text-emerald-950/70 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Daftar Admin
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                    activeTab === "logs"
                      ? "bg-emerald-900 text-amber-50"
                      : "text-emerald-950/70 hover:bg-emerald-50 hover:text-emerald-950"
                  }`}
                >
                  <History className="h-4 w-4" />
                  Log Aktivitas
                </button>
              </nav>
            </div>
          )}
        </section>

        <div className="py-6">
          {activeTab === "kajian" ? (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                        Total Kajian
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-950">
                        {filteredKajianList.length}
                      </p>
                    </div>
                    <BookOpen className="h-10 w-10 text-emerald-800/20" />
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                        Terbit
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-950">
                        {publishedCount}
                      </p>
                    </div>
                    <Shield className="h-10 w-10 text-emerald-800/20" />
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                        Draft
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-950">
                        {draftCount}
                      </p>
                    </div>
                    <FileText className="h-10 w-10 text-emerald-800/20" />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
                <section className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white/85 shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-emerald-900/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-emerald-950">
                        Daftar Kajian
                      </h2>
                      <p className="text-sm text-emerald-950/60">
                        Edit cepat, cek status, dan rapikan materi sebelum
                        tampil di publik.
                      </p>
                    </div>
                    <span className="rounded-md bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
                      {filteredKajianList.length} item
                    </span>
                  </div>

                  {isLoadingList ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
                      <span className="ml-2 text-sm text-emerald-950/65">
                        Memuat data...
                      </span>
                    </div>
                  ) : filteredKajianList.length === 0 ? (
                    <div className="px-4 py-14 text-center">
                      <BookOpen className="mx-auto mb-4 h-12 w-12 text-emerald-800/25" />
                      <p className="text-lg font-semibold text-emerald-950">
                        Belum ada kajian
                      </p>
                      <p className="mt-1 text-sm text-emerald-950/60">
                        Klik Tambah Kajian untuk membuat konten pertama.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-emerald-900/10">
                      {filteredKajianList.map((kajian) => {
                        const isOwner = kajian.authorId === session?.user?.id;
                        const canEdit = isSuperAdmin || isOwner;

                        return (
                          <article
                            key={kajian.id}
                            className="grid gap-4 px-4 py-4 transition hover:bg-emerald-50/55 md:grid-cols-[108px_1fr_auto]"
                          >
                            <div className="relative h-24 overflow-hidden rounded-md border border-emerald-900/10 bg-emerald-950/5 md:h-20">
                              {kajian.coverImage ? (
                                <Image
                                  src={kajian.coverImage}
                                  alt={kajian.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-emerald-800/25" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
                                    kajian.status === "published"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-stone-100 text-stone-700"
                                  }`}
                                >
                                  {kajian.status}
                                </span>
                                {!isOwner && isSuperAdmin && (
                                  <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                                    {kajian.author.name}
                                  </span>
                                )}
                              </div>
                              <h3 className="line-clamp-2 text-base font-semibold text-emerald-950">
                                {kajian.title}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-sm leading-6 text-emerald-950/65">
                                {stripHtml(kajian.excerpt)}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-950/60">
                                {kajian.ustadz && (
                                  <span className="inline-flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    {kajian.ustadz}
                                  </span>
                                )}
                                {kajian.location && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {kajian.location}
                                  </span>
                                )}
                                {kajian.date && (
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {format(
                                      new Date(kajian.date),
                                      "dd MMMM yyyy",
                                      {
                                        locale: id,
                                      }
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 md:flex-col md:justify-center">
                              <button
                                onClick={() => handleEdit(kajian)}
                                disabled={!canEdit}
                                className={`inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition md:flex-none ${
                                  canEdit
                                    ? "border border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50"
                                    : "cursor-not-allowed bg-stone-100 text-stone-400"
                                }`}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(kajian)}
                                disabled={!canEdit}
                                className={`inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition md:flex-none ${
                                  canEdit
                                    ? "border border-red-900/15 bg-red-50 text-red-700 hover:bg-red-100"
                                    : "cursor-not-allowed bg-stone-100 text-stone-400"
                                }`}
                              >
                                <Trash2 className="h-4 w-4" />
                                Hapus
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>

                <aside className="h-fit rounded-lg border border-emerald-900/10 bg-emerald-950 p-5 text-amber-50 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/80">
                    Fokus Hari Ini
                  </p>
                  <h2 className="mt-3 text-xl font-semibold">
                    Rapikan materi sebelum publikasi
                  </h2>
                  <div className="mt-5 space-y-4 text-sm text-amber-50/75">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                      <p>Pastikan judul jelas dan ringkasan singkat.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                      <p>Gunakan status draft jika konten belum siap tampil.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                      <p>Tambahkan cover agar halaman kajian terlihat rapi.</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-md border border-amber-100/15 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                      Terakhir
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-amber-50">
                      {latestKajian?.title || "Belum ada kajian"}
                    </p>
                  </div>
                </aside>
              </div>
            </>
          ) : activeTab === "feedback" ? (
            <FeedbackTable />
          ) : activeTab === "admins" ? (
            <AdminTable />
          ) : (
            <ActivityLogs />
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-emerald-950/70 p-3 backdrop-blur-sm sm:p-4">
          <div className="my-4 flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-emerald-900/15 bg-[#fffaf0] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 bg-white/70 p-5">
              <div>
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-900 text-amber-50">
                  <Settings className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-semibold text-emerald-950">
                  Edit Profil
                </h2>
                <p className="mt-1 text-sm text-emerald-950/65">
                  Perbarui nama akun dan password admin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setProfileData({
                    name: session?.user?.name || "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-emerald-900/10 bg-white text-emerald-950 transition hover:bg-emerald-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="flex-1 space-y-5 overflow-y-auto p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-emerald-950">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div className="border-t border-emerald-900/10 pt-5">
                <div className="mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 flex-shrink-0 text-emerald-800" />
                  <h3 className="text-sm font-semibold text-emerald-950">
                    {hasPassword ? "Ubah Password" : "Buat Password"}
                  </h3>
                  <span className="text-xs text-emerald-950/50">
                    (opsional)
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          currentPassword: e.target.value,
                        })
                      }
                      disabled={!hasPassword}
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                      placeholder={
                        hasPassword
                          ? "Masukkan password lama"
                          : "Belum ada password di akun ini"
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                      placeholder="Minimal 6 karakter"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                      placeholder="Ketik ulang password baru"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-emerald-900/10 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileData({
                      name: session?.user?.name || "",
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:flex-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-emerald-900 px-4 py-2.5 text-sm font-bold text-amber-50 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400 sm:flex-1"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/75 p-2 backdrop-blur-sm sm:p-4">
          <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-emerald-900/15 bg-[#fffaf0] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 bg-white/80 p-4 sm:p-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
                  Editor Kajian
                </p>
                <h2 className="text-2xl font-semibold text-emerald-950">
                  {editingKajian ? "Edit Kajian" : "Tambah Kajian Baru"}
                </h2>
                <p className="mt-1 text-sm text-emerald-950/65">
                  Isi konten utama, atur status, lalu simpan perubahan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-emerald-900/10 bg-white text-emerald-950 transition hover:bg-emerald-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6 p-4 sm:p-6">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-emerald-900/10 pb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-900 text-amber-50">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-950">
                          Informasi Utama
                        </h3>
                        <p className="text-sm text-emerald-950/60">
                          Judul, ringkasan, dan isi lengkap kajian.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-emerald-950">
                        Judul Kajian <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                        placeholder="Contoh: Kajian Tafsir Surat Al-Fatihah"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-emerald-950">
                        Ringkasan Singkat{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            excerpt: e.target.value,
                          })
                        }
                        className="w-full resize-none rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm leading-6 text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                        placeholder="Ringkasan singkat untuk halaman kajian."
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <label className="block text-sm font-semibold text-emerald-950">
                          Konten Lengkap{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-emerald-900/10 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50">
                          <FileText className="h-3.5 w-3.5" />
                          Import DOCX
                          <input
                            type="file"
                            accept=".docx"
                            onChange={handleDocxImport}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) =>
                          setFormData({ ...formData, content })
                        }
                      />
                    </div>
                  </section>
                </div>

                <aside className="space-y-6 border-t border-emerald-900/10 bg-white/60 p-4 sm:p-6 lg:border-l lg:border-t-0">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-emerald-900/10 pb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 text-amber-900">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-950">
                          Detail Publikasi
                        </h3>
                        <p className="text-sm text-emerald-950/60">
                          Pemateri, lokasi, tanggal, dan status.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-950">
                      Ustadz/Pemateri
                    </label>
                    <input
                      type="text"
                      value={formData.ustadz}
                      onChange={(e) =>
                        setFormData({ ...formData, ustadz: e.target.value })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                      placeholder="Ustadz Firanda Andirja"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-950">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                      placeholder="Masjid Istiqlal, Jakarta"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-950">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-emerald-950">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-emerald-900/10 pb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-900">
                        <Eye className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-950">
                          Media
                        </h3>
                        <p className="text-sm text-emerald-950/60">
                          Cover dan galeri pendukung.
                        </p>
                      </div>
                    </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-emerald-950">
                    Cover Image
                  </label>
                  <div className="rounded-md border border-dashed border-emerald-900/20 bg-[#fffaf0] p-4 transition hover:border-emerald-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="w-full text-sm text-emerald-950 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-emerald-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-50 hover:file:bg-emerald-800"
                      disabled={isUploading || isUploadThingUploading}
                    />
                    <p className="mt-2 text-xs text-emerald-950/55">
                      Recommended: 1200x630px, Max 4MB
                    </p>
                  </div>
                  {formData.coverImage && (
                    <div className="relative mt-3 h-40 w-full overflow-hidden rounded-md border border-emerald-900/15">
                      <Image
                        src={formData.coverImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, coverImage: "" })
                        }
                        className="absolute right-2 top-2 rounded-md bg-red-600 p-2 text-white shadow-sm transition hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-emerald-950">
                    Gallery (Multiple Images)
                  </label>
                  <div className="rounded-md border border-dashed border-emerald-900/20 bg-[#fffaf0] p-4 transition hover:border-emerald-700">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "gallery")}
                      className="w-full text-sm text-emerald-950 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-emerald-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-50 hover:file:bg-emerald-800"
                      disabled={isUploading || isUploadThingUploading}
                    />
                    <p className="mt-2 text-xs text-emerald-950/55">
                      Upload multiple images (max 4MB each)
                    </p>
                  </div>
                  {formData.gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {formData.gallery.map((url, i) => (
                        <div
                          key={i}
                          className="group relative h-24 overflow-hidden rounded-md border border-emerald-900/15"
                        >
                          <Image
                            src={url}
                            alt={`Gallery ${i}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                gallery: formData.gallery.filter(
                                  (_, idx) => idx !== i
                                ),
                              })
                            }
                            className="absolute right-1 top-1 rounded-md bg-red-600 p-1.5 text-white opacity-0 transition hover:bg-red-700 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-900/10 bg-emerald-50 p-3 text-emerald-800">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Uploading images...
                    </span>
                  </div>
                )}
                  </section>
                </aside>
              </div>

              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-emerald-900/10 bg-[#fffaf0]/95 p-4 backdrop-blur sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-md border border-emerald-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:w-40"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-900 px-5 py-2.5 text-sm font-bold text-amber-50 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400 sm:w-44"
                >
                  {loading
                    ? "Menyimpan..."
                    : editingKajian
                    ? "Update Kajian"
                    : "Simpan Kajian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
