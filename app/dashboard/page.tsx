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
  const [activeTab, setActiveTab] = useState<"kajian" | "admins" | "logs">(
    "kajian"
  );
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
      if (!profileData.currentPassword) {
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

    {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 md:p-4 shadow-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-xl md:text-2xl font-bold">
                  <Image
                    src="/images/sahabat-ilmu-vertikal2.png"
                    alt="Logo"
                    width={150}
                    height={40}
                    className="inline-block md:w-[200px]"
                  />
                </Link>

              </div>
            </div>
          </div>

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Kajian
                </h1>
                {isSuperAdmin && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" />
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                Selamat datang, <strong>{session?.user?.name}</strong>
              </p>
              <p className="text-sm text-gray-500">
                {isSuperAdmin
                  ? "Anda dapat mengelola semua konten kajian"
                  : "Kelola konten kajian Anda"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Kajian
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-blue-50 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Profil</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="mt-6 border-b border-gray-200">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab("kajian")}
                  className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                    activeTab === "kajian"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Kelola Kajian
                </button>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                    activeTab === "admins"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Daftar Admin
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${
                    activeTab === "logs"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <History className="w-5 h-5" />
                  Activity Logs
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "kajian" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Kajian</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {filteredKajianList.length}
                    </p>
                  </div>
                  <BookOpen className="w-12 h-12 text-emerald-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Published</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {
                        filteredKajianList.filter(
                          (k) => k.status === "published"
                        ).length
                      }
                    </p>
                  </div>
                  <Shield className="w-12 h-12 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gray-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Draft</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {
                        filteredKajianList.filter((k) => k.status === "draft")
                          .length
                      }
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-gray-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Kajian List */}
            {isLoadingList ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-600">Memuat data...</span>
              </div>
            ) : filteredKajianList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">Belum ada kajian</p>
                <p className="text-gray-500 text-sm mt-1">
                  Klik &quot;Tambah Kajian&quot; untuk membuat kajian baru
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKajianList.map((kajian) => {
                  const isOwner = kajian.authorId === session?.user?.id;
                  const canEdit = isSuperAdmin || isOwner;

                  return (
                    <div
                      key={kajian.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {kajian.coverImage && (
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={kajian.coverImage}
                            alt={kajian.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              kajian.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {kajian.status}
                          </span>
                          {!isOwner && isSuperAdmin && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              by {kajian.author.name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {kajian.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {stripHtml(kajian.excerpt)}
                        </p>

                        <div className="space-y-1 text-xs text-gray-500 mb-4">
                          {kajian.ustadz && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {kajian.ustadz}
                            </div>
                          )}
                          {kajian.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {kajian.location}
                            </div>
                          )}
                          {kajian.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(kajian.date), "dd MMMM yyyy", {
                                locale: id,
                              })}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(kajian)}
                            disabled={!canEdit}
                            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-1 text-sm transition-colors ${
                              canEdit
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(kajian)}
                            disabled={!canEdit}
                            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-1 text-sm transition-colors ${
                              canEdit
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : activeTab === "admins" ? (
          <AdminTable />
        ) : (
          <ActivityLogs />
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl my-4 max-h-[96vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                    Edit Profil
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm truncate">
                    Perbarui nama dan password Anda
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
                  className="flex-shrink-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Nama lengkap Anda"
                />
              </div>

              <div className="border-t-2 border-gray-100 pt-4 sm:pt-5">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                    Ubah Password
                  </h3>
                  <span className="text-xs text-gray-500">(opsional)</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Password Lama
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
                      className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Masukkan password lama"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Minimal 6 karakter"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ketik ulang password baru"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100 flex-shrink-0">
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
                  className="w-full sm:flex-1 border-2 border-gray-300 text-gray-700 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg text-sm sm:text-base"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form - Same as before but remove redundant code */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-4 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingKajian ? "Edit Kajian" : "Tambah Kajian Baru"}
              </h2>
              <p className="text-emerald-50 text-sm mt-1">
                {editingKajian
                  ? "Perbarui informasi kajian"
                  : "Isi form di bawah untuk menambahkan kajian baru"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Same form fields as your original dashboard */}
              {/* I'll keep the form content identical to save space */}
              {/* Just copy paste from your original modal form */}

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-200">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    Informasi Utama
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Judul Kajian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Contoh: Kajian Tafsir Surat Al-Fatihah"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ringkasan Singkat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                    placeholder="Tulis ringkasan singkat yang menarik tentang kajian ini..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      Konten Lengkap <span className="text-red-500">*</span>
                    </label>
                    <label className="cursor-pointer bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 text-xs font-medium flex items-center gap-1 transition-colors">
                      <FileText className="w-3.5 h-3.5" />
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
              </div>

              {/* Other sections from your original form */}
              {/* Section: Detail Kajian */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-700" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Detail Kajian</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ustadz/Pemateri
                    </label>
                    <input
                      type="text"
                      value={formData.ustadz}
                      onChange={(e) =>
                        setFormData({ ...formData, ustadz: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Ustadz Firanda Andirja"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Masjid Istiqlal, Jakarta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Media */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-700" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Media</h3>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors bg-gray-50">
                    {/* // Cover Image Input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      disabled={isUploading || isUploadThingUploading}
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Recommended: 1200x630px, Max 4MB
                    </p>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-3 relative h-40 w-full rounded-xl overflow-hidden border-2 border-purple-200">
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
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Gallery (Multiple Images)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors bg-gray-50">
                    {/* // Gallery Input */}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "gallery")}
                      className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      disabled={isUploading || isUploadThingUploading}
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Upload multiple images (max 4MB each)
                    </p>
                  </div>
                  {formData.gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {formData.gallery.map((url, i) => (
                        <div
                          key={i}
                          className="relative h-24 rounded-lg overflow-hidden border-2 border-purple-200 group"
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
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="flex items-center gap-2 text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Uploading images...
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
