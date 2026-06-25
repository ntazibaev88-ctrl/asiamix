import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Users, Crown, TrendingUp, CreditCard, BookMarked } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ChartCard } from "@/components/admin/chart-card";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: vipUsers },
    { data: pendingPayments },
    { count: totalGoals },
    { count: totalJournal },
    { data: recentPayments },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("plan", "vip"),
    supabase.from("payments").select("*").eq("status", "pending"),
    supabase.from("goals").select("*", { count: "exact", head: true }),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      icon: Users,
      label: "Барлық пайдаланушы",
      value: totalUsers || 0,
      color: "text-[#6D5EF6]",
      bg: "bg-[#6D5EF6]/10",
    },
    {
      icon: Crown,
      label: "VIP мүшелер",
      value: vipUsers || 0,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: CreditCard,
      label: "Күтудегі төлемдер",
      value: pendingPayments?.length || 0,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      icon: TrendingUp,
      label: "Жалпы мақсаттар",
      value: totalGoals || 0,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: BookMarked,
      label: "Күнделік жазбалары",
      value: totalJournal || 0,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  // Simple growth chart data (placeholder)
  const userGrowthData = [
    { label: "Қаң", value: Math.max(1, (totalUsers || 0) - 9) },
    { label: "Ақп", value: Math.max(1, (totalUsers || 0) - 7) },
    { label: "Нау", value: Math.max(1, (totalUsers || 0) - 5) },
    { label: "Сәу", value: Math.max(1, (totalUsers || 0) - 4) },
    { label: "Мам", value: Math.max(1, (totalUsers || 0) - 2) },
    { label: "Мау", value: totalUsers || 0 },
  ];

  const goalGrowthData = [
    { label: "Қаң", value: Math.max(1, (totalGoals || 0) - 18) },
    { label: "Ақп", value: Math.max(1, (totalGoals || 0) - 13) },
    { label: "Нау", value: Math.max(1, (totalGoals || 0) - 9) },
    { label: "Сәу", value: Math.max(1, (totalGoals || 0) - 5) },
    { label: "Мам", value: Math.max(1, (totalGoals || 0) - 2) },
    { label: "Мау", value: totalGoals || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Платформа статистикасы</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Пайдаланушылар өсімі" data={userGrowthData} color="#6D5EF6" />
        <ChartCard title="Мақсаттар өсімі" data={goalGrowthData} color="#00C896" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Күтудегі төлемдер</h2>
            <a href="/admin/payments" className="text-sm text-[#6D5EF6] hover:opacity-80 transition-opacity">
              Барлығы →
            </a>
          </div>
          {!pendingPayments || pendingPayments.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] text-center py-8">
              Күтудегі төлемдер жоқ
            </p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {p.amount ? formatCurrency(p.amount) : "₸990"}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {new Date(p.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <a
                    href="/admin/payments"
                    className="text-xs text-[#6D5EF6] font-medium hover:opacity-80"
                  >
                    Тексеру →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Жаңа пайдаланушылар</h2>
            <a href="/admin/users" className="text-sm text-[#6D5EF6] hover:opacity-80 transition-opacity">
              Барлығы →
            </a>
          </div>
          <div className="space-y-3">
            {(recentUsers || []).map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(u.full_name || u.email || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.full_name || "—"}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate">{u.email}</div>
                </div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  u.plan === "vip"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                }`}>
                  {u.plan === "vip" ? "VIP" : "Тегін"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
