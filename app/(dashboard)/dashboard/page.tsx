import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Target,
  PiggyBank,
  ArrowRight,
  Flame,
  Plus,
  Newspaper,
  TrendingUp,
  Calculator,
  BookOpenCheck,
  Globe,
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

  const [{ data: profile }, { data: goals }, { data: savings }, { data: articles }, { data: siteSettingsRows }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("goals").select("*").eq("user_id", user.id).eq("status", "active")
        .order("created_at", { ascending: false }).limit(3),
      supabase.from("savings_plans").select("*").eq("user_id", user.id).limit(2),
      supabase.from("articles").select("id, title, excerpt, category, slug").eq("published", true).limit(4),
      supabase.from("site_settings").select("key, value"),
    ]);

  const site: Record<string, string> = {};
  for (const row of siteSettingsRows ?? []) site[row.key] = row.value;

  const name = profile?.full_name?.split(" ")[0] || "Пайдаланушы";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? T("greeting_morning") : hour < 17 ? T("greeting_day") : T("greeting_evening");
  const streak = 7;
  const dashSubtitle = site["dashboard_subtitle"] || T("dashboard_subtitle");
  const announcement = site["announcement"] || "";
  const announcementColor = site["announcement_color"] || "blue";
  const challengeTitle = site["challenge_title"] || T("dashboard_challenge");
  const challengeDesc = site["challenge_desc"] || "7 күн бойы күнделігіңе жаз.";
  const challengeProgress = Math.min(100, Number(site["challenge_progress"]) || 40);
  const showTips = site["show_tips_block"] !== "false";
  const showChallenge = site["show_challenge_block"] !== "false";
  const showArticles = site["show_articles_block"] !== "false";
  const showNews = site["show_news_block"] !== "false";

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  let tipsArray = dailyTips;
  try {
    const parsed = JSON.parse(site["daily_tips"] || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) tipsArray = parsed;
  } catch { /* use default */ }
  const todayTip = tipsArray[dayOfYear % tipsArray.length];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">

      {/* Announcement banner (admin-controlled) */}
      {announcement && (
        <div className={`px-4 py-3 rounded-2xl border text-sm font-medium ${
          announcementColor === "amber"
            ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200"
            : announcementColor === "emerald"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200"
            : announcementColor === "red"
            ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200"
            : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200"
        }`}>
          📢 {announcement}
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {name}! 👋</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{dashSubtitle}</p>
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
          <div className="text-2xl font-bold text-orange-500">{streak}</div>
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

      {/* Daily Tip — compact card with link */}
      {showTips && <Link href="/tips">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/15 to-violet-700/15 border border-primary-500/20 p-5 hover:border-primary-500/40 transition-colors group">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="font-semibold text-primary-400 text-xs uppercase tracking-wide">{T("dashboard_tip_label")}</span>
              </div>
              <span className="text-xs text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Барлығы <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              <span className="text-xl mr-2">{todayTip.emoji}</span>
              {todayTip.tip}
            </p>
          </div>
        </div>
      </Link>}

      {/* Quick links row: Currency, Calculator, Learn */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/currency">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs font-semibold">Валюта</p>
          </div>
        </Link>
        <Link href="/calculator">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto">
              <Calculator className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-xs font-semibold">Калькулятор</p>
          </div>
        </Link>
        <Link href="/learn">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mx-auto">
              <BookOpenCheck className="h-5 w-5 text-violet-500" />
            </div>
            <p className="text-xs font-semibold">Сабақтар</p>
          </div>
        </Link>
      </div>

      {/* Weekly Challenge */}
      {showChallenge && <div className="rounded-2xl bg-gradient-to-br from-violet-600/10 to-primary-600/10 border border-violet-500/20 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            🏆 {challengeTitle}
          </h2>
          <span className="text-xs font-bold text-primary-600">{challengeProgress}%</span>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">{challengeDesc}</p>
        <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all"
            style={{ width: `${challengeProgress}%` }}
          />
        </div>
      </div>}

      {/* Articles */}
      {showArticles && articles && articles.length > 0 && (
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
              <Link key={article.id} href={`/education/${article.slug}`}>
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

      {/* News section */}
      {showNews && <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-slate-500" /> Қаржылық жаңалықтар
          </h2>
          <Link href="/news">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Барлығы <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <Link href="/news#bloomberg">
            <div className="p-4 rounded-2xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors card-hover">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center mb-2">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold">Bloomberg</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Халықаралық қаржы</p>
            </div>
          </Link>
          <Link href="/news#kz">
            <div className="p-4 rounded-2xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors card-hover">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold">Қазақстан</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">KASE • Kapital.kz</p>
            </div>
          </Link>
        </div>
      </div>}

    </div>
  );
}
