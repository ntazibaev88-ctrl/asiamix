import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Users, Crown, TrendingUp, CreditCard, Target, BookMarked } from "lucide-react";

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

  const totalRevenue = (recentPayments || [])
    .filter((p) => p.status === "approved")
    .reduce((s: number, p) => s + p.amount, 0);

  const stats = [
    {
      icon: Users,
      label: "Барлық пайдаланушы",
      value: totalUsers || 0,
      color: "text-primary-600",
      bg: "bg-primary-50 dark:bg-primary-950/30",
    },
    {
      icon: Crown,
      label: "VIP мүшелер",
      value: vipUsers || 0,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: CreditCard,
      label: "Күтудегі төлемдер",
      value: pendingPayments?.length || 0,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      icon: TrendingUp,
      label: "Жалпы мақсаттар",
      value: totalGoals || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: BookMarked,
      label: "Күнделік жазбалары",
      value: totalJournal || 0,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Платформа статистикасы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Күтудегі төлемдер</h2>
            <a href="/admin/payments" className="text-sm text-primary-600 hover:text-primary-700">
              Барлығы →
            </a>
          </div>
          {!pendingPayments || pendingPayments.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
              Күтудегі төлемдер жоқ
            </p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
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
                    href={`/admin/payments`}
                    className="text-xs text-primary-600 font-medium hover:text-primary-700"
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
            <a href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
              Барлығы →
            </a>
          </div>
          <div className="space-y-3">
            {(recentUsers || []).map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {(u.full_name || u.email || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.full_name || "—"}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate">{u.email}</div>
                </div>
                <div className={`text-xs font-medium ${u.plan === "vip" ? "text-amber-600" : "text-[var(--muted-foreground)]"}`}>
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
