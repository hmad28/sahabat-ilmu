import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  UserRoundPen,
} from "lucide-react";
import PublicFooter from "@/components/public/PublicFooter";
import PublicNav from "@/components/public/PublicNav";
import SourceNotice from "@/components/public/SourceNotice";

const principles = [
  {
    title: "Cari dengan bahasa sendiri",
    description:
      "Pengguna bisa menulis topik agama, pertanyaan dalil, atau kata kunci kajian dengan bahasa sehari-hari.",
    icon: MessageCircle,
  },
  {
    title: "Sumber tetap dibuka",
    description:
      "AI membantu menyusun ringkasan, tetapi rujukan asli tetap ditampilkan agar bisa dicek.",
    icon: ShieldCheck,
  },
  {
    title: "Arsip kajian dikelola",
    description:
      "Penulis dapat menambahkan kajian, menjaga arsip, dan memperbarui bahan rujukan.",
    icon: UserRoundPen,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-emerald-950">
      <PublicNav />

      <section className="border-b border-emerald-950/10 bg-[#f7f1df]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1fr_0.85fr] md:px-6 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Tentang Sahabat Ilmu
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Tempat mencari rujukan, bukan tempat berhenti belajar.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-950/70 md:text-lg">
              Sahabat Ilmu dirancang untuk membantu mencari dalil, kajian, dan
              pengetahuan agama dari Yufid.com, lalu mengarahkan pengguna untuk
              membaca sumber asli.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Tanya AI
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/kajian"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-950/15 bg-white px-6 py-3 text-sm font-semibold text-emerald-950"
              >
                Lihat kajian
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <SourceNotice />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            Cara kerja
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
            Dibangun untuk memudahkan pencarian ilmu dengan rujukan.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <article
                key={principle.title}
                className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-emerald-950/65">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-emerald-950/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                Batas aman
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Tidak menambah klaim agama tanpa sumber.
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                "Jawaban agama di chat harus muncul dari pencarian dan ringkasan Yufid.com.",
                "Jika sumber tidak cukup, AI diarahkan untuk mengatakan sumber tidak cukup.",
                "Tampilan web boleh membantu navigasi, tetapi tidak membuat hukum baru.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-emerald-950/10 bg-[#fffaf0] p-4 text-sm leading-7 text-emerald-950/70"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-800" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="rounded-[2rem] bg-emerald-950 p-8 text-white md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Arah produk
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold md:text-4xl">
            Nilai utamanya ada di akses: dari pertanyaan ke rujukan yang bisa dicek.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            Pengalaman publik dibuat lebih fokus, tenang, dan dipercaya agar
            pengguna mudah menemukan pembahasan, lalu tetap membaca sumber asli.
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
