import { BookOpen } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-900/20 bg-white/70 p-10 text-center">
      <BookOpen className="mx-auto mb-4 h-12 w-12 text-emerald-800/40" />
      <h3 className="text-xl font-semibold text-emerald-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-950/65">
        {description}
      </p>
    </div>
  );
}
