"use client";

import { useState, useEffect, useMemo } from "react";
import { Film, Star, Crown, Lock, Play, Heart, Search, X } from "lucide-react";
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

  const toggleFav = (id: string) => {
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero banner */}
      {hero && (
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-gray-900">
          <img
            src={hero.banner_url || hero.poster_url || ""}
            alt={hero.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-end p-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{hero.title}</h2>
              {hero.description && (
                <p className="text-sm text-white/70 max-w-md line-clamp-2">{hero.description}</p>
              )}
              <Link
                href={`/movies/${hero.id}`}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                <Play className="h-4 w-4 fill-current" /> Қарау
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Фильмдер</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Табыс, ақша және бизнес туралы ең жақсы фильмдер
          </p>
        </div>
        {/* Search */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((movie) => {
            const cat = CATEGORIES.find((c) => c.value === movie.category);
            const isLocked = movie.is_premium && !isVip;
            const isFav = favorites.has(movie.id);

            return (
              <div
                key={movie.id}
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-hover"
              >
                <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="h-12 w-12 text-gray-600" />
                  )}

                  {!isLocked && (movie.video_url || movie.watch_url) && (
                    <Link
                      href={`/movies/${movie.id}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-6 w-6 text-gray-900 ml-1" />
                      </div>
                    </Link>
                  )}

                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white" />
                    </div>
                  )}

                  {movie.is_premium && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>
                    </div>
                  )}

                  {movie.year && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">{movie.year}</Badge>
                    </div>
                  )}

                  <button
                    onClick={() => toggleFav(movie.id)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </button>
                </div>

                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{cat?.label || movie.category}</Badge>
                  <h3 className="font-semibold mb-1">{movie.title}</h3>
                  {movie.director && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-2">
                      Режиссер: {movie.director}
                    </p>
                  )}
                  {movie.rating != null && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{movie.rating}/10</span>
                    </div>
                  )}
                  {movie.description && (
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3">
                      {movie.description}
                    </p>
                  )}

                  {isLocked ? (
                    <Link
                      href="/premium"
                      className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <Crown className="h-3.5 w-3.5" /> VIP алу
                    </Link>
                  ) : (movie.video_url || movie.watch_url) ? (
                    <Link
                      href={`/movies/${movie.id}`}
                      className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <Play className="h-3.5 w-3.5" /> Қарау
                    </Link>
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
