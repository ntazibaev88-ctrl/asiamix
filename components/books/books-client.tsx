"use client";

import { useState, useMemo } from "react";
import { BookOpen, Star, Crown, Lock, ExternalLink, FileText, Search, X } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "self_development", label: "Өзін дамыту", emoji: "🚀" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
];

export function BooksClient({ books, isVip }: { books: Book[]; isVip: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const published = useMemo(() => books.filter((b) => b.published !== false), [books]);

  const filtered = useMemo(() => {
    let list = published;
    if (category) list = list.filter((b) => b.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    return list;
  }, [published, category, search]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Кітаптар кітапханасы</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Ақша, бизнес және өзін дамыту туралы ең жақсы кітаптар
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Іздеу..."
            className="pl-9 pr-8 py-2 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            !category
              ? "bg-primary-600 text-white"
              : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Барлығы
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value === category ? "" : cat.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-primary-600 text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Кітаптар табылмады</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((book) => {
            const cat = CATEGORIES.find((c) => c.value === book.category);
            const isLocked = book.is_premium && !isVip;
            const cardHref = isLocked
              ? "/premium"
              : Boolean(book.pdf_url)
              ? `/books/${book.id}`
              : book.buy_url || `/books/${book.id}`;
            const isExternal = !isLocked && !book.pdf_url && Boolean(book.buy_url);

            return (
              <div
                key={book.id}
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Cover */}
                <Link
                  href={cardHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="block relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50"
                >
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-primary-300" />
                    </div>
                  )}

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}

                  {/* VIP badge */}
                  {book.is_premium && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[10px] font-bold">
                        <Crown className="h-2.5 w-2.5" /> VIP
                      </span>
                    </div>
                  )}

                  {/* PDF badge */}
                  {Boolean(book.pdf_url) && !isLocked && (
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                        <FileText className="h-2.5 w-2.5" /> PDF
                      </span>
                    </div>
                  )}

                  {/* Rating overlay */}
                  {book.rating != null && (
                    <div className="absolute bottom-2 right-2">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                        ⭐ {book.rating}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-3 space-y-1">
                  {cat && (
                    <span className="text-[10px] text-[var(--muted-foreground)]">{cat.emoji} {cat.label}</span>
                  )}
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{book.author}</p>

                  {book.pages && (
                    <p className="text-xs text-[var(--muted-foreground)]">{book.pages} бет</p>
                  )}

                  <Link
                    href={cardHref}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isLocked
                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isLocked ? (
                      <><Crown className="h-3 w-3" /> VIP алу</>
                    ) : isExternal ? (
                      <><ExternalLink className="h-3 w-3" /> Сатып алу</>
                    ) : (
                      <><BookOpen className="h-3 w-3" /> Оқу</>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
