"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { Bell, Send, Users, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

const TYPES = [
  { value: "info", label: "Ақпарат", icon: Info, color: "text-blue-500" },
  { value: "success", label: "Жетістік", icon: CheckCircle2, color: "text-emerald-500" },
  { value: "warning", label: "Ескерту", icon: AlertTriangle, color: "text-amber-500" },
];

export default function AdminNotificationsPage() {
  const [loading, setSending] = useState(false);
  const [sent, setSent] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const loadSent = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setSent(data || []);
  };

  useEffect(() => { loadSent(); }, []);

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Тақырып пен мәтін міндетті");
      return;
    }
    setSending(true);
    try {
      const supabase = createClient();

      // Fetch all user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id");

      if (profilesError) throw profilesError;
      if (!profiles || profiles.length === 0) {
        toast.error("Пайдаланушылар табылмады");
        return;
      }

      // Batch insert notifications for all users
      const rows = profiles.map((p: { id: string }) => ({
        user_id: p.id,
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
      }));

      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;

      toast.success(`${profiles.length} пайдаланушыға жіберілді!`);
      setForm({ title: "", message: "", type: "info" });
      loadSent();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Қате орын алды";
      toast.error("Жіберу сәтсіз болды", msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Хабарландырулар</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Барлық пайдаланушыларға хабарлама жіберу
        </p>
      </div>

      {/* Send Form */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
            <Send className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-semibold">Жаңа хабарлама жіберу</div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Барлық тіркелген пайдаланушыларға жетеді
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Тақырыбы *</Label>
          <Input
            placeholder="Хабарлама тақырыбы"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Мазмұны *</Label>
          <Textarea
            placeholder="Хабарлама мазмұны..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Түрі</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <div className="flex items-center gap-2">
                    <t.icon className={`h-4 w-4 ${t.color}`} />
                    {t.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="gradient"
            loading={loading}
            onClick={handleSend}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Барлығына жіберу
          </Button>
          <div className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
            <Users className="h-4 w-4" />
            Барлық пайдаланушылар
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Жіберілген хабарламалар</h2>

        {sent.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Bell className="h-10 w-10 text-[var(--muted-foreground)] mx-auto mb-3" />
            <p className="text-[var(--muted-foreground)]">Хабарламалар жоқ</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--secondary)]">
                <tr>
                  <th className="text-left p-4 font-semibold">Тақырыбы</th>
                  <th className="text-left p-4 font-semibold">Түрі</th>
                  <th className="text-left p-4 font-semibold">Күні</th>
                </tr>
              </thead>
              <tbody>
                {sent.map((n) => {
                  const typeInfo = TYPES.find((t) => t.value === n.type);
                  return (
                    <tr
                      key={n.id as string}
                      className="border-b border-[var(--border)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium">{n.title as string}</div>
                        <div className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                          {n.message as string}
                        </div>
                      </td>
                      <td className="p-4">
                        {typeInfo && (
                          <Badge variant="secondary">
                            <typeInfo.icon className={`h-3 w-3 ${typeInfo.color}`} />
                            {typeInfo.label}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-[var(--muted-foreground)]">
                        {formatDate(n.created_at as string)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
