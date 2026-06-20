import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Target,
  PiggyBank,
  BookMarked,
  TrendingUp,
  Crown,
  ArrowRight,
  Flame,
  Plus,
  GraduationCap,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: goals }, { data: savings }, { data: journalCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("savings_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("journal_entries")
        .select("id", { count: "exact" })
        .eq("user_id", user.id),
    ]);

  const name = profile?.full_name?.split(" ")[0] || "Пайдаланушы";
  const isVip = profile?.plan === "vip";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Қайырлы таң" : hour < 17 ? "Қайырлы күн" : "Қайырлы кеш";

  const motivations = [
    "Үлкен мақсаттар кішкентай қадамдардан басталады. Бүгін бір қадам жаса! 🚀",
    "Жинақ — бостандықтың бастауы. Бүгін жинасаң, ертең еркін боласың! 💪",
    "Білім — ең жақсы инвестиция. Бүгін бірдеңе үйренің! 📚",
    "Сенің болашағың сенің бүгінгі таңдауларыңда жатыр! ⭐",
  ];
  const motivation = motivations[new Date().getDay() % motivations.length];

  const statsCards = [
    {
      icon: Target,
      label: "Белсенді мақсаттар",
      value: goals?.length ?? 0,
      color: "text-primary-600",
      bg: "bg-primary-50 dark:bg-primary-950/30",
      href: "/goals",
    },
    {
      icon: PiggyBank,
      label: "Жинақ жоспарлары",
      value: savings?.length ?? 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      href: "/savings",
    },
    {
      icon: BookMarked,
      label: "Күнделік жазбалар",
      value: journalCount?.length ?? 0,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      href: "/journal",
    },
    {
      icon: Flame,
      label: "Қатар күндер",
      value: 7,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      href: "/dashboard",
    },
  ];

  const categoryIcons: Record<string, string> = {
    house: "🏠",
    car: "🚗",
    business: "💼",
    education: "🎓",
    travel: "✈️",
    family: "👨‍👩‍👧",
    health: "💪",
    other: "🎯",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {greeting}, {name}! 👋
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">{motivation}</p>
        </div>
        {!isVip && (
          <Link href="/premium">
            <Button variant="gradient" size="sm">
              <Crown className="h-4 w-4" />
              VIP алу
            </Button>
          </Link>
        )}
        {isVip && <Badge variant="premium">✨ VIP</Badge>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Белсенді мақсаттар</h2>
            <Link href="/goals">
              <Button variant="ghost" size="sm">
                Барлығы
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {goals && goals.length > 0 ? (
            <div className="space-y-3">
              {goals.map((goal) => {
                const progress = calculateProgress(
                  goal.current_amount,
                  goal.target_amount
                );
                return (
                  <Link key={goal.id} href={`/goals/${goal.id}`}>
                    <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] card-hover">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {categoryIcons[goal.category] || "🎯"}
                          </span>
                          <div>
                            <div className="font-semibold text-sm">{goal.title}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">
                              {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={progress === 100 ? "success" : "default"}
                        >
                          {progress}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] border-dashed text-center">
              <Target className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="text-sm text-[var(--muted-foreground)] mb-4">Әлі мақсат жоқ</p>
              <Link href="/goals">
                <Button variant="gradient" size="sm">
                  <Plus className="h-4 w-4" />
                  Мақсат қосу
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <h3 className="font-semibold mb-4">Жылдам әрекеттер</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/goals", icon: Target, label: "Мақсат қосу", emoji: "🎯" },
                { href: "/savings", icon: PiggyBank, label: "Жинақ", emoji: "💰" },
                { href: "/journal", icon: BookMarked, label: "Күнделік", emoji: "📝" },
                { href: "/education", icon: GraduationCap, label: "Оқу", emoji: "📚" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="p-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors text-center">
                    <div className="text-xl mb-1">{action.emoji}</div>
                    <div className="text-xs font-medium text-[var(--foreground)]">{action.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Savings Summary */}
          {savings && savings.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center gap-2 mb-4">
                <PiggyBank className="h-5 w-5" />
                <span className="font-semibold">Жинақтар</span>
              </div>
              {savings.slice(0, 2).map((s) => {
                const p = calculateProgress(s.current_amount, s.goal_amount);
                return (
                  <div key={s.id} className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="opacity-90">{s.name}</span>
                      <span className="font-medium">{p}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full">
                      <div
                        className="h-1.5 bg-white rounded-full transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <Link href="/savings">
                <Button
                  className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm"
                  size="sm"
                >
                  Толығырақ
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}

          {/* Premium CTA */}
          {!isVip && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white">
              <Crown className="h-6 w-6 text-amber-300 mb-3" />
              <h3 className="font-bold mb-1">VIP-ке өтіңіз</h3>
              <p className="text-xs opacity-80 mb-4">
                Шексіз мақсаттар, аналитика және Premium контент
              </p>
              <Link href="/premium">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm" size="sm">
                  <Crown className="h-4 w-4 text-amber-300" />
                  ₸990/ай
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
