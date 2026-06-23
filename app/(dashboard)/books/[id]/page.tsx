import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { BookReaderClient } from "@/components/books/book-reader";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Crown, ArrowLeft, Star, ExternalLink, BookOpen } from "lucide-react";
import type { Book } from "@/types";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: bookRow }, { data: profile }] = await Promise.all([
    supabase.from("books").select("*").eq("id", id).single(),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  if (!bookRow) notFound();

  const book = bookRow as Book;
  const isVip = profile?.plan === "vip";
  const isLocked = book.is_premium && !isVip;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Кітаптарға оралу
      </Link>

      {/* Book info card */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex gap-5">
        <div className="w-24 flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 flex items-center justify-center">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="h-8 w-8 text-primary-300" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold">{book.title}</h1>
            {book.is_premium && (
              <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>
            )}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">{book.author}</p>
          {book.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{book.rating}</span>
            </div>
          )}
          {book.pages && (
            <p className="text-xs text-[var(--muted-foreground)]">{book.pages} бет</p>
          )}
          {book.description && (
            <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">{book.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      {isLocked ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-10 text-center">
          <Crown className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">VIP контент</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Бұл кітапты оқу үшін VIP жазылым қажет
          </p>
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Crown className="h-4 w-4" /> VIP алу
          </Link>
        </div>
      ) : book.pdf_url ? (
        <BookReaderClient pdfUrl={book.pdf_url} title={book.title} />
      ) : book.buy_url ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--muted-foreground)] mb-4">
            Бұл кітаптың PDF нұсқасы жоқ. Кітапты сатып алу арқылы оқи аласыз.
          </p>
          <a
            href={book.buy_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Сатып алу
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center text-[var(--muted-foreground)]">
          Кітап контенті қол жетімді емес
        </div>
      )}
    </div>
  );
}
