import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { GraduationCap, Clock, Eye, Crown, Lock } from "lucide-react";
import type { Article } from "@/types";

const CATEGORIES = [
  { value: "investing", label: "Инвестиция", emoji: "📈" },
  { value: "bonds", label: "Облигациялар", emoji: "📊" },
  { value: "gold", label: "Алтын", emoji: "🏅" },
  { value: "silver", label: "Күміс", emoji: "🥈" },
  { value: "savings", label: "Жинақ", emoji: "🐷" },
  { value: "business", label: "Бизнес", emoji: "💼" },
  { value: "personal_finance", label: "Жеке қаржы", emoji: "💰" },
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
    .select("plan")
    .eq("id", user!.id)
    .single();

  const isVip = profile?.plan === "vip";

  let query = supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data: articles } = await query;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Қаржылық білім</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Инвестиция, жинақ және бизнес туралы мақалалар
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/education"
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
            href={`/education?category=${cat.value}`}
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

      {/* Articles */}
      {!articles || articles.length === 0 ? (
        <div className="py-16 text-center">
          <GraduationCap className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Мақалалар табылмады</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article: Article) => {
            const cat = CATEGORIES.find((c) => c.value === article.category);
            const isLocked = article.is_premium && !isVip;

            return (
              <div
                key={article.id}
                className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden card-hover"
              >
                {/* Cover */}
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-violet-100 dark:from-primary-950/50 dark:to-violet-950/50 relative flex items-center justify-center">
                  <span className="text-5xl">{cat?.emoji || "📄"}</span>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">VIP контент</p>
                      </div>
                    </div>
                  )}
                  {article.is_premium && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="premium">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{cat?.label || article.category}</Badge>
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>

                  {article.excerpt && (
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(article.created_at)}
                    </span>
                    {isLocked ? (
                      <Link
                        href="/premium"
                        className="text-primary-600 font-medium hover:text-primary-700"
                      >
                        VIP алу →
                      </Link>
                    ) : (
                      <Link
                        href={`/education/${article.slug}`}
                        className="text-primary-600 font-medium hover:text-primary-700"
                      >
                        Оқу →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
