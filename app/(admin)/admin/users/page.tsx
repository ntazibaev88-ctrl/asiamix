"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import { Crown, Users, Search, ShieldOff, Shield, Star } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  role: string;
  vip_expires_at: string | null;
  created_at: string;
}

function GiveVipDialog({
  user,
  onClose,
  onDone,
}: {
  user: UserRow;
  onClose: () => void;
  onDone: () => void;
}) {
  const [months, setMonths] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleGive = async () => {
    const m = parseInt(months);
    if (!m || m < 1 || m > 36) {
      toast.error("1 ден 36 айға дейін болу керек");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const expiresAt = new Date();
      // Extend from existing expiry if still active
      if (user.vip_expires_at && new Date(user.vip_expires_at) > new Date()) {
        expiresAt.setTime(new Date(user.vip_expires_at).getTime());
      }
      expiresAt.setMonth(expiresAt.getMonth() + m);

      const { error } = await supabase
        .from("profiles")
        .update({ plan: "vip", vip_expires_at: expiresAt.toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      toast.success(`${user.full_name || user.email} — VIP берілді`);
      onDone();
      onClose();
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-medium">
          <Crown className="h-4 w-4" />
          {user.full_name || user.email}
        </div>
        {user.vip_expires_at && new Date(user.vip_expires_at) > new Date() && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Ағымдағы VIP: {formatDate(user.vip_expires_at)} дейін (созылады)
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Ай саны *</Label>
        <Input
          type="number"
          min="1"
          max="36"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          placeholder="1"
        />
        <p className="text-xs text-[var(--muted-foreground)]">1–36 ай</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Болдырмау
        </Button>
        <Button variant="gradient" className="flex-1" loading={loading} onClick={handleGive}>
          <Crown className="h-4 w-4 text-amber-300" />
          VIP беру
        </Button>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [vipTarget, setVipTarget] = useState<UserRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data || []) as UserRow[]);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleBlock = async (user: UserRow) => {
    const isBlocked = user.role === "blocked";
    const action = isBlocked ? "Блоктауды алу" : "Блоктау";
    if (!confirm(`${user.full_name || user.email} — ${action}?`)) return;

    setActionLoading(user.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ role: isBlocked ? "user" : "blocked" })
        .eq("id", user.id);
      if (error) throw error;
      toast.success(isBlocked ? "Блоктау алынды" : "Пайдаланушы блокталды");
      loadUsers();
    } catch {
      toast.error("Қате орын алды");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q)
    );
  });

  const vipCount = users.filter(
    (u) => u.vip_expires_at && new Date(u.vip_expires_at) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Пайдаланушылар</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {users.length} пайдаланушы • {vipCount} VIP
          </p>
        </div>
        <Input
          placeholder="Іздеу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="w-64"
        />
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
                <th className="text-left p-4 font-semibold">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    <td className="p-4" colSpan={6}>
                      <div className="h-8 rounded-lg shimmer" />
                    </td>
                  </tr>
                ))
              ) : (
                filtered.map((user) => {
                  const isVipActive =
                    user.vip_expires_at &&
                    new Date(user.vip_expires_at) > new Date();
                  const isBlocked = user.role === "blocked";
                  const isAdmin = user.role === "admin";

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-[var(--border)] transition-colors ${
                        isBlocked
                          ? "opacity-50 bg-red-50/30 dark:bg-red-950/10"
                          : "hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                          variant={
                            isAdmin
                              ? "default"
                              : isBlocked
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {isAdmin ? "Әкімші" : isBlocked ? "Блокталды" : "Пайдаланушы"}
                        </Badge>
                      </td>
                      <td className="p-4 text-[var(--muted-foreground)]">
                        {user.vip_expires_at ? formatDate(user.vip_expires_at) : "—"}
                      </td>
                      <td className="p-4 text-[var(--muted-foreground)]">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="p-4">
                        {!isAdmin && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950 gap-1"
                              onClick={() => setVipTarget(user)}
                            >
                              <Star className="h-3.5 w-3.5" />
                              VIP
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={
                                isBlocked
                                  ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                  : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              }
                              onClick={() => handleBlock(user)}
                              disabled={actionLoading === user.id}
                            >
                              {isBlocked ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <ShieldOff className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3" />
              <p className="text-[var(--muted-foreground)]">
                {search ? "Пайдаланушы табылмады" : "Пайдаланушылар жоқ"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Give VIP Dialog */}
      <Dialog open={!!vipTarget} onOpenChange={(open) => !open && setVipTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>VIP беру</DialogTitle>
          </DialogHeader>
          {vipTarget && (
            <GiveVipDialog
              user={vipTarget}
              onClose={() => setVipTarget(null)}
              onDone={loadUsers}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
