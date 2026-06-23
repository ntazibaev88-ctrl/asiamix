import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookReaderClient } from "@/components/books/book-reader";
import { Star, Crown, ArrowLeft, Lock, ExternalLink, FileText, Zap } from "lucide-react";
import type { Book } from "@/types";

const CATEGORIES: Record<string, string> = {
  money: "Ақша",
  business: "Бизнес",
  self_development: "Өзін дамыту",
  investing: "Инвестиция",
};

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: book }, { data: profile }] = await Promise.all([
    supabase.from("books").select("*").eq("id", id).single(),
    supabase.from("profiles").select("plan").eq("id", user!.id).single(),
  ]);

  if (!book) notFound();

  const isVip = profile?.plan === "vip";
  const b = book as Book;
  const isLocked = b.is_premium && !isVip;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Кітаптарға оралу
      </Link>

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5">
        <div className="flex gap-4">
          {b.cover_url && (
            <img src={b.cover_url} alt={b.title} className="w-24 h-36 object-cover rounded-xl shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <Badge variant="secondary" className="mb-2">{CATEGORIES[b.category] || b.category}</Badge>
            <h1 className="text-xl font-bold mb-1">{b.title}</h1>
            <p className="text-[var(--muted-foreground)] mb-3">{b.author}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {b.rating != null && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{b.rating}</span>
                </span>
              )}
              {b.pages && (
                <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                  <FileText className="h-4 w-4" /> {b.pages} бет
                </span>
              )}
              {b.xp_reward != null && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Zap className="h-4 w-4" /> +{b.xp_reward} XP
                </span>
              )}
              {b.is_premium && <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>}
            </div>
            {b.description && (
              <p className="text-sm text-[var(--muted-foreground)] mt-3 leading-relaxed line-clamp-3">{b.description}</p>
            )}
          </div>
        </div>
      </div>

      {isLocked ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center">
          <Crown className="h-12 w-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">VIP мүшелік қажет</h2>
          <p className="text-[var(--muted-foreground)] mb-4">Бұл кітапты оқу үшін VIP мүшелік алыңыз</p>
          <Link href="/premium" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium">
            <Crown className="h-4 w-4" /> VIP алу
          </Link>
        </div>
      ) : b.pdf_url ? (
        <BookReaderClient pdfUrl={b.pdf_url} title={b.title} />
      ) : b.buy_url ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center">
          <FileText className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-3" />
          <p className="text-[var(--muted-foreground)] mb-4">Онлайн нұсқасы жоқ. Кітапты сатып алыңыз:</p>
          <a
            href={b.buy_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Сатып алу
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">Онлайн нұсқасы қол жетімді емес</p>
        </div>
      )}
    </div>
  );
}
