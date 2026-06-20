import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Crown, Users } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Пайдаланушылар</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {users?.length || 0} пайдаланушы
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
              <tr>
                <th className="text-left p-4 font-semibold">Пайдаланушы</th>
                <th className="text-left p-4 font-semibold">Жоспар</th>
                <th className="text-left p-4 font-semibold">Рөл</th>
                <th className="text-left p-4 font-semibold">VIP мерзімі</th>
                <th className="text-left p-4 font-semibold">Тіркелген</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user) => {
                const isVipActive =
                  user.vip_expires_at &&
                  new Date(user.vip_expires_at) > new Date();
                return (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                          {(user.full_name || user.email || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || "—"}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {isVipActive ? (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Crown className="h-3.5 w-3.5" />
                          <span className="font-medium text-xs">VIP</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">Тегін</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                      >
                        {user.role === "admin" ? "Әкімші" : "Пайдаланушы"}
                      </Badge>
                    </td>
                    <td className="p-4 text-[var(--muted-foreground)]">
                      {user.vip_expires_at
                        ? formatDate(user.vip_expires_at)
                        : "—"}
                    </td>
                    <td className="p-4 text-[var(--muted-foreground)]">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(!users || users.length === 0) && (
            <div className="py-12 text-center">
              <Users className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="text-[var(--muted-foreground)]">Пайдаланушылар жоқ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
