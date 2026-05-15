"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Lock, Mail, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registrasi berhasil. Silakan login.");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        toast.error(data.error || "Registrasi gagal");
      }
    } catch {
      toast.error("Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <Toaster position="top-right" />
      <PublicNav />

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            Daftar penulis
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
            Bantu arsip rujukan tetap hidup.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-emerald-950/70">
            Akun penulis dipakai untuk membuat dan mengelola konten kajian.
            Konten yang baik membantu pengguna menemukan dalil, kajian, dan
            rujukan yang jelas.
          </p>
          <div className="mt-8 rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-emerald-800" />
              <p className="text-sm leading-7 text-emerald-950/65">
                Akun baru mendapat role Author. Pengelolaan role lanjutan tetap
                ada di dashboard super admin.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-2xl shadow-emerald-950/10 md:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-white">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">Buat akun</h2>
            <p className="mt-2 text-sm text-emerald-950/60">
              Lengkapi data penulis baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Nama</span>
              <span className="relative block">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className="w-full rounded-2xl border border-emerald-950/10 bg-stone-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800"
                  placeholder="Nama lengkap"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  className="w-full rounded-2xl border border-emerald-950/10 bg-stone-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800"
                  placeholder="email@example.com"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <span className="relative block">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                  className="w-full rounded-2xl border border-emerald-950/10 bg-stone-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800"
                  placeholder="Minimal 6 karakter"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Konfirmasi password
              </span>
              <span className="relative block">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      confirmPassword: event.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-emerald-950/10 bg-stone-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800"
                  placeholder="Ulangi password"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:bg-stone-300"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Daftar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-emerald-950/60">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-emerald-800">
              Masuk
            </Link>
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
