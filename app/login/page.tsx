"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";

type LoginMode = "otp" | "password";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("otp");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpEmail: "",
    otpCode: "",
  });

  useEffect(() => {
    getProviders()
      .then((providers) => setGoogleEnabled(Boolean(providers?.google)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Login berhasil");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!googleEnabled) {
      toast.error("Google OAuth belum dikonfigurasi");
      return;
    }

    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setGoogleLoading(false);
      toast.error("Login Google belum siap. Cek env Google OAuth.");
    }
  };

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setOtpLoading(true);

    try {
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.otpEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Gagal mengirim kode");
        return;
      }

      setOtpSent(true);
      toast.success("Kode OTP dikirim ke email");
    } catch {
      toast.error("Terjadi kesalahan saat mengirim kode");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setOtpLoading(true);

    try {
      const result = await signIn("email-otp", {
        email: formData.otpEmail,
        code: formData.otpCode,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success("Login berhasil");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan saat verifikasi kode");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <Toaster position="top-right" />
      <PublicNav />

      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-8 md:px-6 lg:py-12">
        <div className="grid w-full overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-2xl shadow-emerald-950/10 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-emerald-950 p-10 text-white lg:flex">
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative">
              <div className="inline-flex rounded-lg bg-white p-2">
                <Image
                  src="/images/sahabat-ilmu-horizontal2.png"
                  alt="Sahabat Ilmu"
                  width={180}
                  height={45}
                  className="h-9 w-auto"
                  priority
                />
              </div>

              <div className="mt-14 max-w-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                  Admin access
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight">
                  Ruang kerja konten Sahabat Ilmu.
                </h1>
                <p className="mt-5 text-sm leading-7 text-white/68">
                  Masuk untuk mengelola kajian, feedback publik, dan arsip
                  dashboard dengan akses yang lebih tertata.
                </p>
              </div>
            </div>

            <div className="relative space-y-3">
              {[
                ["Google OAuth", "Masuk cepat dengan akun Google"],
                ["Email OTP", "Kode sekali pakai berlaku 10 menit"],
                ["Password", "Tetap mendukung akun admin lama"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4"
                >
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-amber-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs text-white/58">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-h-[640px] items-center justify-center p-5 sm:p-8 lg:p-12">
            <div className="w-full max-w-[440px]">
              <div className="mb-8 lg:hidden">
                <Image
                  src="/images/sahabat-ilmu-horizontal2.png"
                  alt="Sahabat Ilmu"
                  width={180}
                  height={45}
                  className="h-10 w-auto"
                  priority
                />
              </div>

              <div className="mb-8">
                <div className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-950/10 bg-[#fffaf0] px-3 text-sm font-semibold text-emerald-900">
                  <Lock className="h-4 w-4" />
                  Dashboard secure login
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Masuk ke dashboard
                </h2>
                <p className="mt-3 text-sm leading-6 text-emerald-950/62">
                  Gunakan Google, kode email, atau password untuk melanjutkan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || !googleEnabled}
                className="group inline-flex h-12 w-full items-center justify-between rounded-lg border border-emerald-950/12 bg-white px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:border-emerald-900/25 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-emerald-950/45"
              >
                <span className="inline-flex items-center gap-3">
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-950/15 bg-white text-xs font-bold text-emerald-950">
                      G
                    </span>
                  )}
                  {googleEnabled ? "Masuk dengan Google" : "Google belum aktif"}
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-950/35 transition group-hover:translate-x-0.5 group-hover:text-emerald-900" />
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-emerald-950/10" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-950/42">
                  metode lain
                </span>
                <div className="h-px flex-1 bg-emerald-950/10" />
              </div>

              <div className="mb-5 grid grid-cols-2 rounded-lg border border-emerald-950/10 bg-[#fffaf0] p-1">
                <button
                  type="button"
                  onClick={() => setMode("otp")}
                  className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    mode === "otp"
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-emerald-950/60 hover:bg-white hover:text-emerald-950"
                  }`}
                >
                  Kode email
                </button>
                <button
                  type="button"
                  onClick={() => setMode("password")}
                  className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    mode === "password"
                      ? "bg-emerald-950 text-white shadow-sm"
                      : "text-emerald-950/60 hover:bg-white hover:text-emerald-950"
                  }`}
                >
                  Password
                </button>
              </div>

              {mode === "otp" ? (
                <form
                  onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}
                  className="space-y-4"
                >
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Email
                    </span>
                    <span className="relative block">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                      <input
                        type="email"
                        required
                        value={formData.otpEmail}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            otpEmail: event.target.value,
                          })
                        }
                        className="h-12 w-full rounded-lg border border-emerald-950/12 bg-stone-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                        placeholder="email@example.com"
                      />
                    </span>
                  </label>

                  {otpSent && (
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Kode OTP
                      </span>
                      <span className="relative block">
                        <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          maxLength={6}
                          value={formData.otpCode}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              otpCode: event.target.value.replace(/\D/g, ""),
                            })
                          }
                          className="h-12 w-full rounded-lg border border-emerald-950/12 bg-stone-50 pl-12 pr-4 text-sm tracking-[0.3em] outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                          placeholder="123456"
                        />
                      </span>
                    </label>
                  )}

                  {otpSent && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950/75">
                      <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      Kode dikirim ke email dan berlaku 10 menit.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:bg-stone-300"
                  >
                    {otpLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {otpSent ? "Verifikasi kode" : "Kirim kode OTP"}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setFormData({ ...formData, otpCode: "" });
                      }}
                      className="w-full rounded-lg px-3 py-2 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      Kirim ulang kode
                    </button>
                  )}
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Email
                    </span>
                    <span className="relative block">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            email: event.target.value,
                          })
                        }
                        className="h-12 w-full rounded-lg border border-emerald-950/12 bg-stone-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                        placeholder="email@example.com"
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      Password
                    </span>
                    <span className="relative block">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-900/35" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          password: event.target.value,
                        })
                      }
                      className="h-12 w-full rounded-lg border border-emerald-950/12 bg-stone-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-800 focus:bg-white focus:ring-4 focus:ring-emerald-900/10"
                      placeholder="Masukkan password"
                    />
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:bg-stone-300"
                  >
                    {passwordLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Masuk dashboard
                  </button>
                </form>
              )}

              <div className="mt-7 flex flex-col gap-3 border-t border-emerald-950/10 pt-5 text-sm text-emerald-950/60 sm:flex-row sm:items-center sm:justify-between">
                <span>Belum punya password?</span>
                <Link
                  href="/register"
                  className="font-semibold text-emerald-800 transition hover:text-emerald-950"
                >
                  Daftar manual
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
