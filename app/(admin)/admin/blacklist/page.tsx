"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { Ban, Trash2, ShieldAlert, Users } from "lucide-react";

interface BlacklistRow {
  id: string;
  user_id: string | null;
  email: string | null;
  reason: string;
  created_at: string;
  profiles?: { full_name?: string; email?: string } | null;
}

interface BlockedUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function AdminBlacklistPage() {
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [blacklist, setBlacklist] = useState<BlacklistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const [blockedRes, blacklistRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, created_at").eq("role", "blocked").order("created_at", { ascending: false }),
      supabase.from("blacklist").select("*, profiles(full_name, email)").order("created_at", { ascending: false }),
    ]);
    setBlocked((blockedRes.data || []) as BlockedUser[]);
    setBlacklist((blacklistRes.data || []) as BlacklistRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUnblock = async (userId: string) => {
    if (!confirm("Блоктауды алу керек пе?")) return;
    setActionLoading(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ role: "user" }).eq("id", userId);
    toast.success("Блоктау алынды");
    setActionLoading(null);
    load();
  };

  const handleRemoveBlacklist = async (id: string) => {
    if (!confirm("Қара тізімнен шығарасыз ба?")) return;
    setActionLoading(id);
    const supabase = createClient();
    await supabase.from("blacklist").delete().eq("id", id);
    toast.success("Қара тізімнен шығарылды");
    setActionLoading(null);
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Бан & Қара тізім</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          {blocked.length} блокталған • {blacklist.length} қара тізімде
        </p>
      </div>

      {/* Blocked Users */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Блокталған пайдаланушылар</h2>
          <Badge variant="destructive">{blocked.length}</Badge>
        </div>

        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[var(--muted-foreground)]">Жүктелуде...</div>
          ) : blocked.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-2" />
              <p className="text-[var(--muted-foreground)]">Блокталған пайдаланушы жоқ</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
                <tr>
                  <th className="text-left p-4 font-semibold">Пайдаланушы</th>
                  <th className="text-left p-4 font-semibold">Тіркелген</th>
                  <th className="text-left p-4 font-semibold">Статус</th>
                  <th className="text-left p-4 font-semibold">Әрекет</th>
                </tr>
              </thead>
              <tbody>
                {blocked.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)] bg-red-50/20 dark:bg-red-950/10">
                    <td className="p-4">
                      <div className="font-medium">{u.full_name || "—"}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{u.email}</div>
                    </td>
                    <td className="p-4 text-[var(--muted-foreground)]">{formatDate(u.created_at)}</td>
                    <td className="p-4"><Badge variant="destructive">Блокталды</Badge></td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => handleUnblock(u.id)}
                        disabled={actionLoading === u.id}
                      >
                        Блокты алу
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Blacklist */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Ban className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Қара тізім (алаяқтар)</h2>
          <Badge variant="warning">{blacklist.length}</Badge>
        </div>

        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
          {blacklist.length === 0 ? (
            <div className="py-10 text-center">
              <Ban className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-2" />
              <p className="text-[var(--muted-foreground)]">Қара тізім бос</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
                <tr>
                  <th className="text-left p-4 font-semibold">Пайдаланушы</th>
                  <th className="text-left p-4 font-semibold">Себебі</th>
                  <th className="text-left p-4 font-semibold">Күні</th>
                  <th className="text-left p-4 font-semibold">Әрекет</th>
                </tr>
              </thead>
              <tbody>
                {blacklist.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--border)] bg-orange-50/20 dark:bg-orange-950/10">
                    <td className="p-4">
                      <div className="font-medium">
                        {(b.profiles as { full_name?: string } | null)?.full_name || "—"}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {(b.profiles as { email?: string } | null)?.email || b.email || "—"}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-red-600 dark:text-red-400">{b.reason}</td>
                    <td className="p-4 text-[var(--muted-foreground)]">{formatDate(b.created_at)}</td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveBlacklist(b.id)}
                        disabled={actionLoading === b.id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
