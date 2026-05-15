"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/chat", label: "Chat" },
  { href: "/kajian", label: "Kajian" },
  { href: "/about", label: "Tentang" },
  { href: "/support", label: "Support" },
];

export default function PublicNav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dashboardHref = session ? "/dashboard" : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#fffaf0]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/sahabat-ilmu-vertikal.png"
            alt="Sahabat Ilmu"
            width={473}
            height={155}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-950/75 transition hover:bg-white hover:text-emerald-950"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={dashboardHref}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
          >
            {session ? (
              <LayoutDashboard className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {session ? "Dashboard" : "Masuk"}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-emerald-950 md:hidden"
          aria-label="Buka menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-emerald-950/10 bg-[#fffaf0] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <BookOpen className="h-4 w-4" />
              {session ? "Dashboard" : "Masuk"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
