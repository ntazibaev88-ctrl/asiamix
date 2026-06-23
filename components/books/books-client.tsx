"use client";

import { useState, useMemo } from "react";
import { BookOpen, Star, Crown, Lock, ExternalLink, FileText, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((book) => {
            const cat = CATEGORIES.find((c) => c.value === book.category);
            const isLocked = book.is_premium && !isVip;

            return (
              <div
                key={book.id}
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-hover"
              >
                <div className="aspect-[3/4] relative bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 flex items-center justify-center">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-10 w-10 text-primary-300" />
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {book.is_premium && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>
                    </div>
                  )}
                  {Boolean(book.pdf_url) && (
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FileText className="h-2.5 w-2.5" />PDF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <Badge variant="secondary" className="mb-1 text-[10px]">{cat?.label || book.category}</Badge>
                  <h3 className="font-semibold text-sm mb-0.5 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mb-2 line-clamp-1">{book.author}</p>

                  {book.rating != null && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">{book.rating}</span>
                    </div>
                  )}

                  {isLocked ? (
                    <Link
                      href="/premium"
                      className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <Crown className="h-3 w-3" /> VIP алу
                    </Link>
                  ) : book.pdf_url ? (
                    <Link
                      href={`/books/${book.id}`}
                      className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" /> Оқу
                    </Link>
                  ) : book.buy_url ? (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> Сатып алу
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
