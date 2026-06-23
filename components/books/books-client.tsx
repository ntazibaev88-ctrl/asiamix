"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Star, Crown, Lock, Search, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "self_development", label: "Өзін дамыту", emoji: "🚀" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
];

function BookCard({ book, isVip }: { book: Book; isVip: boolean }) {
  const isLocked = book.is_premium && !isVip;
  const cat = CATEGORIES.find((c) => c.value === book.category);

  return (
    <Link href={`/books/${book.id}`}>
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-hover group h-full">
        <div className="aspect-[2/3] relative bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 flex items-center justify-center overflow-hidden">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-primary-300" />
          )}
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
          )}
          {book.is_premium && (
            <div className="absolute top-3 right-3">
              <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>
            </div>
          )}
          {book.pdf_url && !isLocked && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 flex items-center gap-1">
                <FileText className="h-3 w-3" /> PDF
              </Badge>
            </div>
          )}
          {book.pages && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">{book.pages} б.</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <Badge variant="secondary" className="mb-2">{cat?.label || book.category}</Badge>
          <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary-500 transition-colors">{book.title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-2">{book.author}</p>
          {book.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{book.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function BooksClient({ books, isVip }: { books: Book[]; isVip: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    let list = books.filter((b) => b.published !== false);
    if (category) list = list.filter((b) => b.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return list;
  }, [books, search, category]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Кітаптар кітапханасы</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Ақша, бизнес және өзін дамыту туралы ең жақсы кітаптар
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Кітап немесе автор іздеу..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${!category ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
        >
          Барлығы
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${category === cat.value ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} isVip={isVip} />
          ))}
        </div>
      )}
    </div>
  );
}
