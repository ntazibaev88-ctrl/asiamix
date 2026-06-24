"use client";

import { useState, useEffect, useMemo } from "react";
import { Film, Star, Crown, Lock, Play, Heart, Search, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Movie } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "success", label: "Табыс", emoji: "⭐" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
  { value: "documentary", label: "Документал", emoji: "🎬" },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--secondary)] rounded ${className}`} />;
}

export function MoviesClient({ movies, isVip }: { movies: Movie[]; isVip: boolean }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("movie_favorites") || "[]");
      setFavorites(new Set(stored));
    } catch {}
    setLoaded(true);
  }, []);

  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("movie_favorites", JSON.stringify([...next]));
      return next;
    });
  };

  const published = useMemo(
    () => movies.filter((m) => m.published !== false),
    [movies]
  );

  const filtered = useMemo(() => {
    let list = published;
    if (category) list = list.filter((m) => m.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.director || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [published, category, search]);

  const hero = published.find((m) => m.banner_url || m.poster_url);

  if (!loaded) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero banner */}
      {hero && (
        <Link href={hero.is_premium && !isVip ? "/premium" : `/movies/${hero.id}`}>
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-gray-900 group cursor-pointer">
            <img
              src={hero.banner_url || hero.poster_url || ""}
              alt={hero.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-end p-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{hero.title}</h2>
                {hero.description && (
                  <p className="text-sm text-white/70 max-w-md line-clamp-2">{hero.description}</p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold">
                  <Play className="h-4 w-4 fill-current" /> Қарау
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Фильмдер</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Табыс, ақша және бизнес туралы ең жақсы фильмдер
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
          <Film className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Фильмдер табылмады</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((movie) => {
            const cat = CATEGORIES.find((c) => c.value === movie.category);
            const isLocked = movie.is_premium && !isVip;
            const isFav = favorites.has(movie.id);
            const cardHref = isLocked ? "/premium" : `/movies/${movie.id}`;

            return (
              <div key={movie.id} className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                {/* Poster */}
                <Link href={cardHref} className="block relative aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="h-12 w-12 text-gray-600" />
                    </div>
                  )}

                  {/* Play overlay */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-5 w-5 text-gray-900 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}

                  {/* Badges */}
                  {movie.is_premium && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>
                    </div>
                  )}
                  {movie.year && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">{movie.year}</span>
                    </div>
                  )}

                  {/* Favorites button */}
                  <button
                    onClick={(e) => toggleFav(e, movie.id)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </button>
                </Link>

                {/* Info */}
                <div className="p-3 space-y-1.5">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">{movie.title}</h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    {movie.rating != null && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold">{movie.rating}</span>
                      </div>
                    )}
                    {movie.duration && (
                      <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{movie.duration} мин</span>
                      </div>
                    )}
                    {cat && (
                      <span className="text-[10px] text-[var(--muted-foreground)]">{cat.emoji} {cat.label}</span>
                    )}
                  </div>

                  {movie.director && (
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">{movie.director}</p>
                  )}

                  <Link
                    href={cardHref}
                    className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isLocked
                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isLocked ? (
                      <><Crown className="h-3 w-3" /> VIP алу</>
                    ) : (
                      <><Play className="h-3 w-3 fill-current" /> Қарау</>
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
