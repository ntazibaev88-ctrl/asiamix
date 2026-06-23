"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Film, Star, Crown, Lock, Play, Heart, Search, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "success", label: "Табыс", emoji: "⭐" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
  { value: "documentary", label: "Документал", emoji: "🎬" },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden animate-pulse">
      <div className="aspect-video bg-[var(--secondary)]" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-[var(--secondary)] rounded w-1/3" />
        <div className="h-4 bg-[var(--secondary)] rounded w-3/4" />
        <div className="h-3 bg-[var(--secondary)] rounded w-1/2" />
      </div>
    </div>
  );
}

function MovieCard({ movie, isVip, isFav, onToggleFav }: {
  movie: Movie;
  isVip: boolean;
  isFav: boolean;
  onToggleFav: (id: string) => void;
}) {
  const isLocked = movie.is_premium && !isVip;
  const cat = CATEGORIES.find((c) => c.value === movie.category);
  const videoUrl = movie.video_url || movie.watch_url;

  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden group card-hover">
      <Link href={`/movies/${movie.id}`}>
        <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Film className="h-12 w-12 text-gray-600" />
          )}
          {!isLocked && videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <Play className="h-6 w-6 text-gray-900 ml-1" />
              </div>
            </div>
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
          {movie.duration && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">{movie.duration} мин</Badge>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Badge variant="secondary" className="mb-2">{cat?.label || movie.category}</Badge>
            <Link href={`/movies/${movie.id}`}>
              <h3 className="font-semibold mb-1 line-clamp-2 hover:text-primary-500 transition-colors">{movie.title}</h3>
            </Link>
          </div>
          <button
            onClick={() => onToggleFav(movie.id)}
            className="p-1.5 rounded-full hover:bg-[var(--secondary)] transition-colors shrink-0 mt-1"
          >
            <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-[var(--muted-foreground)]"}`} />
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {movie.rating != null && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{movie.rating}/10</span>
            </div>
          )}
          {movie.xp_reward != null && (
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <Zap className="h-3 w-3" />+{movie.xp_reward} XP
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MoviesClient({ movies, isVip }: { movies: Movie[]; isVip: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [favIds, setFavIds] = useState<string[]>([]);
  const [showFavs, setShowFavs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("movie_favorites");
    if (saved) setFavIds(JSON.parse(saved));
    setLoading(false);
  }, []);

  const toggleFav = (id: string) => {
    setFavIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("movie_favorites", JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = movies.filter((m) => m.published !== false);
    if (showFavs) list = list.filter((m) => favIds.includes(m.id));
    if (category) list = list.filter((m) => m.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || (m.director || "").toLowerCase().includes(q));
    }
    return list;
  }, [movies, search, category, favIds, showFavs]);

  const hero = movies.find((m) => m.published !== false && (m.banner_url || m.poster_url));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Фильмдер</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Табыс, ақша және бизнес туралы ең жақсы фильмдер мен документалдар
        </p>
      </div>

      {hero && (
        <Link href={`/movies/${hero.id}`}>
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-gray-900 cursor-pointer group">
            <img
              src={hero.banner_url || hero.poster_url || ""}
              alt={hero.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              {hero.is_premium && <Badge variant="premium" className="mb-2"><Crown className="h-3 w-3" />VIP</Badge>}
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">{hero.title}</h2>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                {hero.year && <span>{hero.year}</span>}
                {hero.rating && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{hero.rating}/10</span>}
                {hero.duration && <span>{hero.duration} мин</span>}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                <Play className="h-4 w-4" /> Қарау
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Фильм іздеу..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setCategory(""); setShowFavs(false); }}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${!category && !showFavs ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
        >
          Барлығы
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setCategory(cat.value); setShowFavs(false); }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${category === cat.value ? "bg-primary-600 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
        <button
          onClick={() => { setShowFavs(!showFavs); setCategory(""); }}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${showFavs ? "bg-red-500 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}
        >
          <Heart className="h-3.5 w-3.5" /> Таңдаулы
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Film className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Фильмдер табылмады</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isVip={isVip}
              isFav={favIds.includes(movie.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}
