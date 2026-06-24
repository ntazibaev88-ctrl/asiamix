import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { GraduationCap, Clock, Eye, Crown, Lock, BookOpen, Sparkles } from "lucide-react";
import type { Article } from "@/types";

const CATEGORIES = [
  { value: "investing", label: "Инвестиция", emoji: "📈", color: "from-blue-500 to-cyan-500" },
  { value: "bonds", label: "Облигациялар", emoji: "📊", color: "from-indigo-500 to-blue-500" },
  { value: "gold", label: "Алтын", emoji: "🏅", color: "from-amber-500 to-yellow-500" },
  { value: "silver", label: "Күміс", emoji: "🥈", color: "from-slate-400 to-slate-500" },
  { value: "savings", label: "Жинақ", emoji: "🐷", color: "from-emerald-500 to-teal-500" },
  { value: "business", label: "Бизнес", emoji: "💼", color: "from-violet-500 to-purple-500" },
  { value: "personal_finance", label: "Жеке қаржы", emoji: "💰", color: "from-rose-500 to-pink-500" },
];

export default async function EducationPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, vip_expires_at")
    .eq("id", user!.id)
    .single();

  const isVip = profile?.plan === "vip" &&
    profile?.vip_expires_at &&
    new Date(profile.vip_expires_at) > new Date();

  let query = supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data: articles } = await query;

  const activeCat = CATEGORIES.find((c) => c.value === category);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-violet-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-8xl">📚</div>
          <div className="absolute bottom-2 right-24 text-5xl">💡</div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Қаржылық білім</h1>
              <p className="text-sm text-white/70">
                {articles?.length || 0} мақала • Инвестиция, жинақ және бизнес туралы
              </p>
            </div>
          </div>
          {!isVip && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 text-sm">
              <Crown className="h-4 w-4" />
              VIP алу арқылы барлық Premium мақалаларды оқыңыз
              <Link href="/premium" className="underline font-semibold">→ VIP алу</Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Санаттар</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/education"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !category
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
            }`}
          >
            🗂 Барлығы {!category && articles && `(${articles.length})`}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/education?category=${cat.value}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
              }`}
            >
              {cat.emoji} {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* AI Badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-sm text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4 shrink-0" />
        Мақалалар Claude AI арқылы күн сайын автоматты жарияланады
      </div>

      {/* Articles */}
      {!articles || articles.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="h-16 w-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <p className="font-medium text-[var(--muted-foreground)]">Мақалалар табылмады</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Жақында жаңа мақалалар жарияланады</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {(articles as Article[]).map((article) => {
            const cat = CATEGORIES.find((c) => c.value === article.category);
            const isLocked = article.is_premium && !isVip;
            const cardHref = isLocked ? "/premium" : `/education/${article.slug}`;

            return (
              <Link
                key={article.id}
                href={cardHref}
                className="block rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Cover */}
                <div className={`relative h-44 overflow-hidden ${!article.cover_url ? `bg-gradient-to-br ${cat?.color || "from-primary-500 to-violet-500"}` : "bg-gray-100 dark:bg-gray-900"} flex items-center justify-center`}>
                  {article.cover_url ? (
                    <img
                      src={article.cover_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {cat?.emoji || "📄"}
                    </span>
                  )}

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <Lock className="h-8 w-8 text-white" />
                      <p className="text-white text-sm font-semibold">VIP мазмұны</p>
                    </div>
                  )}

                  {/* Premium badge */}
                  {article.is_premium && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 text-xs font-bold">
                        <Crown className="h-3 w-3" /> Premium
                      </span>
                    </div>
                  )}

                  {/* Views */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 text-white text-xs">
                      <Eye className="h-3 w-3" /> {article.views}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {cat && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--secondary)] text-xs font-medium">
                        {cat.emoji} {cat.label}
                      </span>
                    )}
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 ml-auto shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.created_at)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                  )}

                  <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isLocked
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-primary-600/10 text-primary-600 group-hover:bg-primary-600 group-hover:text-white"
                  }`}>
                    {isLocked ? (
                      <><Crown className="h-3.5 w-3.5" /> VIP алу</>
                    ) : (
                      <><BookOpen className="h-3.5 w-3.5" /> Оқу</>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
