import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MoviePlayer } from "@/components/movies/movie-player";
import { Star, Crown, Clock, Zap, ArrowLeft, Lock } from "lucide-react";
import type { Movie } from "@/types";

const CATEGORIES: Record<string, string> = {
  money: "Ақша",
  business: "Бизнес",
  success: "Табыс",
  investing: "Инвестиция",
  documentary: "Документал",
};

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: movie }, { data: profile }] = await Promise.all([
    supabase.from("movies").select("*").eq("id", id).single(),
    supabase.from("profiles").select("plan").eq("id", user!.id).single(),
  ]);

  if (!movie) notFound();

  const isVip = profile?.plan === "vip";
  const m = movie as Movie;
  const isLocked = m.is_premium && !isVip;
  const videoUrl = m.video_url || m.watch_url;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/movies" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Фильмдерге оралу
      </Link>

      {isLocked ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 text-center">
          {m.poster_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-6 relative">
              <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-16 w-16 text-white" />
              </div>
            </div>
          )}
          <Crown className="h-12 w-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">VIP мүшелік қажет</h2>
          <p className="text-[var(--muted-foreground)] mb-4">Бұл фильмді қарау үшін VIP мүшелік алыңыз</p>
          <Link href="/premium" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-violet-600 text-white px-6 py-3 rounded-xl font-medium">
            <Crown className="h-4 w-4" /> VIP алу
          </Link>
        </div>
      ) : videoUrl ? (
        <MoviePlayer movieId={m.id} url={videoUrl} title={m.title} />
      ) : (
        <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center">
          <p className="text-white/50">Бейне қол жетімді емес</p>
        </div>
      )}

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">{CATEGORIES[m.category] || m.category}</Badge>
            <h1 className="text-2xl font-bold">{m.title}</h1>
            {m.director && <p className="text-[var(--muted-foreground)] mt-1">Режиссер: {m.director}</p>}
          </div>
          {m.is_premium && <Badge variant="premium"><Crown className="h-3 w-3" />VIP</Badge>}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {m.year && <span className="text-[var(--muted-foreground)]">{m.year}</span>}
          {m.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{m.rating}/10</span>
            </span>
          )}
          {m.duration && (
            <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
              <Clock className="h-4 w-4" /> {m.duration} мин
            </span>
          )}
          {m.xp_reward != null && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Zap className="h-4 w-4" /> +{m.xp_reward} XP
            </span>
          )}
        </div>

        {m.description && (
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{m.description}</p>
        )}
      </div>
    </div>
  );
}
