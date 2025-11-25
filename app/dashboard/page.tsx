"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  User,
  BookOpen,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import mammoth from "mammoth";
import RichTextEditor from "@/components/RichTextEditor";

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

export default function DashboardPage() {
  const [kajianList, setKajianList] = useState<Kajian[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingKajian, setEditingKajian] = useState<Kajian | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);

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

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  useEffect(() => {
    fetchKajian();
  }, []);

  const fetchKajian = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("/api/kajian?status=all");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "gallery"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploaded = await startUpload(Array.from(files));
      if (uploaded) {
        const urls = uploaded.map((file) => file.url);
        if (type === "cover") {
          setFormData({ ...formData, coverImage: urls[0] });
        } else {
          setFormData({ ...formData, gallery: [...formData.gallery, ...urls] });
        }
        toast.success("Upload berhasil!");
      }
    } catch (error) {
      toast.error("Upload gagal!");
    }
  };

  // Handle DOCX Import
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

        if (result.messages.length > 0) {
          console.log("Import messages:", result.messages);
        }
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
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(`Gagal menyimpan kajian: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (kajian: Kajian) => {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kajian ini?")) return;

    try {
      await fetch(`/api/kajian/${id}`, { method: "DELETE" });
      toast.success("Kajian dihapus!");
      fetchKajian();
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Kajian
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola konten blog kajian Islam
              </p>
            </div>
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
          </div>
        </div>
      </div>

      {/* Kajian List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoadingList ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        ) : kajianList.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Belum ada kajian</p>
            <p className="text-gray-500 text-sm mt-1">
              Klik "Tambah Kajian" untuk membuat kajian baru
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kajianList.map((kajian) => (
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
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        kajian.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {kajian.status}
                    </span>
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
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kajian.id)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 flex items-center justify-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto my-4 shadow-2xl">
            {/* Header Modal */}
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
              {/* Section: Informasi Utama */}
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
                  <p className="text-xs text-gray-600 mt-1">
                    Ringkasan akan ditampilkan di card preview
                  </p>
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
                  <p className="text-xs text-gray-600 mt-1">
                    Gunakan toolbar untuk format teks atau import dari file DOCX
                  </p>
                </div>
              </div>

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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      disabled={isUploading}
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
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "gallery")}
                      className="w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                      disabled={isUploading}
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
