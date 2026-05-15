import { ExternalLink, ShieldCheck } from "lucide-react";

export default function SourceNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-amber-300 bg-amber-50 text-amber-950 ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-amber-200 p-2 text-amber-900">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Sumber jawaban dijaga dari Yufid.com</p>
          <p className="text-sm leading-relaxed text-amber-900/85">
            Jawaban AI adalah ringkasan dari referensi Yufid.com, insyaallah
            mengarah kepada Al-Qur&apos;an dan Sunnah. Tetap buka sumber asli untuk
            belajar langsung dan jangan jadikan ringkasan AI sebagai pengganti
            bimbingan guru.
          </p>
          <a
            href="https://yufid.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-amber-950 underline-offset-4 hover:underline"
          >
            Buka Yufid.com
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
