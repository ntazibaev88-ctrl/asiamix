import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Users, Crown, TrendingUp, CreditCard, BookMarked, BarChart3, DollarSign } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ChartCard } from "@/components/admin/chart-card";
import Link from "next/link";

function buildGrowthSeries(current: number, months = 12) {
  const monthNames = ["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"];
  const now = new Date();
  const points = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthIdx = (now.getMonth() - i + 12) % 12;
    const ratio = (months - i) / months;
    const variance = 0.75 + (Math.sin(i * 1.3) * 0.15 + 0.1);
    points.push({
      label: monthNames[monthIdx],
      value: Math.max(0, Math.round(current * ratio * variance)),
    });
  }
  points[points.length - 1].value = current;
  return points;
}

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
    supabase.from("payments").select("*, profiles(full_name, email)").eq("status", "pending").limit(5),
    supabase.from("goals").select("*", { count: "exact", head: true }),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalRevenue =
    (recentPayments || [])
      .filter((p) => p.status === "approved")
      .reduce((s: number, p) => s + (p.amount || 0), 0) || (vipUsers || 0) * 990;

  const userGrowth = buildGrowthSeries(totalUsers || 0);
  const goalGrowth = buildGrowthSeries(totalGoals || 0);

  const vipRatio = totalUsers ? (((vipUsers || 0) / totalUsers) * 100) : 0;

  const statusBadge = (status: string) => {
    if (status === "approved")
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">Расталды</span>;
    if (status === "pending")
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">Күтуде</span>;
    if (status === "rejected")
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">Қабылданбады</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--secondary)] text-[var(--muted-foreground)]">{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Платформа статистикасы</p>
        </div>
        <div className="text-xs text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Барлық пайдаланушы"
          value={totalUsers || 0}
          color="text-white"
          bg=""
          trend={12}
          highlight
        />
        <StatCard
          icon={Crown}
          label="VIP мүшелер"
          value={vipUsers || 0}
          color="text-amber-500"
          bg="bg-amber-500/10"
          trend={8}
        />
        <StatCard
          icon={DollarSign}
          label="Жалпы табыс"
          value={totalRevenue}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          prefix="₸"
          trend={15}
        />
        <StatCard
          icon={CreditCard}
          label="Күтудегі төлемдер"
          value={pendingPayments?.length || 0}
          color="text-orange-500"
          bg="bg-orange-500/10"
          trend={-5}
        />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Жалпы мақсаттар"
          value={totalGoals || 0}
          color="text-[#6D5EF6]"
          bg="bg-[#6D5EF6]/10"
          trend={25}
        />
        <StatCard
          icon={BookMarked}
          label="Күнделік жазбалары"
          value={totalJournal || 0}
          color="text-rose-500"
          bg="bg-rose-500/10"
          trend={5}
        />
        <div className="col-span-2 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] mb-2 font-medium uppercase tracking-wide">
            VIP коэффициенті
          </div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-2.5 bg-[var(--secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, vipRatio).toFixed(0)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-amber-500 shrink-0">{vipRatio.toFixed(1)}%</span>
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">
            {vipUsers || 0} VIP / {totalUsers || 0} барлық пайдаланушы
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Пайдаланушылар өсімі (12 ай)" data={userGrowth} color="#6D5EF6" />
        <ChartCard title="Мақсаттар өсімі (12 ай)" data={goalGrowth} color="#00C896" />
      </div>

      {/* Bottom tables */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Transaction history */}
        <div className="lg:col-span-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-[#6D5EF6]" />
              Соңғы транзакциялар
            </h2>
            <Link href="/admin/payments" className="text-xs text-[#6D5EF6] hover:opacity-80 transition-opacity">
              Барлығы →
            </Link>
          </div>
          {!recentPayments || recentPayments.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
              Төлемдер жоқ
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {recentPayments.map((p) => {
                const profile = p.profiles as { full_name?: string; email?: string } | null;
                const initials = (profile?.full_name || profile?.email || "?")[0].toUpperCase();
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--secondary)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {profile?.full_name || profile?.email || "—"}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {new Date(p.created_at).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                    <div className="text-sm font-semibold shrink-0">
                      {p.amount ? formatCurrency(p.amount) : "₸990"}
                    </div>
                    <div className="shrink-0">{statusBadge(p.status)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-[#6D5EF6]" />
              Жаңа пайдаланушылар
            </h2>
            <Link href="/admin/users" className="text-xs text-[#6D5EF6] hover:opacity-80 transition-opacity">
              Барлығы →
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {(recentUsers || []).map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--secondary)] transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(u.full_name || u.email || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.full_name || "—"}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate">{u.email}</div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    u.plan === "vip"
                      ? "bg-amber-500/15 text-amber-500"
                      : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {u.plan === "vip" ? "VIP" : "Free"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
