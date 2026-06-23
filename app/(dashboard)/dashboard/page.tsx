import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyQuiz } from "@/components/dashboard/daily-quiz";
import { DailyBonus } from "@/components/dashboard/daily-bonus";
import { CurrencyRates } from "@/components/dashboard/currency-rates";
import { Presentations } from "@/components/dashboard/presentations";
import Link from "next/link";
import {
  Target,
  PiggyBank,
  Crown,
  ArrowRight,
  Flame,
  Plus,
  Newspaper,
} from "lucide-react";
import { t as translate, DEFAULT_LANG, LANG_COOKIE } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const dailyTips = [
  { tip: "Кірісіңіздің 20%-ін жинаққа салыңыз. 50/30/20 ережесі: 50% қажеттілік, 30% тілек, 20% жинақ.", emoji: "💡" },
  { tip: "Депозит ашу — ақшаңызды жұмысқа жіберудің ең қауіпсіз жолы. Қазақстанда жылдық 14–16% пайыз бар.", emoji: "🏦" },
  { tip: "Шығындарыңызды жазып отырыңыз. Не жұмсайтыныңызды білмей, жинауға болмайды.", emoji: "📊" },
  { tip: "Кредит картасының қарызын толығымен өтеңіз. Айлық пайыз жылдық 30–40%-ке жетуі мүмкін.", emoji: "💳" },
  { tip: "Алтынға инвестиция — инфляциядан қорғаудың классикалық әдісі. Ұлттық Банктен монета сатып алуға болады.", emoji: "🥇" },
  { tip: "Апта сайын кем дегенде 1 қаржы мақаласын оқыңыз. Білім — ең жақсы инвестиция.", emoji: "📚" },
  { tip: "Қаржылық жастықша жасаңыз: 3–6 айлық шығындарыңызды депозитке салыңыз.", emoji: "🛡️" },
];


const categoryIcons: Record<string, string> = {
  house: "🏠", car: "🚗", business: "💼", education: "🎓",
  travel: "✈️", family: "👨‍👩‍👧", health: "💪", other: "🎯",
};

const categoryLabels: Record<string, string> = {
  investing: "Инвестиция", bonds: "Облигация", gold: "Алтын",
  silver: "Күміс", savings: "Жинақ", business: "Бизнес", personal_finance: "Қаржы",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  const lang: Lang = (["kk", "ru", "en"].includes(langCookie ?? "") ? langCookie : DEFAULT_LANG) as Lang;
  const T = (key: Parameters<typeof translate>[1]) => translate(lang, key);

  const [{ data: profile }, { data: goals }, { data: savings }, { data: articles }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active")
        .order("created_at", { ascending: false }).limit(3),
      supabase.from("savings_plans").select("*").eq("user_id", user.id).limit(2),
      supabase.from("articles").select("id, title, excerpt, category, slug").eq("published", true).limit(4),
    ]);

  const name = profile?.full_name?.split(" ")[0] || "Пайдаланушы";
  const isVip = profile?.plan === "vip";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? T("greeting_morning") : hour < 17 ? T("greeting_day") : T("greeting_evening");
  const streak = 7;

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const todayTip = dailyTips[dayOfYear % dailyTips.length];
  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-6">

      {/* Greeting */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {name}! 👋</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{T("dashboard_subtitle")}</p>
        </div>
        {isVip ? (
          <Badge variant="premium">✨ VIP</Badge>
        ) : (
          <Link href="/premium">
            <Button variant="gradient" size="sm"><Crown className="h-4 w-4" />VIP</Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/goals">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover text-center">
            <div className="text-2xl font-bold text-primary-500">{goals?.length ?? 0}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" /> {T("dashboard_goals")}
            </div>
          </div>
        </Link>
        <Link href="/savings">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover text-center">
            <div className="text-2xl font-bold text-emerald-500">{savings?.length ?? 0}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
              <PiggyBank className="h-3 w-3" /> {T("dashboard_savings")}
            </div>
          </div>
        </Link>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
          <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
            {streak}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center justify-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" /> {T("dashboard_streak")}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary-500" /> {T("dashboard_active_goals")}
          </h2>
          <Link href="/goals">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              {T("dashboard_all")} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        {goals && goals.length > 0 ? (
          <div className="px-5 pb-5 space-y-3">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_amount, goal.target_amount);
              return (
                <Link key={goal.id} href={`/goals/${goal.id}`}>
                  <div className="p-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        {categoryIcons[goal.category] || "🎯"} {goal.title}
                      </span>
                      <span className="text-xs font-bold text-primary-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-[var(--muted-foreground)]">{formatCurrency(goal.current_amount)}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">{formatCurrency(goal.target_amount)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-5 pb-6 text-center">
            <Target className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-30" />
            <p className="text-sm text-[var(--muted-foreground)] mb-3">{T("dashboard_no_goals")}</p>
            <Link href="/goals">
              <Button variant="gradient" size="sm"><Plus className="h-4 w-4" />{T("dashboard_add_goal")}</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Daily Tip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/15 to-violet-700/15 border border-primary-500/20 p-5">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-violet-600/15 rounded-full blur-xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔥</span>
            <span className="font-semibold text-primary-400 text-sm tracking-wide uppercase text-xs">{T("dashboard_tip_label")}</span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--foreground)]">
            <span className="text-xl mr-2">{todayTip.emoji}</span>
            {todayTip.tip}
          </p>
        </div>
      </div>

      {/* Currency Rates */}
      <CurrencyRates titleLabel={T("currency_title")} />

      {/* Finance Quiz */}
      <DailyQuiz dayOfYear={dayOfYear} />

      {/* Presentations */}
      <Presentations />

      {/* Articles */}
      {articles && articles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-amber-500" /> {T("dashboard_articles")}
            </h2>
            <Link href="/education">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                {T("dashboard_all")} <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {articles.map((article) => (
              <Link key={article.id} href="/education">
                <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover h-full flex flex-col gap-2">
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium w-fit">
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <p className="text-sm font-semibold leading-snug line-clamp-2">{article.title}</p>
                  {article.excerpt && (
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{article.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Daily Bonus */}
      <DailyBonus streak={streak} />

      {/* VIP Banner */}
      {!isVip && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white p-5">
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-5 w-5 text-amber-300" />
                <span className="font-bold text-lg">{T("dashboard_vip_title")}</span>
              </div>
              <p className="text-xs opacity-75">{T("dashboard_vip_desc")}</p>
            </div>
            <Link href="/premium">
              <Button className="shrink-0 bg-white/20 hover:bg-white/30 text-white border-0 whitespace-nowrap font-semibold" size="sm">
                <Crown className="h-4 w-4 text-amber-300" /> {T("dashboard_vip_btn")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
