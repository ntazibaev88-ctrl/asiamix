import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { MoviePlayer } from "@/components/movies/movie-player";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Crown, ArrowLeft, Star } from "lucide-react";
import type { Movie } from "@/types";

export default async function MovieDetailPage({
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

  const [{ data: movieRow }, { data: profile }] = await Promise.all([
    supabase.from("movies").select("*").eq("id", id).single(),
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  if (!movieRow) notFound();

  const movie = movieRow as Movie;
  const isVip = profile?.plan === "vip";
  const isLocked = movie.is_premium && !isVip;
  const videoUrl = movie.video_url || movie.watch_url;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/movies"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Фильмдерге оралу
      </Link>

      {isLocked ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-10 text-center">
          <Crown className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">VIP контент</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Бұл фильмді қарау үшін VIP жазылым қажет
          </p>
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Crown className="h-4 w-4" /> VIP алу
          </Link>
        </div>
      ) : videoUrl ? (
        <MoviePlayer movieId={movie.id} url={videoUrl} title={movie.title} />
      ) : (
        <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center text-white/50">
          Видео жоқ
        </div>
      )}

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold">{movie.title}</h1>
          {movie.is_premium && (
            <Badge variant="premium">
              <Crown className="h-3 w-3" /> VIP
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          {movie.director && <span>Режиссер: {movie.director}</span>}
          {movie.year && <span>{movie.year}</span>}
          {movie.duration && <span>{movie.duration} мин</span>}
          {movie.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {movie.rating}/10
            </span>
          )}
        </div>

        {movie.description && (
          <p className="text-sm text-[var(--muted-foreground)]">{movie.description}</p>
        )}
      </div>
    </div>
  );
}
