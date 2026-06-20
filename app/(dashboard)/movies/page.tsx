import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Film, Star, Crown, Lock, Play } from "lucide-react";
import type { Movie } from "@/types";

const CATEGORIES = [
  { value: "money", label: "Ақша", emoji: "💰" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "success", label: "Табыс", emoji: "⭐" },
  { value: "investing", label: "Инвестиция", emoji: "📈" },
  { value: "documentary", label: "Документал", emoji: "🎬" },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single();
  const isVip = profile?.plan === "vip";

  let query = supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: movies } = await query;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Фильмдер</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Табыс, ақша және бизнес туралы ең жақсы фильмдер мен документалдар
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/movies"
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            !category
              ? "bg-primary-600 text-white"
              : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          Барлығы
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/movies?category=${cat.value}`}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              category === cat.value
                ? "bg-primary-600 text-white"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {cat.emoji} {cat.label}
          </Link>
        ))}
      </div>

      {!movies || movies.length === 0 ? (
        <div className="py-16 text-center">
          <Film className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Фильмдер табылмады</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((movie: Movie) => {
            const cat = CATEGORIES.find((c) => c.value === movie.category);
            const isLocked = movie.is_premium && !isVip;

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

                  {/* Play button overlay */}
                  {!isLocked && movie.watch_url && (
                    <a
                      href={movie.watch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-6 w-6 text-gray-900 ml-1" />
                      </div>
                    </a>
                  )}

                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="h-10 w-10 text-white" />
                    </div>
                  )}

                  {movie.is_premium && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="premium">
                        <Crown className="h-3 w-3" />
                        VIP
                      </Badge>
                    </div>
                  )}

                  {movie.year && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {movie.year}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">{cat?.label || movie.category}</Badge>
                  <h3 className="font-semibold mb-1">{movie.title}</h3>
                  {movie.director && (
                    <p className="text-sm text-[var(--muted-foreground)] mb-2">
                      Режиссер: {movie.director}
                    </p>
                  )}
                  {movie.rating && (
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
                      <Crown className="h-3.5 w-3.5" />
                      VIP алу
                    </Link>
                  ) : movie.watch_url ? (
                    <a
                      href={movie.watch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Қарау
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
