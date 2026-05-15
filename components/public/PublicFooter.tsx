import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Beranda" },
  { href: "/chat", label: "Chat" },
  { href: "/kajian", label: "Kajian" },
  { href: "/about", label: "Tentang" },
  { href: "/support", label: "Support" },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-emerald-950/10 bg-emerald-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6">
        <div>
          <Image
            src="/images/sahabat-ilmu-horizontal2.png"
            alt="Sahabat Ilmu"
            width={176}
            height={44}
            className="h-10 w-auto rounded bg-white/95 p-1"
          />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Sahabat Ilmu membantu mencari dalil, kajian, dan pengetahuan agama
            melalui ringkasan AI dari Yufid.com dan tautan sumber untuk dibaca
            langsung.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Navigasi
          </p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/75 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Rujukan
          </p>
          <a
            href="https://yufid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-amber-100"
          >
            Yufid.com
            <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Jawaban AI adalah ringkasan, bukan pengganti belajar langsung dari
            sumber asli dan bimbingan guru.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        Copyright {new Date().getFullYear()} Sahabat Ilmu. Dibuat untuk mencari
        ilmu dengan rujukan.
      </div>
    </footer>
  );
}
